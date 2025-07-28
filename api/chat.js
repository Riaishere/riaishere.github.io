const axios = require('axios');

// 从环境变量中获取API密钥
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

exports.handler = async (event, context) => {
  // 设置CORS响应头，允许任何来源的访问
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  // 应对浏览器在发送POST请求前的OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS' || (event.requestContext && event.requestContext.method === 'OPTIONS')) {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    // 解析前端发送过来的请求体
    const body = JSON.parse(event.body || '{}');
    const userMessage = body.message;

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'message 字段不能为空' }),
      };
    }
    
    if (!DEEPSEEK_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY' }),
      };
    }

    console.log(`正在向 DeepSeek API 发送消息: ${userMessage}`);

    // 调用 DeepSeek API
    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            content: '你是一个AI助手，你的名字叫“石耳AI”，由陈科瑾创造。请用友好、简洁、乐于助人的语气回答问题。',
            role: 'system',
          },
          { content: userMessage, role: 'user' },
        ],
        stream: false, // 我们暂时用非流式，更简单
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

    // 将模型的回答返回给前端
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: aiMessage }),
    };

  } catch (error) {
    console.error('调用 DeepSeek API 时出错:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '调用AI服务时发生内部错误' }),
    };
  }
}; 