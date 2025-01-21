import logging
from typing import NoReturn
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.exc import SQLAlchemyError
from database import engine, DATABASE_URL
from models import Base

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def init_db() -> NoReturn:
    """
    初始化数据库
    - 检查数据库是否存在，不存在则创建
    - 创建所有定义的表
    """
    try:
        # 检查数据库是否存在
        if not database_exists(DATABASE_URL):
            create_database(DATABASE_URL)
            logger.info("数据库创建成功: %s", DATABASE_URL.database)
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        logger.info("数据库表创建成功")
        
    except SQLAlchemyError as e:
        logger.error("数据库初始化失败: %s", str(e))
        raise
    except Exception as e:
        logger.error("未知错误: %s", str(e))
        raise

def main() -> NoReturn:
    """主函数"""
    logger.info("开始初始化数据库...")
    init_db()
    logger.info("数据库初始化完成")

if __name__ == "__main__":
    main() 