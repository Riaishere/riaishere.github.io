
// 文件名: index.js (为陈科瑾定制的修复版本)

// 测试模式回复函数
function getTestResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
        return '你好！我是陈科瑾的AI助手。我可以回答关于他的技能、项目经验和职业背景等问题。';
    }
    
    if (message.includes('工作') || message.includes('职业') || message.includes('经历')) {
        return '陈科瑾是一位AI应用开发工程师，专注于构建可扩展、高性能的AI驱动应用程序。';
    }
    
    if (message.includes('技能') || message.includes('能力') || message.includes('技术')) {
        return '陈科瑾的核心技术栈包括：Python、Go、Docker、Kubernetes，以及主流的深度学习框架如TensorFlow和PyTorch。';
    }
    
    if (message.includes('项目') || message.includes('作品') || message.includes('经验')) {
        return '陈科瑾参与开发了多个AI项目，包括智能聊天机器人、个性化推荐系统和AI模型服务平台。';
    }
    
    if (message.includes('联系') || message.includes('邮箱') || message.includes('contact')) {
        return '可以通过邮箱 chekj@epsoft.com.cn 联系陈科瑾，或者访问他的个人网站了解更多信息。';
    }
    
    return `感谢你的提问。陈科瑾是一位AI应用开发工程师，你可以问我关于他的技术背景、项目经验等问题。`;
}

// 主处理函数 - 阿里云FC标准格式
// 修复版本 - 解决下载问题
exports.handler = async (event, context) => {
    console.log('函数被调用');
    
    try {
        // 处理Buffer格式的事件数据
        let eventData = event;
        if (event.type === 'Buffer' && event.data) {
            const buffer = Buffer.from(event.data);
            eventData = JSON.parse(buffer.toString());
        }
        
        console.log('解析后的事件数据:', JSON.stringify(eventData, null, 2));
        
        // 获取请求信息
        const method = eventData.requestContext?.http?.method || 'GET';
        const path = eventData.requestContext?.http?.path || eventData.rawPath || '/';
        
        console.log('请求方法:', method);
        console.log('请求路径:', path);

        // HTML内容
        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陈科瑾 - AI应用开发工程师</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 50px 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        h1 { font-size: 3rem; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); }
        h2 { font-size: 1.5rem; margin-bottom: 15px; opacity: 0.9; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 15px; }
        .tech-stack {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .contact {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .status {
            margin-top: 30px;
            padding: 10px;
            background: rgba(0, 255, 0, 0.2);
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 石耳在这里 🌟</h1>
        <h2>我是陈科瑾</h2>
        <p>AI应用开发工程师</p>
        <p>专注于构建可扩展、高性能的AI驱动应用程序</p>
        
        <div class="tech-stack">
            <h3>🚀 技术栈</h3>
            <p>Python | Go | Docker | Kubernetes</p>
            <p>TensorFlow | PyTorch | 机器学习 | 深度学习</p>
        </div>
        
        <div class="contact">
            <h3>📧 联系方式</h3>
            <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
            <p><strong>GitHub:</strong> github.com/riaishere</p>
            <p><strong>网站:</strong> riaishere.github.io</p>
        </div>
        
        <div class="status">
            ✅ 网站运行正常 - 问题已修复！
        </div>
    </div>
    
    <script>
        console.log('陈科瑾的网站加载成功！');
        document.title = '陈科瑾 - AI应用开发工程师';
    </script>
</body>
</html>`;

        console.log('准备返回HTML响应');
        
        // 返回正确格式的响应
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            body: html,
            isBase64Encoded: false
        };
        
        console.log('响应格式:', JSON.stringify({
            statusCode: response.statusCode,
            headers: response.headers,
            bodyLength: response.body.length
        }));
        
        return response;

    } catch (error) {
        console.error('函数执行错误:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            },
            body: '服务器错误: ' + error.message,
            isBase64Encoded: false
        };
    }
};
