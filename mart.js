var Sequelize = require('sequelize');
var dbconfig = require('./dbconfig');
var express = require("express");
var cors=require("cors");
//Express() object is created and assigned to app variable.

var app = express();
app.use(cors());

app.use(express.json())
var stripe = require('stripe')('sk_test_51K4qg3SGxLpdKMNG1Dp0cXSDNT0fxFrNy4xrbSU3xZtNfv37qCnZvEhf6H1hdCAbgLoG6vtTFXlRT6u70R7GnaqD00zGLMmw7n');


//creating sequezlie object with all db parameter
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
//connecting sequelize with database and whether it worlking or not 

// sequelize.authenticate().then(=>
// {
//     console.log("connected sucessfully ");
// }).catch(err=>
//     {
//         console.log("unable to connect");
//     })


//structure of the table
    let ratingtable=sequelize.define('rating', //rating is table name 
    {
        rate:Sequelize.STRING,
        count:Sequelize.INTEGER

    },
    {
        freezeTableName: true, //avoid extra s in table name
        timestamps: false,     //avoid created at and updated at
    }
    );

//structure of the cart table
    let carttable = sequelize.define('cart', {  // cart is table name 
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement:true
            
        },
        title: Sequelize.STRING,
        price: Sequelize.INTEGER,
        description: Sequelize.STRING,
        category: Sequelize.STRING,
        image:Sequelize.STRING,
        
    }, {
        freezeTableName: true, //avoid extra s in table name
        timestamps: false,     //avoid created at and updated at
    });

    carttable.hasOne(ratingtable) //hasone used for create cloumn for product id in rarting table


    //structure of the store table
    let storetable=sequelize.define('store',
    {
        id: {
            primaryKey: true, //will not create a new id with pk is default
            type: Sequelize.INTEGER,
            autoIncrement:true
            
        },

        title:Sequelize.STRING,
        image:Sequelize.STRING,
        description:Sequelize.STRING,
        price:Sequelize.STRING,
        quantity:Sequelize.INTEGER

        

    },
    {
        freezeTableName: true, //avoid extra s in table name
        timestamps: false,     //avoid created at and updated at
    }
    );
    //storetable.hasMany(ratingtable);

    // storetable.sync({ force: true })  //if we have already table drop old table and will create again
    //     .then(data => {
    //          console.log("Table created sucessfully")
    //       })
    //     .catch(err => { console.log(err) })    

    //
    app.post('/storedata',function(req,res)
    {
       //req. body object allows you to access data in a string or JSON object from the client side.
        var title=req.body.title;
        var image=req.body.image;
        var description=req.body.description;
        var price=req.body.price;
        var quantity=req.body.quantity;
        
        console.log(req.body);
    //Build() will create an object and it does not store in db
    //Save() will save the record/object in the db which is created by build().

        storeobj = storetable.build({title:title,image:image,description:description,price:price,quantity:quantity});
        storeobj.save().then(data => {
            console.log("data inserted");
            res.status(201).send({data:data,msg:"Record inserted sucessfully"});
            // request has succeeded and has led to the creation of a resource
        })
            .catch(err => {
                console.log("error is " + err);
                res.status(400).send(err);
                // status 400 indicates that the server will not process the request due to something that is perceived to be a client error
                //page not found error 
            })

    })
    app.get('/showdata',function(req,res)
    {
        //all true has to be given format data and to be give sequelize 
        //findAll display all the table simillar to select * from tablename;
       
        storetable.findAll({all:true}).then(data=>
            {
                // console.log(data);
                res.status(200).send(data);
                
    
            }).catch((err)=>
                {
                    console.log(err);
                }
            
            )   

    })

    app.delete("/alldelete",function(req,res)
    {
        //Destroy() will remove record or records from the table.
        storetable.destroy({
            where: {},
            truncate: true
          }).then(data=>
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
    app.delete("/deletedata/:id",function(req,res)
    {
        console.log("Entering in delete");

        //params an  object containing parameter values parsed from the URL path
        var id=req.params.id;
    
        console.log("Given id is"+id);
        storetable.destroy({where:{id:id}}).then(data=>
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



//  carttable.sync({ force: true })  //if we have already table drop old table
//     .then(data => {
//          console.log("Table created sucessfully")
//      })
//    .catch(err => { console.log(err) })

//    ratingtable.sync({ force: true })  //if we have already table drop old table
//     .then(data => {
//          console.log("Table created sucessfully")
//      })
//    .catch(err => { console.log(err) })


app.get("/getdata",function(req,res)
{
    
    carttable.findAll({include:[{all:true}]}).then(data=>
        {
            // console.log(data);
            res.status(200).send(data);
            

        }).catch((err)=>
            {
                console.log(err);
            }
        
        )   
})

app.post("/insertdata",function(req,res)
{
    var id = req.body.id;
    var title=req.body.title;
    var price=req.body.price;
    var description=req.body.description;
    var category=req.body.category;
    var image=req.body.Image;
    //console.log(req.body);

    cartobj = carttable.build(req.body);
    cartobj.save().then(data => {
        console.log("data inserted");
        res.status(201).send("Record inserted sucessfully");
    })
        .catch(err => {
            console.log("error is " + err);
            res.status(400).send(err);
        })
})
app.post("/payment",function(req,res)
{
//exports.PaymentConfirm = (req,res) =>{
    var amount = req.body.amount
    delete req.body.amount;
    stripe.charges.create({
        amount:parseInt(amount)*100,
        currency:'INR',
        description:"One Time Payment",
        source : req.body.token.id,
    },
    (err)=>{
        if(err){
            console.log(err);
        }
        res.status(200).send("Payment Sucessfull")
    })
});


//the application will listen on port 8000 from clients
app.listen(8000,function()
{
    console.log("http/localhost:8000 is running ");
})


