from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import kol

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
app.include_router(kol.router, prefix="/kols", tags=["KOLs"])

@app.get("/")
async def root():
    return {"message": "Welcome to KOL Dashboard API"}

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy"}
