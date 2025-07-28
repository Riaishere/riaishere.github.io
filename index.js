
const fs = require('fs');
const path = require('path');
const https = require('https');

// 统一的响应头，包含CORS，允许跨域访问
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 主处理函数 (最终修正版)
exports.handler = async (event, context) => {
  // 诊断日志：打印出收到的完整事件对象，以便我们能看到真实的数据结构
  console.log('--- 收到完整的原始事件 (event) ---');
  console.log(JSON.stringify(event, null, 2));
  console.log('--- 原始事件打印完毕 ---');

  // 正确地从事件的顶层获取路径和方法
  const requestPath = event.path || '/';
  const httpMethod = event.httpMethod || 'GET';

  console.log(`[正确解析] 收到请求: 方法=${httpMethod}, 路径=${requestPath}`);

  // 1. 处理浏览器的OPTIONS预检请求
  if (httpMethod.toUpperCase() === 'OPTIONS') {
    console.log("正在处理 OPTIONS 预检请求");
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  
  // 2. 处理聊天API的POST请求
  if (requestPath === '/chat' && httpMethod.toUpperCase() === 'POST') {
    console.log("匹配到聊天API路由，准备调用AI");
    return handleChatRequest(event);
  }
  
  // 3. 默认处理所有GET请求，返回主页
  if (httpMethod.toUpperCase() === 'GET') {
      console.log("匹配到主页GET路由");
      return handleStaticPageRequest();
  }

  // 4. 对于其他所有未知请求，返回404
  console.log("未匹配到任何路由，返回404");
  return {
      statusCode: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Not Found'
  };
};

// --- 子函数 ---

function handleStaticPageRequest() {
  // ... (这部分代码是正确的，无需修改)
  try {
    const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlContent,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
      body: '服务器内部错误：无法读取主页文件。',
    };
  }
}

function handleChatRequest(event) {
  return new Promise((resolve) => {
    // 正确地从event.body解析用户消息
    let userMessage;
    try {
        if (!event.body) throw new Error("Request body is empty.");
        const body = JSON.parse(event.body);
        userMessage = body.message;
        if (!userMessage) throw new Error("'message' field is missing.");
    } catch(e) {
        console.error("解析请求体失败:", e.message);
        return resolve({ statusCode: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: `无效的请求体: ${e.message}` }) });
    }
    
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
        return resolve({ statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY' }) });
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

    console.log(`正在向 DeepSeek API 发送消息...`);
    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const responseData = JSON.parse(responseBody);
                const aiMessage = responseData.choices[0].message.content;
                console.log(`从 DeepSeek API 收到回复。`);
                resolve({ statusCode: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ reply: aiMessage }) });
            } catch(e) {
                console.error("解析DeepSeek响应失败:", e);
                resolve({ statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: "解析AI响应时出错" }) });
            }
          } else {
            console.error('DeepSeek API 返回错误:', responseBody);
            resolve({ statusCode: res.statusCode, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: `AI服务返回错误: ${responseBody}` }) });
          }
        });
    });

    req.on('error', (e) => {
        console.error(`请求 DeepSeek API 时出错: ${e.message}`);
        resolve({ statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '调用AI服务时发生网络错误' }) });
    });

    req.write(postData);
    req.end();
  });
}
