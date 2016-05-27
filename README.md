# Text Quality Indicator
Return a indicator (in %) of any text, using dictionnary.

## The aim
TQI is a node.js written module which get any text data and return you a number regarding the quality of it.

## How does it work ?
TQI compares your text to a list of words comming from large affix dictionnaries in some languages.

## Which languages do TQI support ?
There are currently English/French/German.

## How to use it ?

#### Using our module in your project :

```
npm install text-quality-indicator
```

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
