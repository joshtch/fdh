import {
  verify,
} from 'fdv/verifier';

import {
  SUP,
} from 'fdlib';

// each test is an array [desc:string, tests:string]
//
// the tests string is preprocessed to remove anything up to and
// including the first newline and anything after and including the
// last newline, If a line is only whitespace plus |-- then the
// while line (including surrounded newlines) is stripped. This way
// you can declare multiple whitespace test cases for the same
// output with backticks.

describe('fdh/specs/importer.spec', function () {

  describe('new', function () {
    let n = 0;

    function test(input, rejects, skipVerify) {
      ++n;

      let e = new Error();

      it('[test #' + n + '] input=`' + input.replace(/[\n\r]/g, '\u23CE') + '`', function () {
        verify(input, rejects, {
          stack: e.stack,
          skipVerify: skipVerify || input.indexOf(': \'') >= 0,
        });
      });

      it('[test #' + n + '] with tabs', function () {
        verify(input.replace(/ /g, '\t'), rejects, {
          stack: e.stack,
          skipVerify: true,
        });
      });

      it('[test #' + n + '] with padded newlines', function () {
        verify('\n\r\n' + input.replace(/([\r\n])/g, '$1\n\r\n') + '\n\r\n', rejects, {
          stack: e.stack,
          skipVerify: true,
        });
      });

      it('[test #' + n + '] with comment padding', function () {
        verify(input.replace(/([\n\r]|$)/g, _ => ' # foo!\n'), rejects, {
          stack: e.stack,
          skipVerify: true,
        });
      });

      it('[test #' + n + '] with whitespace padding', function () {
        let inputPadded = input.replace(/([)+*\/\[\],\n\r])/g, ' $1 ');
        verify(inputPadded, rejects, {
          stack: e.stack,
          skipVerify: true,
        });
        verify(inputPadded.replace(/ /g, _ => ' '), rejects, {
          stack: e.stack,
          skipVerify: true,
        });
      });
    }

    function testnv(input) {
      test(input, undefined, true);
    }
    function testr(input) {
      test(input, 'reject');
    }

    describe('- vars', function () {

      describe('basic whitespace tests', function () {

        test(`: A [0 1]`);
        test(` : A [0 1]`);
        test(`  : A [0 1]`);
        test(`
: A [0 1]`);
        test(`: A [0 1]`);
        test(`
: A [0 1]`);
        test(`: A [0 1] `);
      });
    });
    describe('  - var names', function () {

      describe('simple var decl with range one pair', function () {

        test(`      : A [0 1]`);
      });

      describe('simple var decl with range one pair', function () {

        test(`      : foobar [0 1]`);
      });

      describe('simple var decl with range one pair', function () {

        test(`      : simple$_-3210stuff [0 1]`);
      });

      describe('var with unicode with range one pair', function () {

        test(`      : λandnum63r50987654321aswellλ [0 1]`);
      });
    });
    describe('  - quoted ident s', function () {

      describe('simple quoted ident', function () {

        test(`      : 'A' [0 1]`);
      });

      describe('quoted ident otherwise illegal', function () {

        test(`      : '[({#=]})' [0 1]`);
      });

      describe('quoted ident in constraint', function () {

        testnv(`      : '[({#=]})' [0 1]
      '[({#=]})' == 0`);
      });
    });
    describe('  - domain', function () {

      describe('simple var decl with range one pair', function () {

        test(`    : A [1 2]`);
        test(`    : A [ 1 2]`);
        test(`    : A [1 2 ]`);
        test(`    : A [1  2]`);
        test(`    : A [ 1 2 ]`);
        test(`     : A [1 2]`);
        test(`    :  A [1 2]`);
        test(`    :   A   [ 1 2 ]`);
      });

      describe('simple var decl with range multiple pairs', function () {

        test(`    : A [[0 1] [10 20] [100 3000]]`);
        test(`    : A [[0 1] [10 20] [100 3000]]`);
        test(`    : A [ [0 1] [10 20] [100 3000]]`);
        test(`    : A [[ 0 1] [10 20 ] [ 100 3000]]`);
        test(`    : A [[ 0 1 ] [ 10 20 ] [ 100 3000]]`);
        test(`    : A [[ 0 1] [10 20 ] [100 3000]]`);
        test(`    : A [[ 0 1] [10 20 ] [ 100 3000]]`);
      });

      describe('wide domain', function () {

        test(`    : A *`);
        test(`    : A  *`);
        test(`    : A * 	`);
      });

      describe('literal domains', function () {

        test(`    : A 15`);
        test(`    : A  1000`);
        test(`    : A 0 	`);
        test(`    : A 100000000 	`);
      });
    });
    describe('  - list', function () {

      describe('  - var with priority list', function () {

        test(`    : A [0 10] @list prio(5 8 10 1)`);
        test(`    : A [0 10] @list prio(5  8 10 1)`);
        test(`    : A [0 10] @list prio(5, 8, 10, 1)`);
        test(`    : A [0 10] @list prio(5, 8 10, 1)`);
        test(`    : A [0 10] @list prio( 5, 8 10, 1 )`);
        test(`    : A [0 10] @list   prio(5 8 10 1)`);
      });
    });
    describe('- constraint', function () {

      describe('  - distinct', function () {

        describe('simple distincts', function () {

          test(`
            : A [0 10]
            : B [0 10]
            : C [0 10]
            distinct(A B C)
          `);
          test(`    : A [0 10]
    : B [0 10]
    : C [0 10]
    distinct( A, B C)`);
        });

        describe('distinct with one constant', function () {

          test(`    : A [0 10]
    : B [0 10]
    distinct(A 5 B)`);
          test(`    : A [0 10]
    : B [0 10]
    distinct( A, 5 B)`);
        });

        describe('distinct with two constants', function () {

          test(`    : A [0 10]
    distinct( 3 A 8)`);
          test(`    : A [0 10]
    distinct( 3, A 8 )`);
        });

        describe('distinct with one var', function () {

          test(`    : A [0 10]
    distinct(A)`);
        });

        describe('distinct with two vars', function () {

          test(`    : A [0 10]
    : B [0 10]
    distinct(A B)`);
          test(`    : A [0 10]
    : B [0 10]
    distinct(A ,B)`);
        });
      });
      describe('  - nall', function () {

        describe('simple nalls', function () {

          test(`    : A [0 10]
    : B [0 10]
    : C [0 10]
    : R [0 0]
    R = product(A B C)`);
          test(`    : A [0 10]
    : B [0 10]
    : C [0 10]
    nall(A B C)`);
        });
      });
      describe('  - simple cops', function () {

        describe('    - method=eq', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A == B`);
          });

          describe('var and constant args', function () {

            testr(`
              : A [0 1]
              A == 5
            `);
          });

          describe('constant and var args', function () {

            testr(`
              : B [0 1]
              5 == B
            `);
          });

          describe('two constants', function () {

            test(`        5 == 5`);
          });

          describe('domain literal left', function () {

            test(`      : A [1 10]
      [0 1] == A`);
          });

          describe('domain literal right', function () {

            test(`      : A [1 10]
      A == [0 1]`);
          });
        });
        describe('    - method=neq', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A != B`);
          });

          describe('var and constant args', function () {

            test(`        : A [0 1]
        A != 5`);
          });

          describe('constant and var args', function () {

            test(`        : B [0 1]
        5 != B`);
          });

          describe('two constants', function () {

            testr(`        5 != 5`);
          });

          describe('domain literal left', function () {

            test(`      : A [1 10]
      [0 1] != A`);
          });

          describe('domain literal right', function () {

            test(`      : A [1 10]
      A != [0 1]`);
          });
        });
        describe('    - method=lt', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A < B`);
          });

          describe('var and constant args', function () {

            test(`        : A [0 1]
        A < 5`);
          });

          describe('constant and var args', function () {

            testr(`        : B [0 1]
        5 < B`);
          });

          describe('two constants', function () {

            testr(`        5 < 5`);
          });

          describe('domain literal left', function () {

            test(`      : A [1 10]
      [0 1] < A`);
          });
        });
        describe('    - method=lte', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A <= B`);
          });

          describe('var and constant args', function () {

            test(`        : A [0 1]
        A <= 5`);
          });

          describe('constant and var args', function () {

            testr(`        : B [0 1]
        5 <= B`);
          });

          describe('two constants', function () {

            test(`        5 <= 5`);
          });

          describe('domain literal left', function () {

            test(`      : A [1 10]
      [0 1] <= A`);
          });

          describe('domain literal right', function () {

            test(`      : A [1 10]
      A <= [0 1]`);
          });
        });
        describe('    - method=gt', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A > B`);
          });

          describe('var and constant args', function () {

            testr(`        : A [0 1]
        A > 5`);
          });

          describe('constant and var args', function () {

            test(`        : B [0 1]
        5 > B`);
          });

          describe('two constants', function () {

            testr(`        5 > 5`);
          });

          describe('domain literal right', function () {

            test(`      : A [1 10]
      A > [0 1]`);
          });
        });
        describe('    - method=gte', function () {

          describe('simple var args', function () {

            test(`        : A [0 1]
        : B [0 1]
        A >= B`);
          });

          describe('var and constant args', function () {

            testr(`        : A [0 1]
        A >= 5`);
          });

          describe('constant and var args', function () {

            test(`        : B [0 1]
        5 >= B`);
          });

          describe('two constants', function () {

            test(`        5 >= 5`);
          });

          describe('domain literal left', function () {

            test(`      : A [1 10]
      [0 1] >= A`);
          });

          describe('domain literal right', function () {

            test(`      : A [1 10]
      A >= [0 1]`);
          });
        });
      });

      describe('  - logic ops', function () {

        describe('with bools [or]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A | B`);
        });

        describe('with constant right [or]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A | 1`);
        });

        describe('with two constants [or]', function () {

          test(`          : A [0 1]
          : B [0 1]
          1 | 0`);
        });

        describe('with constant left [or]', function () {

          test(`          : B [0 1]
          1 | B`);
        });

        describe('with bools [nor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A !| B`);
        });

        describe('with constant right [nor]', function () {

          testr(`          : A [0 1]
          : B [0 1]
          A !| 1`);
        });

        describe('with two constants [nor]', function () {

          testr(`          : A [0 1]
          : B [0 1]
          1 !| 0`);
        });

        describe('with constant left [nor]', function () {

          testr(`          : B [0 1]
          1 !| B`);
        });

        describe('with bools [xor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A ^ B`);
        });

        describe('with constant right [xor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A ^ 1`);
        });

        describe('with two constants [xor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          1 ^ 0`);
        });

        describe('with constant left [xor]', function () {

          test(`          : B [0 1]
          1 ^ B`);
        });

        describe('with bools [xnor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A !^ B`);
        });

        describe('with constant right [xnor]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A !^ 1`);
        });

        describe('with two constants [xnor]', function () {

          testr(`          : A [0 1]
          : B [0 1]
          1 !^ 0`);
        });

        describe('with constant left [xnor]', function () {

          test(`          : B [0 1]
          1 !^ B`);
        });

        describe('with bools [imp]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A -> B`);
        });

        describe('with constant right [imp]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A -> 1`);
        });

        describe('with two constants [imp]', function () {

          testr(`          : A [0 1]
          : B [0 1]
          1 -> 0`);
        });

        describe('with constant left [imp]', function () {

          test(`          : B [0 1]
          1 -> B`);
        });

        describe('with bools [nimp]', function () {

          test(`          : A [0 1]
          : B [0 1]
          A !-> B`);
        });

        describe('with constant right [nimp]', function () {

          testr(`          : A [0 1]
          : B [0 1]
          A !-> 1`);
        });

        describe('with two constants [nimp]', function () {

          test(`          : A [0 1]
          : B [0 1]
          1 !-> 0`);
        });

        describe('with constant left [nimp]', function () {

          test(`          : B [0 1]
          1 !-> B`);
        });
      });

      describe('  - simple assignments', function () {

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A ==? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 ==? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A ==? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A ==? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 ==? 8`);
        });

        describe('assignment where B and C are constants', function () {

          testr(`        : A [0 1]
        1 = A ==? 8`);
        });

        describe('assignment where A and C are constants', function () {

          testr(`        : B [0 1]
        1 = 4 ==? B`);
        });

        describe('assignment with only constants', function () {

          test(`        1 = 4 ==? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A ==? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A ==? B
        C == [0 1]`);
        });

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A !=? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 !=? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A !=? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A !=? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 !=? 8`);
        });

        describe('assignment where B and C are constants', function () {

          test(`        : A [0 1]
        1 = A !=? 8`);
        });

        describe('assignment where A and C are constants', function () {

          test(`        : B [0 1]
        1 = 4 !=? B`);
        });

        describe('assignment with only constants', function () {

          testr(`        1 = 4 !=? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A !=? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A !=? B
        C == [0 1]`);
        });

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A <? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 <? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A <? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A <? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 <? 8`);
        });

        describe('assignment where B and C are constants', function () {

          test(`        : A [0 1]
        1 = A <? 8`);
        });

        describe('assignment where A and C are constants', function () {

          testr(`        : B [0 1]
        1 = 4 <? B`);
        });

        describe('assignment with only constants', function () {

          testr(`        1 = 4 <? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A <? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A <? B
        C == [0 1]`);
        });

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A <=? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 <=? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A <=? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A <=? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 <=? 8`);
        });

        describe('assignment where B and C are constants', function () {

          test(`        : A [0 1]
        1 = A <=? 8`);
        });

        describe('assignment where A and C are constants', function () {

          testr(`        : B [0 1]
        1 = 4 <=? B`);
        });

        describe('assignment with only constants', function () {

          test(`        1 = 4 <=? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A <=? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A <=? B
        C == [0 1]`);
        });

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A >? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 >? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A >? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A >? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 >? 8`);
        });

        describe('assignment where B and C are constants', function () {

          testr(`        : A [0 1]
        1 = A >? 8`);
        });

        describe('assignment where A and C are constants', function () {

          test(`        : B [0 1]
        1 = 4 >? B`);
        });

        describe('assignment with only constants', function () {

          testr(`        1 = 4 >? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A >? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A >? B
        C == [0 1]`);
        });

        describe('assignment with vars', function () {

          test(`        : A [0 1]
        : B [0 1]
        : C [0 1]
        C = A >=? B`);
        });

        describe('assignment where A is a constant', function () {

          test(`        : B [0 1]
        : C [0 1]
        C = 5 >=? B`);
        });

        describe('assignment where B is a constant', function () {

          test(`        : A [0 1]
        : C [0 1]
        C = A >=? 5`);
        });

        describe('assignment where C is a constant', function () {

          test(`        : A [0 1]
        : B [0 1]
        1 = A >=? B`);
        });

        describe('assignment where A and B are constants', function () {

          test(`        : C [0 1]
        C = 5 >=? 8`);
        });

        describe('assignment where B and C are constants', function () {

          testr(`        : A [0 1]
        1 = A >=? 8`);
        });

        describe('assignment where A and C are constants', function () {

          test(`        : B [0 1]
        1 = 4 >=? B`);
        });

        describe('assignment with only constants', function () {

          test(`        1 = 4 >=? 4`);
        });

        describe('assignment where C explicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A >=? B
        C == [0 1]`);
        });

        describe('assignment where C implicit', function () {

          test(`        : A [0 1]
        : B [0 1]
        C = A >=? B
        C == [0 1]`);
        });
      });

      describe('  - groups', function () {

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B ==? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) ==? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B ==? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B ==? C) ==? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B ==? (C ==? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B ==? (C ==? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A ==? B) = (C ==? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A ==? B) = C ==? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A ==? B) == (C ==? D)`);
        });

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B !=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) !=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B !=? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B !=? C) !=? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B !=? (C !=? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B !=? (C !=? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A !=? B) = (C !=? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A !=? B) = C !=? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A !=? B) == (C !=? D)`);
        });

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B <? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) <? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B <? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B <? C) <? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B <? (C <? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B <? (C <? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <? B) = (C <? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <? B) = C <? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <? B) == (C <? D)`);
        });

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B <=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) <=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B <=? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B <=? C) <=? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B <=? (C <=? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B <=? (C <=? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <=? B) = (C <=? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <=? B) = C <=? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A <=? B) == (C <=? D)`);
        });

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B >? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) >? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B >? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B >? C) >? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B >? (C >? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B >? (C >? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >? B) = (C >? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >? B) = C >? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >? B) == (C >? D)`);
        });

        describe('    - unnecessary group', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        (A) = B >=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = (B) >=? C`);
          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        A = B >=? (C)`);
        });

        describe('    - nested reifier left', function () {

          testnv(`        : A [0 1]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        A = (B >=? C) >=? D`);
        });

        describe('    - nested reifier right', function () {

          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = B >=? (C >=? D)`);
          testnv(`        : A [0 1]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        A = (B >=? (C >=? D))`);
        });

        describe('    - nested reifier result', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >=? B) = (C >=? D)`);
          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >=? B) = C >=? D`);
        });

        describe('    - not to be confused with eq', function () {

          testnv(`        : A [0 3]
        : B [0 3]
        : C [0 3]
        : D [0 3]
        (A >=? B) == (C >=? D)`);
        });
      });

      describe('  - product', function () {

        describe('one arg', function () {

          test(`        : A [0 10]
        : S [0 100]
        S = product(A)`);
        });

        describe('two args', function () {

          test(`        : A [0 10]
        : B [0 10]
        : S [0 100]
        S = product(A B)`);
        });

        describe('three args', function () {

          test(`        : A [0 10]
        : B [0 10]
        : C [0 10]
        : S [0 100]
        S = product(A B C)`);
        });

        describe('with a constant', function () {

          test(`        : A [0 10]
        : C [0 10]
        : S [0 100]
        S = product(A 5 C)`);
        });

        describe('only constants', function () {

          test(`        : S [0 100]
        S = product( 1 2 3)`);
        });

        describe('op=op with constants without result', function () {

          test(`        product(1 2 3) = product( 1 2 3)`);
        });

        describe('op=op with vars', function () {

          test(`        : A [0 10]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        : E [0 10]
        : F [0 10]
        product(A B C) = product(D E F)`);
        });
      });
      describe('  - sum', function () {

        describe('one arg', function () {

          test(`        : A [0 10]
        : S [0 100]
        S = sum(A)`);
        });

        describe('two args', function () {

          test(`        : A [0 10]
        : B [0 10]
        : S [0 100]
        S = sum(A B)`);
        });

        describe('three args', function () {

          test(`        : A [0 10]
        : B [0 10]
        : C [0 10]
        : S [0 100]
        S = sum(A B C)`);
        });

        describe('with a constant', function () {

          test(`        : A [0 10]
        : C [0 10]
        : S [0 100]
        S = sum(A 5 C)`);
        });

        describe('only constants', function () {

          test(`        : S [0 100]
        S = sum( 1 2 3)`);
        });

        describe('op=op with constants without result', function () {

          test(`        sum(1 2 3) = sum( 1 2 3)`);
        });

        describe('op=op with vars', function () {

          test(`        : A [0 10]
        : B [0 10]
        : C [0 10]
        : D [0 10]
        : E [0 10]
        : F [0 10]
        sum(A B C) = sum(D E F)`);
        });
      });
    });

    describe('- @rules', function () {

      describe('val-strat', function () {

        test(`    @custom val-strat max`);
        test(`    @custom val-strat = max`);
      });

      describe('targets', function () {

        test(`    @custom targets all`);
        test(`    @custom targets = all`);
      });

      describe('targets', function () {

        test(`
          : A, B, C [0 1]
          @custom targets (A B C)
        `);
      });

      describe('all var strats', function () {

        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat naive`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat min`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat max`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat throw`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat size`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat naive`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = naive`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = min`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = max`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = throw`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = size`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat = naive`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat (A B)`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat (A, B)`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat inverted (A B)`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat list(A B)`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat list (A B)`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat inverted list (A B)`);
      });

      describe('all var fallback strats', function () {

        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat naive
    @custom var-strat fallback naive`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat min
    @custom var-strat max
    @custom var-strat throw`);
        test(`    : A [0 1]
    : B [0 1]
    @custom var-strat max
    @custom var-strat fallback = naive
    @custom var-strat fallback throw`);
      });
    });
  });

  describe('regressions', function () {

    it('should solve an "anonymous" iseq comparison', function () {
      // C should never be 2 because the iseq is anonymous and
      // that should generate a [0 1] domain for its result
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 2]
        (A ==? B) == C
      `, undefined, {skipVerify: true}); // no complex
    });

    it('should solve an eq between two anonymous iseqs', function () {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        (A ==? B) == (C ==? D)
      `, undefined, {skipVerify: true}); // no complex
    });

    describe('should set anonymous reifier vars to strict bool domain (like multiverse expects)', function () {

      // all reifiers have the same number of outcomes
      function testBin(op) {
        it(`for ${op}`, function () {
          verify(`
            : A = [1,3,5,6]
            R = A ${op} 3
          `, undefined, {skipVerify: true}); // verify cant handle anonymous R
        });
      }

      testBin('==?');
      testBin('!=?');
      testBin('<?');
      testBin('<=?');
      testBin('==?');
      testBin('>?');
      testBin('>=?');

      // all reifiers have the same number of outcomes
      function testCall(op) {
        it(`for ${op}`, function () {
          verify(`
            : A = [1,3 5,6]
            R = ${op}(A 3)
          `, undefined, {skipVerify: true}); // verify cant handle anonymous R
        });
      }

      testCall('all?');
      testCall('nall?');
      testCall('none?');
    });
  });
});
