
const fs = require('fs');
const path = require('path');

// 主处理函数
exports.handler = async (event, context) => {
    console.log("函数处理器已启动。正在尝试返回一个简单的测试HTML。");
    try {
        // const filePath = path.resolve(__dirname, 'index.html');
        // const htmlContent = fs.readFileSync(filePath, 'utf-8');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            // 直接返回一个极简的HTML用于测试
            body: '<html><body><h1>测试页面</h1><p>如果看到这个页面，说明函数执行成功。</p></body></html>',
        };
    } catch (error) {
        console.error('❌ 函数执行出错:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
            body: `服务器错误: ${error.message}`,
        };
    }
};
