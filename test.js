var express = require('express'),
    GrydValidator = require('./lib/validator.js'),
    bodyParser = require('body-parser');

GrydValidator(express);
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/test',function(req,res){
    var rules = {
      apples: ['required','num:null:10'],
      bob: ['required','sameAs:apples'],
      bool: ['required','bool'],
      url: ['required','url'],
      array: ['array'],
      reqWith: ['requiredWith:bob'],
      reqWithout: ['requiredWithout:bob']
    };
    req.GrydValidateBody(rules,function(err){
        if(err){
            res.json({success:false,errors:err});
        } else {
            res.json({success:true});
        }
    });
});

app.listen(8085);