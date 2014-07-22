module.exports = function (express) {
  var req = express.request;
  req.GrydValidateParams = GrydValidateParams;
  req.GrydValidateBody = GrydValidateBody;
  req.GrydValidateQuery = GrydValidateQuery;
  express.application.GrydExtend = GrydExtend;
};

function GrydValidateParams(rules, callback) {
  callback(_validate(this.params, rules));
}

function GrydValidateBody(rules, callback) {
  callback(_validate(this.body, rules));
}

function GrydValidateQuery(rules, callback) {
  callback(_validate(this.query, rules));
}

function GrydExtend(name, fn) {
  if(typeof name === 'string' && typeof fn === 'function')
    _GrydFunctions[name] = fn;
  else
    throw new SyntaxError('Invalid parameters. Usage: GrydExtend(string,function);');
}

function _validate(input, rules) {
  var req = this;

  var results = {};

  for(var f in rules){
    if(rules.hasOwnProperty(f)){
      var field = rules[f];
      results[f] = [];
      for(var r = 0;r<field.length;r++){
        var rule = field[r].split(":");
        var params = [input,f,input[f]];

        if(rule.length>1)
          params = params.concat(rule.splice(1,1000));

        if(_GrydFunctions.hasOwnProperty(rule[0]))
          results[f].push(_GrydFunctions[rule[0]].apply(req,params));
      }
    }
  }
  for(var l in results){
    if(results.hasOwnProperty(l)){
      var trip = false,
          rCopy = JSON.parse(JSON.stringify(results));

      for(var o = 0; o < rCopy[l].length;o++){
        if(rCopy[l][o].hasOwnProperty('msg')){
          trip = true;
        }
        else
          results[l].splice(o,1);
      }
      if(!trip)
        delete results[l];
    }
  }
  return _isEmpty(results) ? false : results;
}

var _GrydFunctions = {
  required: function(input,name,val){
    var msg = {type:"required"};
    if(val === '' || val === null || val === undefined)
      msg.msg = "Field `"+name+"` is required.";

    return msg;
  },
  requiredWith:function(input,name,val,fieldname){
    var msg = {type:"requiredWith"};

    if(!fieldname){
      throw new SyntaxError("Validator `requiredWith` requires a `fieldname` parameter");
    }

    if(input.hasOwnProperty(fieldname)){
      if(val === '' || val === null || val === undefined)
        msg.msg = "Field `"+name+"` is required with field `"+fieldname+"`.";
    }

    return msg;
  },
  requiredWithout:function(input,name,val,fieldname){
    var msg = {type:"requiredWithout"};

    if(!fieldname){
      throw new SyntaxError("Validator `requiredWith` requires a `fieldname` parameter");
    }

    if(!input.hasOwnProperty(fieldname)){
      if(val === '' || val === null || val === undefined)
        msg.msg = "Field `"+name+"` is required without field `"+fieldname+"`.";
    }

    return msg;
  },
  regex:function(input,name,val){
    var msg = {type:"regex"};
    var exp = arguments.splice(3,1000).join(":");
    var reg = new RegExp(exp);

    if(!reg.test(val))
      msg.msg = "Field `"+name+"` does not match regexp: `/exp/`.";

    return msg;
  },
  array:function(input,name,val){
    var msg = {type:"array"};
    if(!(val === '' || val === null || val === undefined)){
      if(typeof val !== 'array')
        msg.msg = "Field `"+name+"` must be an array.";
    }
    return msg;
  },
  sameAs:function(input,name,val,fieldname){
    var msg = {type:"sameAs"};
    if(!(val === '' || val === null || val === undefined)){
      if(!fieldname){
        throw new SyntaxError("Validator `requiredWith` requires a `fieldname` parameter");
      }

      if(input.hasOwnProperty(fieldname)){
        if(input[fieldname] != val)
          msg.msg = "Field `"+name+"` must match field "+fieldname+".";
      }
    }
    return msg;
  },
  num:function(input,name,val,min,max){
    var msg = {type:"num"};
    if(!(val === '' || val === null || val === undefined)){
      if(isNaN(val)){
        msg.msg = "Field `"+name+"` is not a number.";
      } else {
        val = parseInt(val);
        min = parseInt(min);
        max = parseInt(max);
        if(typeof min != 'undefined' && val < min)
          msg.msg = "Field `"+name+"` is less than the minimum value of `"+min+"`.";
        if(typeof max != 'undefined' && val > max)
          msg.msg = "Field `"+name+"` is greater than the maximum value of `"+max+"`.";
      }
    }
    return msg;
  },
  url:function(input,name,val){
    var msg = {type:"url"};
    if(!(val === '' || val === null || val === undefined)){
      var reg = /(https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g;

      if(!reg.test(val))
        msg.msg = "Field `"+name+"` must be a valid URL.";

    }
    return msg;
  },
  bool:function(input,name,val){
    var msg = {type:"bool"};

    if(!(val === '' || val === null || val === undefined)){
      if(typeof val == 'boolean' ||
        /[Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee]/g.test(val)){

      } else {
        msg.msg = "Field `"+name+"` must be a boolean value (True or False).";
      }

      if(!msg.msg)
        input[name] = Boolean(val);
    }
    return msg;
  },
  date:function(input,name,val,before,after){
    var msg = {type:"date"};

    if(!(val === '' || val === null || val === undefined)){
      //TODO
    }
    return msg;
  },
  different:function(input,name,val,fieldname){
    var msg = {type:"different"};

    if(!(val === '' || val === null || val === undefined)){
      if(!fieldname){
        throw new SyntaxError("Validator `requiredWith` requires a `fieldname` parameter");
      }

      if(input.hasOwnProperty(fieldname)){
        if(input[fieldname] == val)
          msg.msg = "Field `"+name+"` must not match field "+fieldname+".";
      }
    }
    return msg;
  }
};

function _isEmpty(o){
  for(var i in o){
    if(o.hasOwnProperty(i)){
      return false;
    }
  }
  return true;
}