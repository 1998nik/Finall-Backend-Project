var nodemailer = require('nodemailer');
var express=require('express');
const bodyParser = require('body-parser');
const multer = require('multer')

var app=express();

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '1998nik109@gmail@gmail.com',
          pass: '***'
        }
      });
      
      var mailOptions = {
        from: '1998nik109@gmail.com',
        to: 'nikhil.khandelwal@mtxb2b.com',
        subject: '',
        text:''
      };


  
  

  app.listen(3000,()=>
  {
      console.log("app started on 5000");
  })