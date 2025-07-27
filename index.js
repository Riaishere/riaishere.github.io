
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
module.exports.handler = async (event, context) => {
    console.log('函数开始执行，收到事件:', JSON.stringify(event, null, 2));
    
    try {
        // 获取请求信息（兼容不同格式）
        const method = event.httpMethod || event.method || 'GET';
        const path = event.path || event.requestPath || '/';
        
        console.log('请求方法:', method);
        console.log('请求路径:', path);

        // 处理OPTIONS预检请求
        if (method.toUpperCase() === 'OPTIONS') {
            return {
                statusCode: 204,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
        }

        // 处理聊天API
        if (path === '/api/chat' && method.toUpperCase() === 'POST') {
            console.log('处理聊天API请求');
            try {
                let message = '';
                if (event.body) {
                    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
                    message = body.message || '';
                }
                
                if (!message.trim()) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ error: 'Message is required' })
                    };
                }
                
                const reply = getTestResponse(message);
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        success: true,
                        reply: reply,
                        timestamp: new Date().toISOString()
                    })
                };
                
            } catch (error) {
                console.error('聊天API错误:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ error: 'Internal Server Error' })
                };
            }
        }

        // 返回HTML页面（默认请求）
        console.log('返回HTML页面');
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
            line-height: 1.6; color: #333;
        }
        .navbar {
            position: fixed; top: 0; width: 100%; 
            background: rgba(255, 255, 255, 0.95);
            padding: 1rem 2rem; 
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); 
            z-index: 1000;
        }
        .nav-container { 
            max-width: 1200px; margin: 0 auto; 
            display: flex; justify-content: space-between; align-items: center; 
        }
        .logo { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; }
        .nav-links a:hover { color: #667eea; }
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; justify-content: center; align-items: center;
            text-align: center; color: white;
        }
        .hero-container {
            background: rgba(255, 255, 255, 0.1); 
            border-radius: 20px; padding: 60px 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); 
            max-width: 600px; width: 90%;
        }
        .hero-title { 
            font-size: 3rem; margin-bottom: 1rem; 
            font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
        }
        .hero-subtitle { font-size: 1.3rem; margin-bottom: 1rem; opacity: 0.9; }
        .hero-description { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.8; }
        .section { padding: 80px 2rem; max-width: 1200px; margin: 0 auto; }
        .section-title { 
            text-align: center; font-size: 2.5rem; 
            margin-bottom: 3rem; color: #333; 
        }
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hero-title { font-size: 2.5rem; }
            .section { padding: 60px 1rem; }
        }
        .hero-container { animation: fadeInUp 1s ease-out; }
        @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
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
            <div style="margin-top: 2rem;">
                <h3>技术栈</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">Python</span>
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">Go</span>
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">Docker</span>
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">Kubernetes</span>
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">TensorFlow</span>
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 25px;">PyTorch</span>
                </div>
            </div>
        </div>
    </section>
    
    <section id="contact" class="section" style="background: #f8f9fa;">
        <h2 class="section-title">联系我</h2>
        <div style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                <div style="background: white; padding: 2rem; border-radius: 15px; min-width: 200px;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📧</div>
                    <h3>邮箱</h3>
                    <p>chekj@epsoft.com.cn</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 15px; min-width: 200px;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">💼</div>
                    <h3>GitHub</h3>
                    <p>github.com/riaishere</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 15px; min-width: 200px;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🌐</div>
                    <h3>个人网站</h3>
                    <p>riaishere.github.io</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer style="background: #333; color: white; text-align: center; padding: 2rem;">
        <p>&copy; 2024 陈科瑾. Built with ❤️ and AI</p>
        <p style="margin-top: 0.5rem; opacity: 0.8;">网站运行正常 ✅</p>
    </footer>
    
    <script>
        console.log('陈科瑾的个人网站已成功加载！');
        
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

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache'
            },
            body: htmlContent
        };

    } catch (error) {
        console.error('函数执行错误:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: '<h1>服务器错误</h1><p>请稍后重试</p>'
        };
    }
};
