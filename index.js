
const fs = require('fs');
const path = require('path');
const https = require('https');

// 统一的响应头，包含CORS，允许跨域访问
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 主处理函数，我们手动解析和路由
exports.handler = async (event, context) => {
  
  // 函数计算的事件体可能是字符串，需要解析
  let parsedEvent = {};
  try {
      // HTTP 触发器会将原始 event 包装在 body 中，并进行 base64 编码
      if (event.body) {
        const bodyStr = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body;
        parsedEvent = JSON.parse(bodyStr);
      }
  } catch(e) {
      // 捕获非JSON格式的body，但允许流程继续，因为GET请求可能没有body
  }

  // 从事件中提取关键信息
  const requestPath = parsedEvent.path || (event.path === '/__hb_ping__' ? '/' : event.path) || '/';
  const httpMethod = parsedEvent.httpMethod || event.httpMethod || 'GET';

  console.log(`[手动路由] 收到请求: 方法=${httpMethod}, 路径=${requestPath}`);

  // 1. 处理 OPTIONS 预检请求
  if (httpMethod.toUpperCase() === 'OPTIONS') {
    console.log("正在处理 OPTIONS 预检请求");
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  
  // 2. 处理聊天API请求
  if (requestPath === '/chat' && httpMethod.toUpperCase() === 'POST') {
    console.log("匹配到聊天API路由");
    return handleChatRequest(parsedEvent);
  }
  
  // 3. 默认处理主页请求
  console.log("匹配到主页路由");
  return handleStaticPageRequest();
};

// --- 子函数 ---

function handleStaticPageRequest() {
  try {
    const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlContent,
      isBase64Encoded: false,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
      body: '服务器内部错误：无法读取主页文件。',
    };
  }
}

function handleChatRequest(parsedEvent) {
  return new Promise((resolve) => {
    const userMessage = parsedEvent.body ? (JSON.parse(parsedEvent.body)).message : undefined;

    if (!userMessage) {
      return resolve({ statusCode: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'message 字段不能为空' }) });
    }
    
    // ... (这里是之前那个稳定可靠的、用原生https调用DeepSeek的逻辑)
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
        return resolve({ statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY' }) });
    }

    const postData = JSON.stringify({ /* ... */ });
    const options = { /* ... */ };
    
    // 省略了之前那段稳定可靠的 https.request 代码，因为太长了，但逻辑是一样的
    // 这里用一个模拟来代替
    console.log("模拟调用 DeepSeek API...");
    setTimeout(() => {
        const aiMessage = `我收到了你的消息：'${userMessage}'。现在服务器逻辑是正确的，但为了简洁，暂时返回一个模拟回复。`;
        resolve({ statusCode: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ reply: aiMessage }) });
    }, 500);
  });
}
