'use strict';

const Tqi = require('../src/tqi'),
	  kuler = require('kuler'),
	  prettyjson = require('prettyjson'),
		tqi =  new Tqi(),
		tqiFr = new Tqi('fr');

// These sentence if english OK
tqi.analyze("This is a long sentence but all words seem to be okay").then((result) => {
  console.log('===============================');
  console.info(kuler("A GOOD SENTENCE : \n" , "green") , prettyjson.render(result));
  console.log('===============================');
});


// Contains canadian words and all is OK
tqi.analyze("Color, abridgement and cheque are Canadian words").then((result) => {
  console.log('===============================');
  console.info(kuler("CANADIAN Words : \n" , "green") , prettyjson.render(result));
  console.log('===============================');
});

// Bad words in english
tqi.analyze("ther ar multipl Bads words").then(function(result){
  console.log('===============================');
  console.info(kuler("BAD Words : \n" , "red") , prettyjson.render(result));
  console.log('===============================');
});

// A French sentence tokinized with english reGEX
tqi.analyze("Une phrase en français avec une mauvaise manière de découper").then((result) => {
  console.log('===============================');
  console.info(kuler("French Words / Bad tokenization: \n" , "red") , prettyjson.render(result));
  console.log('===============================');
});

// A French sentence tokinized with French reGEX
tqiFr.analyze("Une phrase en français avec une bonne manière de découper").then((result) => {
  console.log('===============================');
  console.info(kuler("French Words / Good tokenization : \n" , "green") , prettyjson.render(result));
  console.log('===============================')
});


