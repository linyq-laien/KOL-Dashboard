from pydantic_settings import BaseSettings
import os
from pathlib import Path
from typing import Optional

def expand_env_vars(value: str) -> str:
    """展开环境变量"""
    return os.path.expandvars(value)

# 获取项目根目录
ROOT_DIR = Path(__file__).resolve().parents[3]
ENV_FILE = ROOT_DIR / ".env"

class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str
    ASYNC_DATABASE_URL: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    # 环境配置
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    BUILD_TARGET: str = "development"
    API_WORKERS: int = 1

    # PgAdmin配置
    PGADMIN_EMAIL: str = "admin@admin.com"
    PGADMIN_PASSWORD: str = "admin"

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = "utf-8"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.DATABASE_URL = expand_env_vars(self.DATABASE_URL)
        self.ASYNC_DATABASE_URL = expand_env_vars(self.ASYNC_DATABASE_URL)

settings = Settings()
