var GrydValidator = module.exports = function(){
    console.log('hi');
};

GrydValidator.prototype.GrydValidate = function(rules,callback){
    callback(_validate([this.params,this.body,this.query],rules));
};

GrydValidator.prototype.GrydValidateParams = function(rules){
    return _validate(this.params,rules);
};

GrydValidator.prototype.GrydValidateBody = function(rules){
    return _validate(this.body,rules);
};

GrydValidator.prototype.GrydValidateQuery = function(rules){
    return _validate(this.query,rules);
};

function _validate(input,rules){
    var req = this;
    if(rules){
        console.log(req.body);
        return false;
    } else {
        return false;
    }
}

function _required(val){
    return (val !== '' && val !== null && val !== undefined);
}

