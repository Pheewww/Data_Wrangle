from sqlalchemy.orm import Session
from . import models, schemas

def create_dataset(db: Session, filename: str, file_path: str, user_id: int):
    if user_id is None:
        print("User ID", user_id)
    db_dataset = models.Dataset(name=filename, file_path=file_path, user_id=user_id)
    print("db_dataset in crud.py", db_dataset)
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def get_dataset(db: Session, dataset_id: int):
    return db.query(models.Dataset).filter(models.Dataset.dataset_id == dataset_id).first() 