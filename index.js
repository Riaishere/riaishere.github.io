
const fs = require('fs');
const path = require('path');
const https = require('https');

// 统一的响应头，包含CORS，允许跨域访问
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 主处理函数 (最终版，已修复)
exports.handler = async (event, context) => {
  // --- 关键修复：解码并解析真实事件 ---
  // FC通过自定义域名触发时，会将原始请求信息编码成一个JSON字符串，并作为Buffer传递。
  const eventString = event.toString('utf-8');
  const parsedEvent = JSON.parse(eventString);

  // 从解析后的事件中，提取出真正的路径和方法
  const requestPath = parsedEvent.rawPath || parsedEvent.path;
  const httpMethod = parsedEvent.requestContext.http.method;
  
  // 使用新的诊断日志，确认我们拿到了正确的值
  console.log(`[最终解析] 收到请求: 方法=${httpMethod}, 路径=${requestPath}`);

  // 1. 处理浏览器的OPTIONS预检请求
  if (httpMethod.toUpperCase() === 'OPTIONS') {
    console.log("正在处理 OPTIONS 预检请求");
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  
  // 2. 处理聊天API的POST请求
  if (requestPath === '/chat' && httpMethod.toUpperCase() === 'POST') {
    console.log("匹配到聊天API路由，准备调用AI");
    // 将解析后的真实事件传递给处理函数
    return handleChatRequest(parsedEvent);
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

function handleChatRequest(parsedEvent) { // 注意：现在接收的是解析后的事件
  return new Promise((resolve) => {
    // 从解析后的事件体中获取用户消息
    let userMessage;
    try {
        if (!parsedEvent.body) throw new Error("Request body is empty.");
        // parsedEvent.body 本身就是个JSON字符串，需要再次解析
        const body = JSON.parse(parsedEvent.body);
        userMessage = body.message;
        if (!userMessage) throw new Error("'message' field is missing.");
    } catch(e) {
        console.error("解析请求体失败:", e.message);
        console.error("原始请求体:", parsedEvent.body);
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
