// @flow
'use strict';

// The rationale behind using this idiom is described in:
//     http://stackoverflow.com/a/36628148/274677
//
if (!global._babelPolyfill) // https://github.com/s-panferov/awesome-typescript-loader/issues/121
    require('babel-polyfill');
// The above is important as Babel only transforms syntax (e.g. arrow functions)
// so you need this in order to support new globals or (in my experience) well-known Symbols, e.g. the following:
//
//     console.log(Object[Symbol.hasInstance]);
//
// ... will print 'undefined' without the the babel-polyfill being required.


import {assert} from 'chai';


export type TokenT =  {v: string, isDelim: boolean};


function tokenize1(s: string, m: string, caseSensitive: boolean=true): Array<TokenT> {
    return tokenize(s, [m], caseSensitive);
}

function sortByLength(ss: Array<string>): Array<string> {
    return ss.slice().sort( (a,b)=>a.length-b.length );
}

function tokenize(s: string, _ms: Array<string>, caseSensitive: boolean=true, mergeSuccessiveDelims:boolean = false): Array<TokenT> {
    const ms: Array<string> = sortByLength(_ms).reverse();
    assert.isTrue( ( s!=null) && (s!=='') );
    assert.isTrue( (ms!=null) );
    for (let i = 0 ; i < ms.length ; i++)
        assert.isTrue( (ms[i]!=null) && (ms[i]!='') );
    let rv: Array<TokenT> = [];
    let token = '';
    for (let i = 0 ; i < s.length ; ) {
        let matched = false;
        for (let j = 0 ; j < ms.length ; j++) {
            const stringPart = s.substring(i, i+ms[j].length);
            if ( ( caseSensitive && (stringPart              ===ms[j]              )) ||
                 (!caseSensitive && (stringPart.toUpperCase()===ms[j].toUpperCase()))  ) {
                if (token!=='') {
                    rv.push({v: token, isDelim: false});
                }
                if ( (rv.length>0) && rv[rv.length-1].isDelim && mergeSuccessiveDelims ) {
                    rv[rv.length-1].v += ms[j];
                } else
                    rv.push({v: stringPart, isDelim: true});
                token = '';
                i += ms[j].length;
                matched  = true;
                break;
            }
        }
        if (!matched) {
            token+=s[i];        
            i++;
        }
    }
    if (token!=='')
        rv.push({v: token, isDelim: false});
    return rv;
}

function nonDelimTokens(s: string, _ms: Array<string>, caseSensitive: boolean = true): Array<string> {
    const rv: Array<TokenT> = tokenize(s, _ms, caseSensitive);
    return rv.filter( ({isDelim})=>!isDelim ).map( ({v, isDelim})=>v );
}

exports.sortByLength   = sortByLength;
exports.tokenize1      = tokenize1;
exports.tokenize       = tokenize;
exports.nonDelimTokens = nonDelimTokens;

