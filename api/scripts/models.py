from datetime import datetime, UTC
from typing import List, Optional
from sqlalchemy import ForeignKey, String, Float, DateTime, Enum, ARRAY
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
import enum

class Base(DeclarativeBase):
    pass

# KOL性别枚举
class Gender(str, enum.Enum):
    MALE = "MALE"     # 男性
    FEMALE = "FEMALE" # 女性
    LGBT = "LGBT"     # 跨性别

# KOL等级枚举
class Level(str, enum.Enum):
    MID = "Mid 50k-500k"     # 中型KOL
    MICRO = "Micro 10k-50k"  # 小型KOL
    NANO = "Nano 1-10k"      # 微型KOL

# 发送状态枚举
class SendStatus(str, enum.Enum):
    ROUND_1 = "Round No.1"
    ROUND_2 = "Round No.2"
    ROUND_3 = "Round No.3"
    ROUND_4 = "Round No.4"
    ROUND_5 = "Round No.5"
    ROUND_6 = "Round No.6"
    ROUND_7 = "Round No.7"
    ROUND_8 = "Round No.8"
    ROUND_9 = "Round No.9"
    ROUND_10 = "Round No.10"
    ROUND_11 = "Round No.11"
    ROUND_12 = "Round No.12"
    ROUND_13 = "Round No.13"
    ROUND_14 = "Round No.14"
    ROUND_15 = "Round No.15"
    ROUND_16 = "Round No.16"
    ROUND_17 = "Round No.17"
    ROUND_18 = "Round No.18"
    ROUND_19 = "Round No.19"
    ROUND_20 = "Round No.20"

# 社交平台枚举
class Platform(str, enum.Enum):
    TIKTOK = "TikTok"       # 抖音
    INSTAGRAM = "Instagram" # Instagram
    YOUTUBE = "YouTube"     # YouTube

# 数据来源枚举
class Source(str, enum.Enum):
    COLLABSTR = "Collabstr"
    MANUAL = "Manual"
    CREABLE = "Creable"
    HEEPSY = "Heepsy"

# KOL信息表
class KOL(Base):
    """KOL信息表，包含基本信息、指标数据和运营数据"""
    __tablename__ = "kols"

    # 基本信息
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    kol_id: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String, unique=True, index=True)
    name: Mapped[Optional[str]] = mapped_column(String, index=True)
    bio: Mapped[Optional[str]] = mapped_column(String)
    account_link: Mapped[Optional[str]] = mapped_column(String)
    platform: Mapped[Optional[Platform]] = mapped_column(Enum(Platform))
    source: Mapped[Optional[Source]] = mapped_column(Enum(Source))
    filter: Mapped[Optional[str]] = mapped_column(String)
    gender: Mapped[Optional[Gender]] = mapped_column(Enum(Gender))
    tag: Mapped[Optional[str]] = mapped_column(String)
    language: Mapped[Optional[str]] = mapped_column(String)
    location: Mapped[Optional[str]] = mapped_column(String)
    slug: Mapped[Optional[str]] = mapped_column(String, unique=True)
    creator_id: Mapped[Optional[str]] = mapped_column(String, unique=True)

    # 指标数据
    followers_k: Mapped[Optional[float]] = mapped_column(Float)
    likes_k: Mapped[Optional[float]] = mapped_column(Float)
    mean_views_k: Mapped[Optional[float]] = mapped_column(Float)
    median_views_k: Mapped[Optional[float]] = mapped_column(Float)
    engagement_rate: Mapped[Optional[float]] = mapped_column(Float)
    average_views_k: Mapped[Optional[float]] = mapped_column(Float)
    average_likes_k: Mapped[Optional[float]] = mapped_column(Float)
    average_comments_k: Mapped[Optional[float]] = mapped_column(Float)

    # 运营数据
    send_status: Mapped[Optional[SendStatus]] = mapped_column(Enum(SendStatus))
    send_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    export_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    level: Mapped[Optional[Level]] = mapped_column(Enum(Level))
    keywords_ai: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    most_used_hashtags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))

    # 时间信息
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), onupdate=lambda: datetime.now()) 