var util = require('util'),
    express = require('express'),
    GrydValidator = require('./lib/validator.js'),
    bodyParser = require('body-parser');

util.inherits(express.request,GrydValidator);
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/test',function(req,res){
    var rules = {
        apples: ['required']
    };

    console.log("test");
    res.send();

//    req.validate(rules,function(err){
//        if(err){
//            res.json({success:false,errors:err});
//        } else {
//            res.json({success:true});
//        }
//    });
});

app.listen(8085);