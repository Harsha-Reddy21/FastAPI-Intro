import uvicorn
from app.database.init_db import create_tables, add_sample_data

if __name__ == "__main__":
    print("Initializing database...")
    create_tables()
    add_sample_data()
    
    print("Starting FastAPI server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 