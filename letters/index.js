const express = require('express')
const app = express()
const port = 3032

app.use(express.static('images'));

let imageUrl = "http://145.14.157.48:3032/";

let letterById = (id) => {
    if (id === 1) {
        return {name: 'A', example: 'Adam'};
    } else if (id === 2) {
        return {name: 'B', example: 'Bell'};
    } else if (id === 3) {
        return {name: 'E', example: 'Emotion'};
    } else if (id === 4) {
        return {name: 'L', example: 'Love'};
    } else if (id === 5) {
        return {name: 'M', example: 'Meaning'};
    }

    return {name: 'U', example: 'Unknown'};
}

let defaultMedatadata = {
    "description": "These letters are simple like a poor guy and Naive like a Nomad from Medet, who is famous like an unknown soldier.", 
    "external_url": "https://turkmenson.com/letters", 
    "image": imageUrl + "1.png", 
    "name": "Letter 'A'",
    "attributes": [ {
            "trait_type": "Order", 
            "value": 1
        }, 
        {
            "trait_type": "Example", 
            "value": "Adam"
        }
    ]
};

app.get('/letter/:id', (req, res) => {
    let id = parseInt(req.params.id);
    if (isNaN(id) || id < 1 || id > 5) {
        return res.json(defaultMedatadata);
    }

    let meta = defaultMedatadata;
    meta.image = imageUrl + `${id}.png`;

    let {name, example} = letterById(id);

    meta.name = `Letter '${name}'`;
    meta.attributes[0].value = id;
    meta.attributes[1].value = example;

    return res.json(meta);
})

app.get('/', (_req, res) => {
  res.send('Hello and Welcome!')
})

app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)
})