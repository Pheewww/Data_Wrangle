# from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, status
# from fastapi.responses import JSONResponse
# from fastapi.exceptions import RequestValidationError
# from starlette.exceptions import HTTPException as StarletteHTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# import pandas as pd
# from models import Dataset, engine, SessionLocal, Base
# import shutil
# import os



# DATABASE_URL = "  "
# Base.metadata.create_all(bind=engine)
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],   
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
        
# @app.exception_handler(StarletteHTTPException)
# async def http_exception_handler(request, exc):
#     headers = {
#         'Access-Control-Allow-Origin': 'http://localhost:3000',
#         'Access-Control-Allow-Credentials': 'true',
#         'Access-Control-Allow-Methods': '*',
#         'Access-Control-Allow-Headers': '*',
#     }
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"detail": exc.detail},
#         headers=headers,
#     )

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):
#     headers = {
#         'Access-Control-Allow-Origin': 'http://localhost:3000',
#         'Access-Control-Allow-Credentials': 'true',
#         'Access-Control-Allow-Methods': '*',
#         'Access-Control-Allow-Headers': '*',
#     }
#     return JSONResponse(
#         status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#         content={"detail": exc.errors()},
#         headers=headers,
#     )

# @app.post("/datasets/upload")
# async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     file_location = f"uploads/{file.filename}"
#     print('file', file_location)
#     with open(file_location, "wb+") as file_object:
#         shutil.copyfileobj(file.file, file_object)
    
#     try:
#         df = pd.read_csv(file_location)  
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error reading dataset: {e}")

#     dataset_dict = df.to_dict(orient='records')

#     dataset = Dataset(name=file.filename, file_path=file_location)
#     db.add(dataset)
#     db.commit()
#     db.refresh(dataset)

#     return {"filename": dataset.name, "file_path": dataset.file_path, "dataset": dataset_dict, "dataset_id": dataset.dataset_id }

# class FilterParameters(BaseModel):
#     filter_condition: str

 
# class TransformationInput(BaseModel):
#     operation_type: str
#     parameters: FilterParameters

# @app.post("/datasets/{dataset_id}/transform")
# async def transform_dataset(dataset_id: int, transformation_input: TransformationInput, db: Session = Depends(get_db)):
#     dataset = db.query(Dataset).filter(Dataset.dataset_id == dataset_id).first()
#     if not dataset:
#         raise HTTPException(status_code=404, detail=f"Dataset with ID {dataset_id} not found")
    
#     try:
#         df = pd.read_csv(dataset.file_path)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Could not load dataset from file path {dataset.file_path}: {e}")

#     if transformation_input.operation_type == 'filter':
#         filter_condition = transformation_input.parameters.filter_condition
#         df = df.query(filter_condition)

#     data = df.to_dict(orient='records')
#     return data



# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.endpoints import datasets
from dotenv import load_dotenv
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()


# load_dotenv() 
# FRONTEND_URL = os.getenv("FRONTEND_URL")  # No default value
# if FRONTEND_URL is None:
#     raise ValueError("FRONTEND_URL environment variable not set")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 

app.include_router(datasets.router, prefix="/datasets", tags=["datasets"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)