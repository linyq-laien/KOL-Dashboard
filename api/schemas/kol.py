from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from ..models import Gender, Level, Platform, Source, SendStatus

class KOLBase(BaseModel):
    """KOL基础模型"""
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    account_link: Optional[HttpUrl] = None
    platform: Optional[Platform] = None
    source: Optional[Source] = None
    filter: Optional[str] = None
    gender: Optional[Gender] = None
    tag: Optional[str] = None
    language: Optional[str] = None
    location: Optional[str] = None
    slug: Optional[str] = None
    creator_id: Optional[str] = None
    followers_k: Optional[float] = None
    likes_k: Optional[float] = None
    mean_views_k: Optional[float] = None
    median_views_k: Optional[float] = None
    engagement_rate: Optional[float] = None
    average_views_k: Optional[float] = None
    average_likes_k: Optional[float] = None
    average_comments_k: Optional[float] = None
    send_status: Optional[SendStatus] = None
    send_date: Optional[datetime] = None
    export_date: Optional[datetime] = None
    level: Optional[Level] = None
    keywords_ai: Optional[List[str]] = None
    most_used_hashtags: Optional[List[str]] = None

class KOLCreate(KOLBase):
    """创建KOL时的请求模型"""
    kol_id: str = Field(..., description="KOL唯一标识")

class KOLUpdate(KOLBase):
    """更新KOL时的请求模型"""
    pass

class KOLInDB(KOLBase):
    """数据库中的KOL模型"""
    id: int
    kol_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class KOLResponse(KOLInDB):
    """KOL响应模型"""
    pass

class KOLBatchCreate(BaseModel):
    """批量创建KOL的请求模型"""
    kols: List[KOLCreate] = Field(..., max_items=500)

class KOLFilter(BaseModel):
    """KOL查询过滤条件"""
    name: Optional[str] = None
    platform: Optional[Platform] = None
    level: Optional[Level] = None
    gender: Optional[Gender] = None
    location: Optional[str] = None
    source: Optional[Source] = None
    send_status: Optional[SendStatus] = None
    min_followers: Optional[float] = None
    max_followers: Optional[float] = None

class PaginatedKOLResponse(BaseModel):
    """分页KOL响应模型"""
    total: int
    items: List[KOLResponse]
    page: int
    size: int
    pages: int 