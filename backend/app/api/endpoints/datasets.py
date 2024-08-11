from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app import models, schemas, database
import pandas as pd
import shutil

router = APIRouter()

# CRUD Functions ---------------------------------------
def create_dataset(db: Session, filename: str, file_path: str ):
    # if user_id is None:
    #     print("User ID is None")
    db_dataset = models.Dataset(name=filename, file_path=file_path)
    print("db_dataset in create_dataset", db_dataset)
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def get_dataset(db: Session, dataset_id: int):
    return db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).first()

# New function to create a copy of the dataset
def create_dataset_copy(original_path: str) -> str:
    copy_path = original_path.replace('.csv', '_copy.csv')
    shutil.copy2(original_path, copy_path)
    return copy_path

# New function to log transformations
def log_transformation(db: Session, dataset_id: int, transformation_input: schemas.TransformationInput):
    log = models.DatasetChangeLog(
        dataset_id=dataset_id,
        action_type=transformation_input.operation_type,
        action_details=transformation_input.dict()
    )
    db.add(log)
    db.commit()


# function to save changes in db
def save_dataframe_to_csv(df: pd.DataFrame, file_path: str):
    """Saves the DataFrame to a CSV file and handles potential errors."""
    try:
        df.to_csv(file_path, index=False)
        print("In try block, df changed", df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")


# Add a function to determine the data type of a column
def get_column_type(df: pd.DataFrame, column: str) -> str:
    dtype = df[column].dtype
    if pd.api.types.is_string_dtype(dtype):
        return 'string'
    elif pd.api.types.is_numeric_dtype(dtype):
        return 'numeric'
    return 'unknown'
# CRUD Functions ---------------------------------------


# API Routes
@router.post("/upload", response_model=schemas.DatasetResponse)
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(database.get_db)):

    print("FILE ->", file.filename)

    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
   
    try: 
        df = pd.read_csv(file_location)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading dataset: {str(e)}")
    
    #  a copy of the dataset
    copy_location = create_dataset_copy(file_location)
    
    dataset = create_dataset(db, filename=file.filename, file_path=copy_location)
    
    data = {
        "filename": dataset.name,
        "file_path": dataset.file_path,
        "dataset_id": dataset.dataset_id,
        "columns": df.columns.tolist(),
        "row_count": len(df),
        "rows": df.values.tolist()  # Convert dataframe rows to list of lists
    }
    print("return to frontend", data)
    return data


