#!/usr/bin/env node
let mysql = require("mysql");


let random = (min,max)=> Math.floor(Math.random() * (max - min + 1) + min);

class App{
    constructor(){
        this.connection = mysql.createConnection({
            host:'localhost',
            port:3306,
            user:"root",
            password:"snouto",
            database:'dsu'
        });
        this.num_dsus=5;
        //connecting to mysql database
        this.end = this.end.bind(this);
        this.start = this.start.bind(this);
        this.createDSUS = this.createDSUS.bind(this);
        this.randomlyCreateSite =this.randomlyCreateSite.bind(this);
        this.aggregateSites = this.aggregateSites.bind(this);
        this.empty = this.empty.bind(this);

    }

    empty(){

        ['DELETE from dsu_power','DELETE from site_power','DELETE from dsus'].map(query=>{

            this.connection.query(query);

        });
        return this;
    }


    start(){
        return new Promise(function (resolve, reject) {

            //first connect to the database
            this.connection.connect(function (err) {
                if(err && reject){
                    reject(err);
                }
                //then create random DSUS up to the number of num_dsus
                this.empty();
                this.createDSUS();
                resolve(this);
            }.bind(this));
        }.bind(this));
    }


    randomlyCreateSite(){
        //by default, we have 5 DSUS as referred by num_dsus,
        //each time this method run, we will pick a dsu Id from 1=>MAX , leaving the last dsu empty without any sites to demonstrate the left join
        let max_query = "select min(id) as min ,  max(id) as max  from dsus";
        this.connection.query(max_query,(err,results,fields)=>{

            if(err){
                console.log(err);
                return;
            }
            if(results && results.length > 0){

                let {min,max} = results[0];
                let dsus = random(min,max-1); // Leaving the last one without any sites for demonstrating left join
                let power = random(0,1000);
                console.log(`Randomly picked DSUS ID : ${dsus}`);
                let sql = `INSERT INTO site_power(power,dsu_id,time_sent) VALUES(${power},${dsus},${this.connection.escape(new Date())})`;
                this.connection.query(sql);
            }
        });


    }

    aggregateSites(){

        let aggregate_query = "select d.id, ifnull(sum(s.power),0) as total_power from dsus as d left join site_power as s on d.id = s.dsu_id group by d.id";
        this.connection.query(aggregate_query,(err,results,fields)=>{

            if(err){
                console.log(err);
                return;
            }
            if(results && results.length > 0){

                for(let {id,total_power} of results){

                    let dsu_query = `INSERT INTO dsu_power(dsu_id,total_power,time_aggregated) VALUES (${id},${total_power},${this.connection.escape(new Date())}) ON DUPLICATE KEY update  total_power = ${total_power} , time_aggregated=${this.connection.escape(new Date())} , dsu_id=${id}`;
                    //this.connection.query(dsu_query);
                    this.connection.query(dsu_query);

                }

            }

        });

    }

    createDSUS(){

        for(let i=0;i<this.num_dsus;i++){

           let insert_query = `INSERT INTO dsus(description) VALUES (${String(i)})`;
            this.connection.query(insert_query);
        }

        return true;

    }

    end(callback){

        this.connection.end(function (err) {

            if(err){
                console.log(err);
                return;
            }
            console.log("Disconnected successfully from MySQL Database.");
            if(callback){
                callback();
            }
        }.bind(this));

    }
};
let app = new App();
//app.start().then(app=>setInterval(app.randomlyCreateSite,1000));
app.start().then(app=>{
    //create random sites
    setInterval(app.randomlyCreateSite,1000); // for one second
    setInterval(app.aggregateSites,1000); //for another second
});


