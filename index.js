
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();

// 日志中间件：打印每个进入Express的请求
app.use((req, res, next) => {
  console.log(`[Express Router] 收到请求: 方法=${req.method}, 路径=${req.path}, 原始URL=${req.originalUrl}`);
  next(); // 将请求传递给下一个中间件或路由处理器
});

// 中间件，用于解析请求体中的JSON数据
app.use(express.json());

// --- 路由定义 ---

// 1. 主页路由
app.get('/', (req, res) => {
  console.log("收到主页请求，正在返回 index.html");
  const filePath = path.resolve(__dirname, 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("读取 index.html 失败:", err);
      res.status(500).send("无法加载主页");
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(data);
    }
  });
});

// 2. AI聊天API路由
app.post('/chat', (req, res) => {
  console.log("收到 /chat 的POST请求");
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'message 字段不能为空' });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: '服务器未配置 DEEPSEEK_API_KEY' });
  }

  const postData = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { content: '你是一个AI助手，你的名字叫“石耳AI”，由陈科瑾创造。请用友好、简洁、乐于助人的语气回答问题。', role: 'system' },
      { content: userMessage, role: 'user' },
    ],
    stream: false,
  });

  const options = {
    hostname: 'api.deepseek.com',
    path: '/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let responseBody = '';
    apiRes.on('data', (chunk) => { responseBody += chunk; });
    apiRes.on('end', () => {
      if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
        try {
          const responseData = JSON.parse(responseBody);
          const aiMessage = responseData.choices[0].message.content;
          console.log("从DeepSeek获取回复成功");
          res.status(200).json({ reply: aiMessage });
        } catch (e) {
          console.error("解析DeepSeek响应失败:", e);
          res.status(500).json({ error: "解析AI响应时出错" });
        }
      } else {
        console.error("DeepSeek API返回错误:", responseBody);
        res.status(apiRes.statusCode).json({ error: `AI服务返回错误: ${responseBody}` });
      }
    });
  });

  apiReq.on('error', (e) => {
    console.error(`请求DeepSeek API时出错: ${e.message}`);
    res.status(500).json({ error: '调用AI服务时发生网络错误' });
  });

  apiReq.write(postData);
  apiReq.end();
});

// --- 导出模块 ---

// 使用 serverless-http 包装 express app，使其与函数计算兼容
module.exports.handler = serverless(app);
