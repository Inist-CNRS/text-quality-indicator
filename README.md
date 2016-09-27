[![Build Status](https://travis-ci.org/Inist-CNRS/text-quality-indicator.svg?branch=master)](https://travis-ci.org/Inist-CNRS/text-quality-indicator)

# Text Quality Indicator
Return a indicator (in %) of any text, using dictionnary.

## The aim
TQI is a node.js written module which get any text data and return you a number regarding the quality of it.

## How does it work ?
TQI compares your text to a list of words comming from large affix dictionnaries in some languages.

## Which languages do TQI support ?
TQI supports all languages present in the list of dictionaries for Hunspell. 

You could use all languages which are in nodes_modules/dictionnaries or a personnel dictionnary.

## How to use it ?

#### Requirements
Hunspell (version >= 1.3)

```bash
sudo apt-get install hunspell
```

#### Using our module in your project :
```bash
npm install --save text-quality-indicator
```

```javascript
// Load NPM Module
const Tqi = require('text-quality-indicator'),
    tqi = new Tqi();

// correct/mispelled words are disable by default. To activate it : 
const options = { wordsResult: true }

// Analyze a file
tqi.analyze(file.txt, options).then((result) => {
  console.log("result : ", result);
}

// Will return you :
{ correct: 3,
  misspelled: 0,
  rate: 100,
  words: { correct: [ 'somme', 'english', 'words' ], mispelled: [] } 
}
```


When you init TQI you can send an array of langage's code, a path to a personnal dictionnary or a mix of both:

```javascript
const Tqi = require('text-quality-indicator'),
      tqi = new Tqi("en"),
      tqiEnFr = new Tqi(["en", "fr"]);
      tqiEnFrAndMyDictionnary = new Tqi(["en", "fr", "/path/to/my/dictionnary"]);
```


#### Using our CLI programm
```bash
npm install -g text-quality-indicator
tqi --help
```

#### Cli examples:

- On a sample french txt files containing 1 "bad word":

  ```bash
    cat ./test/data/fr-sample.txt
    -> En se réveillant un matin après des rêves agités, Gregor Samsa se retrouva, dans son lit, métamorphosé en un monstrueux insecte.
  ```
  
  Lauch TQI with fr lang option :
  
  ```bash
    tqi -d fr ./test/data/fr-sample.txt 
  ```
  
  Will return you:
  
  ```bash
    fr-sample.txt => { correct: 20, mispelled: 1, rate: 95.23809523809523 }
  ```

- On an english folder containing txts :
  
  ```bash
    tqi /path/to/folder
  ```
  English is the default lang used.

You can ask cli to send back you the corect/mispelled words :

```bash
./bin/cli.js -w ./pathToTxt.txt
```