@router.post("/{dataset_id}/transform", response_model=schemas.BasicQueryResponse)
async def transform_dataset(
    dataset_id: int,
    transformation_input: schemas.TransformationInput,
    db: Session = Depends(database.get_db)
):
    
    dataset = get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset with ID {dataset_id} not found")
   
    try:
        df = pd.read_csv(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {str(e)}")

    if transformation_input.operation_type == 'filter':
        if not transformation_input.parameters:
            raise HTTPException(status_code=400, detail="Filter parameters are required for filter operation")
        
        column = transformation_input.parameters.column
        condition = transformation_input.parameters.condition
        value = transformation_input.parameters.value

         # Determine the data type of the column
        column_type = get_column_type(df, column)

        # Convert value based on column type
        if column_type == 'numeric':
            try:
                value = float(value)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid value for numeric column: {value}")
        

        print("col, cond, and value ->", column, condition, value) 

        if condition == '=':
            df = df[df[column] == value]
        elif condition == '>':
            df = df[df[column] > value]
        elif condition == '<':
            df = df[df[column] < value]
        elif condition == '>=':
            df = df[df[column] >= value]
        elif condition == '<=':
            df = df[df[column] <= value] 
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported filter condition: {condition}")

    elif transformation_input.operation_type == 'sort':
        if not transformation_input.sort_params:
            raise HTTPException(status_code=400, detail="Sort parameters are required for sort operation")
        
        column = transformation_input.sort_params.column 
        ascending = transformation_input.sort_params.ascending

        df = df.sort_values(by=column, ascending=ascending)

    elif transformation_input.operation_type == 'addRow':
        if not transformation_input.row_params:
            raise HTTPException(status_code = 400, detail="please privide index where row has to be added")
        
        index = transformation_input.row_params.index

        if index < 0 or index > len(df):
            raise ValueError("Index out of range")
    
        # Create a DataFrame with one row of None values
        new_row = pd.DataFrame([[" "] * len(df.columns)], columns=df.columns, index=[index]) 
        # only string with space works, everything else gives error on applying operation twice
        print("new row and index", new_row, index)
    
         
        print("DF BEFORE", df)

        df = pd.concat([df.iloc[:index], new_row, df.iloc[index:]]).reset_index(drop=True)
        print("DF AFTER", df)

        save_dataframe_to_csv(df, dataset.file_path)
        # Log the transformation
        log_transformation(db, dataset_id, transformation_input)

    elif transformation_input.operation_type == 'delRow':
        if not transformation_input.row_params:
            raise HTTPException(status_code = 400, detail="please privide index where row has to be added")
        
        index = transformation_input.row_params.index 
        # row_column because only index is enough to del col

        if index < 0 or index > len(df):
            raise ValueError("Index out of range")
        
        df = df.drop(index)

        save_dataframe_to_csv(df, dataset.file_path)
        # Log the transformation
        log_transformation(db, dataset_id, transformation_input)
    

    elif transformation_input.operation_type == 'addCol':
        if not transformation_input.col_params:
            raise HTTPException(status_code = 400, detail="please privide index where row has to be added")
        
        index = transformation_input.col_params.index
        if index<0 or index> len(df.columns):
            raise ValueError("index  is out of bounds")
        

        column_name = transformation_input.col_params.name
                                        # replace   None = pd.NA if error starts
        print("DF before", df)

        df.insert(index, column_name, None)  
        print("DF After ", df)

        
        save_dataframe_to_csv(df, dataset.file_path)
        # Log the transformation
        print("Going for LOGs-> db, dataset_id, and transformation_input", db, dataset_id, transformation_input)
        log_transformation(db, dataset_id, transformation_input)

    # for del col - serach col name in dataset, then remove it 
    elif transformation_input.operation_type == 'delCol':
        if not transformation_input.row_params:
            raise HTTPException(status_code=400, detail="Please provide the name of the column to be deleted")
    
        # column_name = transformation_input.col_params.name

        # if column_name not in df.columns:
        #     raise ValueError("Column not found")
        index = transformation_input.row_params.index

        if index < 0 or index >= len(df.columns):
            raise ValueError("Index out of range")
        
        column_name = df.columns[index]
     
        df.drop(column_name, axis=1, inplace=True)

        save_dataframe_to_csv(df, dataset.file_path)
        # Log the transformation
        log_transformation(db, dataset_id, transformation_input)

    elif transformation_input.operation_type == 'fillEmpty':
        if not transformation_input.fill_empty_params:
            raise HTTPException(status_code=400, detail="Please provide the values that has to be filled")
        
        df = pd.read_csv(dataset.file_path, na_values=[' ', '']) 
        
        value = transformation_input.fill_empty_params.index 

        # if you need name instead index, find column name using df as array that has index
        # implement forward and backward fill
        df.fillna(value, inplace=True)

        save_dataframe_to_csv(df, dataset.file_path)
        # Log the transformation
        log_transformation(db, dataset_id, transformation_input)

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported operation type: {transformation_input.operation_type}")
    
    data =  {
        "dataset_id": dataset_id,
        "operation_type": transformation_input.operation_type,
        # "result": result,
        "row_count": len(df),
        "columns": df.columns.tolist(),
        "rows": df.values.tolist()  # Convert dataframe rows to list of lists
    }

    print("msg to frontend", data)
    return data 


# @router.post("/{dataset_id}/Complextransform", response_model=schemas.BasicQueryResponse)
# async def Complextransform( 
#     dataset_id: int,
#     transformation_input: schemas.TransformationInput,
#     db: Session = Depends(database.get_db)
# ): 

#     dataset = get_dataset(db, dataset_id)
#     if not dataset:
#         raise HTTPException(status_code=400, detail=f"Dataset with ID not found")
    
#     try:
#         df = pd.read_csv(dataset.file_path)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {str(e)}")
    
#     if transformation_input.operation_type == 'dropDuplicate':
#         if not transformation_input.drop_duplicate:
#             raise HTTPException(status_code=400, detail="Drop Dublicate parameter not found")
        
#         # multiple column from input is left -> done
#         column= transformation_input.drop_duplicate.columns
#         split_col_value = column.split(',')
#         keep = transformation_input.drop_duplicate.keep

#         print(f"Applying drop duplicates on column, split and keep->: {split_col_value}, keep: {keep}")

#        # Check if all columns in split_col_value exist in df.columns
#         if not all(col in df.columns for col in split_col_value):
#             missing_columns = [col for col in split_col_value if col not in df.columns]
#             raise HTTPException(status_code=400, detail=f"Columns {missing_columns} not found in dataset")

#         df.drop_duplicates(subset=split_col_value, keep=keep, inplace=True)
        

#         save_dataframe_to_csv(df, dataset.file_path)
#         # Log the transformation
#         log_transformation(db, dataset_id, transformation_input)

#     # HOW TO SHOW BELOW APIs ON FRONTEND? 
#     if transformation_input.operation_type == 'advQueryFilter':
#         if not transformation_input.adv_query:
#             raise HTTPException(status_code=400, detail="Drop Dublicate parameter not found")
        
#         query_string= transformation_input.adv_query.query

#         print(f"Applying Adv Query on column, advQuery String->: {query_string}")

#         df = df.query(query_string)
        

#     if transformation_input.operation_type == 'pivotTables':
#         if not transformation_input.pivot_query:
#             raise HTTPException(status_code=400, detail="Drop Dublicate parameter not found")
        
#         index = transformation_input.pivot_query.index
#         column = transformation_input.pivot_query.column
#         value = transformation_input.pivot_query.value
#         aggfun = transformation_input.pivot_query.aggfun
#         print(f"Applying Pivot Tables on column, Pivot tables on String->: {index}, {column}, {value}, {aggfun}")

#         split_col_value = index.split(',')
#          # Check if all columns in split_col_value exist in df.columns
#         if not all(col in df.columns for col in split_col_value):
#             missing_columns = [col for col in split_col_value if col not in df.columns]
#             raise HTTPException(status_code=400, detail=f"Columns {missing_columns} not found in dataset")
        
#         # Apply the pivot table transformation
#         try:
#             df = pd.pivot_table(df, index=split_col_value, values=value, columns=column, aggfunc=aggfun)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Error applying pivot table: {str(e)}")
        


#     data =  {
#         "dataset_id": dataset_id,
#         "operation_type": transformation_input.operation_type,
#         # "result": result,
#         "row_count": len(df),
#         "columns": df.columns.tolist(),
#         "rows": df.values.tolist()  # Convert dataframe rows to list of lists
#         }

#     print("msg to frontend from complex api", data)
#     return data 

@router.post("/{dataset_id}/Complextransform", response_model=schemas.BasicQueryResponse)
async def Complextransform(
    dataset_id: int,
    transformation_input: schemas.TransformationInput,
    db: Session = Depends(database.get_db)
):
    dataset = get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=400, detail=f"Dataset with ID {dataset_id} not found")
    
    try:
        df = pd.read_csv(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {str(e)}")

    # Handle 'dropDuplicate' operation
    if transformation_input.operation_type == 'dropDuplicate':
        if not transformation_input.drop_duplicate:
            raise HTTPException(status_code=400, detail="Drop Duplicate parameters not provided")
        
        columns = transformation_input.drop_duplicate.columns
        split_col_value = columns.split(',')
        keep = transformation_input.drop_duplicate.keep

        print(f"Applying drop duplicates on columns: {split_col_value}, keep: {keep}")

        if not all(col in df.columns for col in split_col_value):
            missing_columns = [col for col in split_col_value if col not in df.columns]
            raise HTTPException(status_code=400, detail=f"Columns {missing_columns} not found in dataset")

        df.drop_duplicates(subset=split_col_value, keep=keep, inplace=True)
        save_dataframe_to_csv(df, dataset.file_path)
        log_transformation(db, dataset_id, transformation_input)

    # Handle 'advQueryFilter' operation
    elif transformation_input.operation_type == 'advQueryFilter':
        if not transformation_input.adv_query:
            raise HTTPException(status_code=400, detail="Advanced Query parameter not provided")
        
        query_string = transformation_input.adv_query.query
        print(f"Applying Advanced Query: {query_string}")

        # Ensure column names are properly escaped in the query
        try:
            df = df.query(query_string)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error applying query '{query_string}': {str(e)}")

    # Handle 'pivotTables' operation
    elif transformation_input.operation_type == 'pivotTables':
        if not transformation_input.pivot_query:
            raise HTTPException(status_code=400, detail="Pivot Table parameters not provided")
        
        index = transformation_input.pivot_query.index
        column = transformation_input.pivot_query.column
        value = transformation_input.pivot_query.value
        aggfun = transformation_input.pivot_query.aggfun
        print(f"Applying Pivot Table with index: {index}, column: {column}, value: {value}, aggregation function: {aggfun}")

        split_col_value = index.split(',')
        if not all(col in df.columns for col in split_col_value):
            missing_columns = [col for col in split_col_value if col not in df.columns]
            raise HTTPException(status_code=400, detail=f"Columns {missing_columns} not found in dataset")

        try:
            df = pd.pivot_table(df, index=split_col_value, values=value, columns=column, aggfunc=aggfun)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error applying pivot table: {str(e)}")

    # Prepare response
    try:
        data = {
            "dataset_id": dataset_id,
            "operation_type": transformation_input.operation_type,
            "row_count": len(df),
            "columns": df.columns.tolist(),  # Ensure columns are strings
            "rows": df.astype(str).values.tolist()  # Ensure all values are strings
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error preparing response data: {str(e)}")

    print("Response to frontend:", data)
    return data



# APPLY changes to original dataset
def apply_transformation(df: pd.DataFrame, action_type: str, action_details: dict) -> pd.DataFrame:

    if action_type == 'addRow':
        index = action_details['row_params']['index']
        new_row = pd.DataFrame([[" "] * len(df.columns)], columns=df.columns, index=[index])
        df = pd.concat([df.iloc[:index], new_row, df.iloc[index:]]).reset_index(drop=True)
    
    elif action_type == 'delRow':
        index = action_details['row_params']['index']
        df = df.drop(index)
    
    elif action_type == 'addCol':
        index = action_details['col_params']['index']
        column_name = action_details['col_params']['name']
        df.insert(index, column_name, None)
    
    elif action_type == 'delCol':
        index = action_details['row_params']['index']
        column_name = df.columns[index]
        df = df.drop(column_name, axis=1)
    
    elif action_type == 'fillEmpty':
        value = action_details['fill_empty_params']['index']
        df = df.fillna(value)
    
    elif action_type == 'dropDuplicate':
        columns = action_details['drop_duplicate']['columns'].split(',')
        keep = action_details['drop_duplicate']['keep']
        df = df.drop_duplicates(subset=columns, keep=keep)
    
    
    return df

# New endpoint to save changes
@router.post("/{dataset_id}/save", response_model=schemas.DatasetResponse)
async def save_dataset(dataset_id: int, commit_message: str, db: Session = Depends(database.get_db)):
    dataset = get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset with ID {dataset_id} not found")

    # Get all unapplied logs for this dataset
    logs = db.query(models.DatasetChangeLog).filter(
        models.DatasetChangeLog.dataset_id == dataset_id,
        models.DatasetChangeLog.applied == False
    ).order_by(models.DatasetChangeLog.timestamp).all()

    # new checkpoint
    new_checkpoint = models.Checkpoint(dataset_id=dataset_id, message=commit_message)
    db.add(new_checkpoint)
    db.flush()  # This will assign an ID to the new checkpoint

    # Load original dataset
    original_path = dataset.file_path.replace('_copy.csv', '.csv')
    df = pd.read_csv(original_path)

    # Apply and update logs
    for log in logs:
        df = apply_transformation(df, log.action_type, log.action_details)
        log.applied = True
        log.checkpoint_id = new_checkpoint.id  # Assign the new checkpoint ID to the log

     
    save_dataframe_to_csv(df, original_path)

     
    db.commit()

    data = {
        "filename": dataset.name,
        "file_path": original_path,
        "dataset_id": dataset.dataset_id,
        "columns": df.columns.tolist(),
        "row_count": len(df),
        "rows": df.values.tolist()
    }
    return data

# New endpoint to revert to a checkpoint
@router.post("/{dataset_id}/revert", response_model=schemas.DatasetResponse)
async def revert_to_checkpoint(dataset_id: int, checkpoint_id: int, db: Session = Depends(database.get_db)):
    dataset = get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset with ID {dataset_id} not found")

    # Load the original dataset
    original_path = dataset.file_path.replace('_copy.csv', '.csv')
    df = pd.read_csv(original_path)

    # Get all applied logs  to the checkpoint
    logs = db.query(models.DatasetChangeLog).filter(
        models.DatasetChangeLog.dataset_id == dataset_id,
        models.DatasetChangeLog.applied == True,
        models.DatasetChangeLog.checkpoint_id <= checkpoint_id
    ).order_by(models.DatasetChangeLog.timestamp).all()

    # Apply all transformations 
    for log in logs:
        df = apply_transformation(df, log.action_type, log.action_details)

   
    save_dataframe_to_csv(df, dataset.file_path)

    #  logs after the checkpoint as unapplied
    db.query(models.DatasetChangeLog).filter(
        models.DatasetChangeLog.dataset_id == dataset_id,
        models.DatasetChangeLog.checkpoint_id > checkpoint_id
    ).update({models.DatasetChangeLog.applied: False})

    db.commit()

    data = {
        "filename": dataset.name,
        "file_path": dataset.file_path,
        "dataset_id": dataset.dataset_id,
        "columns": df.columns.tolist(),
        "row_count": len(df),
        "rows": df.values.tolist()
    }
    return data
 










 