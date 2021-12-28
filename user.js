var Sequelize = require('sequelize');
var dbconfig = require('./dbconfig');
var express = require("express");
var cors=require("cors");

var app = express();
app.use(cors());

app.use(express.json())

var sequelize = new Sequelize(dbconfig.DB, dbconfig.User, dbconfig.Password,
    {
        host: dbconfig.Host,
        dialect: dbconfig.dialect,

        pool:
        {
            min: dbconfig.pool.min,
            max: dbconfig.pool.max,
            acquire: dbconfig.pool.acquire,
            idle: dbconfig.pool.idle
        }

    });

    let Usertable = sequelize.define('usertable', {  // table name =CART
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement:true
            
        },
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        email: Sequelize.STRING,
        mobile: Sequelize.STRING,
        
        
    }, {
        freezeTableName: true, //avoid extra s in table name
        timestamps: false,     //avoid created at and updated at
    });

    // Usertable.sync({ force: true })  //if we have already table drop old table
    //      .then(data => {
    //          console.log("Table created sucessfully")
    //      })
    //    .catch(err => { console.log(err) })


       app.post("/insertdata",function(req,res)
       {
           var created_object = {
               
               firstname:req.body.firstname,
               lastname:req.body.lastname,
               email:req.body.email,
               mobile:req.body.mobile

           }

       
           var User_obj = Usertable.build(created_object);
           User_obj.save()
           .then(data=>{
               res.status(201).send("Created Sucessfully");
           })
           .catch(err=>{
               console.error("Error",err);
               res.status(400).send("Something went wrong");
           })
       })

       


       app.put("/updatedata/:Id", function (req, res) {
        var Id = req.params.Id;

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email= req.body.email;
        var mobile = req.body.mobile;
        

        console.log(Id);
    
        //console.log(req.body);
        //console.log(ename);
        Usertable.update(
            {firstname:firstname,lastname:lastname,email:email,mobile:mobile},
            {where:{id:Id}}
        ).then(data=>
                {
                    console.log(data);
                    var strmsg="Record Updated Succesfully";
                    res.status(201).send(strmsg);
                })
                .catch(err=>
                {
                    console.log("error is " + err);
                res.status(400).send(err);
                })
    
    })
    app.get("/getdata",function(req,res)
       {
        Usertable.findAll({ raw: true }).then(data=>
            {
                console.log(data);
                res.status(200).send(data);
                
    
            }).catch((err)=>
                {
                    console.log(err);
                }
            
            )   
       })

 app.delete("/deletedata/:Id",function(req,res)
{
    console.log("Entering in delete");
    var Id=req.params.Id;

    console.log("Given id is"+Id);
    Usertable.destroy({where:{id:Id}}).then(data=>
        {
            var strmsg="Record Deleted Succesfully";
                res.status(201).send(strmsg);

        })
        .catch(err=>
            {
                console.log("error is " + err);
            res.status(400).send(err);
            })




})



       app.listen(5000,function(){
        console.log("Server is listening");
    })