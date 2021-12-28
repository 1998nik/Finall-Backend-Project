var Sequelize = require('sequelize');
var dbconfig = require('./dbconfig');
var express = require("express");
var cors=require("cors");

var app = express();
app.use(cors());

app.use(express.json())

//connect to database

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

let usersequelize = sequelize.define('employee', {  // table name =Student
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement:true
        
    },
    ename: Sequelize.STRING,
    dept: Sequelize.STRING,
    desi: Sequelize.STRING

}, {
    freezeTableName: true, //avoid extra s in table name
    timestamps: false,     //avoid created at and updated at
});

// usersequelize.sync({ force: true })  //if we have already table drop old table
//     .then(data => {
//         console.log("Table created sucessfully")
//     })
//     .catch(err => { console.log(err) })

app.get("/", function (req, res) {
    console.log("Logging at express side...");
    res.send("this is my script in express");
})

app.get("/getAllEmployees", function (req, res) {
    usersequelize.findAll({ raw: true }).then(data => {
        console.log(data);
        res.status(200).send(data);
    })
        .catch(err => {
            console.log("err is" + err);
            res.status(400).send(err);

        })
}
);

app.get("/getemployeebyid/:id",function(req,res)
{
    var id=req.params.id;
    console.log("Given id is"+id);

    usersequelize.findByPk(id,{raw:true}).then(data=>
        {
            if(data==null)
            {
                res.status(400).send("Null Value");
            }
            console.log(data);
            res.status(200).send([data]);
        })
        .catch(err => {
            console.log("err is" + err);
            

        })


});
app.get("/getemployeebyname/:ename",function(req,res)
{
    var ename=req.params.ename;
    console.log("Given ename is"+ename);

    if(ename==undefined)
    res.status(400).send("Null Value");

    usersequelize.findAll({where:{ename:ename}},{raw:true}).then(data=>
        {
           
            console.log(data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log("err is" + err);
        })


});

app.post("/insertdata", function (req, res) {
    var id = req.body.id;
    var ename = req.body.Name;
    var dept = req.body.Dept;
    var desi = req.body.designation;

    console.log(req.body);
    empobj = usersequelize.build({ id: id, ename: ename, dept: dept, desi: desi });
    empobj.save().then(data => {
        console.log("data inserted");
        res.status(201).send("Record inserted sucessfully");
    })
        .catch(err => {
            console.log("error is " + err);
            res.status(400).send(err);
        })

})

app.put("/updatedata/:id", function (req, res) {
    var id = req.params.id;
    var ename = req.body.Name;
    var dept = req.body.Dept;
    var desi= req.body.designation;

    //console.log(req.body);
    //console.log(ename);
    usersequelize.update(
        {ename:ename,dept:dept,desi:desi},
        {where:{id:id}}
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

app.delete("/deletedata/:id",function(req,res)
{
    console.log("Entering in delete");
    var id=req.params.id;

    console.log("Given id is"+id);
    usersequelize.destroy({where:{id:id}}).then(data=>
        {
            console.log(data);
            var strmsg="Record Deleted Succesfully";
                res.status(201).send(strmsg);

        })
        .catch(err=>
            {
                console.log("error is " + err);
            res.status(400).send(err);
            })




})
app.listen(8000, function () {
    console.log("http/localhost:8000 is running ");
})
