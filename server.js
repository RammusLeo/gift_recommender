import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8000;

// 配置 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 请求体
app.use(express.json());

// 静态文件服务
app.use(express.static(__dirname));

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-48606ee404c24aabae7c65175198e763'
});

// 代理 API 请求
app.post('/api/chat', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: req.body.messages,
      temperature: req.body.temperature || 0.7,
      max_tokens: req.body.max_tokens || 1000,
      stream: false
    });
    
    res.json(completion);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 