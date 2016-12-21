# js-string-tokenize
Simple string tokenizer that returns both tokens and delimiters and preserves their order.
Features:

* no RegExps - delimiters are simple strings
* multiple delimiters
* preserves the order and position of delimiters and non-delimiter text
* when more than one delimiter is given and one happens to be a substring of another
it splits intelligently (tries to match the longer delimiter first)
* option for case-insensitive splitting
* option to merge consecutive delimiters into single token

## Installation


    npm install string-tokenize --save


## Usage

```javascript

  import {tokenize, nonDelimTokens} from 'string-tokenize'

```

Function *tokenize* takes four arguments:
1. string to split
2. array of string delimiters to use
3. (optional) case sensitive flag (default: true)
4. (optional) whether to merge successive delimiters (default: false)

&hellip; and return an array of objects of shape:

    {v: string, isDelim: boolean}

Function *nonDelimTokens* is a convenience wrapper (effectively an one-liner) around *tokenize* that takes
the same first three arguments and returns an array of the non-delimiter strings (throwing away the delimiters).


## Examples
```javascript

   tokenize('aba', ['b']); // returns: [{"v":"a","isDelim":false},{"v":"b","isDelim":true},{"v":"a","isDelim":false}]
   tokenize('abz', ['a', 'ab']); // returns: [{"v":"ab","isDelim":true},{"v":"z","isDelim":false}]

   tokenize('aaBaa', ['b'], false); // returns: [{"v":"aa","isDelim":false},{"v":"B","isDelim":true},{"v":"B","isDelim":true},{"v":"aa","isDelim":false}]

   tokenize('aaBBaa', ['b'], false, true); // returns: [{"v":"aa","isDelim":false},{"v":"Bb","isDelim":true},{"v":"aa","isDelim":false}]



```

For more examples look in file *test.js*


## Tests

    npm test

