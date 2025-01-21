from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from .database import async_session_maker
from .models import KOL
from .crud.kol import get_kol

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """获取数据库会话"""
    async with async_session_maker() as session:
        yield session

async def get_kol_or_404(
    kol_id: str,
    db: AsyncSession = Depends(get_db)
) -> KOL:
    """获取KOL，如果不存在则抛出404错误"""
    kol = await get_kol(db, kol_id)
    if kol is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"KOL with id {kol_id} not found"
        )
    return kol 