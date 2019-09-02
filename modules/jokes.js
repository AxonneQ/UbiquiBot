const http = require("http");
const https = require("https");

const chuckAPI = "http://api.icndb.com/jokes/random";
const darkAPI = "https://sv443.net/jokeapi/category/Dark";
const miscAPI = "https://sv443.net/jokeapi/category/Miscellaneous";
const progAPI = "https://sv443.net/jokeapi/category/Programming";


this.randomizeJoke = (channel) => {
        // most of the code is taken from documentation
        // https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_http_get_options_callback
        http.get(chuckAPI, res => {
                res.setEncoding("utf8");
                console.log(res);
                let body = "";
                res.on("data", chunk => {
                        body += chunk;
                });

                res.on("end", () => {
                        body = JSON.parse(body);
                        console.log(`Result: ${body.value.joke}`); // for debug purposes
                        channel.send(body.value.joke); // send to Discord Channel
                });
        });
}

this.getDarkJoke = (channel) => {
        https.get(darkAPI, res => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                        try {
                                const parsedData = JSON.parse(rawData);
                                console.log(parsedData);
                                if(parsedData.type == 'single'){
                                        channel.send(parsedData.joke);
                                } else if (parsedData.type== 'twopart'){
                                        channel.send(parsedData.setup + "\n" +parsedData.delivery);
                                }
                               
                        } catch (e) {
                                console.error(e.message);
                        }
                });
                







        })

}