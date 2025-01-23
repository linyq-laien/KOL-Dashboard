#!/bin/sh

# 生成环境变量配置
cat << EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  API_URL: "${API_URL}"
};
EOF

exec "$@" 