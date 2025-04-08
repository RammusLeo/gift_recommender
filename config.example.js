require('dotenv').config();

const config = {
    apiKey: process.env.DEEPSEEK_API_KEY,
    port: process.env.PORT || 8000
};

// 验证必要的环境变量
if (!config.apiKey) {
    console.error('错误：未设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
}

module.exports = config; 