const apisrc = [
        { name: 'chuck', protocol: 'http', address: "http://api.icndb.com/jokes/random", extract: ['joke'] },
        { name: 'misc', protocol: 'https', address: "https://jokes.guyliangilsing.me/retrieveJokes.php?type=dadjoke", extract: ['joke'] },
        //{ name: 'mom', protocol: 'https', address: "https://api.yomomma.info/", extract: ['joke'] },
        { name: 'prog', protocol: 'https', address: "https://sv443.net/jokeapi/category/Programming", extract: ['joke', 'setup', 'delivery'] },

        //Dark jokes, (need to implement toggle per server basis, turn off by default)
        { name: 'dark', protocol: 'https', address: "https://sv443.net/jokeapi/category/Dark", extract: ['joke', 'setup', 'delivery'] }
];

module.exports = {
        randomizeJoke
};

function randomizeJoke(channel, args) {
        let jokeCategory = args[0];
        if (jokeCategory === undefined) {

                // to implement toggle variable for nsfw jokes -> if statement, which will determine whether to include nsfw in the random joke.
                let rand = Math.floor(Math.random() * (apisrc.length - 1) /* + nsfw toggle value (either 0 or 1) */);
                jokeCategory = apisrc[rand].name;
        }

        // fetch joke api according to category and protocol (http/https).
        let jokeAPI = apisrc.find(api => api.name === jokeCategory);
        var prot = require(jokeAPI.protocol);

        prot.get(jokeAPI.address, res => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", chunk => {
                        body += chunk;
                });

                res.on("end", () => {
                        let counter = 0;

                        //replace the key names from different APIs to one standardised name: output0,1,2,3,4....n
                        jokeAPI.extract.forEach(function (element) {
                                if (body.includes(element)) {
                                        body = body.replace(`"${element}":`, `"output${counter}":`);
                                        counter++;
                                }
                        });

                        body = JSON.parse(body);

                        // concat the multiple lines into output0
                        for (let i = 1; i < counter; i++) {
                                body[`output0`] += '\n' + body[`output${i}`];
                        }

                        let out = searchKey(body, "output0");
                        channel.send(out);
                });
        });
}


function searchKey(object, value) {
        var result;

        for (var key in object) {                                                        // iterate through each key of an object
                if (key === value) {                                                        // if the key is what we look for
                        return object[value];                                           // return it's value
                } else if (typeof object[key] === 'object') {           // else if the value of the key is an object
                        result = searchKey(object[key], value);         // recursively search through that object
                        if (typeof result !== 'undefined') {                  // if the result is not null
                                return result;                                                 // return it
                        }
                }
        }
}