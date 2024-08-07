from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.endpoints import datasets, user_logs
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
app.include_router(user_logs.router, prefix="/logs", tags=["user_logs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)