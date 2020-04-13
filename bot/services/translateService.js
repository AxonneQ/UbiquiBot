module.exports = {
    translate,
    getLanguages,
    isLangSupported,
    getCodeFromLang,
    getLangFromCode
};

const apiService = require('./apiService');
const url = require('url');
let supportedLangs = [];
populateLangList();

function translate(originalText, targetLanguage) {
    return apiService.get(
        url.parse(
            url.format({
                protocol: 'http',
                hostname: process.env.TRANSLATE_SERVER_ADDR,
                pathname: process.env.TRANSLATE_API,
                port: process.env.TRANSLATE_SERVER_PORT,
                query: {
                    query: originalText,
                    sourceLang: 'en',
                    targetLang: targetLanguage,
                },
            })
        )
    )
    .then((res) => {
        return res;
    })
    .catch((err) => {
        console.log(err);
    });
}

function populateLangList() {
    apiService.get(
        url.parse(
            url.format({
                protocol: 'http',
                hostname: process.env.TRANSLATE_SERVER_ADDR,
                pathname: process.env.LANGUAGES_API,
                port: process.env.TRANSLATE_SERVER_PORT,
            })
        )
    )
    .then((res) => {
        supportedLangs = res;
    })
    .catch((err) => {
        console.log(err);
    });
}

function getLanguages() {
    return supportedLangs;
}

function isLangSupported(language) {
    language = language.toLowerCase();
    language = language.charAt(0).toUpperCase() + language.slice(1);

    for (let lang of supportedLangs) {
        if (lang.name === language || lang.code === language.toLowerCase()) {
            console.log(true);
            return true;
        }
    }

    return false;
}

function getCodeFromLang(language) {
    language = language.toLowerCase();
    language = language.charAt(0).toUpperCase() + language.slice(1);

    for(let lang of supportedLangs) {
        if( lang.name === language || lang.code === language.toLowerCase()) {
            return lang.code;
        }
    }
    console.log(`Cannot find language code for: ${language}`);
}

function getLangFromCode(code) {
    code = code.toLowerCase();

    for(let lang of supportedLangs) {
        if(lang.code === code ) {
            return lang.name;
        }
    }
    console.log(`Cannot find language name for: ${code}`);
}
