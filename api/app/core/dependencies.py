from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import async_session_maker
from app.crud import kol as kol_crud
from app.schemas.kol import KOLResponse

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def get_kol_by_id_or_404(
    kol_id: int,
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """通过 ID 获取 KOL，如果不存在则返回 404"""
    kol = await kol_crud.get_kol_by_id(db, kol_id)
    if not kol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"KOL with id {kol_id} not found"
        )
    return kol

async def get_kol_by_kol_id_or_404(
    kol_id: str,
    db: AsyncSession = Depends(get_db)
) -> KOLResponse:
    """通过 kol_id 获取 KOL，如果不存在则返回 404"""
    kol = await kol_crud.get_kol_by_kol_id(db, kol_id)
    if not kol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"KOL with kol_id {kol_id} not found"
        )
    return kol
