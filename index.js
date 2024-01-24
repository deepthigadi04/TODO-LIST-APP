const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('./config/mongoose')
const db =require('./models/task')
const Task = require('./models/task')
const path =require('path');
const port = 8080;
const app = express();
app.use(express.urlencoded());
app.use(express.static("./views"));
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname + '/public')));
app.get('/',function(req,res){
    res.send("I am in Home Page");
});

app.get('/home',function(req,res){
    const tasks = Task.find({})
    .exec();
    tasks      
    .then(task=>{
        console.log(task);
        res.render('home',{task:task});
    })
    .catch(err=>{
        console.log("Error in fetching tasks from db");
    })
})



app.post('/create-task',function(req,res){
    const promise= new Promise((resolve,reject)=>{
        Task.create({
           description: req.body.description,
           category: req.body.category,
           date: req.body.date 
        });
    })
    console.log(req.body.name);
    res.redirect('home'); 
})


app.get('/delete-task', function(req, res){
    var id = req.query;
    var count = Object.keys(id).length;
    var deletePromises = [];
    for(let i=0; i < count ; i++){

        deletePromises.push(Task.findByIdAndDelete(Object.keys(id)[i]));
    }

    Promise.all(deletePromises).then(function(){
        return res.redirect('back'); 
    }).catch(function(err){
        console.log('error in deleting task', err);
        return res.redirect('back');
    });
});



app.listen(port,function(err){
    if(err){
        console.log("Server is not running");
    }
    console.log("Server is running in port:" +port);
})
