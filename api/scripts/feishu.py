import requests
import json
from typing import Dict, List, Optional, Any
from datetime import datetime, UTC
from models import KOL, Gender, Level, SendStatus, Platform, Source
from database import SessionLocal
from sqlalchemy.exc import IntegrityError

def convert_feishu_record(record: Dict) -> KOL:
    """
    将飞书记录转换为数据库模型
    """
    fields = record["fields"]
    
    # 处理文本字段中的第一个值
    def get_text(field_name: str) -> Optional[str]:
        field = fields.get(field_name, [])
        if isinstance(field, list) and len(field) > 0:
            return field[0].get("text")
        return None
    
    # 处理链接字段
    def get_link(field_name: str) -> Optional[str]:
        field = fields.get(field_name, {})
        return field.get("text") if isinstance(field, dict) else None

    # 处理数组字段
    def get_array(field_name: str) -> Optional[List[str]]:
        field = fields.get(field_name, [])
        if isinstance(field, list) and len(field) > 0:
            text = field[0].get("text", "")
            return [item.strip() for item in text.split(",")]
        return None

    # 处理发送状态的映射
    def map_send_status(status: str) -> Optional[SendStatus]:
        status_map = {
            "第一轮": SendStatus.ROUND_1,
            "第二轮": SendStatus.ROUND_2,
            "第三轮": SendStatus.ROUND_3,
            "第四轮": SendStatus.ROUND_4,
            "第五轮": SendStatus.ROUND_5,
            "第六轮": SendStatus.ROUND_6,
            "第七轮": SendStatus.ROUND_7,
            "第八轮": SendStatus.ROUND_8,
            "第九轮": SendStatus.ROUND_9,
            "第十轮": SendStatus.ROUND_10,
            "第十一轮": SendStatus.ROUND_11,
            "第十二轮": SendStatus.ROUND_12,
            "第十三轮": SendStatus.ROUND_13,
            "第十四轮": SendStatus.ROUND_14,
            "第十五轮": SendStatus.ROUND_15,
            "第十六轮": SendStatus.ROUND_16,
            "Round No.17": SendStatus.ROUND_17,
            "Round No.18": SendStatus.ROUND_18,
            "Round No.19": SendStatus.ROUND_19,
            "Round No.20": SendStatus.ROUND_20,
        }
        return status_map.get(status)

    # 处理等级的映射
    def map_level(level: str) -> Optional[Level]:
        level_map = {
            "Mid 50~500k": Level.MID,
            "Micro 10~50k": Level.MICRO,
            "Nano 1~10k": Level.NANO
        }
        return level_map.get(level)

    try:
        # 创建KOL实例
        kol = KOL(
            kol_id=get_text("KOL ID"),
            email=get_text("Email"),
            name=get_text("KOL Name"),
            bio=get_text("Bio"),
            account_link=get_link("Account link"),
            platform=Platform.INSTAGRAM,  # 根据链接判断是 TikTok
            source=Source(fields.get("Source")) if fields.get("Source") else None,
            filter=get_text("Filter"),
            gender=Gender[fields.get("Gender")] if fields.get("Gender") else None,
            language=get_text("Language"),
            location=get_text("Location"),
            creator_id=get_text("Creator ID"),
            
            # 数值字段
            followers_k=fields.get("Followers(K)"),
            likes_k=fields.get("Likes(K)"),
            mean_views_k=fields.get("Mean Views(K)"),
            median_views_k=fields.get("Median Views(K)"),
            engagement_rate=fields.get("Engagement Rate(%)"),
            average_views_k=fields.get("Average Views(K)"),
            average_likes_k=fields.get("Average Likes(K)"),
            average_comments_k=fields.get("Average Comments(K)"),
            
            # 状态和分类
            send_status=map_send_status(fields.get("Send Status")),
            export_date=datetime.fromtimestamp(fields.get("Export Date", 0)/1000, UTC) if fields.get("Export Date") else None,
            level=map_level(fields.get("Level")),
            
            # 数组字段
            keywords_ai=get_array("Keywords-AI"),
            most_used_hashtags=get_array("Most used hashtags")
        )
        
        return kol
    except Exception as e:
        print(f"Error converting record with fields: {json.dumps(fields, ensure_ascii=False)}")
        raise e

