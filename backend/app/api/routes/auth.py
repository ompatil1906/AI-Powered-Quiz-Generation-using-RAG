from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import UserRegisterRequest, UserLoginRequest, HistorySaveRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
async def signup(request: UserRegisterRequest):
    try:
        return auth_service.register_user(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(request: UserLoginRequest):
    try:
        return auth_service.login_user(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/history/save")
async def save_history(request: HistorySaveRequest):
    try:
        return auth_service.save_history_entry(
            user_id=request.userId,
            lesson_id=request.lessonId,
            config=request.config or {},
            quiz=request.quiz,
            rag_stats=request.ragStats or {}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(userId: str = Query(...)):
    try:
        return auth_service.get_user_history(userId)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history/{entryId}")
async def delete_history(entryId: str, userId: str = Query(...)):
    try:
        success = auth_service.delete_history_entry(userId, entryId)
        return {"status": "success", "deleted": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
