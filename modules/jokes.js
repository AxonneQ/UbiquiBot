const apisrc = [
        {name: 'chuck', protocol: 'http', address: "http://api.icndb.com/jokes/random", path: 'value', extract: ['joke']},
        {name: 'misc', protocol: 'https', address: "https://icanhazdadjoke.com/", path: '', extract: ''},           
        {name: 'prog', protocol: 'https', address:  "https://sv443.net/jokeapi/category/Programming", path: '', extract: ['joke','setup','delivery']},

         //Dark jokes, (need to implement toggle per server basis, turn off by default)
        {name: 'dark', protocol: 'https', address: "https://sv443.net/jokeapi/category/Dark", path: '', extract: ['joke','setup','delivery']}                      
]

this.searchKey = () => {
        //WIP
}

this.randomizeJoke = (channel, args) => {

        let jokeCategory = args[0];
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
                        jokeAPI.extract.forEach(function(element) {
                                if(body.includes(element)){
                                        body = body.replace(`"${element}":`, `"output${counter}":`);
                                        counter++;
                                }
                        });

                        body = JSON.parse(body);

                        for(let i = 1; i < counter; i++){
                                console.log("in the loop");
                                body['output0'] += '\n' + body[`output${i}`];
                        }                       

                        // Implement recursive search for a key within JSON

                        console.log(body);
                        console.log(body[`value.output0`]);
                });
        });
}
