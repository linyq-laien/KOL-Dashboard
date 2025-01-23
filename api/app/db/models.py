from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ARRAY
from sqlalchemy.sql import func

from app.db.base import Base

import enum

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

class KOL(Base):
    """KOL Model"""
    __tablename__ = "kols"

    id = Column(Integer, primary_key=True, index=True)
    kol_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    bio = Column(String)
    account_link = Column(String)  # 存储为字符串
    platform = Column(Enum(Platform))
    source = Column(Enum(Source))
    filter = Column(String)
    gender = Column(Enum(Gender))
    tag = Column(String)
    language = Column(String)
    location = Column(String)
    slug = Column(String, unique=True)
    creator_id = Column(String, unique=True)
    followers_k = Column(Float)
    likes_k = Column(Float)
    mean_views_k = Column(Float)
    median_views_k = Column(Float)
    engagement_rate = Column(Float)
    average_views_k = Column(Float)
    average_likes_k = Column(Float)
    average_comments_k = Column(Float)
    send_status = Column(Enum(SendStatus))
    send_date = Column(DateTime(timezone=True))
    export_date = Column(DateTime(timezone=True))
    level = Column(Enum(Level))
    keywords_ai = Column(ARRAY(String))
    most_used_hashtags = Column(ARRAY(String))

    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
