
const fs = require('fs');
const path = require('path');
const https = require('https');
const stream = require('stream');
const util = require('util');

// 统一的响应头，包含CORS，允许跨域访问
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 主处理函数 (无需修改)
exports.handler = async (event, context, callback) => {
  // --- 关键修复：解码并解析真实事件 ---
  const eventString = event.toString('utf-8');
  const parsedEvent = JSON.parse(eventString);

  // 从解析后的事件中，提取出真正的路径和方法
  const requestPath = parsedEvent.rawPath || parsedEvent.path || '/';
  const httpMethod = parsedEvent.requestContext.http.method;
  
  console.log(`[最终解析] 收到请求: 方法=${httpMethod}, 路径=${requestPath}`);

  // 1. 处理浏览器的OPTIONS预检请求
  if (httpMethod.toUpperCase() === 'OPTIONS') {
    console.log("正在处理 OPTIONS 预检请求");
    callback(null, { statusCode: 204, headers: CORS_HEADERS, body: '' });
    return;
  }
  
  // 2. 处理聊天API的POST请求
  if (requestPath === '/chat' && httpMethod.toUpperCase() === 'POST') {
    console.log("匹配到聊天API路由，准备调用AI (流式)");
    // 对于流式响应，我们需要使用 callback 并创建一个响应流
    const responseStream = stream.Writable({
        write(chunk, encoding, next) {
            callback(null, chunk);
            next();
        }
    });
    // 添加 pipeline 用于错误处理
    const pipeline = util.promisify(stream.pipeline);

    try {
        await handleChatStreamRequest(parsedEvent, responseStream);
    } catch (e) {
        console.error("流式处理管道出错:", e);
        responseStream.end(JSON.stringify({ error: "服务器流处理错误" }));
    }
    return; // 对于流式函数，在此处返回
  }
  
  // 3. 处理GET请求
  if (httpMethod.toUpperCase() === 'GET') {
      // 根路径返回主页
      if (requestPath === '/') {
        console.log("匹配到主页GET路由");
        callback(null, handleStaticPageRequest());
        return;
      }
      // 其他路径尝试作为静态资源（如图片）返回
      console.log(`尝试提供静态资源: ${requestPath}`);
      callback(null, handleStaticAssetRequest(requestPath));
      return;
  }

  // 4. 对于其他所有未知请求，返回404
  console.log(`未匹配到任何路由，返回404 for ${httpMethod} ${requestPath}`);
  callback(null, {
      statusCode: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Not Found'
  });
};

// --- 子函数 ---

/**
 * 处理静态主页HTML的请求
 */
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

/**
 * 处理静态资源（如图片）的请求
 * @param {string} requestPath - 请求的资源路径, e.g., /Ria.jpg?t=12345
 */
function handleStaticAssetRequest(requestPath) {
    // 关键修复：从请求路径中移除查询参数（例如 ?t=...），得到纯粹的文件路径
    const pathnameOnly = requestPath.split('?')[0];

    // 安全检查：防止路径遍历攻击
    const safeSuffix = path.normalize(pathnameOnly).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.join(__dirname, safeSuffix);

    if (!fs.existsSync(filePath)) {
        console.error(`静态资源未找到: ${filePath}`);
        return { statusCode: 404, headers: {'Content-Type': 'text/plain'}, body: 'Asset Not Found' };
    }

    try {
        const fileContent = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);
        console.log(`成功提供静态资源: ${filePath} a_s ${contentType}`);
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': contentType },
            body: fileContent.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error(`读取静态资源失败: ${error}`);
        return { statusCode: 500, headers: {'Content-Type': 'text/plain'}, body: 'Error reading asset' };
    }
}

/**
 * 根据文件扩展名获取MIME类型
 * @param {string} filePath 
 */
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.ico':
            return 'image/x-icon';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        default:
            return 'application/octet-stream';
    }
}


/**
 * 【新】处理对AI聊天API的流式请求
 * @param {object} parsedEvent - 已解析的真实事件对象
 * @param {stream.Writable} responseStream - 用于将数据流式返回给客户端的流
 */
async function handleChatStreamRequest(parsedEvent, responseStream) {
    // 写入响应头
    responseStream.write(`HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\n` +
                         `Access-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\nConnection: keep-alive\r\n\r\n`);
    
    let userMessage;
    try {
        if (!parsedEvent.body) throw new Error("Request body is empty.");
        const body = JSON.parse(parsedEvent.body);
        userMessage = body.message;
        if (!userMessage) throw new Error("'message' field is missing.");
    } catch (e) {
        responseStream.write(`data: ${JSON.stringify({error: e.message})}\n\n`);
        responseStream.end();
        return;
    }

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
        responseStream.write(`data: ${JSON.stringify({error: '服务器未配置 DEEPSEEK_API_KEY'})}\n\n`);
        responseStream.end();
        return;
    }

    const postData = JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { content: '你是一个AI助手，你的名字叫“石耳AI”，由陈科瑾创造。请用友好、简洁、乐于助人的语气回答问题。', role: 'system' },
          { content: userMessage, role: 'user' },
        ],
        stream: true, // <-- 关键：开启流式响应
    });

    const options = {
        hostname: 'api.deepseek.com',
        path: '/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
    };

    const req = https.request(options, (res) => {
        res.on('data', (chunk) => {
            // DeepSeek的流式响应是 Server-Sent Events (SSE) 格式
            // 它可能是多个 "data: {...}" 块
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonData = line.substring(6);
                    if (jsonData.trim() === '[DONE]') {
                        // 流结束的标志
                        responseStream.end();
                        return;
                    }
                    try {
                        const parsedChunk = JSON.parse(jsonData);
                        const content = parsedChunk.choices[0].delta.content;
                        if (content) {
                            // 将收到的AI内容块直接转发给前端
                            responseStream.write(`data: ${JSON.stringify({ reply_chunk: content })}\n\n`);
                        }
                    } catch(e) {
                        console.error("解析DeepSeek流式块失败:", jsonData);
                    }
                }
            }
        });
        res.on('end', () => {
            responseStream.end();
        });
    });

    req.on('error', (e) => {
        responseStream.write(`data: ${JSON.stringify({error: `调用AI服务时发生网络错误: ${e.message}`})}\n\n`);
        responseStream.end();
    });

    req.write(postData);
    req.end();
}
