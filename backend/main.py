from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
tasks = []

class Task(BaseModel):
    title: str
    description: str

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def add_task(task: Task):
    tasks.append(task.dict())
    return {"message": "Task added", "task": task}

