
// 文件名: index.js (为陈科瑾定制的完整版本)
const fs = require('fs');
const path = require('path');

// AI模型调用函数
async function callAIModel(userMessage) {
    const systemPrompt = `你是陈科瑾的AI助手。陈科瑾是一位AI应用开发工程师，专注于构建可扩展、高性能的AI驱动的应用程序。

关于陈科瑾的基本信息：
- 姓名：陈科瑾
- 职业：AI应用开发工程师
- 核心领域：AI应用后端架构、算法实现与优化
- 技能栈：Python, Go, Docker, Kubernetes, TensorFlow, PyTorch
- 特点：热衷于解决复杂的技术挑战，追求代码的健壮性和效率
- 邮箱：chekj@epsoft.com.cn
- 个人网站：riaishere.github.io

请以专业、简洁、友好的语气回答用户的问题，重点介绍陈科瑾的技术能力和项目经验。`;

    // 从环境变量中读取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.log('未找到API密钥，使用测试模式');
        return getTestResponse(userMessage);
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) { 
            throw new Error(`API 请求失败: ${response.status}`); 
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('调用AI模型失败:', error);
        return getTestResponse(userMessage); // 降级到测试模式
    }
}

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
    
    // 默认回复
    return `感谢你询问关于"${userMessage}"的问题。陈科瑾是一位AI应用开发工程师，擅长构建高性能的AI驱动应用。你可以问我关于他的技术背景、项目经验或联系方式等问题。`;
}

// 获取HTML内容
function getHTMLContent() {
    // 如果有单独的HTML文件，优先读取
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
        return fs.readFileSync(htmlPath, 'utf-8');
    }
    
    // 否则返回内嵌的HTML内容
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陈科瑾 - AI应用开发工程师</title>
    <style>
        body { 
            font-family: 'Microsoft YaHei', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; justify-content: center; align-items: center;
            text-align: center; color: white; margin: 0;
        }
        .hero-container {
            background: rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 60px 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px);
            max-width: 600px; width: 90%;
        }
    </style>
</head>
<body>
    <div class="hero-container">
        <div style="font-size: 2rem; margin-bottom: 1rem;">🌟</div>
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">石耳在这里</h1>
        <p style="font-size: 1.3rem; margin-bottom: 1rem;">我是陈科瑾</p>
        <p style="font-size: 1.1rem; opacity: 0.8;">AI应用开发工程师</p>
        <div style="font-size: 2rem; margin-top: 1rem;">✨</div>
    </div>
    <script>
        console.log('陈科瑾的个人网站已加载');
    </script>
</body>
</html>`;
}

// 主处理函数
module.exports.handler = async function(req, res, context) {
    const requestPath = req.path || '/';
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理OPTIONS预检请求
    if (req.method.toUpperCase() === 'OPTIONS') {
        res.setStatusCode(204);
        res.send('');
        return;
    }

    // 处理API聊天请求
    if (requestPath === '/api/chat') {
        if (req.method.toUpperCase() !== 'POST') {
            res.setStatusCode(405);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
        }
        
        try {
            const body = JSON.parse(req.body.toString());
            const userMessage = body.message;
            
            if (!userMessage || userMessage.trim() === '') {
                res.setStatusCode(400);
                res.setHeader('content-type', 'application/json');
                res.send(JSON.stringify({ error: 'Message is required' }));
                return;
            }
            
            const reply = await callAIModel(userMessage);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({ 
                success: true, 
                reply: reply,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('API处理失败:', error);
            res.setStatusCode(500);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({ 
                error: 'Internal Server Error',
                message: '服务器内部错误，请稍后重试'
            }));
        }
        return;
    }
    
    // 处理静态文件请求
    try {
        const content = getHTMLContent();
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.send(content);
    } catch (error) {
        console.error('读取HTML文件失败:', error);
        res.setStatusCode(500);
        res.setHeader('content-type', 'text/plain');
        res.send('服务器错误：无法加载页面');
    }
};
