# Text Quality Indicator
Return a indicator (in %) of any text, using dictionnary.

## The aim
TQI is a node.js written module which get any text data and return you a number regarding the quality of it.

## How does it work ?
TQI compares your text to a list of words comming from large dictionnaries in some languages.

## Which languages do TQI support ?
There are currently English/French/German.

## How to use it ?
Here is the command to use in your project
```
npm install text-quality-indicator
```

Or for use in console mode
```
npm install --global text-quality-indicator
tqi --help
```

Example:
```shell
[master] kerphi@p-gully:~/istex/text-quality-indicator
$ cat ./test/data/fr-sample.txt
Un chien , un chat , des chatons , ils mangent weekend
[master] kerphi@p-gully:~/istex/text-quality-indicator
$ bin/cli.js -l fr ./test/data/fr-sample.txt 
./test/data/fr-sample.txt => { valid: 8, error: 1, rate: 88.88888888888889 }
[master] kerphi@p-gully:~/istex/text-quality-indicator
$ bin/cli.js -l en ./test/data/en-big.txt 
./test/data/en-big.txt => { valid: 1366200, error: 87945, rate: 93.9521161919891 }
```
