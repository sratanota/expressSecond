const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const pgp = require('pg-promise')
const db = pgp('postgres://db_486example_user:9N2KSOdKB4W8CADTodmTWPjhp2Ks7Riw@dpg-cggkfk02qv28tc48fmk0-a/db_486example')


const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cat', (req, res) => {
  const {color, region} = req.query;
  res.send('We are doing the Cat page for color = '+color + ' and region = ' + region)
})

app.get('/cat/:subPath', (req, res) => {
  const { subPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request.`)
})

app.get('/cat/:subPath/:nextSubPath', (req, res) => {
  const { subPath, nextSubPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request. and ${nextSubPath}`)
})

app.get('/students', (req, res) =>{
   db.any('select * from public.student')
   .then ((data)=>{
       console.log('all student: ', data)
       res.json(data)
   })
   .catch((error)=>{ 
    console.log('ERROR:', error)
    res.send("ERROR: can't get data")
   })
})

app.get('/c*', (req, res) => {
  res.send('get in path c*')
})

app.get('*', (req, res) => {
  res.send("I don't know this request")
})

app.listen(port, () => {
  console.log(`My Example app listening on port ${port}`)
})
