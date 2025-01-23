from datetime import datetime
from typing import List, Optional, Union
from pydantic import BaseModel, EmailStr, Field, validator

from app.db.models import Gender, Level, Platform, Source, SendStatus

class KOLBase(BaseModel):
    """KOL基础模型"""
    email: Optional[EmailStr] = Field(None, description="邮箱")
    name: Optional[str] = Field(None, description="名称")
    bio: Optional[str] = Field(None, description="简介")
    account_link: Optional[str] = Field(None, description="账号链接")
    platform: Optional[Platform] = Field(None, description="平台")
    source: Optional[Union[Source, str]] = Field(None, description="数据来源")
    filter: Optional[str] = Field(None, description="过滤器")
    gender: Optional[Gender] = Field(None, description="性别")
    tag: Optional[str] = Field(None, description="标签")
    language: Optional[str] = Field(None, description="语言")
    location: Optional[str] = Field(None, description="地理位置")
    slug: Optional[str] = Field(None, description="短链接")
    creator_id: Optional[str] = Field(None, description="创建者ID")
    followers_k: Optional[float] = Field(None, description="粉丝数(K)")
    likes_k: Optional[float] = Field(None, description="点赞数(K)")
    mean_views_k: Optional[float] = Field(None, description="平均观看数(K)")
    median_views_k: Optional[float] = Field(None, description="中位观看数(K)")
    engagement_rate: Optional[float] = Field(None, description="互动率")
    average_views_k: Optional[float] = Field(None, description="平均观看数(K)")
    average_likes_k: Optional[float] = Field(None, description="平均点赞数(K)")
    average_comments_k: Optional[float] = Field(None, description="平均评论数(K)")
    send_status: Optional[SendStatus] = Field(None, description="发送状态")
    send_date: Optional[datetime] = Field(None, description="发送日期")
    export_date: Optional[datetime] = Field(None, description="导出日期")
    level: Optional[Union[Level, str]] = Field(None, description="等级")
    keywords_ai: Optional[List[str]] = Field(default_factory=list, description="AI关键词")
    most_used_hashtags: Optional[List[str]] = Field(default_factory=list, description="常用标签")

    class Config:
        from_attributes = True

class KOLCreate(BaseModel):
    """创建KOL请求模型"""
    kol_id: str = Field(..., description="KOL唯一标识")
    email: Optional[EmailStr] = Field(None, description="邮箱")
    name: Optional[str] = Field(None, description="名称")
    bio: Optional[str] = Field(None, description="简介")
    account_link: Optional[str] = Field(None, description="账号链接")
    platform: Optional[Platform] = Field(None, description="平台")
    source: Optional[Union[Source, str]] = Field(None, description="数据来源")
    filter: Optional[str] = Field(None, description="过滤器")
    gender: Optional[Gender] = Field(None, description="性别")
    tag: Optional[str] = Field(None, description="标签")
    language: Optional[str] = Field(None, description="语言")
    location: Optional[str] = Field(None, description="地理位置")
    slug: Optional[str] = Field(None, description="短链接")
    creator_id: Optional[str] = Field(None, description="创建者ID")
    followers_k: Optional[float] = Field(None, description="粉丝数(K)")
    likes_k: Optional[float] = Field(None, description="点赞数(K)")
    mean_views_k: Optional[float] = Field(None, description="平均观看数(K)")
    median_views_k: Optional[float] = Field(None, description="中位观看数(K)")
    engagement_rate: Optional[float] = Field(None, description="互动率")
    average_views_k: Optional[float] = Field(None, description="平均观看数(K)")
    average_likes_k: Optional[float] = Field(None, description="平均点赞数(K)")
    average_comments_k: Optional[float] = Field(None, description="平均评论数(K)")
    send_status: Optional[SendStatus] = Field(None, description="发送状态")
    send_date: Optional[datetime] = Field(None, description="发送日期")
    export_date: Optional[datetime] = Field(None, description="导出日期")
    level: Optional[Union[Level, str]] = Field(None, description="等级")
    keywords_ai: Optional[List[str]] = Field(default_factory=list, description="AI关键词")
    most_used_hashtags: Optional[List[str]] = Field(default_factory=list, description="常用标签")

    @validator('source')
    def validate_source(cls, v):
        if v == '':
            return None
        return v

    @validator('level')
    def validate_level(cls, v):
        if v == '':
            return None
        return v

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "kol_id": "kol_123",
                "email": "example@email.com",
                "name": "KOL Name",
                "platform": "INSTAGRAM",
                "source": "MANUAL",
                "level": "MICRO"
            }
        }

class KOLUpdate(BaseModel):
    """更新KOL请求模型"""
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    account_link: Optional[str] = None
    platform: Optional[Platform] = None
    source: Optional[Union[Source, str]] = None
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
    level: Optional[Union[Level, str]] = None
    keywords_ai: Optional[List[str]] = None
    most_used_hashtags: Optional[List[str]] = None

    @validator('source')
    def validate_source(cls, v):
        if v == '':
            return None
        return v

    @validator('level')
    def validate_level(cls, v):
        if v == '':
            return None
        return v

    class Config:
        from_attributes = True

class KOLResponse(KOLBase):
    """KOL响应模型"""
    kol_id: str
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class KOLBatchCreate(BaseModel):
    """批量创建KOL请求模型"""
    kols: List[KOLCreate] = Field(..., max_items=500)

    class Config:
        from_attributes = True

class KOLFilter(BaseModel):
    """KOL过滤条件模型"""
    name: Optional[str] = None
    platform: Optional[Platform] = None
    level: Optional[Level] = None
    gender: Optional[Gender] = None
    location: Optional[str] = None
    source: Optional[Source] = None
    send_status: Optional[SendStatus] = None
    min_followers: Optional[float] = None
    max_followers: Optional[float] = None

    class Config:
        from_attributes = True

class PaginatedKOLResponse(BaseModel):
    """分页KOL响应模型"""
    items: List[KOLResponse]
    total: int
    page: int
    size: int
    pages: int

    class Config:
        from_attributes = True
