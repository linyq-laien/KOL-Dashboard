from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..dependencies import get_db, get_kol_or_404
from ..schemas.kol import (
    KOLCreate, KOLUpdate, KOLResponse, KOLBatchCreate,
    KOLFilter, PaginatedKOLResponse
)
from ..crud import kol as kol_crud

router = APIRouter(
    prefix="/kols",
    tags=["KOLs"]
)

@router.post("/", response_model=KOLResponse, status_code=status.HTTP_201_CREATED)
async def create_kol(
    kol: KOLCreate,
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """
    创建单个KOL
    """
    return await kol_crud.create_kol(db, kol)

@router.post("/batch", response_model=list[KOLResponse], status_code=status.HTTP_201_CREATED)
async def create_kols_batch(
    kols: KOLBatchCreate,
    db: AsyncSession = Depends(get_db)
) -> list[KOLResponse]:
    """
    批量创建KOL，最多支持500条
    """
    return await kol_crud.create_kols_batch(db, kols.kols)

@router.get("/{kol_id}", response_model=KOLResponse)
async def get_kol(
    kol: KOLResponse = Depends(get_kol_or_404)
) -> KOLResponse:
    """
    获取单个KOL信息
    """
    return kol

@router.put("/{kol_id}", response_model=KOLResponse)
async def update_kol(
    kol_update: KOLUpdate,
    kol: KOLResponse = Depends(get_kol_or_404),
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """
    更新KOL信息
    """
    return await kol_crud.update_kol(db, kol.kol_id, kol_update)

@router.delete("/{kol_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_kol(
    kol: KOLResponse = Depends(get_kol_or_404),
    db: AsyncSession = Depends(get_db)
):
    """
    删除KOL
    """
    await kol_crud.delete_kol(db, kol.kol_id)

@router.get("/", response_model=PaginatedKOLResponse)
async def get_kols(
    name: Optional[str] = None,
    platform: Optional[str] = None,
    level: Optional[str] = None,
    gender: Optional[str] = None,
    location: Optional[str] = None,
    source: Optional[str] = None,
    send_status: Optional[str] = None,
    min_followers: Optional[float] = None,
    max_followers: Optional[float] = None,
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(10, ge=1, le=100, description="每页数量"),
    db: AsyncSession = Depends(get_db)
) -> PaginatedKOLResponse:
    """
    获取KOL列表，支持分页和过滤
    - page: 页码，从1开始
    - size: 每页数量，默认10，最大100
    """
    # 构建过滤条件
    filter_params = KOLFilter(
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
    
    # 计算分页参数
    skip = (page - 1) * size
    
    # 获取数据
    kols, total = await kol_crud.get_kols(
        db,
        filter_params=filter_params,
        skip=skip,
        limit=size
    )
    
    # 计算总页数
    pages = (total + size - 1) // size
    
    return PaginatedKOLResponse(
        total=total,
        items=kols,
        page=page,
        size=size,
        pages=pages
    ) 