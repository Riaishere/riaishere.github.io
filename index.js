
// 文件名: index.js (最终强制修复版)

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

// 主处理函数 - 最终强制修复版
exports.handler = async (event, context) => {
    console.log('🚀 函数开始执行 - 最终修复版');
    console.log('📝 事件类型:', typeof event);
    
    try {
        // 极简HTML内容
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>陈科瑾 - AI应用开发工程师</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0; padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            color: white;
        }
        .container {
            text-align: center; background: rgba(255, 255, 255, 0.15);
            padding: 40px; border-radius: 20px; max-width: 500px; width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.8rem; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
        h2 { font-size: 1.4rem; margin-bottom: 10px; opacity: 0.9; }
        p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 12px; }
        .info-box {
            background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px;
            margin: 20px 0; border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .success {
            background: rgba(34, 197, 94, 0.3); padding: 15px; border-radius: 10px;
            margin-top: 25px; font-weight: bold; border: 2px solid rgba(34, 197, 94, 0.5);
        }
        .tech-item {
            display: inline-block; background: rgba(255, 255, 255, 0.2);
            padding: 5px 12px; margin: 3px; border-radius: 15px; font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 石耳在这里 🌟</h1>
        <h2>我是陈科瑾</h2>
        <p>AI应用开发工程师</p>
        <p>专注于构建可扩展、高性能的AI驱动应用程序</p>
        
        <div class="info-box">
            <h3>🚀 技术栈</h3>
            <div>
                <span class="tech-item">Python</span>
                <span class="tech-item">Go</span>
                <span class="tech-item">Docker</span>
                <span class="tech-item">Kubernetes</span>
                <span class="tech-item">TensorFlow</span>
                <span class="tech-item">PyTorch</span>
            </div>
        </div>
        
        <div class="info-box">
            <h3>📧 联系方式</h3>
            <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
            <p><strong>GitHub:</strong> github.com/riaishere</p>
            <p><strong>网站:</strong> riaishere.github.io</p>
        </div>
        
        <div class="success">
            ✅ 最终修复版 - 强制HTML显示！
        </div>
        
        <p style="margin-top: 20px; opacity: 0.7; font-size: 0.9rem;">
            ⏰ ${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}
        </p>
    </div>
    
    <script>
        console.log('🎉 陈科瑾网站加载成功 - 最终修复版！');
        document.title = '陈科瑾 - AI应用开发工程师 ✅';
    </script>
</body>
</html>`;

        console.log('📦 HTML内容长度:', htmlContent.length);
        console.log('🔄 准备返回强制HTML响应...');
        
        // 使用最强制的响应头设置
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': 'inline',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Content-Type-Options': 'nosniff',
                'Access-Control-Allow-Origin': '*'
            },
            body: htmlContent,
            isBase64Encoded: false
        };
        
        console.log('✅ 返回响应 - Headers:', JSON.stringify(response.headers, null, 2));
        return response;

    } catch (error) {
        console.error('❌ 函数执行出错:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': 'inline'
            },
            body: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>错误</title></head>
<body style="font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5;">
    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h1 style="color: #e74c3c;">🚫 服务器错误</h1>
        <p><strong>错误:</strong> ${error.message}</p>
        <p><strong>时间:</strong> ${new Date().toLocaleString()}</p>
        <p>请联系管理员或稍后重试</p>
    </div>
</body></html>`,
            isBase64Encoded: false
        };
    }
};
