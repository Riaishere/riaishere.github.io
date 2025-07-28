
const fs = require('fs');
const path = require('path');

// 主处理函数
exports.handler = async (event, context) => {
    console.log("函数处理器已启动，尝试读取并返回 index.html，并明确设置isBase64Encoded。");
    try {
        const filePath = path.resolve(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(filePath, 'utf-8');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            body: htmlContent,
            isBase64Encoded: false // 明确指定响应体不是Base64编码的
        };
    } catch (error) {
        console.error('❌ 函数执行出错:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
            body: `服务器错误: ${error.message}`,
            isBase64Encoded: false // 同样为错误信息指定
        };
    }
};
