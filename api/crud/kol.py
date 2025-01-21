from typing import List, Optional, Tuple
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import KOL
from ..schemas.kol import KOLCreate, KOLUpdate, KOLFilter

async def create_kol(db: AsyncSession, kol: KOLCreate) -> KOL:
    """创建单个KOL"""
    db_kol = KOL(**kol.model_dump())
    db.add(db_kol)
    await db.commit()
    await db.refresh(db_kol)
    return db_kol

async def create_kols_batch(db: AsyncSession, kols: List[KOLCreate]) -> List[KOL]:
    """批量创建KOL"""
    db_kols = [KOL(**kol.model_dump()) for kol in kols]
    db.add_all(db_kols)
    await db.commit()
    for db_kol in db_kols:
        await db.refresh(db_kol)
    return db_kols

async def get_kol(db: AsyncSession, kol_id: str) -> Optional[KOL]:
    """根据kol_id获取单个KOL"""
    result = await db.execute(select(KOL).where(KOL.kol_id == kol_id))
    return result.scalar_one_or_none()

async def get_kol_by_id(db: AsyncSession, id: int) -> Optional[KOL]:
    """根据id获取单个KOL"""
    result = await db.execute(select(KOL).where(KOL.id == id))
    return result.scalar_one_or_none()

async def update_kol(db: AsyncSession, kol_id: str, kol_update: KOLUpdate) -> Optional[KOL]:
    """更新KOL信息"""
    db_kol = await get_kol(db, kol_id)
    if not db_kol:
        return None
    
    update_data = kol_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_kol, field, value)
    
    await db.commit()
    await db.refresh(db_kol)
    return db_kol

async def delete_kol(db: AsyncSession, kol_id: str) -> bool:
    """删除KOL"""
    db_kol = await get_kol(db, kol_id)
    if not db_kol:
        return False
    
    await db.delete(db_kol)
    await db.commit()
    return True

async def get_kols(
    db: AsyncSession,
    filter_params: Optional[KOLFilter] = None,
    skip: int = 0,
    limit: int = 10
) -> Tuple[List[KOL], int]:
    """
    获取KOL列表，支持分页和过滤
    返回: (kols列表, 总数)
    """
    # 构建查询条件
    query = select(KOL)
    count_query = select(func.count()).select_from(KOL)
    
    if filter_params:
        conditions = []
        if filter_params.name:
            conditions.append(KOL.name.ilike(f"%{filter_params.name}%"))
        if filter_params.platform:
            conditions.append(KOL.platform == filter_params.platform)
        if filter_params.level:
            conditions.append(KOL.level == filter_params.level)
        if filter_params.gender:
            conditions.append(KOL.gender == filter_params.gender)
        if filter_params.location:
            conditions.append(KOL.location.ilike(f"%{filter_params.location}%"))
        if filter_params.source:
            conditions.append(KOL.source == filter_params.source)
        if filter_params.send_status:
            conditions.append(KOL.send_status == filter_params.send_status)
        if filter_params.min_followers is not None:
            conditions.append(KOL.followers_k >= filter_params.min_followers)
        if filter_params.max_followers is not None:
            conditions.append(KOL.followers_k <= filter_params.max_followers)
        
        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))
    
    # 执行总数查询
    total = await db.scalar(count_query)
    
    # 执行分页查询
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    kols = result.scalars().all()
    
    return kols, total 