import {verify} from 'fdv/verifier';

describe('fdh/specs/dsl2ml.spec', function() {

  it('should parse trivial case', function() {
    verify(`
      : A *
      A == 5
    `);
  });

  it('should work with super small dsl', function() {
    // this should require START+EQ+STOP = 1+4+1 = 6 bytes and input is 4
    verify(`
      : A, B *
      nall(A B)
    `);
  });

  it('should not try to parse a cop after var EOF', function() {
    // this should require START+EQ+STOP = 1+4+1 = 6 bytes and input is 4
    verify(`
      : A, B 0
      A == B`
    ); // deliberately not properly formatted!
  });

  it('should not try to parse a cop after lit EOF', function() {
    // this should require START+EQ+STOP = 1+4+1 = 6 bytes and input is 4
    verify(`
      : A *
      A == 5
    `);
  });

  describe('whitespace', function() {

    it('should parse a comment after a constraint', function() {
      verify(`
        : A [0 10]
        A > 5 # should remove anything 5 and lower
      `);
    });

    it('should throw for bad stuff', function() {
      expect(_ => verify(`
        : A [0 10]
        A > 5 x # should not have done that
      `)).to.throw('Expected EOL');
    });
  });

  describe('var declarations', function() {

    it('should work', function() {
      verify(`
        : A [0 10]
      `);
    });

    describe('unquoted var names', function() {

      function numstarttest(n) {
        it('should not start with a number', function() {
          expect(_ => verify(`
            : ${n}A [0 10]
          `)).to.throw('Unquoted ident cant start with number');
        });
      }
      for (let i = 0; i < 10; ++i) numstarttest(i);

      it('should work', function() {
        verify(`
          : A [0 10]
        `);
      });

      it('should see eof case', function() {
        expect(_ => verify(`
          : `
        )).to.throw('Expected to parse identifier, found none');
      });
    });

    describe('single quoted var names', function() {

      it('should allow squoted vars', function() {
        verify(`
          : 'A B' [0 10]
          'A B' > 5
        `, undefined, {skipVerify: true}); // verifier doesnt know about quoted vars
      });

      it('should throw on eol midway a squoted var', function() {
        expect(_ => verify(`
          : 'A
          B' [0 10]
        `, undefined, {skipVerify: true})).to.throw('Quoted identifier');
      });

      it('should throw on eof midway a squoted var', function() {
        expect(_ => verify(`
          : 'A B`
        )).to.throw('Quoted identifier');
      });

      it('should throw on empty string as var', function() {
        expect(_ => verify(`
          : '' [0 10]
        `)).to.throw('Expected to parse identifier, found none');
      });
    });

    describe('modifiers', function() {

      describe('simple ones', function() {

        it('should parse', function() {
          verify(`
            : A [0 10] @max
            A > 5
          `);
        });

        it('should parse', function() {
          verify(`
            : A [0 10] @min
            A > 5
          `);
        });

        it('should parse', function() {
          verify(`
            : A [0 10] @mid
            A > 5
          `);
        });

        //it('should parse', function() {
        //  expect(_ => verify(`
        //    : A [0 10] @minMaxCycle
        //    A > 5
        //  `)).to.throw('TODO: implement this modifier');
        //});

        it('should parse', function() {
          verify(`
            : A [0 10] @naive
            A > 5
          `);
        });

        //it('should parse', function() {
        //  expect(_ => verify(`
        //    : A [0 10] @splitMax
        //    A > 5
        //  `)).to.throw('TODO: implement this modifier');
        //});
        //
        //it('should parse', function() {
        //  expect(_ => verify(`
        //    : A [0 10] @splitMin
        //    A > 5
        //  `)).to.throw('TODO: implement this modifier');
        //});

        it('should throw for unknowns', function() {
          expect(_ => verify(`
            : A [0 10] @nope
            A > 5
          `)).to.throw('implement me (var mod)');
        });
      });

      describe('@list', function() {

        it('should parse', function() {
          verify(`
            : A [0 10] @list prio(5 8 10 1)
            A > 5
          `);
        });

        it('should have a list with at least one number', function() {
          expect(_ => verify(`
            : A [0 10] @list prio()
            A > 5
          `)).to.throw('Expected to parse a list of at least some numbers');
        });

        it('should @list must have prio', function() {
          expect(_ => verify(`
            : A [0 10] @list
            A > 5
          `)).to.throw('Expecting the priorities');
        });
      });
    });

    it('should not allow var decl after using it implicitly', function() {
      expect(_ => verify(`
        A == 5
        : A [0 1]
      `)).to.throw('CONSTRAINT_VARS_SHOULD_BE_DECLARED');
    });
  });

  describe('constraints', function() {

    describe('isnone', function() {

      it('should exist', function() {
        verify(`
          : A,B,C [0 1]
          A = none?(B C)
        `);
      });

      it('shorthand', function() {
        verify(`
          : A,B,C [0 1]
          A = B !|? C
        `);
      });
    });

    describe('some', function() {

      it('should exist', function() {
        verify(`
          : A,B,C [0 1]
          some(A B C)
        `);
      });

      it('shorthand', function() {
        verify(`
          : A,B [0 1]
          A | B
        `);
      });
    });

    describe('issome', function() {

      it('should exist', function() {
        verify(`
          : A,B,C [0 1]
          A = some?(B C)
        `);
      });

      it('shorthand', function() {
        verify(`
          : A,B,C [0 1]
          A = B |? C
        `);
      });
    });

    describe('xnor', function() {

      it('should accept binary op', function() {
        verify(`
          : A,B [0 1]
          A !^ B
        `);
      });

      it('should accept list op', function() {
        verify(`
          : A,B,C,D,E [0 1]
          xnor(A B C D E)
        `);
      });

      it('should accept list op with 2 elements', function() {
        verify(`
          : A,B [0 1]
          xnor(A B)
        `);
      });

      it('should accept list op with 1 element', function() {
        verify(`
          : A [0 1]
          xnor(A)
        `);
      });
    });

    describe('none / nor', function() {

      it('should exist', function() {
        verify(`
          : A,B [0 1]
          A !| B
        `);
      });

      it('should exist', function() {
        verify(`
          : A,B,C [0 1]
          none(A B C)
        `);
      });
    });

    describe('imp', function() {

      it('should exist', function() {
        verify(`
          : A,B [0 1]
          A -> B
        `);
      });
    });

    describe('nimp', function() {

      it('should exist', function() {
        verify(`
          : A,B [0 1]
          A !-> B
        `);
      });
    });

    describe('diff', function() {

      it('should support diff()', function() {
        verify(`
          : A,B,C,D [0 3]
          diff(A B C D)
        `);
      });

      it('should support distinct() for legacy reasons', function() {
        verify(`
          : A,B,C,D [0 3]
          distinct(A B C D)
        `);
      });

      it('should support diff(A)', function() {
        verify(`
          : A [0 1]
          diff(A)
        `);
      });

      it('should support diff(A B)', function() {
        verify(`
          : A,B [0 1]
          diff(A B)
        `);
      });

      it('should require at least a vexpr', function() {
        expect(_ => verify(`
          @custom var-strat throw
          diff()
        `)).to.throw('Expecting at least one expression');
      });
    });

    describe('islte', function() {

      describe('constants', function() {

        it('should morph boolean constant case v1 to diff', function() {
          verify(`
            @custom var-strat throw
            : A [0 1]
            : R [0 1]
            R = A <=? 0
            # => A != R
            # => A ^ R
            # => should just solve...
            @custom noleaf A R
          `, 'xor');
        });

        it('should solve boolean constant case v2', function() {
          verify(`
            @custom var-strat throw
            : A [0 1]
            : R [0 1]
            R = A <=? 1
            @custom noleaf A R
          `);
        });

        it('should solve boolean constant case v3', function() {
          verify(`
            @custom var-strat throw
            : B [0 1]
            : R [0 1]
            R = 0 <=? B
            @custom noleaf B R
          `);
        });

        it('should solve boolean constant case v4', function() {
          verify(`
            @custom var-strat throw
            : B [0 1]
            : R [0 1]
            R = 1 <=? B
            @custom noleaf B R
          `);
        });
      });
    });

    describe('isall', function() {

      it('should properly compile an isall and literal assignment', function() {
        verify(`
          @custom var-strat throw
          : A, B, R [0 1]
          R = all?(A B)
          A = 1
        `);
      });

      it('shorthand', function() {
        verify(`
          : A,B,C [0 1]
          A = B &? C
        `);
      });
    });

    describe('isnall', function() {

      it('should support', function() {
        verify(`
          @custom var-strat throw
          : A, B, R [0 1]
          R = nall?(A B)
        `);
      });

      it('shorthand', function() {
        verify(`
          : A,B,C [0 1]
          A = B !&? C
        `);
      });
    });

    describe('sum', function() {

      it('should parse trivial case', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [20 30]
          : C [59 100]
          : D [100, 110]
          D = sum(A B C)
          @custom noleaf A B C
        `, 'sum');
      });
    });

    describe('jmp32', function() {

      function test(directive, desc) {
        it('should ' + desc, function() {
          verify(`
            @custom var-strat throw
            : A, B, R [0 1]
            R = all?(A B)
            A = 1
            ${directive}
          `);
        });
      }

      test('', 'solve base case (without a free directive)');
      test('@custom free 65520', 'properly compile a jump covering 0xfff0');
      test('@custom free 65535', 'properly compile a jump covering 0xffff');
      test('@custom free 65536', 'properly compile a jump covering 0x10000');
      test('@custom free 100000', 'properly compile a jump covering 100k');
    });

    describe('group', function() {

      it('should init the anonymous vars of grouped constraints properly', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 10]
          (A ==? B) != (A + B)
        `, 'diff,issame,sum', {skipVerify: true})
        // note: __1 and __2 should be bool and something non-bool
      });

      it('should init the anonymous vars of grouped constraints properly', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 10]
          C = (A + B)
        `, 'sum', {skipVerify: true}); // verifier cant handle this
        // note: __1 and __2 should be bool and something non-bool
      });

      it('should allow wrapped single vexpr', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 10]
          C = (A)
        `, undefined, {skipVerify: true}); // verifier cant handle this
      });

      it('should detect open ended group at eol', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B, C [0 10]
          C = (A
        `)).to.throw('Expecting right paren or rop');
      });

      it('should detect open ended group at eof', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B, C [0 10]
          C = (A`
        )).to.throw('Expecting right paren or rop');
      });

      it('should detect bad rop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B, C [0 10]
          C = (A % B)
        `)).to.throw('Expecting right paren or rop');
      });
    });

    describe('lists/args', function() {

      it('should create a default parameter for lists', function() {
        verify(`
          : A,B,C [0 10]
          R = sum(A B C)
        `);
      });

      it('should create a nonbool default parameter for lists', function() {
        verify(`
          : A,B,C [0 10]
          (sum(A B C)) > 10
          @custom var-strat throw
        `, 'sum', {skipVerify: true}); // verifier cant handle this
      });

      it('should create a bool default parameter for lists v1', function() {
        verify(`
          : A,B,C [0 10]
          (A ==? B) != C
          @custom var-strat throw
          @custom noleaf A B C
        `, 'diff,issame', {skipVerify: true}); // verifier cant handle this
      });

      it('should create a bool default parameter for lists v2', function() {
        verify(`
          : A,B,C [0 10]
          C != (A ==? B)
          @custom var-strat throw
          @custom noleaf A B C
        `, 'diff,issame', {skipVerify: true}); // verifier cant handle this
      });

      it('should create a bool default parameter for lists v3', function() {
        verify(`
          : A,B,C [0 10]
          C != (all?(A B))
          @custom var-strat throw
          @custom noleaf A B C
        `, 'diff,isall', {skipVerify: true}); // verifier cant handle this
      });
    });

    describe('edge cases', function() {

      it('should not allow a simple identifier at eof', function() {
        expect(_ => verify(`
          : A [0 10]
          A`)).to.throw('Expected to parse a cop but reached eof instead');
      });

      it('should not allow a simple literal at eof', function() {
        expect(_ => verify(`
          : A [0 10]
          15`)).to.throw('Expected to parse a cop but reached eof instead');
      });

      it('should not allow a simple domain at eof', function() {
        expect(_ => verify(`
          : A [0 10]
          [0 10]`)).to.throw('Expected to parse a cop but reached eof instead');
      });

      it('should allow a complex expression at eof', function() {
        verify(`
          : A [0 10]
          A > 5`
        );
      });

      it('should allow an identifier at eof', function() {
        verify(`
          : A [0 10]
          A > 5`
        );
      });

      it('should allow a domain at eof', function() {
        verify(`
          : A [0 10]
          A > [0 5]`
        );

        verify(`
          : A [0 10]
          A > [0 5]`
        );
      });

      it('should detect bad op', function() {
        expect(_ => verify(`
          : A [0 10]
          A +- B
        `)).to.throw('Unknown cop');
      });

      it('should init reifier anon R to bool ==?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A ==? B
        `);
      });

      it('should init reifier anon R to bool !=?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A !=? B
        `);
      });

      it('should init reifier anon R to bool <?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A <? B
        `);
      });

      it('should init reifier anon R to bool <=?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A <=? B
        `);
      });

      it('should init reifier anon R to bool all?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = all?(A B)
        `);
      });

      it('should init reifier anon R to bool nall?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = nall?(A B)
        `);
      });

      it('should init reifier anon R to bool none?', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = none?(A B)
        `, 'isnone'); // TODO: add a cutter for isnone..?
      });

      it('should expect a full != when cop is just a !', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A ! B
        `)).to.throw('Unknown cop that starts');
      });

      it('should not allow a comment where a cop is expected', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A # no
        `)).to.throw('Expected to parse a cop but found a comment');
      });

      it('should detect eof when parsing a cop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A !`
        )).to.throw('Unknown cop that starts');
      });

      it('should not allow eof after a single vexpr', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A`)).to.throw('Expected to parse a cop but reached eof');
      });

      it('should expect a full !=? when rop is just a !', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A ! B
        `)).to.throw('invalid rop');
      });

      it('should not allow single = as rop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A = B
        `)).to.throw('Expecting right paren or rop');
      });

      it('should handle unknown rop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          R = A % B
        `)).to.throw('Expecting right paren or rop');
      });

      it('should handle eof at unknown cop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A !`
        )).to.throw('Unknown cop that starts');
      });

      it('should handle unknown cop', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B [0 1]
          A % B
        `)).to.throw('Unknown cop');
      });

      it('should allow commas in list ops', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A = all?(B, C)
        `);
      });

      it('should throw for unknown list ops', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A = crud?(B, C)
        `)).to.throw('Unknown reifier constraint func');
      });

      // cant prevent this due to parsing constraints. so be it.
      //it('should throw for unknown vars where they should be known 1', function() {
      //  expect(_ => Solver.pre(`
      //    @custom var-strat throw
      //    : A, C [0 1]
      //    B == C
      //  `)).to.throw('???');
      //});

      it('should throw for unknown vars where they should be known 2', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, C [0 1]
          C == B
        `)).to.throw('CONSTRAINT_VARS_SHOULD_BE_DECLARED');
      });

      it('should throw for unknown vars where they should be known 3', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, C [0 1]
          A = B ==? C
        `)).to.throw('CONSTRAINT_VARS_SHOULD_BE_DECLARED');
      });

      it('should throw for unknown vars where they should be known 4', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A, C [0 1]
          A = C !=? B
        `)).to.throw('CONSTRAINT_VARS_SHOULD_BE_DECLARED');
      });
    });

    describe('compound anonymous expression regression', function() {

      it('should parse an issame left without assignment', function() {
        verify(`
          @custom var-strat throw

          : A, B, C [0 10]

          (A ==? B) == C
        `, undefined, {skipVerify: true}); // verifier trips over "complex" cases, which is the point of this test
      });

      it('should parse an issame right without assignment', function() {
        verify(`
          @custom var-strat throw

          : A, B, C [0 10]

          C == (A ==? B)
        `, undefined, {skipVerify: true}); // verifier trips over "complex" cases, which is the point of this test
      });

      it('should parse a single compound issame, compile two issame but no eq (because alias)', function() {
        verify(`
          @custom var-strat throw

          : A, C, X, Y [0 10]

          (A ==? X) == (C ==? Y)

          @custom noleaf A C X
        `, 'issame,issame', {skipVerify: true}); // verifier trips over "complex" cases, which is the point of this test
      });

      it('should parse two double compound issames, compile four issame but no eq (because alias)', function() {
        verify(`
          @custom var-strat throw

          : A, B, C, D, X, Y [0 10]

          (A ==? X) == (C ==? Y)
          (B ==? X) == (D ==? Y)

          @custom noleaf A B C D X Y

        `, 'issame,issame,issame,issame', {skipVerify: true}); // verifier trips over "complex" cases, which is the point of this test
      });
    });
  });

  describe('domains', function() {

    describe('square bracketed', function() {

      it('should parse range [0 10]', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
        `);
      });

      it('should parse range with comma [0, 10]', function() {
        verify(`
          @custom var-strat throw
          : A [0, 10]
        `);
      });

      it('should parse range with double wrap [[0 10]]', function() {
        verify(`
          @custom var-strat throw
          : A [[0, 10]]
        `);
      });

      it('should parse two ranges [0 10 20 30]', function() {
        verify(`
          @custom var-strat throw
          : A [0 10 20 30]
        `);
      });

      it('should parse two ranges [0 10, 20 30]', function() {
        verify(`
          @custom var-strat throw
          : A [0 10, 20 30]
        `);
      });

      it('should parse two ranges double wrapped [[0 10] [20 30]]', function() {
        verify(`
          @custom var-strat throw
          : A [[0 10] [20 30]]
        `);
      });

      it('should parse two ranges double wrapped with comma [[0 10], [20 30]]', function() {
        verify(`
          @custom var-strat throw
          : A [[0 10], [20 30]]
        `);
      });

      it('should parse two ranges double wrapped with comma [[0, 10], [20, 30]]', function() {
        verify(`
          @custom var-strat throw
          : A [[0, 10], [20, 30]]
        `);
      });

      it('should not accepted mixed bracketing style [[0 1] 3 4]', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A [[0 1] 3 4]
        `)).to.throw('Expected domain-end');
      });

      it('should not accepted mixed bracketing style [0 1 [3 4]]', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A [0 1 [3 4]]
        `)).to.throw('Expecting to parse a number');
      });

      it('should not accepted weird stuff', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A [#0 1 [3 4]]
        `)).to.throw('Expecting to parse a number but did not find any digits');
      });

      it('should throw for unknown domain starts', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A nope [0 10]
        `)).to.throw('Expecting valid domain start');
      });
    });
  });

  describe('@custom', function() {

    it('should allow an optional equal', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        @custom noleaf = A
      `);
    });

    it('should throw for unknown custom names', function() {
      expect(_ => verify(`
        @custom var-strat throw
        : A [0 1]
        @custom failme X
      `)).to.throw('Unsupported custom rule');
    });

    it('should throw for unknown at names', function() {
      expect(_ => verify(`
        @custom var-strat throw
        : A [0 1]
        @doesnt exist
      `)).to.throw('Unknown atrule');
    });

    it('@custom with comment eof', function() { // tofix
      verify(`
        : A, B, C 1
        @custom noleaf A B C # this is the end`
      );
    });

    it('@custom with comment eol', function() { // tofix
      verify(`
        : A, B, C 1
        @custom noleaf A B C # this is the end
      `);
    });

    describe('var-strat', function() {

      it('should support var-strat', function() {
        verify(`
          @custom var-strat naive
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat size
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat min
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat max
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat ( A )
          : A [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat ( A C B )
          : A [0 1]
          : B [0 1]
          : C [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat list ( A C B )
          : A [0 1]
          : B [0 1]
          : C [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat inverted ( A C B )
          : A [0 1]
          : B [0 1]
          : C [0 1]
        `);
      });

      it('should support var-strat', function() {
        verify(`
          @custom var-strat inverted list ( A C B )
          : A [0 1]
          : B [0 1]
          : C [0 1]
        `);
      });

      describe('fallback', function() {

        it('should support fallback var-strat', function() {
          verify(`
            : A [0 1]
            : B [0 1]
            @custom var-strat naive
            @custom var-strat fallback naive
          `);
        });

        it('should support double fallback var-strat', function() {
          verify(`
            : A [0 1]
            : B [0 1]
            @custom var-strat min
            @custom var-strat max
            @custom var-strat throw
          `);
        });

        it('should support double fallback var-strat', function() {
          verify(`
            : A [0 1]
            : B [0 1]
            @custom var-strat max
            @custom var-strat fallback = naive
            @custom var-strat fallback throw
          `);
        });
      });
    });

    describe('set-valdist', function() {

      it('should require valid json', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A [0 1]
          @custom set-valdist A {'a':1}
        `)).to.throw('JSON');
      });
    });

    describe('noleaf', function() {

      it('should NOT eliminate the isall WITH the noleaf hint', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          @custom noleaf A B C
        `, 'isall');
      });

      it('should eliminate the isall without the noleaf hint', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          @custom noleaf B C
        `);
      });

      it('should NOT eliminate the isalls WITH the noleaf hint', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          : D,E,F [0 1]
          D = all?(E F)
          @custom noleaf A, D
        `, 'isall,isall');
      });

      it('should eliminate the isalls without the noleaf hint', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          : D,E,F [0 1]
          D = all?(E F)
          #@custom noleaf A D
        `);
      });

      it('should require at least one ident', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          @custom noleaf
        `)).to.throw('Expected to parse');
      });

      it('should not allow a leading comma', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          @custom noleaf , A
        `)).to.throw('Leading comma not supported');
      });
    });

    describe('targets', function() {

      it('should parse an ident list', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B C)
          @custom targets(B C)
        `, undefined, {skipVerify: true}); // verifier will trip over missing A, which is the point of this test
      });

      it('should allow optional commas', function() {
        verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(B , C)
          @custom targets(B C)
        `, undefined, {skipVerify: true}); // verifier will trip over missing A, which is the point of this test
      });

      it('should require at least one ident', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets()
        `)).to.throw('Expected to parse a list of at least some identifiers');
      });

      it('should not allow a leading comma', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(, A B C)
        `)).to.throw('Leading comma not supported');
      });

      it('should not allow a trailing comma at eol', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,
        `)).to.throw('Trailing comma not supported');
      });

      it('should not allow a backtoback commas', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,,B)
        `)).to.throw('Double comma not supported');
      });

      it('should not allow a backtoback comma at eol', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,,
        `)).to.throw('Double comma not supported');
      });

      it('should not allow a trailing comma at eol', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,B,
        `)).to.throw('Trailing comma not supported');
      });

      it('should not allow a trailing comma at eof', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,B,`
        )).to.throw('Trailing comma not supported');
      });

      it('should not allow a backtoback comma at eof', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,,`
        )).to.throw('Double comma not supported');
      });

      it('should expect paren at eol', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,B
        `)).to.throw('Missing target char at eol/eof');
      });

      it('should expect paren at eof', function() {
        expect(_ => verify(`
          @custom var-strat throw
          : A,B,C [0 1]
          A = all?(A B C)
          @custom targets(A,B`
        )).to.throw('Missing target char at eol/eof');
      });

      it('should allow = sign for `all`', function() {
        verify(`
          : A 1
          @custom targets = all
        `);
      });

      it('should not allow a double = sign', function() {
        expect(_ => verify(`
          : A 1
          @custom targets = = all
        `)).to.throw('Unexpected double eq sign');
      });

      it('should not require = sign for `all`', function() {
        verify(`
          : A 1
          @custom targets all
        `);
      });

      it('should allow = for parens', function() {
        verify(`
          : A,B,C [0 1]
          @custom targets = (A,B)
        `);
      });
    });

    describe('free', function() {

      it('should allow free 0', function() {
        verify(`
          @custom var-strat throw
          : A 1
          @custom free 0
        `);
      });

      it('should allow free 1000', function() {
        verify(`
          @custom var-strat throw
          : A 1
          @custom free 1000
        `);
      });

      it('should allow free 100000', function() {
        verify(`
          @custom var-strat throw
          : A 1
          @custom free 100000
        `);
      });
    });

    describe('regular assignment', function() {

      it('regression; parser was blackholing literal assignments', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : C [1 2]
          A = 0
          C = 2
        `);
      });

      it('regression; parser was blackholing regular assignments', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : C 2
          A = C
        `);
      });

      it('should not ignore unsolvable sum assignment', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          A = sum(1 2 3 20)
        `, 'reject');
      });

      it('should not ignore solvable sum assignment', function() {
        verify(`
          @custom var-strat throw
          : A [0 50]
          A = sum(1 2 3 20)
        `);
      });
    });
  });
});
