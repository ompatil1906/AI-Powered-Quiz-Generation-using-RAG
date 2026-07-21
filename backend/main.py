import uvicorn
from app.main import app

# This file is kept for backward compatibility with the existing uvicorn command.
# The actual FastAPI application is defined in app/main.py

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
