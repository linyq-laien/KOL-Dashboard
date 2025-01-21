from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import kol

app = FastAPI(
    title="KOL Dashboard API",
    description="KOL Dashboard 后端API服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置为具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(kol.router)

@app.get("/")
async def root():
    return {"message": "Welcome to KOL Dashboard API"} 