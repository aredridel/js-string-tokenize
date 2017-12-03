const assert = require('assert');
const {sortByLength, tokenize1} = require('../lib/lib.js');
const {tokenize, nonDelimTokens} = require('../lib/index.js');

console.log(new Date());

describe('sortByLength', function() {
    it('case 1', function() {
        const a = ['y', 'ab', 'zzz'];
        const aOrigJson = JSON.stringify(a);
        const b = sortByLength(a);
        assert.strictEqual(JSON.stringify(a), aOrigJson);
        const bExpectedJSON = '["y","ab","zzz"]';
        assert.strictEqual(JSON.stringify(b), bExpectedJSON);
    });
});


describe('tokenize', function() {
    describe('single delimiter, single occurence', function() {
        it('case 1', function() {
            const tokens = tokenize('aba', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false},{"v":"b","isDelim":true},{"v":"a","isDelim":false}]');
            {
                const nonDelimTokensV = nonDelimTokens('aba', ['b']);
                assert.strictEqual(JSON.stringify(nonDelimTokensV), '["a","a"]');
            }
        });

        it('case 2', function() {
            const tokens = tokenize('ab', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false},{"v":"b","isDelim":true}]');
        });

        it('case 3', function() {
            const tokens = tokenize('ba', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"b","isDelim":true},{"v":"a","isDelim":false}]');                    
        });
        it('case 4', function() {
            const tokens = tokenize('b', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"b","isDelim":true}]');
        });

        it('case 5', function() {
            const tokens = tokenize('a', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false}]');
        });
        it('case 6', function() {
            const tokens = tokenize('a', ['ba']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":false}]');
        });

        it('case 7', function() {
            const tokens = tokenize('  aba  ', ['b']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  a","isDelim":false},{"v":"b","isDelim":true},{"v":"a  ","isDelim":false}]');
        });
        it('case 8', function() {
            const tokens = tokenize('  aba  ', ['ba']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  a","isDelim":false},{"v":"ba","isDelim":true},{"v":"  ","isDelim":false}]');
        });                                                
    }); 
    

    describe('single delimiter, double occurence', function() {
        it('case 1', function() {
            const tokens = tokenize('aba', ['a']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":false},{"v":"a","isDelim":true}]');
        });
        it('case 2', function() {
            const tokens = tokenize('  aba  ', ['a']);
            assert.strictEqual(JSON.stringify(tokens), '[{"v":"  ","isDelim":false},{"v":"a","isDelim":true},{"v":"b","isDelim":false},{"v":"a","isDelim":true},{"v":"  ","isDelim":false}]');
        });
    });
    describe('two delimiters', function() {
        it('case 1', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('aba', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"a","isDelim":true}]');
            }
        });
        it('case 1b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('aba', searchPatterns[i], true, true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"aba","isDelim":true}]');
            }
        });                
        it('case 2', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('abccda', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true}]');
            }
        });
        it('case 2b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('abccda', searchPatterns[i], true, true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"ab","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true}]');
            }
        });                
        it('case 3', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize(' f f abccda g', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":" f f ","isDelim":false},{"v":"a","isDelim":true},{"v":"b","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true},{"v":" g","isDelim":false}]');
            }
        });
        it('case 3b', function() {
            const searchPatterns = [ ['a', 'b'], ['b', 'a'], ['x', 'xx', 'a', 'xxx', 'b'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize(' f f abccda g', searchPatterns[i], true, true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":" f f ","isDelim":false},{"v":"ab","isDelim":true},{"v":"ccd","isDelim":false},{"v":"a","isDelim":true},{"v":" g","isDelim":false}]');
            }
        });
        it('case 4', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('xxbaxx', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });
        it('case 4b', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('xxbaxx', searchPatterns[i], true, true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });                
        it('case 5', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const tokens = tokenize('xxbaabaxx', searchPatterns[i]);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"ba","isDelim":true},{"v":"a","isDelim":true},{"v":"ba","isDelim":true},{"v":"xx","isDelim":false}]');
            }
        });
        it('case 5b', function() {
            const searchPatterns = [ ['a', 'ba'], ['ba', 'a'], ['y', 'yy', 'ba', 'yyy', 'a'] ];
            for (let i = 0 ; i < searchPatterns.length ; i++) {
                const INPUT = 'xxbaabaxx';
                const tokens = tokenize(INPUT, searchPatterns[i], true, true);
                assert.strictEqual(JSON.stringify(tokens), '[{"v":"xx","isDelim":false},{"v":"baaba","isDelim":true},{"v":"xx","isDelim":false}]');
                {
                    const nonDelimTokensV = nonDelimTokens(INPUT, ['b']);
                    assert.strictEqual(JSON.stringify(nonDelimTokensV), '["xx","aa","axx"]');
                }                        
            }
        });                
    });
    describe('case insensitive', function() {
        it('case 1', function() {
            const input = "MACDONALD";
            assert.strictEqual(JSON.stringify(tokenize(input, ['cd'], false)), '[{"v":"MA","isDelim":false},{"v":"CD","isDelim":true},{"v":"ONALD","isDelim":false}]');
        });
        it('case 2', function() {
            const input = "MACDONALD";
            assert.strictEqual(JSON.stringify(tokenize(input, ['a', 'cd'], false))
                               ,  '[{"v":"M","isDelim":false},{"v":"A","isDelim":true},{"v":"CD","isDelim":true},{"v":"ON","isDelim":false},{"v":"A","isDelim":true},{"v":"LD","isDelim":false}]');
        });        
    });
});

describe('tokenize-documentation-examples', function() {
    it('ex.1', function() {
        const EXPECTED = '[{"v":"a","isDelim":false},{"v":"b","isDelim":true},{"v":"a","isDelim":false}]';
        assert.strictEqual(JSON.stringify(tokenize('aba', ['b'])), EXPECTED);
    });
    it('ex.2', function() {
        const EXPECTED='[{"v":"ab","isDelim":true},{"v":"z","isDelim":false}]';
        assert.strictEqual(JSON.stringify(tokenize('abz', ['a', 'ab'])), EXPECTED);
    });
    it('ex.3', function() {
        const EXPECTED = '[{"v":"aa","isDelim":false},{"v":"B","isDelim":true},{"v":"B","isDelim":true},{"v":"aa","isDelim":false}]';
        assert.strictEqual(JSON.stringify(tokenize('aaBBaa', ['b'], false)), EXPECTED);
    });
    it('ex.4', function() {
        const EXPECTED = '[{"v":"aa","isDelim":false},{"v":"Bb","isDelim":true},{"v":"aa","isDelim":false}]';
        assert.strictEqual(JSON.stringify(tokenize('aaBBaa', ['b'], false, true)), EXPECTED);
    });    

});


