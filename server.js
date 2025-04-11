import express from 'express';
import cors from 'cors';
import config from './config.js';

// 验证 API Key
async function validateApiKey() {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "test" }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Key 验证失败:', response.status, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('API Key 验证错误:', error);
    return false;
  }
}

const app = express();

app.use(cors());
app.use(express.json());
// Add MIME type configuration for CSS files
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.post('/api/chat', async (req, res) => {
  try {
    // 构建符合 DeepSeek API 要求的请求体
    const requestBody = {
      model: "deepseek-chat",
      messages: req.body.messages || [{ role: "user", content: req.body.message }],
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API响应错误:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API请求失败: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('API调用错误:', error);
    res.status(500).json({ error: '服务器内部错误', details: error.message });
  }
});

app.listen(config.port, async () => {
  console.log(`服务器运行在端口 ${config.port}`);
  const isValidKey = await validateApiKey();
  if (isValidKey) {
    console.log('✅ API Key 验证成功');
  } else {
    console.log('❌ API Key 验证失败，请检查配置');
    process.exit(1);
  }
});