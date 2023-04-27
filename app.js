const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const jwt = require('jsonwebtoken')

const SECRET = "mysecretword"

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://db_486example_user:9N2KSOdKB4W8CADTodmTWPjhp2Ks7Riw@dpg-cggkfk02qv28tc48fmk0-a/db_486example')
const top3Course = [{ code: "DT160", cname: "C programming", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT161", cname: "C++ programming", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT261", cname: "Data Structures", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" }]

const courseList = [{ code: "DT160", cname: "C programming", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT161", cname: "C++ programming", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT162", cname: "OOP programming", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT163", cname: "OOP programming Lab", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT468", cname: "Special Topics", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" },
{ code: "DT261", cname: "Data Structures", description: "Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sin" }]

const userData = {email:"mail1@xxx.com", password:"pass1"}

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

app.get('/top3', (req, res) => {
  db.any('select * from public.course order by code limit 3')
    .then((data) => {
      res.json({result:data})
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})

app.get('/courseList', (req, res) => {
  db.any('select * from public.course order by code')
    .then((data) => {
      res.json({result:data})
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })

})

const generateToken = (usr)=> {
  const token = jwt.sign({email:usr.email} , SECRET, {expiresIn:"30m",algorithm:"HS256"})
  return token;
}
app.post('/login',(req, res) => {
  const {user} = req.body

  db.any("select email, password from public.student where email = '$1' and password = '$2'",user.email, user.password)
  .then((data) => {
    if (data.length === 0){
      return res.status(401).send("Login Fail." + user.email + " " + user.password)
    }
    const access_token = generateToken(user)
    res.json({token:access_token})
  })
  .catch((error) => {
    return res.status(401).send("Login error." + error.message)
  })
})

const validateToken = (req, res, next)=>{
  if (!req.headers["authorization"]) return res.status(401).send("Not Login")
  const token = req.headers["authorization"].replace("Bearer ","")
  jwt.verify(token,SECRET, (err, email)=>{
    if(err){
      return res.status(401).send("Not Login")
    }else{
      req.email = email
      next()
    }
  })
}
app.post('myCourses', validateToken ,(req,res) =>{
  const {email} = req.body
  console.log("email",email)
  const queryString = `select  co.coursecode, course.description, sem.semester, sem.year  from studentenrollment as se join student s on se.studentid = s.id 
  join courseopenning as co on se.copenid = co.cid
  left join course on co.coursecode = course.code 
  left join semester as sem on co.semid = sem.semid
  where s.email = $1`
  db.any(queryString,email)
    .then((data) => {
      res.json({result:data})
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
