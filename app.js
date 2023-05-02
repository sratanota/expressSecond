const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://db_63360500408_dtwebapp_user:9tC8Mlncl9boctgApt2eNWhVkkM7dBfS@dpg-cghvpr2k728s1bqu1fsg-a/db_63360500408_dtwebapp')

const topCourse =[{code:"DT160",cname:"C programming",description:" dummy text of the printing"},
                  {code:"DT161",cname:"C++ programming",description:" dummy text of the printing"},
                  {code:"DT261",cname:"Data Structures",description:" dummy text of the printing"}];

const courseList =[{code:"DT160",cname:"C programming",description:" dummy text of the printing"},
{code:"DT161",cname:"C++ programming",description:" dummy text of the printing"},
{code:"DT162",cname:"OOP programming",description:" dummy text of the printing"},
{code:"DT163",cname:"OOP programming",description:" dummy text of the printing"},
{code:"DT468",cname:"Special Topics",description:" dummy text of the printing"},
{code:"DT261",cname:"Data Structures",description:" dummy text of the printing"}];

        
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }))
  
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Post request Hello World!')
})

app.get('/cat', (req, res) => {
  const { color, region } = req.query;
  res.send('We are doing the Cat page for color = ' + color + ' and region = ' + region)
})

app.get('/cat/:subPath', (req, res) => {
  const { subPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request.`)
})

app.get('/cat/:subPath/:nextSubPath', (req, res) => {
  const { subPath, nextSubPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request. and ${nextSubPath}`)
})


app.get('/top3',(req,res)=>{
  db.any('select * from public.course order by code limit 3')
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data" + error.message)
    })
})

app.get('/courseList',(req,res)=>{
  db.any('select * from public.course order by code')
    .then((data) => {
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})

app.get('/students', (req, res) => {
  db.any('select * from public.student')
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})

app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  db.any('select * from public.student where "id" = $1', id)
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})

app.post('/student', (req, res) => {
  console.log('Got body:', req.body);
  const { id } = req.body;
  db.any('select * from public.student where "id" = $1', id)
    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
});

app.get('/c*', (req, res) => {
  res.send('get in path c*')
})

app.get('*', (req, res) => {
  res.send("I don't know this request")
})

app.listen(port, () => {
  console.log(`My Example app listening on port ${port}`)
})
