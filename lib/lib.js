'use strict';

const assert = require('assert');

function tokenize1(s, m, caseSensitive = true) {
    return tokenize(s, [m], caseSensitive);
}

function sortByLength(ss) {
    return ss.slice().sort( (a,b)=>a.length-b.length );
}

function tokenize(s, _ms, caseSensitive = true, mergeSuccessiveDelims = false) {
    const ms = sortByLength(_ms).reverse();
    assert( ( s!=null) && (s!=='') );
    assert( (ms!=null) );
    for (let i = 0 ; i < ms.length ; i++)
        assert( (ms[i]!=null) && (ms[i]!='') );
    let rv = [];
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

function nonDelimTokens(s, _ms, caseSensitive = true) {
    const rv = tokenize(s, _ms, caseSensitive);
    return rv.filter( ({isDelim})=>!isDelim ).map( ({v, isDelim})=>v );
}

exports.sortByLength   = sortByLength;
exports.tokenize1      = tokenize1;
exports.tokenize       = tokenize;
exports.nonDelimTokens = nonDelimTokens;

