
// 文件名: index.js (采用传统FC格式)
const fs = require('fs');
const path = require('path');

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

// ！！！主处理函数 (传统FC格式 + 调试日志)！！！
module.exports.handler = async function(request, response, context) {
    // 调试日志：打印收到的请求路径
    console.log(`Request received for path: ${request.path} with method: ${request.method}`);

    // 设置CORS头部
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理浏览器预检请求
    if (request.method.toUpperCase() === 'OPTIONS') {
        console.log('Responding to OPTIONS preflight request.');
        response.setStatusCode(204);
        response.send('');
        return;
    }

    // "路由器"逻辑：判断请求路径
    if (request.path === '/api/chat') {
        console.log('Entering /api/chat logic...');
        
        if (request.method.toUpperCase() !== 'POST') {
            response.setStatusCode(405);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
        }
        
        try {
            const body = JSON.parse(request.body.toString());
            const userMessage = body.message;
            
            if (!userMessage || userMessage.trim() === '') {
                response.setStatusCode(400);
                response.setHeader('content-type', 'application/json');
                response.send(JSON.stringify({ error: 'Message is required' }));
                return;
            }
            
            const reply = getTestResponse(userMessage);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify({ 
                success: true, 
                reply: reply,
                timestamp: new Date().toISOString()
            }));
            console.log('Successfully sent chat API response.');
        } catch (error) {
            console.error('API处理失败:', error);
            response.setStatusCode(500);
            response.setHeader('content-type', 'application/json');
            response.send(JSON.stringify({ error: 'Internal Server Error' }));
        }
        return;
    }
    
    // 其他所有请求，都返回主页 HTML
    try {
        console.log('Attempting to serve index.html...');
        
        // 内嵌HTML内容（避免文件读取问题）
        const htmlContent = `<!DOCTYPE html>
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
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 50px 40px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        h2 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        p {
            font-size: 1.1rem;
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
        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            text-align: center;
            backdrop-filter: blur(10px);
        }
        .nav a {
            color: white;
            text-decoration: none;
            margin: 0 1rem;
            font-weight: bold;
        }
        .content {
            padding-top: 80px;
        }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="#home">首页</a>
        <a href="#about">关于我</a>
        <a href="#contact">联系</a>
    </nav>
    
    <div class="content">
        <div class="container">
            <h1>🌟 石耳在这里 🌟</h1>
            <h2>我是陈科瑾</h2>
            <p>AI应用开发工程师</p>
            <p>专注于构建可扩展、高性能的AI驱动应用程序</p>
            
            <div class="section">
                <h3>🚀 技术栈</h3>
                <p><strong>编程语言:</strong> Python • Go</p>
                <p><strong>容器化:</strong> Docker • Kubernetes</p>
                <p><strong>AI框架:</strong> TensorFlow • PyTorch</p>
                <p><strong>专业领域:</strong> 机器学习 • 深度学习 • AI应用架构</p>
            </div>
            
            <div class="section">
                <h3>📧 联系方式</h3>
                <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
                <p><strong>GitHub:</strong> github.com/riaishere</p>
                <p><strong>个人网站:</strong> riaishere.github.io</p>
            </div>
            
            <div class="success">
                ✅ 网站运行正常 - 使用传统FC格式修复！
            </div>
            
            <p style="margin-top: 20px; opacity: 0.7; font-size: 0.9em;">
                部署时间: ${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}
            </p>
        </div>
    </div>
    
    <script>
        console.log('陈科瑾的个人网站加载成功！');
        console.log('部署时间:', new Date().toLocaleString());
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
        
        // 关键步骤：正确设置头部并发送内容
        response.setHeader('content-type', 'text/html; charset=utf-8');
        response.setStatusCode(200);
        response.send(htmlContent);
        console.log('Successfully sent index.html using traditional FC format.');

    } catch (error) {
        console.error('处理HTML请求失败:', error);
        response.setStatusCode(500);
        response.setHeader('content-type', 'text/plain');
        response.send('Homepage error: ' + error.message);
    }
};
