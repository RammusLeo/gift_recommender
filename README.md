# 智能赠礼助手

一个基于 DeepSeek API 的智能礼物推荐系统，帮助用户根据预算和需求找到最合适的礼物。

## 功能特点

- 🎁 智能礼物推荐：根据用户预算和需求推荐合适的礼物
- 💰 预算管理：支持0.01-10000元的预算范围
- 🔄 实时推荐：可以随时刷新获取新的礼物推荐
- 💳 支付系统：模拟完整的支付流程
- 📱 响应式设计：适配各种设备屏幕
- 🎨 优雅的UI：简洁现代的用户界面

## 技术栈

- 前端：HTML5, CSS3, JavaScript, p5.js
- 后端：Node.js, Express
- API：DeepSeek API

## 使用方法

1. 克隆项目到本地：
```bash
git clone https://github.com/RammusLeo/gift_recommender.git
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
创建 `.env` 文件并添加您的 DeepSeek API 密钥：
```
DEEPSEEK_API_KEY=您的API密钥
```

4. 启动服务器：
```bash
node server.js
```

5. 在浏览器中访问：
```
http://localhost:8000/
```

## 使用流程

1. 输入预算和礼物需求
2. 获取智能礼物推荐
3. 选择心仪的礼物
4. 填写收货信息
5. 选择支付方式
6. 完成支付

## 注意事项

- 请确保您有有效的 DeepSeek API 密钥
- 建议使用现代浏览器访问
- 支付功能为模拟实现，不涉及真实支付

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License 