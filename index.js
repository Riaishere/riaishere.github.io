
// 文件名: index.js (为 陈科瑾 定制的 MVP 版本)
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// AI模型调用函数
async function callAIModel(userMessage) {
    const systemPrompt = `你是陈科瑾的AI助手。陈科瑾是一位AI应用开发工程师，专注于构建可扩展、高性能的AI驱动的应用程序。

关于陈科瑾的基本信息：
- 职业：AI应用开发工程师
- 核心领域：AI应用后端架构、算法实现与优化
- 技能栈：Python, Go, Docker, Kubernetes, TensorFlow, PyTorch
- 特点：热衷于解决复杂的技术挑战，追求代码的健壮性和效率。

请以专业、简洁、友好的语气回答用户的问题。`;

    // 从环境变量中读取您的 API 密钥
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
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
                ]
            })
        });
        if (!response.ok) { throw new Error(`API 请求失败: ${response.status}`); }
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('调用AI模型失败:', error);
        return "抱歉，我现在遇到了一些技术问题，暂时无法回答。";
    }
}

// 测试模式回复函数
function getTestResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
        return '你好！我是陈科瑾的AI助手。我可以回答关于他的技能、项目经验等问题。';
    }
    
    if (message.includes('工作') || message.includes('职业') || message.includes('经历')) {
        return '陈科瑾是一位AI应用开发工程师，专注于构建和优化AI驱动的应用程序。';
    }
    
    if (message.includes('技能') || message.includes('能力') || message.includes('技术')) {
        return '陈科瑾的核心技术栈包括 Python, Go, Docker, Kubernetes, 以及主流的深度学习框架如 TensorFlow 和 PyTorch。';
    }
    
    // 默认回复
    return '感谢你的提问！我是陈科瑾的AI助手，目前正在测试模式下运行。你可以问我关于他的技术背景和项目经验等问题。';
}


// ！！！主处理函数！！！
module.exports.handler = async function(req, res, context) {
    const requestPath = req.path;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method.toUpperCase() === 'OPTIONS') {
        res.setStatusCode(204);
        res.send('');
        return;
    }

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
            const reply = await callAIModel(userMessage);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({ success: true, reply: reply }));
        } catch (error) {
            console.error('API处理失败:', error);
            res.setStatusCode(500);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify({ error: 'Internal Server Error' }));
        }
        return;
    }
    
    try {
        const filePath = path.join(__dirname, 'index.html');
        const content = fs.readFileSync(filePath, 'utf-8');
        res.setHeader('content-type', 'text/html');
        res.send(content);
    } catch (error) {
        console.error('读取HTML文件失败:', error);
        res.setStatusCode(500);
        res.setHeader('content-type', 'text/plain');
        res.send('Homepage not found.');
    }
};
