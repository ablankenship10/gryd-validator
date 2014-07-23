GrydValidator
=========
An easy to use Node.js input validation library for Express.js or Standalone use.

###Features
  - Extends the Express.js request object with validation functions
  - Stand-alone function for manual use
  - Simple structure for defining validation rules
  - Easily extendable with your own validation functions

Installation
----

```js
    npm install gryd-validator
```
Tests
--------------

```js
    npm test
```

Usage
----

#####Extending Express.js
```js
    var express = require('express'),
        GrydValidator = require('gryd-validator');
    
    //Add validation methods to the Express request object
    GrydValidator(express);
    
    var app = express();
    
    app.post('/user/new',function(req,res){
        //Define validation rules
        var rules = {
            name: ['required'],
            age: ['required','num:13'],
            newsletter: ['bool'],
            website: ['url'],
            pets: ['array']
        };
        
        //Run the validation on post body values
        req.GrydValidateBody(rules,function(err){
            if(err)
                res.json({success:false,errors:err});
            else
                res.json({success:true});
        });
    });
```

#####Standalone use
```js
    var GrydValidate = require('gryd-validator').GrydValidate;
    
    var input = {
        name: "Bob Dole",
        age: "42",
        newsletter: "true",
        website: "http://bobdole.com/blog",
        pets: ['cat','dog','lizard']
    };
    
    //Define validation rules
    var rules = {
        name: ['required'],
        age: ['required','num:13'],
        newsletter: ['bool'],
        website: ['url'],
        pets: ['array']
    };
        
    //Run the validation on the given input object
    GrydValidate(input,rules,function(err){
        if(err)
            console.log("There was an error:",err);
        else
            console.log("Input is valid!");
    });
```

Available functions (Express)
----

####req.GrydValidate(inputObj,rulesObj,callback)
    Validates the given input fields against the provided rules object. The callback returns null or an object containing errors.

####req.GrydValidateParams(rulesObj,callback)
    A convieniece function which runs validation against URL Parameters

####req.GrydValidateBody(rulesObj,callback)
    A convieniece function which runs validation against the request body

####req.GrydValidateQuery(rulesObj,callback)
    A convieniece function which runs validation against querystring fields
    
####app.GrydExtend(name,fn)
    Add your own validation methods to GrydValidator. Functions should return an error message (String) or false on success.
    
    
Validation Methods
----
####required
Checks that the field has a value
####requiredWith:fieldName
Checks that the field has a value if another field also has a value
####requiredWithout:fieldName
Checks that the field has a value if another field does not have a value
####regex:expression
Tests that the field matches the given expression
####array
Requires that a field's value be an array
####sameAs:fieldName
Requires that the values of the field and secondary field are the same
####num[:min[:max]]
Requires that the value be a number. Optional min + max values
####url
Requires that the value be a valid URL
####email
Requires that the value be a valid email address
####bool
Requires that the value be a boolean value, 1 or 0, or string matching true or false
####date[:after[:before]]
Requires that the value be a valid date. Can accept any value that javascript is able to convert to a Date object. After is an optional minimum date and Before is an optional maximum date. These values are provided in milliseconds.
####different:fieldName
Requires that the value of the field be different than the value of another field.


Change Log
----
####0.1.0
>Initial development


Contributors
----
Aaron Blankenship


License
----

Copyright (c) 2014, Aaron Blankenship

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
