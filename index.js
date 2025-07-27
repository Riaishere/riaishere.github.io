
// 文件名: index.js (FC 2.0简化版)

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

// 主处理函数 - FC 2.0 简化版
exports.handler = async (event, context) => {
    console.log('函数开始执行');
    console.log('事件类型:', typeof event);
    console.log('事件部分内容:', JSON.stringify(event).substring(0, 200) + '...');
    
    try {
        // 简化的HTML内容 - 内嵌所有样式
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>陈科瑾 - AI应用开发工程师</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
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
            background: rgba(255, 255, 255, 0.15);
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 2.8rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            animation: fadeIn 1s ease-out;
        }
        h2 {
            font-size: 1.4rem;
            margin-bottom: 10px;
            opacity: 0.9;
        }
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        .info-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .success {
            background: rgba(34, 197, 94, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin-top: 25px;
            font-weight: bold;
            border: 2px solid rgba(34, 197, 94, 0.5);
        }
        .time {
            margin-top: 20px;
            opacity: 0.7;
            font-size: 0.9rem;
            font-style: italic;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .tech-item {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 12px;
            margin: 3px;
            border-radius: 15px;
            font-size: 0.9rem;
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
            <h3 style="margin-bottom: 15px;">🚀 技术栈</h3>
            <div>
                <span class="tech-item">Python</span>
                <span class="tech-item">Go</span>
                <span class="tech-item">Docker</span>
                <span class="tech-item">Kubernetes</span>
            </div>
            <div style="margin-top: 8px;">
                <span class="tech-item">TensorFlow</span>
                <span class="tech-item">PyTorch</span>
                <span class="tech-item">机器学习</span>
            </div>
        </div>
        
        <div class="info-box">
            <h3 style="margin-bottom: 15px;">📧 联系方式</h3>
            <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
            <p><strong>GitHub:</strong> github.com/riaishere</p>
            <p><strong>个人网站:</strong> riaishere.github.io</p>
        </div>
        
        <div class="success">
            ✅ 网站终于修复成功！FC 2.0简化版
        </div>
        
        <div class="time">
            部署成功时间: ${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}
        </div>
    </div>
    
    <script>
        console.log('🎉 陈科瑾的个人网站加载成功！');
        console.log('⏰ 加载时间:', new Date().toLocaleString());
        
        // 添加点击效果
        document.querySelector('.container').addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
        
        // 设置过渡效果
        document.querySelector('.container').style.transition = 'transform 0.2s ease';
    </script>
</body>
</html>`;

        console.log('准备返回HTML响应，内容长度:', htmlContent.length);
        
        // 使用最标准的FC 2.0响应格式
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: htmlContent
        };

    } catch (error) {
        console.error('函数执行出错:', error);
        
        // 错误时也返回HTML
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>错误页面</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f0f0f0; 
        }
        .error { 
            background: #ffebee; 
            border: 1px solid #f44336; 
            padding: 20px; 
            border-radius: 8px; 
            max-width: 500px; 
            margin: 0 auto; 
        }
    </style>
</head>
<body>
    <div class="error">
        <h1>🚫 服务器错误</h1>
        <p>错误信息: ${error.message}</p>
        <p>请稍后重试或联系管理员</p>
        <p>时间: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`
        };
    }
};
