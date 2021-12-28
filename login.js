var express=require("express");
var Sequelize = require('sequelize');
var dbConfig=require('./dbconfig')
var cors=require("cors");
var app=express();
var nodemailer = require('nodemailer');


app.use(express.json())
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
          user: '1998nik109@gmail.com',
          pass: '***'
        }
      });
      
      var mailOptions = {
        from: '1998nik109@@gmail.com',
        to: 'nikhil.khandelwal@mtxb2b.com',
        subject: '',
        text:''
      };



var sequelize = new Sequelize(dbConfig.db,dbConfig.username,dbConfig.password,{
    host:dbConfig.host,
    dialect:dbConfig.dialect,
    pool:{
        min:dbConfig.pool.min,
        max:dbConfig.pool.max,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
}
)
let usermodal = sequelize.define('User',{
    user: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password  : Sequelize.STRING,
    role : Sequelize.STRING
})

// usermodal.sync();
// usermodal.sync({ force: true })  //if we have already table drop old table
//          .then(data => {
//              console.log("Table created sucessfully")
//          })
//        .catch(err => { console.log(err) })


app.get("/display",function(req,res)
{
    console.log("In get of display ");
    res.send("In get of all data");
})

app.post("/login",function(req,res)
{
    console.log("at Login  at server side...");
   
    // var user = req.body.loginobj;
    
    // var password = req.body.password;
    
console.log(req.body.loginobj);
console.log(req.body.password);

    usermodal.findAll({where:{user:req.body.loginobj,password:req.body.password}})
    .then(data=>{
        if(data.length>0){
            res.status(200).send("Login Sucessfull");
        }
        else{
            res.status(400).send("Invalid Credential");
        }
    })
    .catch(err=>{
        console.error("Error : ",err);
        res.status(400).send("Something went wrong");
    })
   
    
})

app.post("/signup",function(req,res)
{
   
    var user = req.body.user;

    var created_object = {
        user : req.body.user,
        password : req.body.password,
        role : req.body.role
    }
    

    var User_obj = usermodal.build(created_object);
    User_obj.save()
    .then(data=>{
        res.status(201).send("Created Sucessfully");
        if(data.length==0){
            res.status(401).send("User not found")
    
        }else{
            mailOptions.to=user;
            
            mailOptions.subject='Hi '+user+' You are registered  Successfully'
            mailOptions.text='Thankyou for Joining us!\n our Best Team \n Apna Store '
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(401).send(error)
                }
                else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send(data)
                }
                  });
           

        }
    })
    .catch(err=>{
        console.error("Error",err);
        res.status(400).send("Something went wrong");
    })

    
})

let contactable = sequelize.define('contact',{
    name:Sequelize.STRING,
    email  : Sequelize.STRING,
    message : Sequelize.STRING
},
{
    freezeTableName: true, //avoid extra s in table name
    timestamps: false,     //avoid created at and updated at
});

// contactable.sync({ force: true })  //if we have already table drop old table
//        .then(data => {
//            console.log("Table created sucessfully")
//          })
//        .catch(err => { console.log(err) })


app.post("/submitdata",function(req,res)
{
   
    var created_object = {
        name : req.body.name,
        email: req.body.email,
        message : req.body.message
    }
    var email = req.body.email;
    
    var message=req.body.message;

    var User_obj = contactable.build(created_object);
    User_obj.save()
    .then(data=>{
        if(data.length==0){
            res.status(401).send("User not found")

        }else{
            mailOptions.to=email;
            mailOptions.subject='Transaction failed but money deducted.'
            mailOptions.text= message
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(401).send(error)
                }
                  });
            res.status(200).send(data)
        }
       
    })
    .catch(err=>{
        console.error("Error",err);
        res.status(400).send("Something went wrong");
    })
})
app.get("/getdata",function(req,res)
{
    contactable.findAll({ raw: true }).then(data=>
        {
            console.log(data);
            res.status(200).send(data);
            

        }).catch((err)=>
            {
                console.log(err);
            })

})

app.get("/getUserByEmail/:email",(req,res)=>{
   
    var email=req.params.email;
    usermodal.findAll({where :{user:email},raw:true})
    .then((data)=>{
        if(data.length==0){
            res.status(401).send("User not found")

        }else{
            let otpdata = Math.floor(100000 + Math.random() * 900000);
                    // let data = Otp.create({
                    //     otp: otpdata,
                    //     email: req.body.email,
                    //     expiresIn: new Date(new Date().getTime() + 300* 1000)
                        
                    // });
            mailOptions.to=email;
            
           
            mailOptions.text='Your otp is  : '+otpdata+'\nThankyou!\n our Best Team \n Apna Store '
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(401).send(error)
                }
                  });
            res.status(200).send({
                "email":data[0].user,
                "otp":otpdata
            })
        }
    })
    .catch((err)=>{
        console.error(err);
    })
})

app.put("/updatedata",function(req,res)
{
    console.log(req.body.password);
    usermodal.update({password:req.body.password},{where:{user:req.body.email}}).then(data=>
        {
            console.log(data);
            res.status(200).send(data);
            

        }).catch((err)=>
            {
                console.log(err);
            })
})
 
app.listen(9000,function()
{
    console.log("http/localhost:9000 is running ");
})