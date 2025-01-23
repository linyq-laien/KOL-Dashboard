// 声明全局环境变量类型
declare global {
    interface Window {
        _env_: {
            API_URL: string;
        };
    }
}

// API配置
export const API_URL = window._env_?.API_URL || '/api';

// 其他配置
export const CONFIG = {
    apiUrl: API_URL,
}; 