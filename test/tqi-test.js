'use strict'

const pkg = require('./../package.json'),
  Tqi = require('./../src/tqi'),
  chai = require('chai'),
  path = require('path'),
  fs = require('fs'),
  expect = chai.expect;

var tqi = new Tqi(),
		enBig = fs.readFileSync(path.resolve(__dirname + '/data/en-big.txt'), 'utf8');

describe(pkg.name + '/src/tqi.js', () => {
  describe('#Constructor', () => {
    it('Must have defaults path in .dic & .aff', () => {
      expect(tqi._dic).to.be.a('string');
      expect(tqi._aff).to.be.a('string');
    });
    it('Paths from constructor should exist', (done) => {
    	fs.access(tqi._dic, fs.R_OK, (err) => {
			  expect(err).to.be.null;
			  fs.access(tqi._aff, fs.R_OK, (err) => {
			  	expect(err).to.be.null;
				  done();
				});
			});
    });
  });
  describe('#Analyze', () => {
  	it('Analyze must return exact int numbers', function() {
			return tqi.analyze(enBig).then(function(result){
			  expect(result.valid).to.be.a("number");
			  expect(result.error).to.be.a("number");
			});
  	});
  });
});