from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app import crud, schemas, database
import pandas as pd
import shutil
import os

router = APIRouter()

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
    
    dataset = crud.create_dataset(db, filename=file.filename, file_path=file_location, user_id=1)
    
    return {
        "user_id": dataset.user_id,
        "filename": dataset.name,
        "file_path": dataset.file_path,
        "dataset_id": dataset.dataset_id,
        "columns": df.columns.tolist(),
        "row_count": len(df)
    }

@router.post("/{dataset_id}/transform", response_model=schemas.TransformationInput)
async def transform_dataset(
    dataset_id: int,
    transformation_input: schemas.TransformationInput,
    db: Session = Depends(database.get_db)
):
    dataset = crud.get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail=f"Dataset with ID {dataset_id} not found")
   
    try:
        df = pd.read_csv(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {str(e)}")

    if transformation_input.operation_type == 'filter':
        if not transformation_input.filter_params:
            raise HTTPException(status_code=400, detail="Filter parameters are required for filter operation")
        
        column = transformation_input.filter_params.column
        condition = transformation_input.filter_params.condition
        value = transformation_input.filter_params.value

        if condition == 'eq':
            df = df[df[column] == value]
        elif condition == 'gt':
            df = df[df[column] > value]
        elif condition == 'lt':
            df = df[df[column] < value]
        elif condition == 'gte':
            df = df[df[column] >= value]
        elif condition == 'lte':
            df = df[df[column] <= value]
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported filter condition: {condition}")

    elif transformation_input.operation_type == 'sort':
        if not transformation_input.sort_params:
            raise HTTPException(status_code=400, detail="Sort parameters are required for sort operation")
        
        column = transformation_input.sort_params.column
        ascending = transformation_input.sort_params.ascending

        df = df.sort_values(by=column, ascending=ascending)

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported operation type: {transformation_input.operation_type}")

    result = df.to_dict(orient='records')
    
    return {
        "dataset_id": dataset_id,
        "operation_type": transformation_input.operation_type,
        "result": result,
        "row_count": len(df)
    }