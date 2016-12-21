/* @flow */
require('source-map-support').install();
import 'babel-polyfill';
import {assert} from 'chai';

import {sortByLength}                        from '../lib/lib.js';
import {tokenize, tokenizeN, nonDelimTokens} from '../lib/index.js';

import type {TokenT} from '../lib/lib.js';

// const assert     = require('chai').assert;
import _ from 'lodash';

console.log(new Date());

describe('sortByLength', function() {
    it('case 1', function() {
        const a = ['y', 'ab', 'zzz'];
        const aOrigJson = JSON.stringify(a);
        const b: Array<string> = sortByLength(a);
        assert.strictEqual(JSON.stringify(a), aOrigJson);
        const bExpectedJSON = '["y","ab","zzz"]';
        assert.strictEqual(JSON.stringify(b), bExpectedJSON);
    });
});

describe('tokenize', function() {
    describe('single delimiter, single occurence', function() {
        it('case 1', function() {
            const tokens: Array<TokenT> = tokenize('aba', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false},{"v":"b","isDelim":true},{"v":"a","isDelim":false}]');
            {
                const nonDelimTokensV = nonDelimTokens('aba', ['b']);
                assert.strictEqual(JSON.stringify(nonDelimTokensV), '["a","a"]');
            }
        });

        it('case 2', function() {
            const tokens: Array<TokenT> = tokenize('ab', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false},{"v":"b","isDelim":true}]');
        });

        it('case 3', function() {
            const tokens: Array<TokenT> = tokenize('ba', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"b","isDelim":true},{"v":"a","isDelim":false}]');                    
        });
        it('case 4', function() {
            const tokens: Array<TokenT> = tokenize('b', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"b","isDelim":true}]');
        });

        it('case 5', function() {
            const tokens: Array<TokenT> = tokenize('a', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false}]');
        });
        it('case 6', function() {
            const tokens: Array<TokenT> = tokenize('a', 'ba');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false}]');
        });

        it('case 7', function() {
            const tokens: Array<TokenT> = tokenize('  aba  ', 'b');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  a","isDelim":false},{"v":"b","isDelim":true},{"v":"a  ","isDelim":false}]');
        });
        it('case 8', function() {
            const tokens: Array<TokenT> = tokenize('  aba  ', 'ba');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  a","isDelim":false},{"v":"ba","isDelim":true},{"v":"  ","isDelim":false}]');
        });                                                
    }); 
    

    describe('single delimiter, double occurence', function() {
        it('case 1', function() {
            const tokens: Array<TokenT> = tokenize('aba', 'a');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":false},{"v":"a","isDelim":true}]');
        });
        it('case 2', function() {
            const tokens: Array<TokenT> = tokenize('  aba  ', 'a');
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  ","isDelim":false},{"v":"a","isDelim":true},{"v":"b","isDelim":false},{"v":"a","isDelim":true},{"v":"  ","isDelim":false}]');
        });
    });
    describe('two delimiters', function() {
        it('case 1', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('aba', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"a","isDelim":true}]');
            }
        });
        it('case 1b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('aba', searchPatterns[i], true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"aba","isDelim":true}]');
            }
        });                
        it('case 2', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('abccda', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true}]');
            }
        });
        it('case 2b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('abccda', searchPatterns[i], true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"ab","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true}]');
            }
        });                
        it('case 3', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN(' f f abccda g', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":" f f ","isDelim":false},{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true},{"v":" g","isDelim":false}]');
            }
        });
        it('case 3b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN(' f f abccda g', searchPatterns[i], true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":" f f ","isDelim":false},{"v":"ab","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true},{"v":" g","isDelim":false}]');
            }
        });
        it('case 4', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('xxbaxx', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });
        it('case 4b', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('xxbaxx', searchPatterns[i], true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });                
        it('case 5', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens: Array<TokenT> = tokenizeN('xxbaabaxx', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"a","isDelim":true},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });
        it('case 5b', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const INPUT = 'xxbaabaxx';
                const tokens: Array<TokenT> = tokenizeN(INPUT, searchPatterns[i], true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"baaba","isDelim":true},{"v":"xx","isDelim":false}]');
                {
                    const nonDelimTokensV = nonDelimTokens(INPUT, ['b']);
                    assert.strictEqual(JSON.stringify(nonDelimTokensV), '["xx","aa","axx"]');
                }                        
            }
        });                
    });            
});
