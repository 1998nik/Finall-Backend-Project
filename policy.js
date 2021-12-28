const express =require("express");
const Sequelize=require("sequelize");
const app=express();
const db2= require("./dbconfig");
var cors=require('cors');
app.use(cors());
var sequelize= new Sequelize(db2.DB,db2.User,db2.Password,{
   host:db2.Host,
   dialect:db2.dialect,
   pool:{
       max:db2.pool.max,
       min:db2.pool.min,
       acquire:db2.pool.acquire,
       idle:db2.pool.idle
   }
});

let InsuranceTable= sequelize.define('InsuranceTable',{
    policyNo :{
        primaryKey:true,
        type:Sequelize.INTEGER
    },
    holderName:Sequelize.STRING,
    amount:Sequelize.INTEGER,
    emiAmount: Sequelize.INTEGER,
    nomineeName:Sequelize.STRING
},{
    timestamps:false,
    freezeTableName:true
});

// InsuranceTable.sync({force:true}).then(()=>{
//     console.log("Table Created successfully");
// }).catch(err=>{
//      console.log("Error in Creation"+err);
// })


app.get('/getAllInsurance',(req,res)=>{

    InsuranceTable.findAll({raw:true}).then((data)=>{
        console.log("All Record in database");
        console.log(data);
        res.send(data);
    }).catch(err=>{
        console.log("Error in Creation");
        res.status(400),send(err);
    })
})
app.get('/getInsuranceById/:Id',(req,res)=>{
    var id=req.params.Id;
    InsuranceTable.findByPk(id,{raw:true}).then(data=>{
                console.log(data);
                res.status(200).send(data)
    }).catch(err=>{
        console.log(err);
        res.status(400).send(err);
    })
})
app.use(express.json())
app.post('/newRecord',(req,res)=>{
    var policyNo=  req.body.policyNo;
    var holderName =  req.body.holderName;
    var amount =  req.body.amount;
    var emiAmount =  req.body.emiAmount;
    var nomineeName=  req.body.nomineeName;
    var InsuranceObj=InsuranceTable.build({policyNo:policyNo,holderName:holderName,
        amount:amount,emiAmount:emiAmount,nomineeName:nomineeName});
    InsuranceObj.save().then(()=>{
        console.log("Successfully inserted");
        res.status(201).send("Inserted Successfully");
    }).catch((err)=>{
        console.log("Error Encountered"+err);
        res.status(400).send("Error Encountered");
    })
})

app.put('/updatePolicy/:id',(req,res)=>{
    var id = req.params.id;
    var holderName =  req.body.holderName;
    var amount =  req.body.amount;
    var emiAmount =  req.body.emiAmount;
    var nomineeName =  req.body.nomineeName;
        InsuranceTable.update(
           {holderName:holderName,
            amount:amount,emiAmount:emiAmount,nomineeName:nomineeName},
           {where:{policyNo:id}}
       ).then(data=>{
           console.log(data);
           var str ="Record updated successfully";
           console.log(str);
           res.status(201).send(str);
       }).catch(err =>{
           console.log("there is a error in updating the table");
           res.status(400).send(err);
       })
})
app.delete('/deletePolicy/:Id',(req,res)=>{
    var Id =req.params.Id;
    console.log("Given ID is "+Id);
    InsuranceTable.destroy({where:{policyNo:Id}}).then(()=>{
        console.log("Deleted Successfully");
        res.status(200).send("Deleted Successfully");
    }).catch((err)=>{
        console.log("Error Encountered");
        res.status(400).send(err);
    })
})


app.listen(8000,function(){
    console.log("Server is listening");
})
