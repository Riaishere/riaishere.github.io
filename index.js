
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从环境变量中获取API密钥
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions';

// 主处理函数，现在是唯一的入口
exports.handler = async (event, context) => {
  // 从函数计算的事件对象中解析出请求路径和方法
  const requestPath = event.path || '/';
  const httpMethod = event.httpMethod || (event.requestContext && event.requestContext.method) || 'GET';

  console.log(`收到请求: [${httpMethod}] ${requestPath}`);

  // 路由逻辑：根据路径决定执行哪个功能
  if (requestPath.startsWith('/chat')) {
    // 如果路径是 /chat，则执行AI聊天逻辑
    return await handleChatRequest(event);
  } else {
    // 否则，默认返回主页HTML
    return handleStaticPageRequest();
  }
};

// 处理静态主页的函数
function handleStaticPageRequest() {
  try {
    const filePath = path.resolve(__dirname, 'index.html');
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    console.log("正在返回主页 HTML");
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlContent,
      isBase64Encoded: false,
    };
  } catch (error) {
    console.error('读取 index.html 时出错:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: '服务器内部错误：无法读取主页文件。',
      isBase64Encoded: false,
    };
  }
}

// 处理AI聊天请求的函数 (从api/chat.js移植而来)
async function handleChatRequest(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  const httpMethod = event.httpMethod || (event.requestContext && event.requestContext.method) || 'GET';

  if (httpMethod === 'OPTIONS') {
    console.log("正在处理 OPTIONS 预检请求");
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userMessage = body.message;

    if (!userMessage) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'message 字段不能为空' }) };
    }
    if (!DEEPSEEK_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY' }) };
    }

    console.log(`正在向 DeepSeek API 发送消息: ${userMessage}`);
    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { content: '你是一个AI助手，你的名字叫“石耳AI”，由陈科瑾创造。请用友好、简洁、乐于助人的语气回答问题。', role: 'system' },
          { content: userMessage, role: 'user' },
        ],
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
      }
    );
    
    const aiMessage = response.data.choices[0].message.content;
    console.log(`从 DeepSeek API 收到回复: ${aiMessage}`);
    return { statusCode: 200, headers, body: JSON.stringify({ reply: aiMessage }) };

  } catch (error) {
    console.error('调用 DeepSeek API 时出错:', error.response ? error.response.data : error.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: '调用AI服务时发生内部错误' }) };
  }
}
