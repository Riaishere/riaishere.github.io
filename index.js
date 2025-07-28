
const fs = require('fs');
const path = require('path');

// 主处理函数
exports.handler = async (event, context) => {
    try {
        const filePath = path.resolve(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(filePath, 'utf-8');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            body: htmlContent,
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
