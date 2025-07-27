
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

// 终极修复版本 - 解决下载问题
exports.handler = async (event, context) => {
    console.log('函数被调用');
    
    try {
        // 正确处理Buffer格式的事件数据
        let requestData = event;
        
        // 如果事件是Buffer格式，需要先解析
        if (event && event.type === 'Buffer' && Array.isArray(event.data)) {
            console.log('检测到Buffer格式事件，开始解析...');
            const buffer = Buffer.from(event.data);
            const jsonString = buffer.toString('utf8');
            requestData = JSON.parse(jsonString);
            console.log('Buffer解析成功');
        }
        
        // 获取请求信息
        const method = requestData.requestContext?.http?.method || 'GET';
        const path = requestData.requestContext?.http?.path || requestData.rawPath || '/';
        
        console.log('请求方法:', method);
        console.log('请求路径:', path);

        // 简单的HTML内容
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陈科瑾 - AI应用开发工程师</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        h2 {
            font-size: 1.5em;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        p {
            font-size: 1.1em;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .section {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .success {
            background: rgba(0, 255, 0, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
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
        
        <div class="section">
            <h3>🚀 技术栈</h3>
            <p>Python • Go • Docker • Kubernetes</p>
            <p>TensorFlow • PyTorch • 机器学习</p>
        </div>
        
        <div class="section">
            <h3>📧 联系方式</h3>
            <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
            <p><strong>GitHub:</strong> github.com/riaishere</p>
            <p><strong>网站:</strong> riaishere.github.io</p>
        </div>
        
        <div class="success">
            ✅ 网站已成功修复并正常运行！
        </div>
        
        <p style="margin-top: 20px; opacity: 0.7; font-size: 0.9em;">
            时间: ${new Date().toLocaleString('zh-CN')}
        </p>
    </div>
    
    <script>
        console.log('陈科瑾的个人网站加载成功！');
        console.log('当前时间:', new Date().toLocaleString());
    </script>
</body>
</html>`;

        console.log('HTML内容长度:', htmlContent.length);
        
        // 使用最简单的响应格式
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: htmlContent
        };
        
        console.log('返回响应，Content-Type:', response.headers['Content-Type']);
        return response;

    } catch (error) {
        console.error('函数执行错误:', error);
        
        // 错误情况下也返回HTML格式
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: `<!DOCTYPE html>
<html>
<head><title>错误</title></head>
<body>
    <h1>服务器错误</h1>
    <p>错误信息: ${error.message}</p>
    <p>请稍后重试</p>
</body>
</html>`
        };
    }
};
