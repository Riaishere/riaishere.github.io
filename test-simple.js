// 最简单的测试版本
exports.handler = async (event, context) => {
    console.log('函数被调用:', JSON.stringify(event));
    
    // 最简单的HTML响应
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>陈科瑾测试页面</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; padding: 20px; 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: white; text-align: center; 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 40px; 
            border-radius: 15px; 
            max-width: 500px; 
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 石耳在这里 🌟</h1>
        <h2>我是陈科瑾</h2>
        <p>AI应用开发工程师</p>
        <p>专注于构建可扩展、高性能的AI驱动应用程序</p>
        <hr style="margin: 20px 0; border: 1px solid rgba(255,255,255,0.3);">
        <p><strong>技术栈:</strong> Python | Go | Docker | Kubernetes | TensorFlow | PyTorch</p>
        <p><strong>邮箱:</strong> chekj@epsoft.com.cn</p>
        <p style="margin-top: 30px; opacity: 0.8;">✅ 网站运行正常</p>
    </div>
    <script>
        console.log('陈科瑾的网站加载成功！');
    </script>
</body>
</html>`;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        },
        body: html
    };
}; 