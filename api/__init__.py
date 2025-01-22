# This file marks the directory as a Python package

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .dependencies import get_db
from .routers import kol

app = FastAPI(
    title="KOL Dashboard API",
    description="KOL Dashboard backend API service",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(kol.router)

@app.get("/")
async def root():
    return {"message": "Welcome to KOL Dashboard API"}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """健康检查端点"""
    return {"status": "healthy"} 