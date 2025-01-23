from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Path, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError
import logging

from app.core.dependencies import get_db, get_kol_by_id_or_404, get_kol_by_kol_id_or_404
from app.schemas.kol import (
    KOLCreate, KOLUpdate, KOLResponse, KOLBatchCreate,
    KOLFilter, PaginatedKOLResponse, Platform, Level, Gender, Source, SendStatus
)
from app.crud import kol as kol_crud

router = APIRouter()
logger = logging.getLogger(__name__)

def format_validation_error(e: ValidationError) -> str:
    """格式化验证错误信息"""
    error_messages = []
    for error in e.errors():
        field = error["loc"][0]
        msg = error["msg"]
        if "enum" in msg:
            if field == "source":
                msg = f"数据来源必须是以下值之一: {', '.join([e.value for e in Source])}"
            elif field == "level":
                msg = f"KOL等级必须是以下值之一: {', '.join([e.value for e in Level])}"
            elif field == "platform":
                msg = f"平台必须是以下值之一: {', '.join([e.value for e in Platform])}"
            elif field == "gender":
                msg = f"性别必须是以下值之一: {', '.join([e.value for e in Gender])}"
            elif field == "send_status":
                msg = f"发送状态必须是以下值之一: {', '.join([e.value for e in SendStatus])}"
        error_messages.append(f"{field}: {msg}")
    return "数据验证错误:\n" + "\n".join(error_messages)

@router.post("/", response_model=KOLResponse, status_code=status.HTTP_201_CREATED)
async def create_kol(
    request: Request,
    kol: KOLCreate,
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """创建单个KOL"""
    try:
        # 记录接收到的原始数据
        body = await request.json()
        logger.info(f"Received data: {body}")
        
        # 记录解析后的数据
        logger.info(f"Parsed data: {kol.dict()}")
        
        return await kol_crud.create_kol(db, kol)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValidationError as e:
        logger.error(f"Validation error: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=format_validation_error(e)
        )
    except Exception as e:
        logger.error(f"Error creating KOL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"创建KOL失败: {str(e)}"
        )

@router.post("/batch", response_model=list[KOLResponse], status_code=status.HTTP_201_CREATED)
async def create_kols_batch(
    request: Request,
    kols: KOLBatchCreate,
    db: AsyncSession = Depends(get_db)
) -> list[KOLResponse]:
    """批量创建KOL，最多支持500条"""
    try:
        # 记录接收到的原始数据
        body = await request.json()
        logger.info(f"Received batch data: {body}")
        
        return await kol_crud.create_kols_batch(db, kols.kols)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValidationError as e:
        logger.error(f"Validation error in batch create: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=format_validation_error(e)
        )
    except Exception as e:
        logger.error(f"Error in batch create: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"批量创建KOL失败: {str(e)}"
        )

@router.get("/{kol_id}", response_model=KOLResponse)
async def get_kol(
    kol: KOLResponse = Depends(get_kol_by_kol_id_or_404)
) -> KOLResponse:
    """获取单个KOL信息"""
    return kol

@router.put("/{kol_id}", response_model=KOLResponse)
async def update_kol(
    request: Request,
    kol_id: str = Path(..., description="KOL ID"),
    kol_update: KOLUpdate = None,
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """更新KOL信息"""
    try:
        # 记录接收到的原始数据
        if request.method != "GET":
            body = await request.json()
            logger.info(f"Received update data for {kol_id}: {body}")
        
        # 先获取现有KOL
        kol = await kol_crud.get_kol_by_kol_id(db, kol_id)
        if not kol:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"KOL with id {kol_id} not found"
            )
        
        # 如果请求体为空，返回现有KOL
        if not kol_update:
            return kol
            
        # 更新KOL
        return await kol_crud.update_kol(db, kol, kol_update)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValidationError as e:
        logger.error(f"Validation error in update: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=format_validation_error(e)
        )
    except Exception as e:
        logger.error(f"Error updating KOL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"更新KOL失败: {str(e)}"
        )

@router.delete("/{kol_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_kol(
    kol: KOLResponse = Depends(get_kol_by_kol_id_or_404),
    db: AsyncSession = Depends(get_db)
):
    """删除KOL"""
    try:
        await kol_crud.delete_kol(db, kol)
    except Exception as e:
        logger.error(f"Error deleting KOL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"删除KOL失败: {str(e)}"
        )

@router.get("/", response_model=PaginatedKOLResponse)
async def get_kols(
    name: Optional[str] = None,
    platform: Optional[Platform] = None,
    level: Optional[Level] = None,
    gender: Optional[Gender] = None,
    location: Optional[str] = None,
    source: Optional[Source] = None,
    send_status: Optional[SendStatus] = None,
    min_followers: Optional[float] = None,
    max_followers: Optional[float] = None,
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=100, description="每页数量"),
    db: AsyncSession = Depends(get_db)
) -> PaginatedKOLResponse:
    """获取KOL列表，支持分页和过滤"""
    try:
        filters = KOLFilter(
            name=name,
            platform=platform,
            level=level,
            gender=gender,
            location=location,
            source=source,
            send_status=send_status,
            min_followers=min_followers,
            max_followers=max_followers
        )
        return await kol_crud.get_kols(db, filters, page, size)
    except ValidationError as e:
        logger.error(f"Validation error in filters: {e.errors()}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=format_validation_error(e)
        )
    except Exception as e:
        logger.error(f"Error getting KOLs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"获取KOL列表失败: {str(e)}"
        )