def save_kols_to_db(kols: List[KOL]) -> tuple[int, int]:
    """
    将KOL记录保存到数据库
    
    Args:
        kols: KOL记录列表
        
    Returns:
        tuple[int, int]: (成功保存的记录数, 失败的记录数)
    """
    success_count = 0
    error_count = 0
    
    # 创建数据库会话
    db = SessionLocal()
    try:
        for kol in kols:
            try:
                # 检查记录是否已存在
                existing_kol = db.query(KOL).filter(KOL.kol_id == kol.kol_id).first()
                if existing_kol:
                    # 更新现有记录
                    for key, value in kol.__dict__.items():
                        if not key.startswith('_'):  # 跳过SQLAlchemy内部属性
                            setattr(existing_kol, key, value)
                else:
                    # 添加新记录
                    db.add(kol)
                
                db.commit()
                success_count += 1
                print(f"Successfully saved KOL: {kol.kol_id}")
                
            except IntegrityError as e:
                db.rollback()
                error_count += 1
                print(f"Error saving KOL {kol.kol_id}: {str(e)}")
                
            except Exception as e:
                db.rollback()
                error_count += 1
                print(f"Unexpected error saving KOL {kol.kol_id}: {str(e)}")
    
    finally:
        db.close()
    
    return success_count, error_count

def search_bitable_records(
    app_id: str,
    table_id: str,
    page_size: int = 10,
    access_token: str = None,
    max_records: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    搜索飞书多维表格记录，支持分页获取所有结果
    
    Args:
        app_id: 多维表格的应用 ID
        table_id: 表格 ID
        page_size: 每页记录数，默认 10
        access_token: 访问令牌，如果不提供则需要在环境变量中设置
        max_records: 最大获取记录数，默认为 None 表示获取所有记录
        
    Returns:
        所有记录的列表
    """
    base_url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_id}/tables/{table_id}/records/search"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    all_records = []
    page_token = None
    
    while True:
        # 如果达到最大记录数限制，则停止获取
        if max_records and len(all_records) >= max_records:
            all_records = all_records[:max_records]  # 确保exactly返回max_records条
            break
            
        # 构建查询参数
        params = {"page_size": page_size}
        if page_token:
            params["page_token"] = page_token
            
        # 发送请求
        response = requests.post(base_url, headers=headers, params=params, json={})
        response.raise_for_status()  # 如果请求失败则抛出异常
        
        data = response.json()
        
        # 获取记录
        if "data" in data and "items" in data["data"]:
            records = data["data"]["items"]
            all_records.extend(records)
            print(f"已获取记录数: {len(all_records)}")
            
            # 检查是否有更多数据
            page_token = data["data"].get("page_token")
            if not page_token:
                break
        else:
            break
    
    return all_records


if __name__ == "__main__":
    # 获取飞书数据
    records = search_bitable_records(
        app_id="JLNXbjpRLaXZcdsigkIcqddSnIh", 
        table_id="tblXSAtZm1wSUyyK",
        page_size=500,  # 每页获取10条
        max_records=None,  # 最多获取50条记录
        access_token="t-g1041lezD5NE7JDFR74MAZPE6MVLB6RHTLMF4XOX",
    )
    
    print(f"\n开始转换数据...")
    # 转换数据
    kols = []
    for record in records:
        try:
            kol = convert_feishu_record(record)
            kols.append(kol)
        except Exception as e:
            print(f"Error converting record: {e}")
    
    print(f"\n开始保存到数据库...")
    # 保存到数据库
    if kols:
        success_count, error_count = save_kols_to_db(kols)
        print(f"\n处理结果统计:")
        print(f"获取记录数: {len(records)}")
        print(f"成功保存: {success_count} 条")
        print(f"保存失败: {error_count} 条")
