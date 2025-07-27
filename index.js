
// 文件名: index.js (为陈科瑾定制的稳定版本)

// 测试模式回复函数
function getTestResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
        return '你好！我是陈科瑾的AI助手。我可以回答关于他的技能、项目经验和职业背景等问题。陈科瑾是一位专注于AI应用开发的工程师。';
    }
    
    if (message.includes('工作') || message.includes('职业') || message.includes('经历')) {
        return '陈科瑾是一位AI应用开发工程师，专注于构建可扩展、高性能的AI驱动应用程序。他在AI应用后端架构设计和算法优化方面有丰富经验。';
    }
    
    if (message.includes('技能') || message.includes('能力') || message.includes('技术')) {
        return '陈科瑾的核心技术栈包括：Python、Go、Docker、Kubernetes，以及主流的深度学习框架如TensorFlow和PyTorch。他专注于AI应用后端架构和算法实现与优化。';
    }
    
    if (message.includes('项目') || message.includes('作品') || message.includes('经验')) {
        return '陈科瑾参与开发了多个AI项目，包括智能聊天机器人、个性化推荐系统和AI模型服务平台。这些项目体现了他在AI技术应用方面的专业能力。';
    }
    
    if (message.includes('联系') || message.includes('邮箱') || message.includes('contact')) {
        return '可以通过邮箱 chekj@epsoft.com.cn 联系陈科瑾，或者访问他的个人网站 riaishere.github.io 了解更多信息。';
    }
    
    return `感谢你询问关于"${userMessage}"的问题。陈科瑾是一位AI应用开发工程师，擅长构建高性能的AI驱动应用。你可以问我关于他的技术背景、项目经验或联系方式等问题。`;
}

// 主处理函数 - 简化版本
exports.handler = async (event, context) => {
    console.log('收到请求:', JSON.stringify(event));
    
    try {
        // 获取请求信息
        const method = event.httpMethod || event.method || 'GET';
        const path = event.path || '/';
        
        // 创建响应对象
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };

        // 处理OPTIONS请求
        if (method === 'OPTIONS') {
            response.statusCode = 204;
            return response;
        }

        // 处理聊天API
        if (path === '/api/chat' && method === 'POST') {
            try {
                const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
                const message = body?.message || '';
                
                if (!message.trim()) {
                    response.statusCode = 400;
                    response.headers['Content-Type'] = 'application/json';
                    response.body = JSON.stringify({ error: 'Message is required' });
                    return response;
                }
                
                const reply = getTestResponse(message);
                response.headers['Content-Type'] = 'application/json';
                response.body = JSON.stringify({
                    success: true,
                    reply: reply,
                    timestamp: new Date().toISOString()
                });
                return response;
                
            } catch (error) {
                console.error('聊天API错误:', error);
                response.statusCode = 500;
                response.headers['Content-Type'] = 'application/json';
                response.body = JSON.stringify({ error: 'Internal Server Error' });
                return response;
            }
        }

        // 返回HTML页面
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
            line-height: 1.6; color: #333; scroll-behavior: smooth;
        }
        .navbar {
            position: fixed; top: 0; width: 100%; background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px); padding: 1rem 2rem; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); z-index: 1000;
        }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s; }
        .nav-links a:hover { color: #667eea; }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; justify-content: center; align-items: center;
            text-align: center; color: white;
        }
        .hero-container {
            background: rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 60px 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px);
            max-width: 600px; width: 90%;
        }
        .hero-title { font-size: 3rem; margin-bottom: 1rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); }
        .hero-subtitle { font-size: 1.3rem; margin-bottom: 1rem; opacity: 0.9; }
        .hero-description { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.8; }
        .section { padding: 80px 2rem; max-width: 1200px; margin: 0 auto; }
        .section-title { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333; }
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hero-title { font-size: 2.5rem; }
            .section { padding: 60px 1rem; }
        }
        .hero-container { animation: fadeInUp 1s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">陈科瑾</div>
            <ul class="nav-links">
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于我</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </div>
    </nav>
    
    <section id="home" class="hero-section">
        <div class="hero-container">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🌟</div>
            <h1 class="hero-title">石耳在这里</h1>
            <p class="hero-subtitle">我是陈科瑾</p>
            <p class="hero-description">AI应用开发工程师 | 专注于构建可扩展、高性能的AI驱动应用程序</p>
            <div style="font-size: 2rem; margin-top: 1rem;">✨</div>
        </div>
    </section>
    
    <section id="about" class="section">
        <h2 class="section-title">关于我</h2>
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 2rem;">👨‍💻</div>
            <p style="font-size: 1.1rem; line-height: 1.8; max-width: 800px; margin: 0 auto;">
                你好！我是陈科瑾，一位专注于AI应用开发的工程师。我热衷于探索人工智能技术在实际业务场景中的应用，致力于构建可扩展、高性能的AI驱动应用程序。
            </p>
        </div>
    </section>
    
    <section id="contact" class="section" style="background: #f8f9fa;">
        <h2 class="section-title">联系我</h2>
        <div style="text-align: center;">
            <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
            <p><strong>GitHub:</strong> github.com/riaishere</p>
            <p><strong>网站:</strong> riaishere.github.io</p>
        </div>
    </section>
    
    <footer style="background: #333; color: white; text-align: center; padding: 2rem;">
        <p>&copy; 2024 陈科瑾. Built with ❤️ and AI</p>
    </footer>
    
    <script>
        console.log('陈科瑾的个人网站已加载 - 简化版本');
    </script>
</body>
</html>`;

        response.body = htmlContent;
        return response;

    } catch (error) {
        console.error('函数执行错误:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
            body: '服务器内部错误'
        };
    }
};
