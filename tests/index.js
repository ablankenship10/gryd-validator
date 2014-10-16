var expect = require('chai').expect,
  GrydValidator = require('../lib/validator.js');

var expressMock = {
  request: {
    body: {},
    params: {},
    query: {}
  },
  application: {}
};

GrydValidator(expressMock);

describe("GrydValidator Express Tests", function () {
  var req = expressMock.request;

  it("Should have a failed required field", function (done) {
    req.body = {};
    var rules = {
      badField: ['required']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'required');
      done();
    });
  });

  it("Should pass required validation", function (done) {
    req.body = {
      goodField: "goodField"
    };
    var rules = {
      goodField: ['required']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed requiredWith field", function (done) {
    req.body = {
      goodField: "test"
    };
    var rules = {
      badField: ['requiredWith:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'requiredWith');
      done();
    });
  });

  it("Should pass requiredWith validation", function (done) {
    req.body = {
      goodField: "test",
      otherField: "working"
    };
    var rules = {
      otherField: ['requiredWith:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed requiredWithout field", function (done) {
    req.body = {
      otherField: "test"
    };
    var rules = {
      badField: ['requiredWithout:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'requiredWithout');
      done();
    });
  });

  it("Should pass requiredWithout validation", function (done) {
    req.body = {
      otherField: "working"
    };
    var rules = {
      otherField: ['requiredWithout:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed array field", function (done) {
    req.body = {
      badField: "test"
    };
    var rules = {
      badField: ['array']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'array');
      done();
    });
  });

  it("Should pass array validation", function (done) {
    req.body = {
      otherField: ['test', 'seconditem']
    };
    var rules = {
      otherField: ['array']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed sameAs field", function (done) {
    req.body = {
      badField: "bad",
      goodField: "good"
    };
    var rules = {
      badField: ['sameAs:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'sameAs');
      done();
    });
  });

  it("Should pass sameAs validation", function (done) {
    req.body = {
      goodField: "good",
      otherField: "good"
    };
    var rules = {
      otherField: ['sameAs:goodField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed num field", function (done) {
    req.body = {
      badField: "bad"
    };
    var rules = {
      badField: ['num']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'num');
      done();
    });
  });

  it("Should pass num validation", function (done) {
    req.body = {
      goodField: "10"
    };
    var rules = {
      goodField: ['num']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed num field with min value", function (done) {
    req.body = {
      badField: 5
    };
    var rules = {
      badField: ['num:10']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'num');
      done();
    });
  });

  it("Should pass num validation with min value", function (done) {
    req.body = {
      goodField: 12
    };
    var rules = {
      goodField: ['num:10']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should have a failed num field with max value", function (done) {
    req.body = {
      badField: 50
    };
    var rules = {
      badField: ['num:10:20']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'num');
      done();
    });
  });

  it("Should pass num validation with max value", function (done) {
    req.body = {
      goodField: 15
    };
    var rules = {
      goodField: ['num:10:20']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should allow a max value without a minimum", function (done) {
    req.body = {
      goodField: 15
    };
    var rules = {
      goodField: ['num::20']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should not pass url validation", function (done) {
    req.body = {
      badField: "badurl.com",
      otherField: "www.url.com"
    };
    var rules = {
      badField: ['url'],
      otherField: ['url']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'url');
      expect(err).to.have.property('otherField');
      expect(err).to.have.deep.property('otherField[0].type', 'url');
      done();
    });
  });

  it("Should pass url validation", function (done) {
    req.body = {
      goodField: "http://goodurl.com",
      otherField: "http://goodurl.com/folder/file.jpg"
    };
    var rules = {
      goodField: ['url'],
      otherField: ['url']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should not pass email validation", function (done) {
    req.body = {
      badField: "maildomain.com",
      otherField: "bob@dole"
    };
    var rules = {
      badField: ['email'],
      otherField: ['email']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'email');
      expect(err).to.have.property('otherField');
      expect(err).to.have.deep.property('otherField[0].type', 'email');
      done();
    });
  });

  it("Should pass email validation", function (done) {
    req.body = {
      goodField: "bob@dole.com",
      otherField: "steve.jobs@apple.com"
    };
    var rules = {
      goodField: ['email'],
      otherField: ['email']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should fail bool validation", function (done) {
    req.body = {
      badField: "apples",
      otherField: 10,
      moreFields: -1
    };
    var rules = {
      badField: ['bool'],
      otherField: ['bool'],
      moreFields: ['bool']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'bool');
      expect(err).to.have.property('otherField');
      expect(err).to.have.deep.property('otherField[0].type', 'bool');
      expect(err).to.have.property('moreFields');
      expect(err).to.have.deep.property('moreFields[0].type', 'bool');
      done();
    });
  });

  it("Should pass bool validation", function (done) {
    req.body = {
      goodField: true,
      otherField: "false",
      moreFields: 1,
      oneMore: 0
    };
    var rules = {
      goodField: ['bool'],
      otherField: ['bool'],
      moreFields: ['bool'],
      oneMore: ['bool']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should not pass date validation", function (done) {
    req.body = {
      badDate: "Text",
      badDateAfter: new Date().toISOString(),
      badDateBefore: new Date().toISOString(),
      badDateBetween: new Date().toISOString()
    };
    var rules = {
      badDate: ['date'],
      badDateAfter: ['date:1503117432000'],
      badDateBefore: ['date::1303117432000'],
      badDateBetween: ['date:1493117432000:1503117432000']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badDate');
      expect(err).to.have.deep.property('badDate[0].type', 'date');
      expect(err).to.have.property('badDateAfter');
      expect(err).to.have.deep.property('badDateAfter[0].type', 'date');
      expect(err).to.have.property('badDateBefore');
      expect(err).to.have.deep.property('badDateBefore[0].type', 'date');
      expect(err).to.have.property('badDateBetween');
      expect(err).to.have.deep.property('badDateBetween[0].type', 'date');
      done();
    });
  });

  it("Should pass date validation", function (done) {
    req.body = {
      goodDate: new Date().toISOString(),
      goodDateAfter: new Date().toISOString(),
      goodDateBefore: new Date().toISOString(),
      goodDateBetween: new Date().toISOString()
    };
    var rules = {
      goodDate: ['date'],
      goodDateAfter: ['date:1303117432000'],
      goodDateBefore: ['date::1503117432000'],
      goodDateBetween: ['date:1303117432000:1503117432000']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

  it("Should not pass different validation", function (done) {
    req.body = {
      badField: "badtext",
      otherField: "badtext"
    };
    var rules = {
      badField: ['different:otherField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'different');
      done();
    });
  });

  it("Should pass different validation", function (done) {
    req.body = {
      goodField: "goodtext",
      otherField: "othertext"
    };
    var rules = {
      goodField: ['different:otherField']
    };
    req.GrydValidateBody(rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });

});

describe("GrydValidator Stand-Alone Tests", function () {
  var GrydValidate = GrydValidator.GrydValidate;

  it("Should have a failed required field", function (done) {
    var input = {};
    var rules = {
      badField: ['required']
    };
    GrydValidate(input, rules, function (err) {
      expect(err).to.have.property('badField');
      expect(err).to.have.deep.property('badField[0].type', 'required');
      done();
    });
  });

  it("Should pass required validation", function (done) {
    var input = {
      goodField: "goodField"
    };
    var rules = {
      goodField: ['required']
    };
    GrydValidate(input, rules, function (err) {
      expect(err).to.equal(null);
      done();
    });
  });
});