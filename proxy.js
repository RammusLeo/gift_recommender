const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 8080;

// 启用 CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static('./'));

// 代理请求处理
app.post('/proxy', async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;
    const response = await axios({
      method,
      url,
      headers,
      data: body
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://127.0.0.1:${port}`);
}); 