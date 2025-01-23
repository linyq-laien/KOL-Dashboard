from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import KOL
from app.schemas.kol import KOLCreate, KOLUpdate, KOLFilter, KOLResponse

async def create_kol(db: AsyncSession, kol: KOLCreate) -> KOL:
    """创建单个KOL"""
    # 检查 kol_id 是否已存在
    existing_kol = await get_kol_by_kol_id(db, kol.kol_id)
    if existing_kol:
        raise ValueError(f"KOL with kol_id {kol.kol_id} already exists")
    
    # 创建新的 KOL
    kol_data = kol.model_dump(exclude_none=True)  # 排除所有 None 值
    current_time = datetime.utcnow()
    db_kol = KOL(
        **kol_data,
        created_at=current_time,
        updated_at=current_time
    )
    db.add(db_kol)
    await db.commit()
    await db.refresh(db_kol)
    return db_kol

async def create_kols_batch(db: AsyncSession, kols: List[KOLCreate]) -> List[KOL]:
    """批量创建KOL"""
    # 检查 kol_id 是否有重复
    kol_ids = [kol.kol_id for kol in kols]
    if len(kol_ids) != len(set(kol_ids)):
        raise ValueError("Duplicate kol_id found in batch create request")
    
    # 检查数据库中是否已存在相同的 kol_id
    for kol_id in kol_ids:
        existing_kol = await get_kol_by_kol_id(db, kol_id)
        if existing_kol:
            raise ValueError(f"KOL with kol_id {kol_id} already exists")
    
    # 创建新的 KOL
    db_kols = [KOL(**kol.model_dump(exclude_none=True)) for kol in kols]  # 排除所有 None 值
    db.add_all(db_kols)
    await db.commit()
    for db_kol in db_kols:
        await db.refresh(db_kol)
    return db_kols

async def get_kol_by_id(db: AsyncSession, kol_id: int) -> Optional[KOL]:
    """通过 ID 获取单个 KOL"""
    result = await db.execute(select(KOL).filter(KOL.id == kol_id))
    return result.scalar_one_or_none()

async def get_kol_by_kol_id(db: AsyncSession, kol_id: str) -> Optional[KOL]:
    """通过 kol_id 获取单个 KOL"""
    result = await db.execute(select(KOL).filter(KOL.kol_id == kol_id))
    return result.scalar_one_or_none()

async def update_kol(db: AsyncSession, db_kol: KOL, kol_update: KOLUpdate) -> KOL:
    """更新KOL信息"""
    update_data = kol_update.model_dump(exclude_none=True)  # 排除所有 None 值
    
    # 更新时间戳
    update_data['updated_at'] = datetime.now()
    
    for field, value in update_data.items():
        setattr(db_kol, field, value)
    
    await db.commit()
    await db.refresh(db_kol)
    return db_kol

async def delete_kol(db: AsyncSession, db_kol: KOL):
    """删除KOL"""
    await db.delete(db_kol)
    await db.commit()

async def get_kols(
    db: AsyncSession,
    filters: KOLFilter,
    page: int = 1,
    size: int = 10
) -> dict:
    """获取KOL列表，支持分页和过滤"""
    # 构建基础查询
    query = select(KOL)
    
    # 添加过滤条件
    if filters.name:
        query = query.filter(KOL.name.ilike(f"%{filters.name}%"))
    if filters.platform:
        query = query.filter(KOL.platform == filters.platform)
    if filters.level:
        query = query.filter(KOL.level == filters.level)
    if filters.gender:
        query = query.filter(KOL.gender == filters.gender)
    if filters.location:
        query = query.filter(KOL.location.ilike(f"%{filters.location}%"))
    if filters.source:
        query = query.filter(KOL.source == filters.source)
    if filters.send_status:
        query = query.filter(KOL.send_status == filters.send_status)
    if filters.min_followers is not None:
        query = query.filter(KOL.followers_k >= filters.min_followers)
    if filters.max_followers is not None:
        query = query.filter(KOL.followers_k <= filters.max_followers)
    
    # 添加排序：按更新时间倒序
    query = query.order_by(desc(KOL.updated_at))
    
    # 获取总记录数
    total_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(total_query)
    
    # 添加分页
    query = query.offset((page - 1) * size).limit(size)
    
    # 执行查询
    result = await db.execute(query)
    items = result.scalars().all()
    
    # 计算总页数
    pages = (total + size - 1) // size
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }
