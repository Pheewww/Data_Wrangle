from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app import models, schemas, database
import pandas as pd
import shutil

router = APIRouter()

# CRUD Functions
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

# function to save changes in db

def save_dataframe_to_csv(df: pd.DataFrame, file_path: str):
    """Saves the DataFrame to a CSV file and handles potential errors."""
    try:
        df.to_csv(file_path, index=False)
        print("In try block, df changed", df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")

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
    
    dataset = create_dataset(db, filename=file.filename, file_path=file_location)
    
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
    
        # Concatenate the new row with the original DataFrame
        print("DF BEFORE", df)

        df = pd.concat([df.iloc[:index], new_row, df.iloc[index:]]).reset_index(drop=True)
        print("DF AFTER", df)

        try:
            df.to_csv(dataset.file_path, index=False)
            print("in try block, df changed", df)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")

    elif transformation_input.operation_type == 'delRow':
        if not transformation_input.row_params:
            raise HTTPException(status_code = 400, detail="please privide index where row has to be added")
        
        index = transformation_input.row_params.index 
        # row_column because only index is enough to del col

        if index < 0 or index > len(df):
            raise ValueError("Index out of range")
        
        df = df.drop(index)

        try:
            df.to_csv(dataset.file_path, index=False)
            print("in try block, df changed", df)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")
    

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

        
        try:
            df.to_csv(dataset.file_path, index=False)
            print("in try block, df changed", df)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")

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

        try:
            df.to_csv(dataset.file_path, index=False)
            print("In try block, df changed", df)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")

    elif transformation_input.operation_type == 'fillEmpty':
        if not transformation_input.fill_empty_params:
            raise HTTPException(status_code=400, detail="Please provide the values that has to be filled")
        
        df = pd.read_csv(dataset.file_path, na_values=[' ', '']) 
        
        value = transformation_input.fill_empty_params.index 

        # implement forward and backward fill
        df.fillna(value, inplace=True)

        try:
            df.to_csv(dataset.file_path, index=False)
            print("In try block, df changed", df)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving updated dataset: {str(e)}")

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


@router.post("/{dataset_id}/Complextransform", response_model=schemas.BasicQueryResponse)
async def Complextransform( 
    dataset_id: int,
    transformation_input: schemas.TransformationInput,
    db: Session = Depends(database.get_db)
): 

    dataset = get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=400, detail=f"Dataset with ID not found"
        )
    
    try:
        df = pd.read_csv(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {str(e)}")
    
    if transformation_input.operation_type == 'dropDuplicate':
        if not transformation_input.drop_duplicate:
            raise HTTPException(status_code=400, detail="Drop Dublicate parameter not found")
        
        # multiple column from input is left -> 
        column= transformation_input.drop_duplicate.columns
        split_col_value = column.split(',')
        keep = transformation_input.drop_duplicate.keep

        print(f"Applying drop duplicates on column, split and keep->: {split_col_value}, keep: {keep}")

       # Check if all columns in split_col_value exist in df.columns
        if not all(col in df.columns for col in split_col_value):
            missing_columns = [col for col in split_col_value if col not in df.columns]
            raise HTTPException(status_code=400, detail=f"Columns {missing_columns} not found in dataset")

        df.drop_duplicates(subset=split_col_value, keep=keep, inplace=True)
        

        save_dataframe_to_csv(df, dataset.file_path)


    data =  {
        "dataset_id": dataset_id,
        "operation_type": transformation_input.operation_type,
        # "result": result,
        "row_count": len(df),
        "columns": df.columns.tolist(),
        "rows": df.values.tolist()  # Convert dataframe rows to list of lists
        }

    print("msg to frontend from complex api", data)
    return data 
 














# @router.post("/upload", response_model=schemas.DatasetResponse)
# async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
#     # Upload logic

# @router.post("/{dataset_id}/filter", response_model=schemas.BasicQueryResponse)
# async def filter_dataset(
#     dataset_id: int,
#     filter_params: schemas.FilterParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Filter logic

# @router.post("/{dataset_id}/sort", response_model=schemas.BasicQueryResponse)
# async def sort_dataset(
#     dataset_id: int,
#     sort_params: schemas.SortParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Sort logic

# @router.post("/{dataset_id}/add_row", response_model=schemas.BasicQueryResponse)
# async def add_row_to_dataset(
#     dataset_id: int,
#     row_params: schemas.RowParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Add row logic

# @router.post("/{dataset_id}/delete_row", response_model=schemas.BasicQueryResponse)
# async def delete_row_from_dataset(
#     dataset_id: int,
#     row_params: schemas.RowParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Delete row logic

# @router.post("/{dataset_id}/add_column", response_model=schemas.BasicQueryResponse)
# async def add_column_to_dataset(
#     dataset_id: int,
#     col_params: schemas.ColParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Add column logic

# @router.post("/{dataset_id}/delete_column", response_model=schemas.BasicQueryResponse)
# async def delete_column_from_dataset(
#     dataset_id: int,
#     col_params: schemas.ColParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Delete column logic

# @router.post("/{dataset_id}/fill_empty", response_model=schemas.BasicQueryResponse)
# async def fill_empty_in_dataset(
#     dataset_id: int,
#     fill_params: schemas.FillEmptyParameters,
#     db: Session = Depends(database.get_db)
# ):
#     # Fill empty logic
