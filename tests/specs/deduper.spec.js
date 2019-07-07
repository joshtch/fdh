import {verify} from 'fdv/verifier';

describe('fdh/specs/deduper.spec', function() {

  it('should remove duplicate constraints', function() {
    verify(`
      @custom var-strat throw
      : A [0 1]
      : B [0 1]
      A != B
      A != B
      # => A ^ B
      @custom noleaf A B
    `, 'xor');
  });

  describe('infix operators', function() {

    function testInfix(op, name) {
      it('should work with [' + op + ']', function() {
        verify(`
          : A, B [0 10]
          A ${op} B
          A ${op} B

          @custom var-strat throw
          @custom noleaf A B
        `, name);
      });
    }

    testInfix('==');
    testInfix('!=', 'diff');
    testInfix('<', 'lt');
    testInfix('<=', 'lte');
    testInfix('&');
    testInfix('|', 'some');
    testInfix('^', 'xor');
    testInfix('!^');
    testInfix('!&', 'nall');
    testInfix('!|');
    testInfix('->', 'imp');
    testInfix('!->');
  });

  describe('binary ops as prefix', function() {

    function testPrefix(op, throws) {
      it('should work with [' + op + '(AB)]', function() {
        verify(`
          : A, B [0 10]
          ${op}(A B)
          ${op}(A B)

          @custom var-strat throw
          @custom noleaf A B
        `, throws === 'xnor' ? undefined : throws); // xnor pseudo aliasing works on 2 but not more args
      });

      it('should work with [' + op + '(ABCD)]', function() {
        verify(`
          : A, B, C, D [0 10]
          ${op}(A B C D)
          ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D
        `, throws);
      });
    }

    testPrefix('same');
    testPrefix('diff', 'diff');
    testPrefix('all');
    testPrefix('some', 'some');
    testPrefix('xnor', 'xnor'); // this case sh/could solve, though
    testPrefix('nall', 'nall');
    testPrefix('none');
  });

  describe('math ops', function() {

    describe('+ *', function() {

      function test(op, name, orThis) {
        it('should work with [' + op + '] on same R', function() {
          verify(`
            : A, B [0 10]
            : R *
            R = A ${op} B
            R = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, (orThis || name));
        });

        it('should work with [' + op + '] on identical R and S', function() {
          verify(`
            : A, B [0 10]
            : R, S *
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, (orThis || name));
        });

        it('should work with [' + op + '] on partially overlapping R and S', function() {
          verify(`
            : A, B [0 10]
            : R [5, 15]
            : S [15, 30]
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, name);
        });

        it('should reject with [' + op + '] on distinct R and S', function() {
          verify(`
            : A, B [0 10]
            : R [5, 10]
            : S [20, 30]
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, 'reject');
        });
      }

      test('+', 'sum', 'issome');
      test('*', 'product');
    });

    describe('- /', function() {

      function test(op, name) {
        it('should work with [' + op + '] on same R', function() {
          verify(`
            : A, B [0 100]
            : R *
            R = A ${op} B
            R = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, name);
        });

        it('should work with [' + op + '] on identical R and S', function() {
          verify(`
            : A, B [0 100]
            : R, S *
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, name);
        });

        it('should work with [' + op + '] on partially overlapping R and S', function() {
          verify(`
            : A, B [0 100]
            : R [5, 15]
            : S [15, 30]
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, name);
        });

        it('should reject with [' + op + '] on distinct R and S', function() {
          verify(`
            : A, B [0 100]
            : R [5, 10]
            : S [20, 30]
            R = A ${op} B
            S = A ${op} B

            @custom var-strat throw
            @custom noleaf A B R
          `, 'reject');
        });
      }

      test('-', 'minus');
      test('/', 'div');
    });
  });

  describe('simple booly reifiers', function() {

    function test(op, name) {
      it('should work with [' + op + '] on same R', function() {
        verify(`
          : A, B [0 10]
          : R *
          R = A ${op} B
          R = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R
        `, name);
      });

      it('should not work with [' + op + '] on wide R and S', function() {
        verify(`
          : A, B [0 10]
          : R, S *
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name + ',' + name);
      });

      it('should work with [' + op + '] on identical size=2 booly R and S', function() {
        verify(`
          : A, B [0 10]
          : R, S [0 0 50 50]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name);
      });

      it('should work with [' + op + '] on identical bool R and S', function() {
        verify(`
          : A, B [0 10]
          : R, S [0 1]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name);
      });

      it('should not work with [' + op + '] on size=2 different booly R and S', function() {
        verify(`
          : A, B [0 10]
          : R [0 0 20 20]
          : S [0 0 21 21]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name + ',' + name);
      });

      it('should not work with [' + op + '] on size=2 non-booly identical R and S', function() {
        let dsl = `
          : A, B [0 10]
          : R [1 2]
          : S [1 2]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `;

        switch (name) {
          case 'issame':
            // since R and S are truthy it morphs the issame to eq which turns into
            // an alias. the problem basically just implodes :)
            verify(dsl);
            break;
          case 'isdiff':
            // since R and S are truthy, minimizer will morph them both to identical
            // diffs. deduper will dedupe one of them and needs cutter to solve other
            verify(dsl, 'diff');
            break;
          case 'islt':
            // since R and S are truthy, minimizer will morph them both to identical
            // lts. deduper will dedupe one of them and needs cutter to solve other
            verify(dsl, 'lt');
            break;
          case 'islte':
            // since R and S are truthy, minimizer will morph them both to identical
            // ltes. deduper will dedupe one of them and needs cutter to solve other
            verify(dsl, 'lte');
            break;
          default:
            throw new Error('no [' + op + ']');
        }
      });

      it('should not work with [' + op + '] on size=2 booly R and non-booly S', function() {
        let dsl = `
          : A, B [0 10]
          : R [0 1]
          : S [1 2]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `;

        switch (name) {
          case 'issame':
            // ok; since S is truthy, it will rewrite the second issame to an eq which will alias A to B
            // since A == B, R must be truthy and the whole thing solves without the deduper helping
            // solves.
            verify(dsl);
            break;
          case 'isdiff':
            // since S is truthy, it will rewrite the second isdiff to an diff
            // that diff will then dedupe R=A!=B and set R=1, leaving just a diff
            verify(dsl, 'diff');
            break;
          case 'islt':
            // since S is truthy, it will rewrite the second islt to an lt then dedupe the second on it
            verify(dsl, 'lt');
            break;
          case 'islte':
            // since S is truthy, it will rewrite the second islte to an lte then dedupe the second on it
            verify(dsl, 'lte');
            break;
          default:
            throw new Error('no [' + op + ']');
        }
      });

      it('should not work with [' + op + '] on size=2 non-booly R and booly S', function() {
        let dsl = `
          : A, B [0 10]
          : R [1 2]
          : S [0 1]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `;

        switch (name) {
          case 'issame':
            // ok; since R is truthy, it will rewrite the first issame to an eq which will alias A to B
            // since A == B, S must be truthy and the whole thing solves without the deduper helping
            // solves.
            verify(dsl);
            break;
          case 'isdiff':
            // since R is truthy, it will rewrite the first isdiff to an diff
            // that diff will then dedupe S=A!=B and set S=1, leaving just a diff
            verify(dsl, 'diff');
            break;
          case 'islt':
            // since R is truthy, it will rewrite the first islt to an lt then dedupe the second on it
            verify(dsl, 'lt');
            break;
          case 'islte':
            // since R is truthy, it will rewrite the first islte to an lte then dedupe the second on it
            verify(dsl, 'lte');
            break;
          default:
            throw new Error('no [' + op + ']');
        }
      });

      it('should not work with [' + op + '] on partially overlapping R and S', function() {
        verify(`
          : A, B [0 10]
          : R [0 0 5, 15]
          : S [0 0 15, 30]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name + ',' + name);
      });

      // while theoretically possible to dedupe this case, it's just not practical, and so we can't
      it('should dedupe as zero with [' + op + '] on R and S that only share a zero', function() {
        verify(`
          : A, B [0 10]
          : R [0 0 5, 10]
          : S [0 0 20, 30]
          R = A ${op} B
          S = A ${op} B

          @custom var-strat throw
          @custom noleaf A B R S
        `, name + ',' + name);
      });
    }

    test('==?', 'issame');
    test('!=?', 'isdiff');
    test('<?', 'islt');
    test('<=?', 'islte');
  });

  describe('islt islte with lt lte deduping', function() {

    it('should dedupe islt lt on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        R = A <? B
        A < B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should dedupe lt islt on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        A < B
        R = A <? B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should dedupe islte lte on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        R = A <=? B
        A < B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should dedupe lte islte on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        A < B
        R = A <=? B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should dedupe islte lt on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        R = A <=? B
        A < B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should dedupe lt islte on same args', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        A < B
        R = A <=? B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'lt');
    });

    it('should NOT dedupe islt lte on same args because the lte may say A==B while the islt does not', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        R = A <? B
        A <= B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'islt,lte');
    });

    it('should NOT dedupe lte islt on same args because the lte may say A==B while the islt does not', function() {
      verify(`
        : A, B [0 10]
        : R [0 0 5 5]
        A <= B
        R = A <? B

        @custom var-strat throw
        @custom noleaf A B R
      `, 'islt,lte');
    });
  });

  describe('islt islte deduping the reverse', function() {

    it('should detect R=A<?B as a dupe of S=B<=?A and change one to R^S', function() {
      verify(`
        : A, B [0 10]
        : R, S [0 1]
        R = A <? B
        S = B <=? A

        @custom var-strat throw
        @custom noleaf A B R S
      `, 'islt,xor');
    });

    it('should detect R=A<=?B as a dupe of S=B<?A and change one to R^S', function() {
      verify(`
        : A, B [0 10]
        : R, S [0 1]
        R = A <=? B
        S = B <? A

        @custom var-strat throw
        @custom noleaf A B R S
      `, 'islte,xor');
    });
  });

  describe('reifier lists', function() {

    function test(op, name) {
      it('should work with [' + op + '] and a plain dupe R', function() {
        verify(`
          : A, B, C, D [0 10]
          : R [0 1]
          R = ${op}(A B C D)
          R = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R
        `, name);
      });

      it('should work with [' + op + '] on bool R and S', function() {
        verify(`
          : A, B, C, D [0 10]
          : R, S [0 1]
          R = ${op}(A B C D)
          S = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R S
        `, name);
      });

      it('should not work with [' + op + '] on different R and S', function() {
        verify(`
          : A, B, C, D [0 10]
          : R [0 0 5 5]
          : S [0 0 6 6]
          R = ${op}(A B C D)
          S = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R S
        `, name + ',' + name);
      });
    }

    test('all?', 'isall');
    test('nall?', 'isnall');
    test('none?', 'isnone');
  });

  describe('nonreifier result lists', function() {

    function test(op, name) {
      it('should work with [' + op + '] and a plain dupe R', function() {
        verify(`
          : A, B, C, D [0 10]
          : R [0 1000]
          R = ${op}(A B C D)
          R = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R
        `, name);
      });

      it('should work with [' + op + '] on bool R and S', function() {
        verify(`
          : A, B, C, D [0 10]
          : R, S [0 1000]
          R = ${op}(A B C D)
          S = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R S
        `, name);
      });

      it('should work with [' + op + '] on different R and S', function() {
        let dsl = `
          : A, B, C, D [0 1000]
          : R [0 0 500 500]
          : S [0 0 600 600]
          R = ${op}(A B C D)
          S = ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D R S
        `;

        // sum:
        // R and S are made aliases, meaning they can only end up 0 or empty
        // when R is 0, all sum args must be 0 as well and the whole thing
        // collapses to solve with zeroes
        // product:
        // R and S are made aliases, meaning they can only end up 0 or empty
        // with R=0, the product is optimized to a simpler nall() (since at
        // least one of the ops has to be zero for the product to be zero)
        verify(dsl, op === 'sum' ? undefined : 'nall');
      });
    }

    test('sum', 'issome');
    test('product', 'product');
  });

  describe('void lists', function() {

    function test(op) {
      it('should work with [' + op + '] already ordered', function() {
        verify(`
          : A, B, C, D [0 10]
          ${op}(A B C D)
          ${op}(A B C D)

          @custom var-strat throw
          @custom noleaf A B C D
        `, (op === 'distinct' ? 'diff' : op));
      });

      it('should work with [' + op + '] in any order', function() {
        verify(`
          : A, B, C, D [0 10]
          ${op}(B A C D)
          ${op}(A B C D)
          ${op}(D B C A)

          @custom var-strat throw
          @custom noleaf A B C D
        `, (op === 'distinct' ? 'diff' : op));
      });
    }

    test('distinct');
    test('diff');
    test('nall');
    test('some');
    test('xnor');
  });

  it('should detect swapped duplicate constraints', function() {
    verify(`
      @custom var-strat throw
      : A [0 1]
      : B [0 1]
      A != B
      B != A
      # => A ^ B
      @custom noleaf A B
    `, 'xor');
  });

  describe('issame/isdiff', function() {

    describe('only issame', function() {

      it('should remove duplicate issame', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C, D [0 1]
          C = A ==? B
          D = A ==? B
          @custom noleaf A B C D
        `, 'issame');
      });

      it('should not remove duplicate issame when result does not have the same domain', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 0 2 2]
          C = A ==? B
          D = A ==? B

          @custom noleaf A B C D
        `, 'issame,issame');
      });

      it('should remove swapped duplicate issame', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C, D [0 1]
          C = A ==? B
          D = B ==? A
          @custom noleaf A, B, C, D
        `, 'issame');
      });

      it('should not remove swapped duplicate issame on different results', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 0 2 2]
          C = A ==? B
          D = B ==? A
          # note: C becomes 1, D becomes 2, so they should not be eq
          @custom noleaf A, B, C, D
        `, 'issame,issame');
      });

      it('should reject when a dupe issame reifier has a different constant R', function() {
        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          0 = A ==? B
          1 = A ==? B
          # oops
          @custom noleaf A B
        `, 'reject');
      });

      it('should reject when a dupe issame reifier has a constant R and different solved alias', function() {

        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 1
          0 = A ==? B
          C = A ==? B
          # oops
          @custom noleaf A B C
        `, 'reject');
      });

      it('should reject when a dupe issame reifier has a solved var and different constant alias', function() {

        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 0
          C = A ==? B
          1 = A ==? B
          # oops
          @custom noleaf A B C
        `, 'reject');
      });

      it('should reject when a dupe issame reifier has a different solved vars', function() {

        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 0
          : D 1
          C = A ==? B
          D = A ==? B
          # oops
          @custom noleaf A B C D
        `, 'reject');
      });
    });

    describe('only isdiff', function() {

      it('should remove duplicate isdiff', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C, D [0 1]
          C = A !=? B
          D = A !=? B
          @custom noleaf A B C D
        `, 'isdiff');
      });

      it('should not remove duplicate isdiff when result does not have the same domain', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 0 2 2]
          C = A !=? B
          D = A !=? B

          @custom noleaf A B C D
        `, 'isdiff,isdiff');
      });

      it('should remove swapped duplicate isdiff', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C, D [0 1]
          C = A !=? B
          D = B !=? A
          @custom noleaf A, B, C, D
        `, 'isdiff');
      });

      it('should not remove swapped duplicate issame on different results', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 0 2 2]
          C = A !=? B
          D = B !=? A
          # note: C becomes 1, D becomes 2, so they should not be eq
          @custom noleaf A, B, C, D
        `, 'isdiff,isdiff');
      });

      it('should reject when a dupe isdiff reifier has a different constant R', function() {
        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          0 = A !=? B
          1 = A !=? B
          # oops
          @custom noleaf A B
        `, 'reject');
      });

      it('should reject when a dupe isdiff reifier has a constant R and different solved alias', function() {
        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 1
          0 = A !=? B
          C = A !=? B
          # oops
          @custom noleaf A B C
        `, 'reject');
      });

      it('should reject when a dupe isdiff reifier has a solved var and different constant alias', function() {
        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 0
          C = A !=? B
          1 = A !=? B
          # oops
          @custom noleaf A B C
        `, 'reject');
      });

      it('should reject when a dupe isdiff reifier has a different solved vars', function() {
        // if this breaks the output probably changed or the engine improved; this case should result in `false`
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : C 0
          : D 1
          C = A !=? B
          D = A !=? B
          # oops
          @custom noleaf A B C D
        `, 'reject');
      });
    });

    describe('issame+isdiff', function() {

      it('should remove pseudo duplicate issame/isdiff', function() {
        verify(`
          @custom var-strat throw
          : A [2 3]
          : C, D [0 1]
          C = A ==? 2
          D = A !=? 3
          # in this particular case A==?x is equal to A!=?y because A only contains [x x y y]
          # this should lead to conclude C=D,C=A==?x
          @custom noleaf A, C, D
        `, 'issame');
      });

      it('should remove pseudo duplicate isdiff/issame', function() {
        // only the constraints are swapped with isdiff going first
        verify(`
          @custom var-strat throw
          : A [2 3]
          : C, D [0 1]
          D = A !=? 3
          C = A ==? 2
          # in this particular case A==?x is equal to A!=?y because A only contains [x x y y]
          # this should lead to conclude C=D,C=A==?x
          @custom noleaf A C D
        `, 'isdiff');
      });

      it('should not remove pseudo duplicate issame/isdiff when domains do not "booly-match"', function() {
        verify(`
          @custom var-strat throw
          : A [2 3]
          : C [0 1]
          : D [0 0 2 2]
          C = A ==? 2
          D = A !=? 3
          # in this case C != D and if the constraint evals to truthy, C and D should become different values...
          @custom noleaf A, C, D
        `, 'issame');
      });

      it('should not remove pseudo duplicate isdiff/issame when domains do not "booly-match"', function() {
        verify(`
          @custom var-strat throw
          : A [2 3]
          : C [0 1]
          : D [0 0 2 2]
          D = A !=? 3
          C = A ==? 2
          # in this case C != D and if the constraint evals to truthy, C and D should become different values...
          @custom noleaf A, C, D
        `, 'isdiff');
      });
    });
  });

  describe('sum/product', function() {

    it('should alias two sums with same order', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        : E, F *
        E = sum(A B C D)
        F = sum(A B C D)
        @custom noleaf A B C D E F
      `, 'issome');
    });

    it('should alias two sums with different order', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        : E, F *
        E = sum(A B C D)
        F = sum(C D A B)
        @custom noleaf A B C D E F
      `, 'issome');
    });

    it('should alias two products with same order', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [0 10]
        : D, E *
        D = product(A B C)
        E = product(A B C)
        # D==E
        @custom noleaf A B C D E
      `, 'product');
    });

    it('should alias two products with different order', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        : E, F *
        E = product(A B C D)
        F = product(B C D A)
        # E==F
        @custom noleaf A B C D E F
      `, 'product');
    });

    it('should alias a sum with a plus', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : D, E *
        D = sum(A B)
        E = A + B
        @custom noleaf A B D E
      `, 'issome');
    });
  });

  it('should dedupe a contrived dupe (noleaf)', function() {
    verify(`
      @custom var-strat throw
      : A, B, C [0 10]
      A != C
      diff(C B A)
      B == 5 # should remove B from the diff, which can then be deduped
      @custom noleaf A B C
    `, 'diff'); // only one diff because B should already be resolved
  });

  it('should dedupe a contrived dupe (cutter)', function() {
    verify(`
      @custom var-strat throw
      : A, B, C [0 10]
      A != C
      diff(C B A)
      B == 5 # should remove B from the diff, which should morph to a C != A
    `);
  });

  describe('nall/nall', function() {

    it('should eliminate double nalls', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [0 10]
        nall(A B C)
        nall(A B C)
        @custom noleaf A B C
      `, 'nall');
    });

    it('should eliminate swapped double nalls', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [0 10]
        nall(A B C)
        nall(B C A)
        @custom noleaf A B C
      `, 'nall');
    });

    it('should dedupe nall (v1)', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        A !& B
        @custom noleaf A B
      `, 'nall');
    });

    it('should dedupe nall (v2)', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        B !& A
        @custom noleaf A B
      `, 'nall');
    });

    it('should completely remove a deduped nall if there is a dupe nall as well (v1)', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        nall(A A B)
        A !& B
        @custom noleaf A B
      `, 'nall');
    });

    it('should completely remove a deduped nall if there is a dupe nall as well (v2)', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        nall(A A B)
        @custom noleaf A B
      `, 'nall');
    });

    it('should completely remove a deduped nall if there is a dupe nall as well (v3)', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        B !& A
        nall(A A B)
        @custom noleaf A B
      `, 'nall');
    });
  });
});
