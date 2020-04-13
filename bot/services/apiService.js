module.exports = {
    get,
};

const http = require('http');
const https = require('https');

// params format:
//
// url.parse(
//     url.format({
//         protocol: 'http',
//         hostname: process.env.TRANSLATE_SERVER_ADDR,
//         pathname: process.env.TRANSLATE_API,
//         port: process.env.TRANSLATE_SERVER_PORT,
//         query: {
//             query: originalText,
//             sourceLang: 'en',
//             targetLang: targetLanguage,
//         },
//     })
// )

function get(params) {
    prot = params.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
        prot.get(params.href, (res) => {
            const { statusCode } = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            }
            if (error) {
                console.error(error.message);
                // Consume response data to free up memory
                res.resume();
                reject(error);
            }

            res.setEncoding('utf8');
            let rawData = '';

            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                } catch (e) {
                    console.error(e.message);
                    reject(e);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e);
        });
    });
}
