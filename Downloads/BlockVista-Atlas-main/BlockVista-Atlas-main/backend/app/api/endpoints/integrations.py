from fastapi import APIRouter, File, UploadFile, HTTPException
import shutil
import os
import pandas as pd
from typing import Dict, Any

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Ingests a CSV or Excel file for processing.
    """
    try:
        # 1. Save File
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Parse File (Basic Validation)
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file_path)
        else:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Invalid file format. Only CSV/Excel allowed.")
            
        # 3. Return Summary
        return {
            "filename": file.filename,
            "status": "success",
            "rows_ingested": len(df),
            "columns": list(df.columns),
            "message": f"Successfully ingested {len(df)} rows from {file.filename}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
