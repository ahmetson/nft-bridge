const port = 3000

const app = require("https-localhost")()

//app.use(express.static('public'));
app.serve('./');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
