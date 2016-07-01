# Text Quality Indicator
Return a indicator (in %) of any text, using dictionnary.

## The aim
TQI is a node.js written module which get any text data and return you a number regarding the quality of it.

## How does it work ?
TQI compares your text to a list of words comming from large affix dictionnaries in some languages.

## Which languages do TQI support ?
There are currently ENGLISH/SPANISH/FRENCH/GERMAN/DUTCH/NORWEGIAN/PORTUGUESE.

You could use all languages which are in nodes_modules/dictionnaries but you need to add tokenization reGEX into src/mapping.js

## How to use it ?

info : API method will always return you found/rest words, not CLI programm (use option -w) 

#### Using our module in your project :

```javascript
npm install --save text-quality-indicator

// Load NPM Module
var Tqi = require('text-quality-indicator'),
    tqi = new Tqi();

// Analyze a string
tqi.analyze("Some english words").then((result) => {
  console.log("result : ", result);
}

// Will return you :
{ valid: 3,
  error: 0,
  rate: 100,
  words: { found: [ 'somme', 'english', 'words' ], rest: [] } 
}
```

When you init TQI you can send 3 arguments:

```
  var Tqi = require('text-quality-indicator'),
      tqi = new Tqi("en"),
      tqi2 = new Tqi(null, .dicPath, .affPath);
```

First argument is the "code Lang" used to tokenize words & load default dictionaries, but you can overwritte them with second & third arguments.

#### Using our CLI programm

```
npm install -g text-quality-indicator
tqi --help
```

#### Cli examples:

- On a sample french txt files containing 1 "bad word":

  ```bash
    cat ./test/data/fr-sample.txt
    -> Un chien , un chat , des chatons , ils mangent weekend
  ```
  
  Lauch TQI with fr lang option :
  
  ```bash
    tqi -l fr ./test/data/fr-sample.txt 
  ```
  
  Will return you:
  
  ```bash
    ./test/data/fr-sample.txt => { valid: 8, error: 1, rate: 88.88888888888889 }
  ```

- On an english folder containing txts :
  
   ```bash
    tqi /path/to/folder
  ```
  English is the default lang used.
