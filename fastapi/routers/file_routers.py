from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from fastapi.responses import FileResponse
from typing import List
from utils.default_auth_utils import validate_access_token

router = APIRouter()

@router.get("/download/{image_name}")
async def download_image(image_name: str, token_data: str = Depends(validate_access_token)):
    image_path = f"uploads/{image_name}"
    try:
        if '.jpeg' in image_name or '.jpg' in image_name:
            media_type = "image/jpeg"
        elif ".png" in image_name:
            media_type = "image/png"
        return FileResponse(path=image_path, filename=image_name, media_type=media_type)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image not found.")
