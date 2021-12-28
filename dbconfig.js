module.exports=
{
    Host:"localhost",
    User:"postgres",
    Password:"postgresql",
    DB:"mtx",
    dialect:"postgres",  //dialect is the one which converts statements to its corresponding Database 
    pool:
    {
        max:5, //maximum number of connection in pool
        min:0, //minimum number of connection in pool
        acquire:30000, //maximum time in millisec pool will try to get connection before throw error
        idle:10000    //maximum time ,that connection can be idle
    }

};