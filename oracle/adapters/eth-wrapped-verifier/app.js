// const createRequest = require('./index').createRequest
const verifyWrappedNFT = require('./alchemy').verifyWrappedNFT;

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())

app.post('/', async (req, res) => {
  console.log('POST Data: ', req.body)
  await verifyWrappedNFT(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

/**
 * @description Expected GET parameters:
 * minter
 * wrapped
 * tokenID
 */
app.get('/', async (req, res) => {
  console.log('GET Data:', req.query);

  console.log(`Expected GET parameters: minter=${req.query.minter}, wrapped=${req.query.wrapped}, tokenID=${req.query.tokenID}`);

  await verifyWrappedNFT(req.body, (status, result) => {
    console.log('Result from verifier ', result)
    res.status(status).json(result.data)
  })
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
