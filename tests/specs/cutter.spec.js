import {
  verify,
  _verify,
} from 'fdv/verifier';

describe('fdh/specs/cutter.spec', function() {

  it('should base 1', function() {
    verify(': A [0 1]');
  });

  it('should base 1', function() {
    verify(`
      : A, B [0 1]
      A <= B
    `);
  });

  describe('only diff / neq', function() {

    describe('double bool diff trick', function() {

      it('should reduce two diffs in the boolean space by aliasing the other sides to each other A!=B A!=C', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A != B
          A != C
          # note: this must mean B == C since they are both "not A" and have only two values, the same values
          # one diff should be eliminated by the cutter
          # => A != B, B==C
          # => A ^ B
          @custom noleaf A B C # (the trick doesnt care about this so it'll only prevent leaf cutting)
        `, 'xor');
      });

      it('should reduce two diffs in the boolean space by aliasing the other sides to each other B!=A C!=A', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          B != A
          C != A
          # => A != B, B==C
          # => A ^ B
          # note: this must mean B == C since they are both "not A" and have only two values, the same values
          # one diff should be eliminated by the cutter
          @custom noleaf A B C # (the trick doesnt care about this so it'll only prevent leaf cutting)
        `, 'xor');
      });

      it('should reduce two diffs in the boolean space by aliasing the other sides to each other A!=B C!=A', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A != B
          C != A
          # note: this must mean B == C since they are both "not A" and have only two values, the same values
          # one diff should be eliminated by the cutter
          # => A != B, B==C
          # => A ^ B
          @custom noleaf A B C # (the trick doesnt care about this so it'll only prevent leaf cutting)
        `, 'xor');
      });

      it('should reduce two diffs in the boolean space by aliasing the other sides to each other B!=A A!=C', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          B != A
          A != C
          # note: this must mean B == C since they are both "not A" and have only two values, the same values
          # one diff should be eliminated by the cutter
          # => A != B, B==C
          # => A ^ B
          @custom noleaf A B C # (the trick doesnt care about this so it'll only prevent leaf cutting)
        `, 'xor');
      });

      it('should apply trick regardless of other ops', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A != B
          A != C
          D = sum(A B C)
          @custom noleaf A B C D
        `, 'issome,xor');
      });

      it('should apply trick regardless of other multiple ops', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          A != B
          A != C
          D = sum(A B C)
          E = product(A B B)
          F = all?(A C A)
          G = nall?(B C C)
          @custom noleaf A B C D E F G
        `, 'isall,isnall,issome,product,xor'); // the point is that diff(=>xor) appears only once!
      });

      it('should work with non-bools', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [900 901]
          A != B
          A != C
          @custom noleaf A B C
        `, 'diff');
      });

      it('should work with non-consecutive ranges', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 0 10 10]
          A != B
          A != C
          @custom noleaf A B C
        `, 'xor');
      });
    });

    describe('diff to xor', function() {
      // a diff is a xor if the args are booly pairs and equal
      it('should work on base bool case', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          A != B
          @custom noleaf A B
        `, 'xor');
      });

      it('should work on base booly pair case', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 0 10 10]
          A != B
          @custom noleaf A B
        `, 'xor');
      });
    });

    // dont extend these. they're here for legacy purposes.
    describe('old diff+some trick tests', function() {

      describe('leaf cut', function() {

        it('should morph A!=B, A|B', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            A | C
            # => B -> C, A leaf

            @custom noleaf B C
          `, 'imp');
        });

        it('should morph B!=A, A|B', function() {
          verify(`
            @custom var-strat throw
            : B, A, C [0 1]
            B != A
            A | C
            # -> B -> C, A leaf

            @custom noleaf B C
          `, 'imp');
        });

        it('should morph A!=B, B|A', function() {
          verify(`
            @custom var-strat throw
            : B, C, A [0 1]
            A != B
            C | A
            # -> B -> C, A leaf

            @custom noleaf B C
          `, 'imp');
        });

        it('should not work if the SOME arg isnt bool (that requires xor)', function() {
          verify(`
            @custom var-strat throw
            : C [0 10]
            : B, A [0 1]
            A != B
            C | A
            @custom noleaf B C
          `, 'imp');
        });

        it('should not work if the DIFF arg isnt bool (that requires xor)', function() {
          verify(`
            @custom var-strat throw
            : B [0 10]
            : A, C [0 1]
            A != B
            C | A
            @custom noleaf B C
          `, 'diff,some');
        });

        it('should not work if the shared arg isnt bool (that requires xor)', function() {
          verify(`
            @custom var-strat throw
            : A [0 10]
            : B, C [0 1]
            A != B
            C | A
            @custom noleaf B C
          `, 'diff,some');
        });
      });

      describe('old bool diff inversion tests', function() {
        // note: dont extend these. use the test functions above. they test thoroughly test variations of the same problem

        it('should diff', function() {
          verify(`
            @custom var-strat throw
            : A, B *
            A != B
            A > 10
            @custom noleaf B
          `);
          // two solutions possible; one where A is solved and one where B is solved
        });

        it('should morph DIFF LTE_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            A <= C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve DIFF LTE_LHS', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            A <= C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF LTE_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            C <= A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve DIFF LTE_RHS', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            C <= A
            @custom noleaf B C
          `);
        });

        it('should morph DIFF SOME', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            A | C
            # => B <= C
            # => B -> C
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve DIFF SOME', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            A | C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF NALL', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            A !& C
            # => C <= A
            # => C -> A
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve DIFF NALL', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            A !& C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            A -> C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve DIFF IMP_LHS', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            A -> C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A != B
            C -> A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve DIFF IMP_LHS', function() {
          verify(`
            : A, B, C [0 1]
            A != B
            C -> A
            @custom noleaf B C
          `);
        });

        it('should not cut AB diff with bad ops', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            A != B
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });

        it('should cut BA diff without bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 1]
            B != A
            A <= C
            @custom noleaf B C D E
          `, 'some');
        });

        it('should not cut BA diff with bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 1]
            B != A
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });
      });

      describe('old boolypair diff inversion tests', function() {

        it('should morph DIFF LTE_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            A <= C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve DIFF LTE_LHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            A <= C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF LTE_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            C <= A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve DIFF LTE_RHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            C <= A
            @custom noleaf B C
          `);
        });

        it('should morph DIFF SOME', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            A | C
            # => B <= C
            # => B -> C
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve DIFF SOME', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            A | C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF NALL', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            A !& C
            # => C <= A
            # => C -> A
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve DIFF NALL', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            A !& C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            A -> C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve DIFF IMP_LHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            A -> C
            @custom noleaf B C
          `);
        });

        it('should morph DIFF IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A != B
            C -> A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve DIFF IMP_LHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A != B
            C -> A
            @custom noleaf B C
          `);
        });

        it('should not cut AB diff with bad ops', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 0 9 9]
            A != B
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });

        it('should cut BA diff without bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 0 9 9]
            B != A
            A <= C
            @custom noleaf B C D E
          `, 'some');
        });

        it('should not cut BA diff with bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 0 9 9]
            B != A
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });
      });
    });
  });

  describe('only lt', function() {

    it('should AB lt', function() {
      verify(`
        @custom var-strat throw
        : A, B *
        A < B
        A > 10
        @custom noleaf B
      `);
    });

    it('should BA lt', function() {
      verify(`
        @custom var-strat throw
        : B, A *
        B < A
        A > 10
        @custom noleaf B
      `);
    });

    it('edge case', function() {
      verify(`
        : A [1 80]
        : B [1 81]
        A < B
      `);
    });
  });

  describe('only lte', function() {

    it('should AB lte', function() {
      verify(`
        @custom var-strat throw
        : A, B *
        A <= B
        A > 10
        @custom noleaf B
      `);
    });

    it('should BA lte', function() {
      verify(`
        @custom var-strat throw
        : B, A *
        B <= A
        A > 10
        @custom noleaf B
      `);
    });
  });

  describe('only isall', function() {

    it('should cannot cut two isalls with same R', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F [0 1]
        : R [0 1]
        R = all?(A B C)
        R = all?(D E F)
        # => !(D&E&F) | (A&B&C)    (no change, R is now anonymous)
        # => (D&E&F) <= (A&B&C)    (no change, R is now anonymous)
        # => (D&E&F) -> (A&B&C)    (no change, R is now anonymous)
        @custom noleaf A B C D E F # R is leaf
      `, 'isall,isall');
    });

    describe('R = all?(R ...) only', function() {

      it('should solve the base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 1]
          R = all?(R A B C)
          # => leaf(R) and nothing else...
          @custom noleaf A B C
        `);
      });

      it('should solve two of these cases', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 1]
          R = all?(R A B C)
          R = all?(R D E)
          # => leaf(X,A) and nothing else...
          @custom noleaf B C D E # X _and_ A are leaf
        `);
      });
    });

    describe('trick R = all?(R ...), S = all(R ...)', function() {

      it('should do two 2-arg cases where one isall has R as an arg', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R, S [0 1]
          R = all?(R A)
          S = all?(R B)
          # => (A&B)|(S==0)
          # => S<=(A&B)
          # => S->(A&B)
          # => S->A, S->B
          @custom noleaf A B S # R is leaf
        `, 'imp,imp');
      });

      it('should do two 3-arg cases where one isall has R as an arg; with extra space', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D [0 1]
          : R, S [0 1]
          R = all?(R A B)
          S = all?(R C D)
          # => S->A, S->B, S->C, S->D
          @custom noleaf A B C D S # R is leaf
          @custom free 100
        `, 'imp,imp,imp,imp');
      });

      it('should do two 3-arg cases where one isall has R as an arg; no extra space', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D [0 1]
          : R, S [0 1]
          R = all?(R A B)
          S = all?(R C D)
          @custom noleaf A B C D S # R is leaf
          @custom free 0
        `, 'isall,isall');
      });

      it('should do two 4-arg cases where one isall has R as an arg; with extra space', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E, F [0 1]
          : R, S [0 1]
          R = all?(R A B C)
          S = all?(R D E F)
          # => S -> A, S -> B
          # => S -> (A &? S)
          @custom noleaf A B C D E F S # R is leaf
          @custom free 100
        `, 'imp,imp,imp,imp,imp,imp');
      });

      it('should do two 4-arg cases where one isall has R as an arg; no extra space', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E, F [0 1]
          : R, S [0 1]
          R = all?(R A B C)
          S = all?(R D E F)
          # => S -> A, S -> B
          # => S -> (A &? S)
          @custom noleaf A B C D E F S # R is leaf
          @custom free 0
        `, 'isall,isall');
      });

      it('should solve if S is also solved and two cases where with only one args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R, S [0 1]
          R = all?(R A B C)
          S = all?(R D E)
          # => S -> A, S -> B    =>   solved with S leaf
          @custom noleaf A B C D E # R and S are leaf
        `);
      });
    });
  });

  describe('only isdiff / isneq', function() {

    it('should isdiff base case', function() {
      verify(`
        @custom var-strat throw
        : A *
        : B 11
        : C *
        : R *
        R = diff?(A B C)
        A > 10
        @custom noleaf A B C
      `, 'isdiff');
    });

    describe('2 args legacy', function() {

      it('should AB isdiff base case', function() {
        verify(`
          @custom var-strat throw
          : A *
          : B 11
          : C *
          C = A !=? B
          A > 10
          @custom noleaf A B
        `);
      });

      it('should BA isdiff base case', function() {
        verify(`
          @custom var-strat throw
          : B 11
          : A *
          : C *
          C = B !=? A
          A > 10
          @custom noleaf A B
        `);
      });

      it('should solve constant B', function() {
        verify(`
          @custom var-strat throw
          : A [1 2]
          : R [0 1]
          R = A !=? 1
          @custom noleaf R
        `);
      });

      it('should solve constant A', function() {
        verify(`
          @custom var-strat throw
          : B [1 2]
          : R [0 1]
          R = 1 !=? B
          @custom noleaf R
        `);
      });

      it('should solve constant R', function() {
        verify(`
          @custom var-strat throw
          : A [1 2]
          : B [0 1]
          0 = A !=? B
          @custom noleaf A B
        `);
      });

      it('should solve arg A=0 B=boolypair', function() {
        verify(`
          @custom var-strat throw
          : A 0
          : B [0 0 5 5]
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });

      it('should solve arg A=boolypair B=0', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : B 0
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });

      it('should morph arg A=max(B) B=boolypair', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [0 0 5 5]
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `, 'xor');
      });

      it('should morph arg A=boolypair B=max(A)', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : B 5
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `, 'xor');
      });

      it('should solve arg A=max(B) B=boolypair', function() {
        verify(`
          : A 5
          : B [0 0 5 5]
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });

      it('should solve arg A=boolypair B=max(A)', function() {
        verify(`
          : A [0 0 5 5]
          : B 5
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });

      it('should morph arg A=0 B=boolypair', function() {
        verify(`
          @custom var-strat throw
          : A 0
          : B [0 0 5 5]
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });

      it('should morph arg A=boolypair B=0', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : B 0
          : R [0 1]
          R = A !=? B
          @custom noleaf A B R
        `);
      });
    });
  });

  describe('only islt', function() {

    it('should AB islt', function() {
      verify(`
        @custom var-strat throw
        : A [0 5]
        : B [0 5]
        : C [0 1]
        C = A <? B
        @custom noleaf A B
      `);
    });

    it('should BA islt', function() {
      verify(`
        @custom var-strat throw
        : B [0 5]
        : A [0 5]
        : C [0 1]
        C = B <? A
        @custom noleaf A B
      `);
    });

    it('should islt with constant A', function() {
      verify(`
        @custom var-strat throw
        : B [0 5]
        : C [0 1]
        C = 2 <? B
        @custom noleaf C
      `);
    });

    it('should islt with constant B', function() {
      verify(`
        @custom var-strat throw
        : A [0 5]
        : C [0 1]
        C = A <? 2
        @custom noleaf C
      `);
    });

    it('should islt with constant C', function() {
      verify(`
        @custom var-strat throw
        : A [1 2]
        : B [0 2]
        2 = A <? B
        @custom noleaf A B
      `);
    });
  });

  describe('only islte', function() {

    it('should AB islte', function() {
      verify(`
        @custom var-strat throw
        : A [0 5]
        : B [0 5]
        : C [0 1]
        C = A <=? B
        @custom noleaf A B
      `);
    });

    it('should BA islte', function() {
      verify(`
        @custom var-strat throw
        : B [0 5]
        : A [0 5]
        : C [0 1]
        C = B <=? A
        @custom noleaf A B
      `);
    });

    it('should islte with constant A', function() {
      verify(`
        @custom var-strat throw
        : B [0 5]
        : C [0 1]
        C = 2 <=? B
        @custom noleaf C
      `);
    });

    it('should islte with constant B', function() {
      verify(`
        @custom var-strat throw
        : A [0 5]
        : C [0 1]
        C = A <=? 2
        @custom noleaf C
      `);
    });

    it('should islte with constant C', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [2 3]
        2 = A <=? B
        @custom noleaf A B
      `);
    });
  });

  describe('only isnone', function() {

    it('should solve simple case', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : R [0 10]
        R = none?(A B)
      `);
    });
  });

  describe('only issame', function() {

    it('should issame', function() {
      verify(`
        @custom var-strat throw
        : A *
        : B 11
        : C [0 1]
        C = A ==? B
        A > 10
        @custom noleaf A B
      `);
    });

    it('should issame with constant A', function() {
      verify(`
        @custom var-strat throw
        : B [0 2]
        : C [0 1]
        C = 2 ==? B
        @custom noleaf B
      `);
    });

    it('should issame with constant B', function() {
      verify(`
        @custom var-strat throw
        : A [0 2]
        : C [0 1]
        C = A ==? 2
        @custom noleaf A
      `);
    });

    it('should issame with constant C', function() {
      verify(`
        @custom var-strat throw
        : A [0 2]
        : B [0 1]
        2 = A ==? B
        @custom noleaf A B
      `);
    });

    it('should AB issame with leaf A v1', function() {
      verify(`
        @custom var-strat throw
        : A [0 2]
        : B 2
        : C [0 1]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf A v2', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [1 10]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf A v3', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [0 0]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf A v4', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [0 10]
        C = A ==? B
        @custom noleaf C B
      `, 'issame');
    });

    it('should AB issame with leaf A v5', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B 2
        : C [0 10]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf A v6', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B 2
        : C [1 10]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf A', function() {
      verify(`
        @custom var-strat throw
        : A [0 4 6 10]
        : B 5
        : C [0 10]
        C = A ==? B
        @custom noleaf C B
      `);
    });

    it('should AB issame with leaf B', function() {
      verify(`
        @custom var-strat throw
        : A 2
        : B [0 2]
        : C [0 1]
        C = A ==? B
        @custom noleaf C A
      `);
    });

    it('shouldnt AB issame with unsolved leaf B', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 2]
        : C [0 1]
        C = A ==? B
        @custom noleaf C A
      `);
    });

    it('shouldnt blabla trying to proc a certain code branch v1', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 0 2 2]
        : C [0 1]
        C = A ==? B
        @custom noleaf C A
      `, 'issame');
    });

    it('should BA issame with leaf A', function() {
      verify(`
        @custom var-strat throw
        : B 2
        : A [0 2]
        : C [0 1]
        C = B ==? A
        @custom noleaf C B
      `);
    });

    it('should BA issame with leaf B', function() {
      verify(`
        @custom var-strat throw
        : B [0 2]
        : A 2
        : C [0 1]
        C = B ==? A
        @custom noleaf C A
      `);
    });
  });

  describe('only issome', function() {
    //: _7610_ [0,1] # T:true  # ocounts: 1  # ops (1): some? $ meta: [ 00000000000000000000100000000000: BOOLY, ISSOME_RESULT ]
    //## _7610_ = some?( _3940_ _3949_ _3955_ _3961_ _3970_ )   # numdom([0,1]) = some?( numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) )    # indexes: 7610 = 3940 3949 3955 3961 3970    # counts: 1 = some?( 9 7 9 7 5 )

    it('should solve base pair case', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 10]
        : R [0 1]
        R = some?(A B)
        @custom noleaf A B
      `);
    });

    it('should solve base set case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        : R [0 1]
        R = some?(A B C D)
        @custom noleaf A B C D
      `);
    });
  });

  describe('only nall / nand', function() {

    it('should nall AB', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        @custom noleaf A B
      `, 'nall');
    });

    it('should presolve a nall', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !& B
      `);
    });

    it('should solve a nall', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !& B
        @custom noleaf A B
      `);
    });

    it('should nall A', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        @custom noleaf B
      `);
    });

    it('should nall B', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !& B
        @custom noleaf A
      `);
    });
  });

  describe('only same', function() {

    it('should eq', function() {
      // note that this test doesnt even reach the cutter... same makes A and alias of B and then removes the op
      verify(`
        @custom var-strat throw
        : A, B *
        A == B
        A > 10
        @custom noleaf B
      `);
    });

    it('should same', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(A B C D)
        C > 10
        @custom noleaf B
      `);
    });

    it('should same with constants', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(A B C 15 D)
        C > 10
        @custom noleaf B
      `);
    });

    it('should same with constants occurring twice', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(A 15 B C 15 D)
        C > 10
        @custom noleaf B
      `);
    });

    it('should same with a constant occuring first', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(15 A B C 15 D)
        C > 10
        @custom noleaf B
      `);
    });

    it('should same with a constant occuring last', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(A B C 15 D 15)
        C > 10
        @custom noleaf B
      `);
    });

    it('should reject (not throw!) a same with two different constants', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        same(A B C 15 20 D)
        C > 10
        @custom noleaf B
      `, 'reject');
    });

    it('should reject (not throw!) a same with two different domains', function() {
      // note that this test doesnt even reach the cutter... eq makes A and alias of B and then removes the eq
      verify(`
        @custom var-strat throw
        : A, B, C, D *
        : X [100 110]
        : Y [200 210]
        same(A B C X Y D)
        C > 10
        @custom noleaf B
      `, 'reject');
    });
  });

  describe('only some / or', function() {

    it('should SOME AB', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A | B
        @custom noleaf A B
      `, 'some');
    });

    it('should presolve a SOME', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A | B
        @custom noleaf A B
      `);
    });

    it('should SOME A', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A | B
        @custom noleaf B
      `);
    });

    it('should SOME B', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A | B
        @custom noleaf A
      `);
    });

    it('should one SOME ABC', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        some(A B C)
      `);
    });

    it('should a SOME ABC with shared first var', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 10]
        some(A B C)
        some(A D E)
        @custom noleaf B C D E
      `);
    });

    it('should a SOME ABC with shared last var', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 10]
        some(A B C)
        some(D E C)
        @custom noleaf A B D E
      `);
    });
  });

  describe('only sum', function() {

    describe('legacy plus tests', function() {

      it('should cut leaf R from AB plus', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : R *
          R = A + B
          @custom noleaf A B
        `);
      });

      it('should cut leaf R from BA plus', function() {
        verify(`
          @custom var-strat throw
          : B [0 10]
          : A [0 10]
          : R *
          R = B + A
          @custom noleaf A B
        `);
      });

      it('should not cut leaf A from AB plus', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          : R *
          R = A + B
          @custom noleaf R A
          @custom nobool R             # otherwise the + becomes a issome
        `, 'sum');
      });

      it('should not cut leaf B from BA plus', function() {
        verify(`
          @custom var-strat throw
          : B [0 10]
          : A [0 10]
          : R *
          R = B + A
          @custom noleaf R B
          @custom nobool R             # otherwise the + becomes a issome
        `, 'sum');
      });

      it('should plus with a constant A', function() {
        verify(`
          @custom var-strat throw
          : B [0 10]
          : R *
          R = 5 + B
          B > 1
          @custom noleaf R
        `);
      });

      it('should plus with a constant B', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : R *
          R = A + 5
          @custom noleaf R
        `);
      });

      it('should plus with a constant R', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          5 = A + B
          @custom noleaf A B
        `, 'sum');
      });

      it('should rewrite a specific some case', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : R [1 2]
          R = A + B
          @custom noleaf A B
        `, 'some');
      });

      it('should rewrite a specific nall case', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : R [0 1]
          R = A + B
          @custom noleaf A B
        `, 'nall');
      });
    });

    it('should remove simple bool case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 3]
        R = sum(A B C)
        @custom noleaf A B C
      `);
    });

    it('should remove simple bool and constant case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [4 7]
        R = sum(A 4 B C)
        @custom noleaf A B C
      `);
    });

    it('should order sum args', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R *
        R = sum(C A B)
        @custom noleaf A B C
      `);
    });

    it('should remove if R wraps whole range', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 2 2]
        : B, C, D [0 1]
        : R [0 5]
        R = sum(A B C D)
        @custom noleaf A B C D
      `);
    });

    it('should rewrite a leaf isnall to nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 3] # n-1
        R = sum(A B C D)
        @custom noleaf A B C D
      `, 'nall');
    });

    it('should detect trivial isall patterns', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R *
        : S [0 1]
        R = sum(A B C)
        S = R ==? 3
        @custom noleaf A B C
      `);
    });

    it('should detect reverse trivial isall patterns', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R *
        : S [0 1]
        S = R ==? 3
        R = sum(A B C)
        @custom noleaf A B C
      `);
    });

    it('should not derail on this input (regression)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        : E, F *
        E = sum(A B C D)
        F = sum(A B C D)
        @custom noleaf A B C D E F
        @custom nobool A B C D E F
      `, 'sum'); // E==F so one sum since E/F is explicitly not a leaf
    });

    it('should recognize a leaf sum that is a some', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [1 3]
        R = sum(A B C)
        @custom noleaf A B C
      `, 'some');
    });
  });

  describe('only xnor', function() {

    it('should eliminate an xnor even with noleaf', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !^ B # since noleaf keeps booly state, A and B are pseudo-booly-alias
        @custom noleaf A B
      `);
    });

    it('should not eliminate an xnor when its not considered a booly', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !^ B # nobool should prevent pseudo alias trick here
        @custom nobool A B
      `, 'xnor');
    });

    it('should xnor A', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !^ B
        @custom noleaf B
      `);
    });

    it('should xnor B', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        A !^ B
        @custom noleaf A
      `);
    });
  });

  describe('only xor', function() {

    describe('leaf args', function() {

      it('should xor when AB arent leafs', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          A ^ B
          @custom noleaf A B
        `, 'xor');
      });

      it('should xor A leaf', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          A ^ B
          @custom noleaf B
        `);
      });

      it('should xor B leaf', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 10]
          A ^ B
          @custom noleaf A
        `);
      });
    });

    describe('regression', function() {

      describe('lte_lhs with bools', function() {
        // these problems only differ in the order of the constraints
        let dsl1 = `
          @custom var-strat throw
          : A, B, C [0,1]
          A <= C
          A ^ B
          # => A->C, A^B
          # => some(A B)
          @custom noleaf B C
        `;
        let dsl2 = `
          @custom var-strat throw
          : A, B, C [0,1]
          A ^ B
          A <= C
          # => A^B, A->C
          # => some(C B)
          @custom noleaf B C
        `;

        it('should give the same result 1', function() {
          verify(dsl1, 'some');
        });

        it('should give the same result 2', function() {
          verify(dsl2, 'some');
        });
      });
    });

    // dont extend these tests. they are here for legacy reasons. just in case.
    describe('legacy bool invert tests', function() {

      describe('invert xor trick on bools', function() {

        it('should xor', function() {
          verify(`
            @custom var-strat throw
            : A, B *
            A ^ B
            A > 10
            @custom noleaf B
          `);
        });

        it('should morph xor LTE_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            A <= C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve xor LTE_LHS', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            A <= C
            @custom noleaf B C
          `);
        });

        it('should morph xor LTE_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            C <= A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve xor LTE_RHS', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            C <= A
            @custom noleaf B C
          `);
        });

        it('should morph xor SOME', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            A | C
            # => B <= C
            # => B -> C
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve xor SOME', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            A | C
            @custom noleaf B C
          `);
        });

        it('should morph xor NALL', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            A !& C
            # => C <= A
            # => C -> A
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve xor NALL', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            A !& C
            @custom noleaf B C
          `);
        });

        it('should morph xor IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            A -> C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve xor IMP_LHS', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            A -> C
            @custom noleaf B C
          `);
        });

        it('should morph xor IMP_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 1]
            A ^ B
            C -> A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve xor IMP_RHS', function() {
          verify(`
            : A, B, C [0 1]
            A ^ B
            C -> A
            @custom noleaf B C
          `);
        });

        it('should not cut AB xor with bad ops', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            A ^ B
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });

        it('should cut BA xor without bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 1]
            B ^ A
            A <= C
            @custom noleaf B C D E
          `, 'some');
        });

        it('should not cut BA xor with bad ops', function() {
          verify(`
            @custom var-strat throw
            : B, A, C, D, E [0 1]
            B ^ A
            A <= C
            A = D + E
            @custom noleaf B C D E
          `, 'imp,sum,xor');
        });
      });

      describe('invert xor trick on identical boolypairs', function() {

        it('should morph xor LTE_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            A <= C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve xor LTE_LHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            A <= C
            @custom noleaf B C
          `);
        });

        it('should morph xor LTE_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            C <= A
            # => B !& C
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve xor LTE_RHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            C <= A
            @custom noleaf B C
          `);
        });

        it('should morph xor SOME', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            A | C
            # => B <= C
            # => B -> C
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve xor SOME', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            A | C
            @custom noleaf B C
          `);
        });

        it('should morph xor NALL', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            A !& C
            # => C <= B
            # => C -> B
            @custom noleaf B C
          `, 'imp');
        });

        it('should solve xor NALL', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            A !& C
            @custom noleaf B C
          `);
        });

        it('should morph xor IMP_LHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            A -> C
            # => B | C
            @custom noleaf B C
          `, 'some');
        });

        it('should solve xor IMP_LHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            A -> C
            @custom noleaf B C
          `);
        });

        it('should morph xor IMP_RHS', function() {
          verify(`
            @custom var-strat throw
            : A, B, C [0 0 9 9]
            A ^ B
            C -> A
            # => !(B & C)
            @custom noleaf B C
          `, 'nall');
        });

        it('should solve xor IMP_RHS', function() {
          verify(`
            : A, B, C [0 0 9 9]
            A ^ B
            C -> A
            @custom noleaf B C
          `);
        });
      });
    });
  });

  describe('list subsets or supersets', function() {

    describe('SOME;', function() {

      describe('SOME ⊂ SOME', function() {

        it('should base cases dedupe a SOME that is subset of another SOME', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(A B C)
            some(A B C D)
            # => D is irrelevant because SOME(ABC) would solve SOME(ABCD) automatically (and has to)
            @custom noleaf A B C D
          `, 'some');
        });

        it('should base cases when subset is second', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(A B C D)
            some(A B C)
            # => D is irrelevant
            @custom noleaf A B C D
          `, 'some');
        });

        it('should dedupe a subset SOME when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(A B D)
            some(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'some');
        });

        it('should dedupe a subset SOME when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(A B D)
            some(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'some');
        });

        it('should dedupe a subset SOME when args are not ordered initially', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(D A B)
            some(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'some');
        });

        it('should dedupe a subset SOME when args are dupe', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            some(C A C)
            some(A B C D)
            # => B, D is irrelevant
            @custom noleaf A B C D
          `, 'some');
        });

        it('should NOT dedupe when it is not a complete subset', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            some(C A E)
            some(A B C D)
            @custom noleaf A B C D E
          `, 'some,some');
        });
      });

      describe('SOME ⊆ ISSOME', function() {

        it('should base cases dedupe a SOME that is subset of ISSOME', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            some(A B C)
            R = some?(A B C D)
            # => the some is required so if some is subset or equal to the args of issome then issome is solved per that
            @custom noleaf A B C D R
          `, 'some');
        });

        it('should base cases dedupe a SOME that have equal args as ISSOME', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            some(A B C D)
            R = some?(A B C D)
            # => the some is required so if some is subset or equal to the args of issome then issome is solved per that
            @custom noleaf A B C D R
          `, 'some');
        });

        it('should NOT dedupe when not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            some(A B E)
            R = some?(A B C D)
            @custom noleaf A B C D E R
          `, 'issome,some');
        });

        it('should NOT dedupe when same count but not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            some(A B E D)
            R = some?(A B C D)
            @custom noleaf A B C D E R
          `, 'issome,some');
        });
      });

      describe('SOME ⊆ ISNONE', function() {

        it('should base cases dedupe a SOME that is subset of isnone', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            some(A B C)
            R = none?(A B C D)
            # => the some is required so if some is subset or equal to the args of issome then issome is solved per that
            @custom noleaf A B C D R
          `, 'some');
        });

        it('should base cases dedupe a SOME that have equal args as isnone', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            some(A B C D)
            R = none?(A B C D)
            # => the some is required so if some is subset or equal to the args of issome then issome is solved per that
            @custom noleaf A B C D R
          `, 'some');
        });

        it('should NOT dedupe when not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            some(A B E)
            R = none?(A B C D)
            @custom noleaf A B C D E R
          `, 'isnone,some');
        });

        it('should NOT dedupe when SOME count but not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            some(A B E D)
            R = none?(A B C D)
            @custom noleaf A B C D E R
          `, 'isnone,some');
        });
      });
    });

    describe('NALL;', function() {

      describe('NALL ⊂ NALL', function() {

        it('should base cases dedupe a NALL that is subset of another NALL', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(A B C)
            nall(A B C D)
            # => D is irrelevant because NALL(ABC) would solve NALL(ABCD) automatically (and has to)
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should base cases when subset is second', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(A B C D)
            nall(A B C)
            # => D is irrelevant
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should dedupe a subset NALL when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(A B D)
            nall(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should dedupe a subset NALL when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(A B D)
            nall(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should dedupe a subset NALL when args are not ordered initially', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(D A B)
            nall(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should dedupe a subset NALL when args are dupe', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            nall(C A C)
            nall(A B C D)
            # => B, D is irrelevant
            @custom noleaf A B C D
          `, 'nall');
        });

        it('should NOT dedupe when it is not a complete subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            nall(C A E)
            nall(A B C D)
            @custom noleaf A B C D E
          `, 'nall,nall');
        });
      });

      describe('NALL ⊆ ISNALL', function() {

        it('should base cases dedupe a NALL that is subset of ISNALL', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            nall(A B C)
            R = nall?(A B C D)
            # => the nall is required so if nall is subset or equal to the args of isnall then isnall is solved per that
            @custom noleaf A B C D R
          `, 'nall');
        });

        it('should base cases dedupe a NALL that have equal args as ISNALL', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            nall(A B C D)
            R = nall?(A B C D)
            # => the nall is required so if nall is subset or equal to the args of isnall then isnall is solved per that
            @custom noleaf A B C D R
          `, 'nall');
        });

        it('should NOT dedupe when not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            nall(A B E)
            R = nall?(A B C D)
            @custom noleaf A B C D E R
          `, 'isnall,nall');
        });

        it('should NOT dedupe when same count but not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            nall(A B E D)
            R = nall?(A B C D)
            @custom noleaf A B C D E R
          `, 'isnall,nall');
        });
      });

      describe('NALL ⊆ ISALL', function() {

        it('should base cases dedupe a NALL that is subset of ISALL', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            nall(A B C)
            R = all?(A B C D)
            # => the nall is required so if nall is subset or equal to the args of ISALL then ISALL is solved to R=0 per that
            @custom noleaf A B C D R
          `, 'nall');
        });

        it('should base cases dedupe a NALL that have equal args as ISALL', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 1]
            : R [0 1]
            nall(A B C D)
            R = all?(A B C D)
            # => the nall is required so if NALL is subset or equal to the args of ISALL then ISALL is solved to R=0 per that
            @custom noleaf A B C D R
          `, 'nall');
        });

        it('should NOT dedupe when not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            nall(A B E)
            R = all?(A B C D)
            @custom noleaf A B C D E R
          `, 'isall,nall');
        });

        it('should NOT dedupe when NALL count but not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 1]
            nall(A B E D)
            R = all?(A B C D)
            @custom noleaf A B C D E R
          `, 'isall,nall');
        });
      });
    });

    describe('DIFF;', function() {

      describe('DIFF ⊃ DIFF', function() {

        it('should base cases dedupe a DIFF that is superset of another DIFF', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 3]
            diff(A B C D)
            diff(A B C)
            # => D is irrelevant because DIFF(ABC) would solve DIFF(ABCD) automatically (and has to)
            @custom noleaf A B C D
          `, 'diff');
        });

        it('should base cases when superset is second', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 3]
            diff(A B C)
            diff(A B C D)
            # => D is irrelevant
            @custom noleaf A B C D
          `, 'diff');
        });

        it('should dedupe a superset DIFF when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 3]
            diff(A B D)
            diff(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'diff');
        });

        it('should dedupe a superset DIFF when args are not consecutive', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 3]
            diff(A B D)
            diff(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'diff');
        });

        it('should dedupe a superset DIFF when args are not ordered initially', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 3]
            diff(D A B)
            diff(A B C D)
            # => C is irrelevant
            @custom noleaf A B C D
          `, 'diff');
        });

        it('should NOT dedupe when it is not a complete superset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 3]
            diff(C A E)
            diff(A B C D)
            @custom noleaf A B C D E
          `, 'diff,diff');
        });
      });

      describe('DIFF ⊇ ISDIFF', function() {

        it('should base cases dedupe a DIFF that is superset of ISDIFF', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 4]
            : R [0 1]
            diff(A B C D)
            R = diff?(A B C)
            # => the diff is required so if diff is superset or equal to the args of isdiff then isdiff is solved per that
            @custom noleaf A B C D R
          `, 'diff');
        });

        it('should base cases dedupe a DIFF that have equal args as ISDIFF', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 4]
            : R [0 1]
            diff(A B C D)
            R = diff?(A B C D)
            # => the diff is required so if diff is superset or equal to the args of isdiff then isdiff is solved per that
            @custom noleaf A B C D R
          `, 'diff');
        });

        it('should NOT dedupe when not a superset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 4]
            : R [0 1]
            diff(A B C D)
            R = diff?(A B E)
            A == 0
            B == 1
            C == 2
            D == 3
            E == 4
            R == 1
            @custom noleaf A B C D R
          `, 'isdiff');
        });

        it('should NOT dedupe when same count but not a superset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 4]
            : R [0 1]
            diff(A B C D)
            R = diff?(A B E D)
            @custom noleaf A B C D R
          `, 'diff,isdiff');
        });
      });

      describe('DIFF ⊆ ISSAME', function() {

        it('should base cases dedupe a DIFF that is subset of ISSAME', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 4]
            : R [0 1]
            diff(A B C)
            R = same?(A B C D)
            # => the diff is required so if diff is subset or equal to the args of ISSAME then ISSAME is solved to R=0 per that
            @custom noleaf A B C D R
          `, 'diff');
        });

        it('should base cases dedupe a DIFF that have equal args as ISSAME', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D [0 4]
            : R [0 1]
            diff(A B C D)
            R = same?(A B C D)
            # => the diff is required so if DIFF is subset or equal to the args of ISSAME then ISSAME is solved to R=0 per that
            @custom noleaf A B C D R
          `, 'diff');
        });

        it('should NOT dedupe when not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 4]
            : R [0 1]
            diff(A B E)
            R = same?(A B C D)
            @custom noleaf A B C D E R
          `, 'diff,issame');
        });

        it('should NOT dedupe when DIFF count but not a subset', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 4]
            : R [0 1]
            diff(A B E D)
            R = same?(A B C D)
            @custom noleaf A B C D E R
          `, 'diff,issame');
        });

        it('simple test', function() {
          verify(`
            @custom var-strat throw
            : A,B *
            C = A ==? B
            A != B
            # -> C=0
            @custom noleaf A B
          `, 'diff');
        });

        it('simple solve', function() {
          verify(`
            : A,B *
            C = A ==? B
            A != B
            # -> C=0
            @custom noleaf A B
          `);
        });
      });
    });
  });

  describe('trick xor+xor', function() {

    describe('with A^B,A^C and pair(B) domains B==C', function() {

      it('should work on bools', function() {
        verify(`
          : A, B, C [0 1]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor');
      });

      it('should work on booly', function() {
        verify(`
          : A [0 1]
          : B, C [0 0 10 10]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor');
      });

      it('should work on booly when B!=C as pseudo aliases', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 10]
          : C [0 0 20 20]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor'); // it will still work but as pseudo alias
      });
    });

    describe('with A^B,A^C and pair(B) pair(C) domains B!=C', function() {

      it('should work on booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 10]
          : C [0 0 20 20]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor');
      });

      it('should not work on when var B is not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 15]
          : C [0 0 20 20]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor,xor');
      });

      it('should not work on when var C is not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 10]
          : C [0 0 20 25]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor,xor');
      });

      it('should not work on when var BC both not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 15]
          : C [0 0 20 25]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor,xor');
      });
    });

    describe('with A^B,A^C and B and C booly vars', function() {

      it('should work on booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 15]
          : C [0 0 20 25]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A
        `, 'xor');
      });

      it('should not work on when var B is not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 15]
          : C [0 0 20 20]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B
        `, 'xor,xor');
      });

      it('should not work on when var C is not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 10]
          : C [0 0 20 25]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A C
        `, 'xor,xor');
      });

      it('should not work on when var BC both not booly', function() {
        verify(`
          : A [0 1]
          : B [0 0 10 15]
          : C [0 0 20 25]
          A ^ B
          A ^ C

          @custom var-strat throw
          @custom noleaf A B C
          @custom nobool A B C
        `, 'xor,xor');
      });
    });

    it('should alias two vars in xors with shared var if the other vars are equal and size=2', function() {
      // A^X,B^X means A and B are the same if their domain is the same and size=2 and they have a zero
      verify(`
        @custom var-strat throw
        : A, B, X [0 1]
        A ^ X
        B ^ X
        @custom noleaf A B X
      `, 'xor');
    });

    it('should alias multiple vars in xors with shared var if the other vars are equal and size=2', function() {
      // try a silly case where A=B=C=D
      verify(`
        @custom var-strat throw
        : A, B, C, D, X [0 1]
        A ^ X
        B ^ X
        C ^ X
        D ^ X
        @custom noleaf A B C D X
      `, 'xor');
    });

    it('should should apply double xor trick even if shared var is not strictly bool', function() {
      // A^X,B^X means A and B are the same if their domain is the same and size=2 and they have a zero
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : X [0 10]
        A ^ X
        B ^ X
        @custom noleaf A B X
      `, 'xor');
    });

    it('should alias multiple vars in xors with shared var even if shared var is not bool', function() {
      // try a silly case where A=B=C=D
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 10]
        A ^ X
        B ^ X
        C ^ X
        D ^ X
        @custom noleaf A B C D X
      `, 'xor');
    });

    it('should combine issame-to-xor trick with double xor trick', function() {
      verify(`
        @custom var-strat throw
        : A [0 3]
        : R [0 1]
        : C [0 1]
        R = A ==? 0
        R ^ C
        @custom noleaf R A C
      `, 'xor');
    });
  });

  describe('trick xnor booly', function() {

    it('should solve the base case', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 8
        A !^ C
        @custom noleaf A B
      `, 'issame');
    });

    it('should eliminate xnor when the arg is booly', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 8
        A !^ C
        @custom noleaf A B
      `, 'issame');
      // note: this may change/improve but the relevant part is that the xnor is gone!
    });

    it('should eliminate xnor when the other arg is booly', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 8
        C !^ A
        @custom noleaf A B
      `, 'issame');
      // note: this may change/improve but the relevant part is that the xnor is gone!
    });

    it('should eliminate xnor when both args are booly 8', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 8
        C !^ A
        # -> should remove the !^
        @custom noleaf A B
      `, 'issame');
    });

    it('should eliminate xnor when both args are booly 5', function() {
      //why solve if issame 8 but not when issame 5?
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 5
        C !^ A
        # -> should remove the !^
        @custom noleaf A B
      `, 'issame');
    });

    it('should keep B if its not a booly', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 5 5]
        : C [0 1]
        : X, Y [0 10]
        A | Y
        A !^ C
        X = C + Y
        @custom noleaf C X Y
      `, 'some,sum');
    });
  });

  describe('trick lte_rhs+isall_r', function() {

    it('should morph the basic 2-arg case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        R = all?(A B)
        C <= R
        # => C <= A, C <= B, leaf(R)
        # => C -> R, R = all?(A B)             =>  C -> all?(A B)
        # => C -> A, C -> B, leaf(R)

        @custom noleaf A B C
        @custom free 0
      `, 'imp,imp');
    });

    it('should solve the basic 2-arg case', function() {
      verify(`
        : A, B, C, R [0 1]
        R = all?(A B)
        C <= R
        # => C -> R, R = all?(A B)
        # => C <= all?(A B)              (no change, R becomes an anonymous var)
        # => C -> all?(A B)              (no change, R becomes an anonymous var)
        # => C <= A, C <= B
        @custom noleaf A B C
        @custom free 0
      `);
    });

    it('should morph the swapped basic 2-arg case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        C <= R
        R = all?(A B)
        # -->  C <= A, C <= B
        # -->  C -> A, C -> B
        @custom noleaf A B C
        @custom free 0
      `, 'imp,imp');
    });

    it('should not morph the >2-arg case if there is no space', function() {
      verify(`
        @custom var-strat throw
        : a, b, c, d, e, f [0 1]
        : L, R [0 1]
        L <= R
        R = all?(L a b c d e f)
        @custom noleaf L a b c d e f
        @custom free 0
      `, 'imp,isall');
    });

    it('should not morph the >2-arg case if there isnt enough space', function() {
      verify(`
        @custom var-strat throw
        : a, b, c, d, e, f [0 1]
        : L, R [0 1]
        L <= R
        R = all?(L a b c d e f)
        @custom noleaf L a b c d e f
        @custom free 10
      `, 'imp,isall');
    });

    it('should work when isall[2] args arent bool because thats fine too', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 10]
        : C, R [0 1]
        R = all?(A B)
        C <= R
        # -->  C <= A, C <= B
        # -->  C -> A, C -> B
        @custom noleaf A B C
        @custom free 0
      `, 'imp,imp');
    });

    it('should solve this and not try to rewrite it because that leads to rejection', function() {
      // pseudo-regression case
      verify(`
        @custom var-strat throw
        : A, B = 1
        : C = 100
        : R = 100
        R = all?(A B)
        C <= R
        # -->  C <= A, C <= B
        @custom noleaf A B C
        @custom free 0
      `);
    });

    it('should is this lossy?', function() {
      // pseudo-regression case
      verify(`
        @custom var-strat throw
        : A, B = [0 0 10 10]
        : C = [0 0 100 100]
        : R = 100
        R = all?(A B)
        C <= R
        # -->  C <= A, C <= B
        # what if we want the solution: {A: 10, B: 10, C: 100, R: 100}
        @custom noleaf A B C
        @custom free 0
        # @custom varstrat R 100
      `);
    });

    it('should morph 3-args if there is enough space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, X [0 1]
        : M = 1
        X = all?(A B C)
        D <= X
        # -->  D <= A, D <= B, D <= C
        # -->  D -> A, D -> B, D -> C
        @custom noleaf A B C D
        @custom free 100
      `, 'imp,imp,imp');
    });

    it('should morph 4-args if there is enough space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, X [0 1]
        X = all?(A B C E)
        D <= X
        # -->  D <= A, D <= B, D <= C, D <= E
        # -->  D -> A, D -> B, D -> C, D -> E
        @custom noleaf A B C D E
        @custom free 100
      `, 'imp,imp,imp,imp');
    });

    it('should morph 5-args if there is enough space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, X [0 1]
        X = all?(A B C E F)
        D <= X
        # -->  D <= A, D <= B, D <= C, D <= E, D <= F
        # -->  D -> A, D -> B, D -> C, D -> E, D <= F
        @custom noleaf A B C D E F
        @custom free 100
      `, 'imp,imp,imp,imp,imp');
    });

    it('should work 2-args when R=0', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R 0
        C <= R
        R = all?(A B)
        # => C <= A, C <= B
        # => C -> A, C -> B
        # => nall(A B C)
        @custom noleaf A B C
        @custom free 0
      `, 'nall');
    });

    it('should base 3-args case with A tied up', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        X = all?(B C D)
        # => A -> X, X = all?(B C D)  (note: LTE to IMP)
        # => A <= (B & C &D)          (note: same because still has anonymous var)
        # => A -> (B & C &D)          (note: same because still has anonymous var)
        # => A==0|(A&C&D&E), leaf(X)  (note: worse because 2 anonymous vars)
        # => A==(A&B&C&D), leaf(X)    (note: same because still has anonymous var)
        # => A -> B, A -> C, A -> D   (note: --vars, ++constraints)
        @custom noleaf A B C D
        @custom free 100
      `, 'imp,imp,imp');
    });

    it('should not do "base 3-args case with A tied up" without extra space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        X = all?(B C D)
        # => A -> X, X = all?(B C D)  (note: LTE to IMP)
        # => A <= (B & C &D)          (note: same because still has anonymous var)
        # => A -> (B & C &D)          (note: same because still has anonymous var)
        # => A==0|(A&C&D&E), leaf(X)  (note: worse because 2 anonymous vars)
        # => A==(A&B&C&D), leaf(X)    (note: same because still has anonymous var)
        # => A -> B, A -> C, A -> D   (note: --vars, ++constraints)
        @custom noleaf A B C D
        @custom free 0
      `, 'imp,isall'); // this could change with other tricks
    });

    it('should solve base 3-args case with A also leaf', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        X = all?(B C D)
        # => A==0|(A&C&D&E), leaf(X)
        # => A==(A&B&C&D), leaf(X)
        # => leaf(X,A) and nothing else...
        @custom noleaf B C D
      `);
    });

    describe('should morph the basic case as long as max(C) <= A,B,R', function() {

      function test(bools, nonbools) {
        it('bools: ' + bools + ', nonbools: ' + nonbools, function() {
          verify(`
            @custom var-strat throw
            : ${bools} [0 1]
            : ${nonbools} [0 10]
            R = all?(A B)
            C <= R

            @custom noleaf A B C
          `, 'imp,imp');
        });
      }

      test('B,R,C', 'A');
      test('A,R,C', 'B');
      test('C,R', 'A,B');
    });

    describe('should not morph the basic case when max(C) > A,B,R', function() {

      function test(bools, nonbools) {
        it('bools: ' + bools + ', nonbools: ' + nonbools, function() {
          verify(`
            @custom var-strat throw
            : ${bools} [0 1]
            : ${nonbools} [0 10]
            R = all?(A B)
            C <= R

            @custom noleaf A B C
          `, 'isall,lte');
        });
      }

      test('B', 'A,C,R');
      test('A', 'B,C,R');
      test('A,B', 'C,R');
    });

    describe('should morph the multi-isall case if all isall args are >= max(C)', function() {

      function test(bools, nonbools) {
        it('bools: ' + bools + ', nonbools: ' + nonbools, function() {
          verify(`
            @custom var-strat throw
            : ${bools} [0 1]
            : ${nonbools} [0 10]
            R = all?(A B C)
            D <= R
            @custom noleaf A B C D
            @custom free 20
          `, 'imp,imp,imp');
        });
      }

      test('D,B,C,R', 'A');
      test('D,A,C,R', 'B');
      test('D,A,B,R', 'C');
      test('D,C,R', 'A,B');
      test('D,B,R', 'A,C');
      test('D,R', 'A,B,C');
    });

    describe('should not morph the multi-isall case if any isall args is < max(C)', function() {

      function test(bools, nonbools) {
        it('bools: ' + bools + ', nonbools: ' + nonbools, function() {
          verify(`
            @custom var-strat throw
            : ${bools} [0 1]
            : ${nonbools} [0 10]
            R = all?(A B C)
            D <= R
            @custom noleaf A B C D
            @custom free 20
          `, 'isall,lte');
        });
      }

      test('B,C', 'A,D,R');
      test('A,C', 'B,D,R');
      test('A,B', 'C,D,R');
      test('C', 'A,B,D,R');
      test('B', 'A,C,D,R');
    });
  });

  describe('trick lte_rhs+lte_rhs', function() {

    it('should presolve', function() {
      verify(`
        @custom var-strat throw
        : A, B, R [0 1]
        A <= R
        B <= R
        # => solved when R is leaf?
        @custom targets (A B R)
      `);
    });
  });

  describe('trick diff+lte_rhs', function() {

    it('should rewrite base case of an lte and diff to a nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A <= B
        B != C
        # -> A -> B, B != C
        # -> A !& C
        @custom noleaf A C
      `, 'nall');
    });

    it('should rewrite swapped base case of an lte and diff to a nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        B != C
        A <= B
        # -> A -> B, B != C
        # -> A !& C
        @custom noleaf A C
      `, 'nall');
    });

    it('should not do lte+diff trick for non bools', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 2]
        : C [0 1]
        A <= B
        B != C
        # -> A !& C
        @custom noleaf A C
      `, 'diff,lte');
    });
  });

  describe('trick lte_lhs/nall leaf', function() {

    it('should eliminate base case of an lte and nall AC', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A <= B
        A !& C
        # => A is leaf var
        @custom noleaf B C
      `);
    });

    it('should eliminate swapped base case of an lte and nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A !& C
        A <= B
        # -> A is leaf var
        @custom noleaf B C
      `);
    });

    it('should eliminate base case of an lte and nall CA', function() {
      verify(`
        @custom var-strat throw
        : C [0 1]
        : A [0 1]
        : B [0 1]
        A <= B
        C !& A
        # -> A is leaf var
        @custom noleaf B C
      `);
    });

    it('should not do lte+diff trick for rhs of lte', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A !& C
        B <= A
        @custom noleaf B C
      `, 'imp,nall');
    });

    it('should not do lte+diff trick if A has no value lower than min(B)', function() {
      // (this never even reaches the cutter because A<=B cant hold and minimizer will reject over that
      verify(`
        @custom var-strat throw
        : A [11 11]
        : B [5 10]
        : C [0 0] # already satisfies nall
        A <= B
        A !& C
        # -> A !& C
        @custom noleaf B C
      `, 'reject');
    });

    it('should not do lte+diff trick if A has no zero and C isnt zero', function() {
      // wont even get to the cutter because the nall wont hold and minimizer will reject over that
      verify(`
        @custom var-strat throw
        : A [1 1]
        : B [0 10]
        : C [1 1] # should force A to 0
        A <= B
        A !& C
        # -> A !& C
        @custom noleaf B C
      `, 'reject');
    });

    it('should do lte+diff trick if A has no zero and C is zero', function() {
      // nall is eliminated by minimizer and cutter only sees countsA==1..
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : C 0
        A <= B
        A !& C
        # -> A !& C
        @custom noleaf B C
      `);
    });

    it('should cut A if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]

        A <= B

        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15

        @custom noleaf B
        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom free 1000
      `);
    });

    it('should eliminate base case a double lte', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A <= B
        A <= C
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

    it('should eliminate swapped base case a double lte', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A <= C
        A <= B
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

    it('should work with semi-overlapping ranges', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [0 8]
        : C [8 11]
        A <= C
        A <= B
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

    it('should work with swapped semi-overlapping ranges', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [0 8]
        : C [8 11]
        A <= B
        A <= C
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

    it('trying to proc code paths v1', function() {
      verify(`
        @custom var-strat throw
        : A [3 4]
        : B [0 5]
        : C [0 5]
        A <= C
        A <= B
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

    it('should leaf cut A when nonzero on LTEs only', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : C [0 10]
        A <= B
        A <= C
        # -> A is a leaf var, eliminate the constraints
        @custom noleaf B C
      `);
    });

  });

  describe('trick isall_r+nall', function() {

    it('should rewrite base case v1 of an isall and nall to a nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        A = all?(B C)
        nall(A B D)
        # -> A = all?(B C), A !& D
        # when A is 1, B and C are 1, so D must be 0 (for the nall)
        # when A is 0, B or C is 0, so the nall is resolved
        # when D is 1, A can't be 1 because then B is also one and the nall would break
        @custom noleaf B C D
        # dont exclude A or the trick won't trigger (even when it's B that disappears)
      `, 'nall'); // isall+nall becomes nall by another trick
    });

    it('should rewrite base case v1 of an swapped isall and nall to a nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        nall(A B D)
        A = all?(B C)
        # -> A = all?(B C), A !& D
        # when A is 1, B and C are 1, so D must be 0 (for the nall)
        # when A is 0, B or C is 0, so the nall is resolved
        # when D is 1, A can't be 1 because then B is also one and the nall would break
        @custom noleaf B C D
        # dont exclude A or the trick won't trigger (even when it's B that disappears)
      `, 'nall'); // isall+nall becomes nall by another trick
    });

    describe('R in isall + nall arg check', function() {

      // note: args are ordered by index and indexes are assigned in order of appearance so declarations must be changed as well
      it('should rewrite isall nall arg 1', function() {
        verify(`
          @custom var-strat throw
          : D [0 1]
          : A [0 1]
          : B [0 1]
          : C [0 1]
          A = all?(B C)
          nall(A B D)
          @custom noleaf B C D
        `, 'nall');
      });

      it('should rewrite isall nall arg 2', function() {
        verify(`
          @custom var-strat throw
          : D [0 1]
          : B [0 1]
          : A [0 1]
          : C [0 1]
          A = all?(B C)
          nall(B A D)
          @custom noleaf B C D
        `, 'nall');
      });

      it('should rewrite isall nall arg 3', function() {
        verify(`
          @custom var-strat throw
          : D [0 1]
          : B [0 1]
          : C [0 1]
          : A [0 1]
          A = all?(B C)
          nall(B D A)
          @custom noleaf B C D
        `, 'nall');
      });
    });

    it('should rewrite when argcount > 2 (arg 1)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        nall(A B D)
        A = all?(B C E)
        @custom noleaf B C D E
      `, 'nall'); // isall+nall becomes nall by other trick
    });

    describe('nall args that share isall arg per index', function() {

      // note: args are ordered by index and indexes are assigned in order of appearance so declarations must be changed as well
      it('should nall 1 with isall A==C', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 1]
          A = all?(B C)
          nall(A B D)
          @custom noleaf B C D
        `, 'nall');
      });

      // note: args are ordered by index and indexes are assigned in order of appearance so declarations must be changed as well
      it('should nall 1 with isall A==D', function() {
        verify(`
          @custom var-strat throw
          : D [0 1]
          : A [0 1]
          : B [0 1]
          : C [0 1]
          A = all?(B C)
          nall(D A B)
          @custom noleaf B C D
        `, 'nall');
      });

      // note: args are ordered by index and indexes are assigned in order of appearance so declarations must be changed as well
      it('should nall 2 with isall B==C', function() {
        verify(`
          @custom var-strat throw
          : B [0 1]
          : A [0 1]
          : C [0 1]
          : D [0 1]
          A = all?(B C)
          nall(A C D)
          @custom noleaf B C D
        `, 'nall');
      });

      // note: args are ordered by index and indexes are assigned in order of appearance so declarations must be changed as well
      it('should nall 2 with isall B==D', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : D [0 1]
          : C [0 1]
          A = all?(B C)
          nall(A D C)
          @custom noleaf B C D
        `, 'nall');
      });

      it('should nall 2 with isall none shared', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : C [0 1]
          : D [0 1]
          : E [0 1]
          A = all?(B C)
          nall(A D E)
          @custom noleaf B C D
        `);
      });
    });

    it('should rewrite when argcount > 2 (arg 2)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        A = all?(B C E)
        nall(A B D)
        @custom noleaf B C D E
      `, 'nall'); // isall+nall becomes nall by other trick
    });

    it('should rewrite when argcount > 2 (arg 3)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        A = all?(D C E)
        nall(A B D)
        @custom noleaf B C D E
      `, 'nall'); // isall+nall becomes nall by other trick
    });

    it('should not rewrite when argcount > 2 but none shared', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F [0 1]
        A = all?(D C E)
        nall(A B F)
        @custom noleaf B C D E F
      `, 'isall,nall');
    });

    // cant test this on isnall2 because it only takes 2 arg (doh)
    it('should also rewrite when isall has 3+ args', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]
        : R [0 1]
        R = all?(A B C)
        nall(R B X)
        # -> X = all?(A B C), R !& X
        # when R is 1, A, B, and C are 1, so X must be 0 (for the nall)
        # when A is 0, A, B, or C is 0, so the nall is resolved (because R=0)
        # when X is 1, A can't be 1 because then B is also one and the nall would break
        @custom noleaf A B C X
        # dont exclude R or the trick won't trigger (even when it's B that disappears from nall)
      `, 'nall'); // isall+nall becomes nall by other trick
    });

    it('trying to improve coverage :)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 1]
        : X [0 1]
        R = all?(A B C D)
        nall(R B X)
        @custom noleaf A B C D X
      `, 'nall'); // isall+nall becomes nall by other trick
    });

    it('should bail if nall has more than 3 args', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 1]
        : X [0 1]
        : z [0 1]
        R = all?(A B C D)
        nall(R B X z)
        @custom noleaf A B C D X z
      `, 'isall,nall');
    });

    describe('all variations of nall arg order', function() {

      function test(v1, v2, v3) {
        it('nall(' + v1 + ',' + v2 + ',' + v3 + ')', function() {
          verify(`
            @custom var-strat throw
            : A [0 1]
            : B [0 1]
            : C [0 1]
            : D [0 1]
            A = all?(B C)
            nall(${v1} ${v2} ${v3})
            # note: this is rewritten to A=all?(BC), A!&D

            @custom noleaf B C D
          `, 'nall'); // isall+nall becomes nall by another trick
        });
      }

      test('A', 'B', 'D');
      test('A', 'D', 'B');
      test('B', 'A', 'D');
      test('B', 'D', 'A');
      test('D', 'A', 'B');
      test('D', 'B', 'A');
    });
  });

  describe('trick isall_r+nall', function() {

    it('should eliminate base case of an isall and nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : R [0 1]
        R = all?(A B)
        R !& C
        # -> nall(A B C)

        @custom noleaf A B C
        @custom free 50
      `, 'nall');
    });

    it('should eliminate base case of an isall and reversed nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : R [0 1]
        R = all?(A B)
        C !& R
        # -> nall(A B C)

        @custom noleaf A B C
        @custom free 50
      `, 'nall');
    });

    it('should eliminate swapped base case of an isall and nall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : R [0 1]
        R !& C
        R = all?(A B)
        # -> nall(A B C)
        @custom noleaf A B C
        @custom free 50
      `, 'nall');
    });

    it('should eliminate swapped base case of an isall and reversed nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 1]
        C !& R
        R = all?(A B)
        # -> nall(A B C)
        @custom noleaf A B C
        @custom free 50
      `, 'nall');
    });

    it('should rewrite isall nall nall to nall nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A B)
        # -> nall(A B C), nall(A B D), R = all?(A B)
        @custom noleaf A B C D
        @custom free 100
      `, 'nall,nall');
    });

    it('should not rewrite if there is no space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A B)
        # -> same because there is no space for the rewrite
        @custom noleaf A B C D
        @custom free 0                 # redundant but for illustration
      `, 'isall,nall,nall');
    });

    it('should not rewrite if R is part of too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        : R [0 1]
        C !& R
        D !& R
        R !& x1
        R !& x2
        R !& x3
        R !& x4
        R !& x5
        R !& x6
        R !& x7
        R !& x8
        R !& x9
        R !& x10
        R !& x11
        R !& x12
        R !& x13
        R !& x14
        R !& x15
        R !& x16
        R !& x17
        R !& x18
        R !& x19
        R !& x20
        R !& x21
        R !& x22
        R !& x23
        R !& x24
        R !& x25
        R !& x26
        R !& x27
        R !& x28
        R !& x29
        R !& x30
        R = all?(A B E)
        @custom noleaf A B C D x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'isall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall');
    });

    it('should not rewrite if there are two isalls', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A B)
        R = all?(A C)
        # -> same because there is no space for the rewrite
        @custom noleaf A B C D
        @custom free 0                 # redundant but for illustration
      `, 'isall,isall,nall,nall');
    });

    it('should not rewrite if there are two isalls', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A B E)
        R = all?(A C E)
        # -> same because there is no space for the rewrite
        @custom noleaf A B C D E
        @custom free 0                 # redundant but for illustration
      `, 'isall,isall,nall,nall');
    });

    it('should two isall case mixed v1', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A B E)
        R = all?(A C)
        # -> same because there is no space for the rewrite
        @custom noleaf A B C D E
        @custom free 0                 # redundant but for illustration
      `, 'isall,isall,nall,nall');
    });

    it('should two isall case mixed v2', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : R [0 1]
        C !& R
        D !& R
        R = all?(A C)
        R = all?(A B E)
        # -> same because there is no space for the rewrite
        @custom noleaf A B C D E
        @custom free 0                 # redundant but for illustration
      `, 'isall,isall,nall,nall');
    });

    it('should consider R a leaf after the rewrite', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 1]
        C !& R
        R = all?(A B)
        # -> nall(A B C), R = all?(A B)
        @custom noleaf A B C
        @custom free 100
      `, 'nall');
    });

    it('should still solve R wrt isall even after eliminating it', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 1]
        C !& R
        R = all?(A B)

        # if A&B then R=1
        : X *
        X = R + R
        # its tricky because this problem may never even reach the nall+isall trick. difficult to test.
        A == 1
        B == 1

        @custom noleaf A B C X
        @custom free 50
      `);
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        : a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z [0 1] # the count needs to overflow the number of offsets tracked by bounty...
        R = all?(A B)
        R !& C
        R !& a
        R !& b
        R !& c
        R !& d
        R !& e
        R !& f
        R !& g
        R !& h
        R !& i
        R !& j
        R !& k
        R !& l
        R !& m
        R !& n
        R !& o
        R !& p
        R !& q
        R !& r
        R !& s
        R !& t
        R !& u
        R !& v
        R !& w
        R !& x
        R !& y
        R !& z
        # -> nall(A B C)

        @custom noleaf A B C a b c d e f g h i j k l m n o p q r s t u v w x y z
        @custom free 1000
      `, 'isall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall');
    });

    it('should skip the trick if another constraint was burried between too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        : a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z [0 1] # the count needs to overflow the number of offsets tracked by bounty...
        R = all?(A B)
        R !& C
        R !& a
        R !& b
        R !& c
        R !& d
        R !& e
        R !& f
        R !& g
        R !& h
        R !& i
        R !& j
        R !& k
        R !& l
        R !& m
        R !& n
        R !& o
        R !& p
        R !& q
        R !& r
        R !& s
        R !& t
        R !& u
        R !& v
        R !& w
        R !& x
        R !& y
        R <= z
        # -> nall(A B C)

        @custom noleaf A B C a b c d e f g h i j k l m n o p q r s t u v w x y z
        @custom free 1000
      `, 'imp,isall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall');
    });

    it('should eliminate base case of an isall with multiple args and two nands', function() {
      verify(`
        @custom var-strat throw
        : a, b, c, d, e [0 1]
        : X, Y [0 1]
        : R [0 1]
        R = all?(a b c d e)
        R !& X
        R !& Y
        # -> nall(a b c d e)

        @custom noleaf a b c d e X
        @custom free 50
      `, 'nall,nall');
    });
  });

  describe('trick lte_lhs+diff', function() {

    it('should eliminate base case an lte_lhs and AB diff', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A <= B
        A != C
        # -> B | C, A is a leaf
        @custom noleaf B C
      `, 'some');
    });

    it('should eliminate swapped base case an lte_lhs and AB diff', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        A != C
        A <= B
        # -> B | C, A is a leaf
        @custom noleaf B C
      `, 'some');
    });

    it('should eliminate base case an lte_lhs and BA diff', function() {
      verify(`
        @custom var-strat throw
        : C [0 1]
        : A [0 1]
        : B [0 1]
        A <= B
        C != A
        # -> B | C, A is a leaf
        @custom noleaf B C
      `, 'some');
    });

    it('should eliminate swapped base case an lte_lhs and BA diff', function() {
      verify(`
        @custom var-strat throw
        : B [0 1]
        : C [0 1]
        : A [0 1]
        C != A
        A <= B
        # -> B | C, A is a leaf
        @custom noleaf B C
      `, 'some');
    });

    it('should not do lte_lhs+diff trick for non bools', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 2]
        : C [0 1]
        : D [0 1]
        A <= B
        C != A
        @custom noleaf B C D
      `, 'lte,xor');
    });

    it('should solve the "not do lte_lhs+diff trick for non bools" test', function() {
      verify(`
        : A [0 1]
        : B [0 2]
        : C [0 1]
        A <= B
        A != C
        @custom noleaf B C
      `);
    });
  });

  describe('trick lte_lhs+isall_r', function() {

    it('should morph the basic case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        R = all?(A B)
        R <= C
        # => R = all?(A B), R -> C
        # => some(C nall?(A B))
        # (note: while this removes R, it creates a temp var)
        # with the all? being flipped to nall?, if any var was solved the nall will now solve as well.

        @custom noleaf A B C
        @custom free 0
      `, 'imp,isall');
    });

    it('should not do lte_lhs+diff trick for non bools', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 2]
        : C [0 1]
        : D [0 1]
        A <= B
        A = all?(C D)
        @custom noleaf B C D
      `, 'isall,lte');
    });

    it('should solve the "not do lte_lhs+diff trick for non bools" test', function() {
      verify(`
        : A [0 1]
        : B [0 2]
        : C [0 1]
        : D [0 1]
        A <= B
        A = all?(C D)
        @custom noleaf B C D
      `);
    });
  });

  describe('trick imp_lhs+isall_r', function() {

    it('check FD brute force morph', function() {
      verify(`
        : A, B, C [0 1]
        C | (nall?(A B))
        @custom targets (A B C)
      `, undefined, {skipVerify: true}); // contains complex dsl
    });

    it('should morph the basic case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, R [0 1]
        R = all?(A B)
        R -> C
        # => some(C nall?(A B))
        # (note: while this removes R, it creates a temp var)
        # with the all? being flipped to nall?, if any var was solved the nall will now solve as well.

        @custom noleaf A B C
        @custom free 0
      `, 'imp,isall'); // yeah i dunno
    });
  });

  describe('trick imp_rhs+isall_r', function() {

    it('should base case with A tied up', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        X = all?(B C D)
        # => A==0|(A&C&D&E), leaf(X)
        # => A==(A&B&C&D), leaf(X)
        # => A -> B, A -> C, A -> D
        @custom noleaf A B C D
        @custom free 100
      `, 'imp,imp,imp');
    });

    it('should not base case with A tied up if there is not enough space', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        X = all?(B C D)
        # => A==0|(A&C&D&E), leaf(X)
        # => A==(A&B&C&D), leaf(X)
        @custom noleaf A B C D
      `, 'imp,isall'); // if this fails... then perhaps we did find a way :)
    });

    it('should base case with A also leaf', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        X = all?(B C D)
        # => A==0|(A&C&D&E), leaf(X)
        # => A==(A&B&C&D), leaf(X)
        # => leaf(X,A) and nothing else...
        @custom noleaf B C D
      `);
    });
  });

  describe('trick diff+lte_lhs+nall', function() {

    it('should eliminate base case a nall, diff, lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A !& B
        A != C
        A <= D
        # => A != C, A -> D, A !& B
        # => B <= C, D | C, A is leaf
        # => B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a reverse nall, diff, lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B !& A
        A != C
        A <= D
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a nall, reverse diff, lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A !& B
        C != A
        A <= D
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a reverse nall, reverse diff, lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B !& A
        C != A
        A <= D
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a diff, nall, lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != C
        A !& B
        A <= D
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a diff, lte_lhs, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != C
        A <= D
        A !& B
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a lte_lhs, diff, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A <= D
        A != C
        A !& B
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a lte_lhs, nall, diff', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A <= D
        A !& B
        A != C
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });
  });

  describe('trick nall+diff+imp_lhs', function() {

    it('should eliminate base case a nall, diff, imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A !& B
        A != C
        A -> D
        # => A != C, A -> D, A !& B
        # => B <= C, D | C, A is leaf
        # => B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a reverse nall, diff, imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B !& A
        A != C
        A -> D
        # -> B <= C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a nall, reverse diff, imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A !& B
        C != A
        A -> D
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate base case a reverse nall, reverse diff, imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B !& A
        C != A
        A -> D
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a diff, nall, imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != C
        A !& B
        A -> D
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a diff, imp_lhs, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != C
        A -> D
        A !& B
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a imp_lhs, diff, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A -> D
        A != C
        A !& B
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });

    it('should eliminate swapped base case a imp_lhs, nall, diff', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A -> D
        A !& B
        A != C
        # -> B -> C, D | C, A is leaf

        @custom noleaf B C D
      `, 'imp,some');
    });
  });

  describe('trick diff+lte_lhs+lte_rhs', function() {

    it('should eliminate base case diff, lte, lte', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != B
        A <= C
        D <= A
        # -> B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case reversed diff, lte, lte', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B != A
        A <= C
        D <= A
        # -> B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case lte, diff, lte', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A <= C
        A != B
        D <= A
        # -> B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case lte, lte, diff', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D <= A
        A <= C
        A != B
        # -> B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should do the trick if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D <= A
        A <= C
        A != B

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        # : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A <= x1
        A <= x2
        A <= x3
        A <= x4
        A <= x5
        A <= x6
        A <= x7
        A <= x8
        A <= x9
        A <= x10
        A <= x11
        A <= x12
        A <= x13
        A <= x14
        A <= x15
        #A <= x16
        #A <= x17
        #A <= x18
        #A <= x19
        #A <= x20
        #A <= x21
        #A <= x22
        #A <= x23
        #A <= x24
        #A <= x25
        #A <= x26
        #A <= x27
        #A <= x28
        #A <= x29
        #A <= x30

        @custom noleaf B C D x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        # @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'nall,some,some,some,some,some,some,some,some,some,some,some,some,some,some,some,some');
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D <= A
        A <= C
        A != B

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A <= x1
        A <= x2
        A <= x3
        A <= x4
        A <= x5
        A <= x6
        A <= x7
        A <= x8
        A <= x9
        A <= x10
        A <= x11
        A <= x12
        A <= x13
        A <= x14
        A <= x15
        A <= x16
        A <= x17
        A <= x18
        A <= x19
        A <= x20
        A <= x21
        A <= x22
        A <= x23
        A <= x24
        A <= x25
        A <= x26
        A <= x27
        A <= x28
        A <= x29
        A <= x30

        @custom noleaf B C D x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,xor');
    });

    it('should not do the trick if an lte arg is non-bool', function() {
      verify(`
        @custom var-strat throw
        : A, B, D [0 1]
        : C [0 10]
        A <= C
        A != B
        D <= A
        @custom noleaf B C D
      `, 'imp,lte,xor');
    });

    it('should do the trick with two neqs but only because another trick eliminates the diffs first', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A <= C
        A != B
        A != C
        # the cutter will do B==C because of these two diffs
        D <= A
        @custom noleaf B C D
      `);
    });
  });

  describe('trick diff+imp_lhs+imp_rhs', function() {

    it('should eliminate base case diff, imp_lhs, imp_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A != B
        A -> C
        D -> A
        # => B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case reversed diff, imp_lhs, imp_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        B != A
        A -> C
        D -> A
        # => B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case imp_lhs, diff, imp_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A -> C
        A != B
        D -> A
        # => B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should eliminate base case imp_rhs, imp_lhs, diff', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D -> A
        A -> C
        A != B
        # => B | C, B !& D, A is leaf

        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should do the trick if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D -> A
        A -> C
        A != B

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        # : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A -> x1
        A -> x2
        A -> x3
        A -> x4
        A -> x5
        A -> x6
        A -> x7
        A -> x8
        A -> x9
        A -> x10
        A -> x11
        A -> x12
        A -> x13
        A -> x14
        A -> x15
        #A -> x16
        #A -> x17
        #A -> x18
        #A -> x19
        #A -> x20
        #A -> x21
        #A -> x22
        #A -> x23
        #A -> x24
        #A -> x25
        #A -> x26
        #A -> x27
        #A -> x28
        #A -> x29
        #A -> x30

        @custom noleaf B C D x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        # @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'nall,some,some,some,some,some,some,some,some,some,some,some,some,some,some,some,some');
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        D -> A
        A -> C
        A != B

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A -> x1
        A -> x2
        A -> x3
        A -> x4
        A -> x5
        A -> x6
        A -> x7
        A -> x8
        A -> x9
        A -> x10
        A -> x11
        A -> x12
        A -> x13
        A -> x14
        A -> x15
        A -> x16
        A -> x17
        A -> x18
        A -> x19
        A -> x20
        A -> x21
        A -> x22
        A -> x23
        A -> x24
        A -> x25
        A -> x26
        A -> x27
        A -> x28
        A -> x29
        A -> x30

        @custom noleaf B C D x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,xor');
    });

    it('should not do the trick if an imp_lhs arg is non-bool', function() {
      verify(`
        @custom var-strat throw
        : A, B, D [0 1]
        : C [0 10]
        A -> C
        A != B
        D -> A
        # A->C,A^B,D->A
        @custom noleaf B C D
      `, 'nall,some');
    });

    it('should do the trick with two neqs but only because another trick eliminates the diffs first', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A -> C
        A != B
        A != C
        # the cutter will do B==C because of these two diffs
        D -> A
        @custom noleaf B C D
      `);
    });
  });

  describe('trick diff+lte_rhs+lte_rhs', function() {

    it('should morph AB diff, lte, lte with perfect fit', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : X, Y [0 1]
        A <= X
        B <= X
        Y != X
        # -> Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph AB diff, lte, lte with room to spare', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : X, Y [0 1]
        A <= X
        B <= X
        Y != X
        # -> Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph BA diff, lte, lte with perfect fit', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : Y, X [0 1]
        A <= X
        B <= X
        X != Y
        # -> Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph BA diff, lte, lte with room to spare', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : Y, X [0 1]
        A <= X
        B <= X
        X != Y
        # -> Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });
  });

  describe('trick diff+imp_rhs+imp_rhs', function() {

    it('should morph AB diff, imp, imp with perfect fit', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : X, Y [0 1]
        A -> X
        B -> X
        Y != X
        # Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph AB diff, imp, imp with room to spare', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : X, Y [0 1]
        A -> X
        B -> X
        Y != X
        # => Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph BA diff, imp, imp with perfect fit', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : Y, X [0 1]
        A -> X
        B -> X
        X != Y
        # => Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });

    it('should morph BA diff, imp, imp with room to spare', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : Y, X [0 1]
        A -> X
        B -> X
        X != Y
        # => Y = none?(A B)  and X a leaf

        @custom noleaf A B Y
      `, 'nall,nall');
    });
  });

  describe('trick diff+nall', function() {

    it('should morph AB diff, AB nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        A != B
        A !& C
        # -> C <= B, A leaf
        # -> C -> B, A leaf

        @custom noleaf B C
      `, 'imp');
    });

    it('should morph BA diff, AB nall', function() {
      verify(`
        @custom var-strat throw
        : B, A, C [0 1]
        B != A
        A !& C
        # -> C <= B, A leaf
        # -> C -> B, A leaf

        @custom noleaf B C
      `, 'imp');
    });

    it('should morph AB diff, BA nall', function() {
      verify(`
        @custom var-strat throw
        : C, A, B [0 1]
        A != B
        C !& A
        # -> C <= B, A leaf
        # -> C -> B, A leaf

        @custom noleaf B C
      `, 'imp');
    });

    it('should not morph if nall arg isnt bool', function() {
      verify(`
        @custom var-strat throw
        : C [0 10]
        : A, B [0 1]
        A != B
        C !& A
        # => A ^ B, C !& A
        @custom noleaf B C
      `, 'imp');
    });
  });

  describe('trick nalls only', function() {

    it('should eliminate a var that is only used in nands AB', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        A !& B
        A !& C
        # -> A leaf, solved

        @custom noleaf B C
      `);
    });

    it('should hit solvestack', function() {
      // at the time of writing the test, this covers the solvestack callback for the case where the nall has
      // at least one non-zero value. this path could always change, rendering the test kinda useless.
      verify(`
        : A, B, C [0 1]
        A !& B
        A !& C
        # -> A leaf, solved
        B = B ==? C
        @custom noleaf B C
      `);
    });

    it('should eliminate a var that is only used in nands BA', function() {
      verify(`
        @custom var-strat throw
        : B, C, A [0 1]
        B !& A
        C !& A
        # -> A leaf, solved

        @custom noleaf B C
      `);
    });

    it('should do the trick if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        # : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        #A !& x16
        #A !& x17
        #A !& x18
        #A !& x19
        #A !& x20
        #A !& x21
        #A !& x22
        #A !& x23
        #A !& x24
        #A !& x25
        #A !& x26
        #A !& x27
        #A !& x28
        #A !& x29
        #A !& x30

        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        # @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `);
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        A !& x16
        A !& x17
        A !& x18
        A !& x19
        A !& x20
        A !& x21
        A !& x22
        A !& x23
        A !& x24
        A !& x25
        A !& x26
        A !& x27
        A !& x28
        A !& x29
        A !& x30

        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall');
    });

    it('should apply trick with nalls with more than 2 args with first shared', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        nall(A B C)
        nall(A D E)
        # -> A leaf, solved

        @custom noleaf B C D E
      `);
    });

    it('should apply trick with nalls with more than 2 args with last shared', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, G, H, I [0 1]
        nall(A B C D E)
        nall(F G H I E)
        # -> A leaf, solved

        @custom noleaf A B C D F G H I
      `);
    });
  });

  describe('trick lte_lhs+some', function() {

    it('should morph base case', function() {
      verify(`
        @custom var-strat throw
        : A, B, X [0 1]
        X <= A
        X | B
        # => X -> A, X | B
        # => A | B, leaf(X)

        @custom noleaf A B
      `, 'some');
    });

    it('should morph with larger SOMEs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, X [0 1]
        X <= A
        some(X B C D E F)
        # => X -> A, some(X B C D E F)
        # => some(A B C D E F), leaf(X)

        @custom noleaf A B C D E F
      `, 'some');
    });
  });

  describe('trick imp_lhs+some', function() {

    it('should morph base case', function() {
      verify(`
        @custom var-strat throw
        : A, B, X [0 1]
        X -> A
        X | B
        # => A | B, leaf(X)

        @custom noleaf A B
      `, 'some');
    });

    it('should morph with larger SOMEs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, X [0 1]
        X -> A
        some(X B C D E F)
        # => some(A B C D E F), leaf(X)

        @custom noleaf A B C D E F
      `, 'some');
    });
  });

  describe('trick lte_lhs+nall+some', function() {

    it('should morph nall, lte, or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X <= B
        X | C
        # => A !& X, X -> B, C | X
        # => B | C, A <= C, with X a leaf. should work for any inpute lte that has x as lhs
        # (because if X is 1, A is 0, C can be any. if X = 0, A can be either but C must be 1. so A <= C.)

        @custom noleaf A B C
      `, 'imp,some');
    });

    it('should solve nall, lte, or', function() {
      // A !& X, X <= B, X | C    ->     B | C, A <= C
      verify(`
        : A, B, C, X [0 1]
        A !& X
        X <= B
        X | C
        # X !& A, X -> B, X | C

        @custom noleaf A B C
      `);
    });

    it('should morph nands, lte, or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, X [0 1]
        A !& X
        X <= B
        X | C
        D !& X
        E !& X
        # -> B | C, A <= C, D <= C, E <= C, with X a leaf
        # -> B | C, A -> C, D -> C, E -> C, with X a leaf

        @custom noleaf A B C D E
      `, 'imp,imp,imp,some');
      // lte,lte,lte,some
      // imp,nall,nall,nall,some
    });

    it('should not do trick when there are two ors', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X <= B
        X | C
        X | B
        @custom noleaf A B C
      `, 'imp,nall,some,some');
    });

    it('should not do trick when there are two ltes', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X <= B
        X <= C
        X | C
        @custom noleaf A B C
      `, 'imp,imp,nall,some');
    });
  });

  describe('trick imp_lhs+nall+some', function() {

    it('should morph nall, imp_lhs, or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X -> B
        X | C
        # => B | C, A -> C, with X a leaf. should work for any input imp that has x as lhs
        # (because if X is 1, A is any, C can be any. if X = 0, A must be 1 and C must be 1. so A -> C.)

        @custom noleaf A B C
      `, 'imp,some');
    });

    it('should solve nall, imp_lhs, or', function() {
      // A !& X, X -> B, X | C    ->     B | C, A -> C
      verify(`
        : A, B, C, X [0 1]
        A !& X
        X -> B
        X | C
        # X !& A, X -> B, X | C

        @custom noleaf A B C
      `);
    });

    it('should morph nands, imp_lhs, or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, X [0 1]
        A !& X
        X -> B
        X | C
        D !& X
        E !& X
        # -> B | C, A -> C, D -> C, E -> C, with X a leaf

        @custom noleaf A B C D E
      `, 'imp,imp,imp,some');
      // imp,imp,imp,some
      // imp,nall,nall,nall,some
    });

    it('should not do trick when there are two ors', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X -> B
        X | C
        X | B
        @custom noleaf A B C
      `, 'imp,nall,some,some');
    });

    it('should not do trick when there are 2x imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        A !& X
        X -> B
        X -> C
        X | C
        @custom noleaf A B C
      `, 'imp,imp,nall,some');
    });
  });

  describe('trick lte_lhs+lte_lhs+lte_rhs+nall+some', function() {

    it('should morph base case of lte_lhs, lte_rhs, or, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B | X
        C !& X
        X <= D
        # A <= X, B | X, !(C & X), X <= D
        # ->   A !& C, B | D, A <= D, C <= B, X leaf

        # A !& C, A <= D
        # <->   (!A)|(C<D)  or  (!A->(C<D))  which we cant model properly in one constraint

        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should morph base case of lte_lhs, lte_lhs, lte_rhs, or, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : X [0 1]
        A <= X
        E <= X
        B | X
        C !& X
        X <= D

        # A <= X, E <= X, B | X, !(C & X), X <= D
        # => A !& C, E !& C, B | D, A <= D, E <= D, C <= B, X leaf
        # => !(A & C), !(E & C), B | D, A?D:1, E?D:1, C?B:1
        # => A !& C, E !& C, B | D, A -> D, E -> D, C -> B

        # A !& C, A <= D
        # <=>   (!A)|(C<D)  or  (!A->(C<D))  which we cant model properly in one constraint

        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not do trick with double lte_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B <= X
        B | X
        C !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,imp,imp,nall,some');
    });

    it('should not do trick with double lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        X <= B
        B | X
        C !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,imp,imp,nall,some');
    });

    it('should not do trick with double or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B | X
        C | X
        C !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,imp,nall,some,some');
    });

    it('should not do trick with double nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B | X
        C !& X
        D !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,imp,nall,nall,some');
    });

    it('should not accept the fourth op being another lte_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B <= X
        B | X
        C !& X
        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not accept the fourth op being another lte_rlhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        X <= B
        B | X
        C !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not accept the fourth op being another or (1)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        B | X
        C | X
        C !& X
        X <= D
        @custom noleaf A B C D
      `, 'imp,nall,some,some');
    });

    it('should not accept the fourth op being another or (2)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B | X
        C | X
        C !& X
        @custom noleaf A B C D
      `, 'imp,nall,some,some');
    });

    it('should not accept the fourth op being another nall (1)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A <= X
        B | X
        C !& X
        D !& X
        @custom noleaf A B C D
      `, 'imp,nall,nall,some');
    });

    it('should not accept the fourth op being another nall (2)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D,E [0 1]
        : X [0 1]
        B | X
        C !& X
        E !& X
        X <= D
        @custom noleaf A B C D E
      `, 'imp,imp,some'); // different trick does apply :)
    });

    it('should do the trick if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B, C, D [0 1]

        A | B
        A <= C
        A !& D

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        # : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        #A !& x16
        #A !& x17
        #A !& x18
        #A !& x19
        #A !& x20
        #A !& x21
        #A !& x22
        #A !& x23
        #A !& x24
        #A !& x25
        #A !& x26
        #A !& x27
        #A !& x28
        #A !& x29
        #A !& x30

        @custom noleaf B C D
        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        # @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,some');
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B, C, D [0 1]

        A | B
        A <= C
        A !& D

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        A !& x16
        A !& x17
        A !& x18
        A !& x19
        A !& x20
        A !& x21
        A !& x22
        A !& x23
        A !& x24
        A !& x25
        A !& x26
        A !& x27
        A !& x28
        A !& x29
        A !& x30

        @custom noleaf B C D
        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,some');
    });

  });

  describe('trick imp_lhs+imp_lhs+imp_rhs+nall+some', function() {

    it('should morph base case of imp_lhs, imp_rhs, or, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B | X
        C !& X
        X -> D
        # A -> X, B | X, !(C & X), X -> D
        # =>   A !& C, B | D, A -> D, C -> B, X leaf

        # A !& C, A -> D
        # <=>   (!A)|(C<D)  or  (!A->(C<D))  which we cant model properly in one constraint

        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should morph base case of imp_lhs, imp_lhs, imp_rhs, or, nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : X [0 1]
        A -> X
        E -> X
        B | X
        C !& X
        X -> D

        # A -> X, E -> X, B | X, !(C & X), X -> D
        # =>    A !& C, E !& C, B | D, A -> D, E -> D, C -> B, X leaf
        # =>    !(A & C), !(E & C), B | D, A?D:1, E?D:1, C?B:1

        # A !& C, A -> D
        # <=>   (!A)|(C<D)  or  (!A->(C<D))  which we cant model properly in one constraint

        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not do trick with double imp_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B -> X
        B | X
        C !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,imp,imp,nall,some');
    });

    it('should not do trick with double imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        X -> B
        B | X
        C !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,imp,imp,nall,some');
    });

    it('should not do trick with double or', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B | X
        C | X
        C !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,imp,nall,some,some');
    });

    it('should not do trick with double nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B | X
        C !& X
        D !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,imp,nall,nall,some');
    });

    it('should not accept the fourth op being another imp_rhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B -> X
        B | X
        C !& X
        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not accept the fourth op being another imp_rlhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        X -> B
        B | X
        C !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,imp,nall,some');
    });

    it('should not accept the fourth op being another or (1)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        B | X
        C | X
        C !& X
        X -> D
        @custom noleaf A B C D
      `, 'imp,nall,some,some');
    });

    it('should not accept the fourth op being another or (2)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B | X
        C | X
        C !& X
        @custom noleaf A B C D
      `, 'imp,nall,some,some');
    });

    it('should not accept the fourth op being another nall (1)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : X [0 1]
        A -> X
        B | X
        C !& X
        D !& X
        @custom noleaf A B C D
      `, 'imp,nall,nall,some');
    });

    it('should not accept the fourth op being another nall (2)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D,E [0 1]
        : X [0 1]
        B | X
        C !& X
        E !& X
        X -> D
        @custom noleaf A B C D E
      `, 'imp,imp,some'); // different trick does apply :)
    });

    it('should do the trick if there arent too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B, C, D [0 1]

        A | B
        A -> C
        A !& D

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        # : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        #A !& x16
        #A !& x17
        #A !& x18
        #A !& x19
        #A !& x20
        #A !& x21
        #A !& x22
        #A !& x23
        #A !& x24
        #A !& x25
        #A !& x26
        #A !& x27
        #A !& x28
        #A !& x29
        #A !& x30

        @custom noleaf B C D
        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        # @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,imp,some');
    });

    it('should skip the trick if there are too many nands', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B, C, D [0 1]

        A | B
        A -> C
        A !& D

        : x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15 [0 1]
        : x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30 [0 1]
        A !& x1
        A !& x2
        A !& x3
        A !& x4
        A !& x5
        A !& x6
        A !& x7
        A !& x8
        A !& x9
        A !& x10
        A !& x11
        A !& x12
        A !& x13
        A !& x14
        A !& x15
        A !& x16
        A !& x17
        A !& x18
        A !& x19
        A !& x20
        A !& x21
        A !& x22
        A !& x23
        A !& x24
        A !& x25
        A !& x26
        A !& x27
        A !& x28
        A !& x29
        A !& x30

        @custom noleaf B C D
        @custom noleaf x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15
        @custom noleaf x16, x17, x18, x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30
        @custom free 1000
      `, 'imp,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,nall,some');
    });

  });

  describe('trick lte_lhs+isall_r with two shared vars', function() {

    it('should remove lte if isall AB subsumes it', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]

        X <= A
        X = all?(A B)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should remove lte if isall BA subsumes it', function() {
      verify(`
        @custom var-strat throw
        : B, A, C [0 1]
        : X [0 1]

        X <= A
        X = all?(B A)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should take the isall 1 path', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]

        X <= A
        X = all?(A B C)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should take the isall 1 ABC path', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]

        X <= A
        X = all?(B A C)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should take the isall 1 BAC path', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]

        X <= A
        X = all?(B A C)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should take the isall 1 BCA path', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : X [0 1]

        X <= A
        X = all?(B C A)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B C
      `);
    });

    it('should not cut if shared var isnt a bool', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 5]
        : X [0 2]

        X <= A
        X = all?(A B)
        # -> remove X <= A, it is subsumed by the isall
        # (if B=0 then X=0, which is always <=A. if B=1, if A=1 then X=1, <= holds. if A=0 then X=0, <= holds.)

        @custom noleaf A B
      `);
    });

    it('should cut even if shared var isnt booly', function() {
      verify(`
        @custom var-strat throw
        : A, B [1 5]
        : X [0 2]

        X <= A
        X = all?(A B)

        @custom noleaf A B
      `);
    });

    it('should cut if shared var isnt booly', function() {
      verify(`
        @custom var-strat throw
        : A [1 5]
        : B 0
        : X [0 2]

        X <= A
        X = all?(A B)

        @custom noleaf A
      `);
    });
  });

  describe('trick lte_lhs+issame', function() {
    //: _2430_ [0,1] # T:true  # ocounts: 2  # ops (2): <= ==? $ meta: [ 0000001000010000: BOOLY, LTE_RHS ]
    // ## _2430_ = _18_ ==? _25_                       # numdom([0,1]) = numdom([1,4]) ==? numdom([1,4])                # indexes: 2430 = 18 ==? 25             # counts: 2 = 6 ==? 6
    // ## _503_ <= _2430_                              # numdom([0,1]) <= numdom([0,1])                                 # args: 503, 2430                       # counts: 8 <= 2
    //R == (A==B), C <= R, R leaf         R=A==?B, C<=R, R leaf
    //=>
    //C?(A==B):1                          C->(A==?B)

    it('should morph the base bool case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 1]
        R = A ==? B
        C <= R
        # => C->(A==?B)    (with R leaf cut)
        @custom noleaf A B C
      `, 'imp,issame');
    });

    it('should solve the base bool case', function() {
      verify(`
        : A, B, C [0 1]
        : R [0 1]
        R = A ==? B
        C <= R
        # => C->(A==?B)    (with R leaf cut)
        @custom noleaf A B C
      `);
    });
  });

  describe('trick lte_lhs+lte_lhs only', function() {

    it('should eliminate a double lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        A <= B
        A <= C
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate a triple lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A <= B
        A <= C
        A <= D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate a triple lte_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, G, H [0 1]
        A <= B
        A <= C
        A <= D
        A <= E
        A <= F
        A <= G
        A <= H
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should work for non-bools as long as A has zero', function() {
      verify(`
        @custom var-strat throw
        : A, D [0 1]
        : B, C [0 10]
        A <= B
        A <= C
        A <= D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should do it for a non-bool booly A', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B, C, D [0 1]
        A <= B
        A <= C
        A <= D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should do it for a non-booly A', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B, C, D [0 1]
        A <= B
        A <= C
        A <= D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should do it for a non-booly vars', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [1 10]
        A <= B
        A <= C
        A <= D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });
  });

  describe('trick imp_lhs+imp_lhs only', function() {

    it('should eliminate a double imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        A -> B
        A -> C
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate a triple imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        A -> B
        A -> C
        A -> D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate a triple imp_lhs', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E, F, G, H [0 1]
        A -> B
        A -> C
        A -> D
        A -> E
        A -> F
        A -> G
        A -> H
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate non-bools as well', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 10]
        A -> B
        A -> C
        A -> D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate non-bool booly A as well', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B, C, D [0 1]
        A -> B
        A -> C
        A -> D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });

    it('should eliminate non-booly A as well', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B, C, D [0 1]
        A -> B
        A -> C
        A -> D
        # -> leaf(A)
        @custom noleaf B C
      `);
    });
  });

  describe('trick isall_arg+plus', function() {

    it('should rewrite combined isAll to a leaf var', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : R *
        : S [0 1]
        R = A + B
        S = R ==? 2
        @custom noleaf A B S
      `, 'isall');
    });

    it('should isall leaf case be reversable', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : R *
        : S [0 1]
        S = R ==? 2
        R = A + B
        @custom noleaf A B S
      `, 'isall');
    });
  });

  describe('trick sum+issame', function() {

    describe('trick plus+issame legacy tests', function() {

      it('should isall base case', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : C [0 2]
          : R [0 1]
          C = A + B
          R = C ==? 2
          @custom noleaf A B R
          @custom free 100
        `, 'isall');
      });

      it('should isall base reverse case', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : C [0 2]
          : R [0 1]
          R = C ==? 2
          C = A + B
          @custom noleaf A B R
          @custom free 100
        `, 'isall');
      });

      it('should isnone base case', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : C [0 2]
          : R [0 1]
          C = A + B
          R = C ==? 0
          @custom noleaf A B R
          @custom free 100
        `, 'isnone');
      });

      it('should not do anything if isall args arent solved', function() {
        verify(`
          @custom var-strat throw
          : B, A [0 1]
          : C [0 2]
          : R [0 1]
          C = B + A
          R = C ==? 2
          @custom noleaf A B R
          @custom free 100
        `, 'isall');
      });

      it('should not do trick if D isnt solved', function() {
        verify(`
          @custom var-strat throw
          : B, A [0 1]
          : C [0 2]
          : R [0 1]
          : D [0 10]
          C = B + A
          R = C ==? D
          @custom noleaf A B R D
          @custom free 100
        `, 'issame,sum');
      });

      it('should not do trick if A isnt bool', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B [0 1]
          : C [0 2]
          : R [0 1]
          : D [0 10]
          C = B + A
          R = C ==? D
          @custom noleaf A B R D
          @custom free 100
        `, 'issame,sum');
      });

      it('should not do trick if B isnt bool', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 10]
          : C [0 2]
          : R [0 1]
          : D [0 10]
          C = B + A
          R = C ==? D
          @custom noleaf A B R D
          @custom free 100
        `, 'issame,sum');
      });

      it('should ignore isxor pattern for now', function() {
        verify(`
          @custom var-strat throw
          : B, A [0 1]
          : C [0 2]
          : R [0 1]
          C = B + A
          R = C ==? 1
          @custom noleaf A B R
          @custom free 100
        `, 'issame,sum');
      });
    });

    describe('to isall', function() {

      describe('with bool args', function() {

        it('should isall base case AB', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 5
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall base case BA', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 5
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should bail if isall const isnt zero nor argcount (1)', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 4
            @custom noleaf A B C D E S
          `, 'issame,sum');
        });

        it('should bail if isall const isnt zero nor argcount (2)', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 100 # way out of range. solves before cutter
            @custom noleaf A B C D E S
          `);
        });

        it('should bail if a sum arg isnt bool nor constant', function() {
          verify(`
            @custom var-strat throw
            : A, B, D, E [0 1]
            : C [0 10]
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 5
            @custom noleaf A B C D E S
          `, 'issame,sum');
        });

        it('should issome if one arg matches R and the others are lower', function() {
          verify(`
            @custom var-strat throw
            : A, B, D, E [0 1]
            : C [0 0 4 4]             # so C fits perfectly in R but cant if any ABDE is set
            : R [0 4]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 4               # either fit C or any of ABDE
            @custom noleaf A B C D E S
          `, 'issame,sum'); // S = some?(all?(A B D E) C), C !& none?(A B D E)
        });

        it('should be failing isall base case BA because missing values', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 3 5 5] # will contain the required 5, but misses 4, so range check should fail
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 5
            @custom noleaf A B C D E S
          `, 'issame,sum'); // if changed, make sure it's correct!
        });

        it('should isall base reverse case', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 1]
            : R [0 5]
            : S [0 1]
            S = R ==? 5
            R = sum(A B C D E)
            @custom noleaf A B C D E S
          `, 'isall');
        });
      });

      describe('bool args and a constant arg', function() {

        it('should isall with a constant 1', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 1
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 5
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with swapped a constant 1', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 1
            : R [0 5]
            : S [0 1]
            S = R ==? 5
            R = sum(A B C D E)
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with a constant 0', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 0
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 4                   # 1 var is 0 so there are 4 vars left that may be 1, S=1 when all are 1
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with swapped a constant 0', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 0
            : R [0 5]
            : S [0 1]
            S = R ==? 4                   # 1 var is 0 so there are 4 vars left that may be 1, S=1 when all are 1
            R = sum(A B C D E)
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with a constant 0 and 1', function() {
          verify(`
            @custom var-strat throw
            : A, C, E [0 1]
            : B 1
            : D 0
            : R [0 5]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 4                   # 1 var is 0 so there are 4 vars left that may be 1, S=1 when all are 1
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with swapped a constant 0 and 1', function() {
          verify(`
            @custom var-strat throw
            : A, C, E [0 1]
            : B 1
            : D 0
            : R [0 5]
            : S [0 1]
            S = R ==? 4
            R = sum(A B C D E)
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with a constant smaller than number of vars', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 3
            : R [0 7]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 7                  # all vars must be set for S=1
            @custom noleaf A B C D E S
          `, 'isall');
        });

        it('should isall with a constant larger than number of vars', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, E [0 1]
            : D 7
            : R [0 11]
            : S [0 1]
            R = sum(A B C D E)
            S = R ==? 11                 # all vars must be set for S=1
            @custom noleaf A B C D E S
          `, 'isall');
        });

      });

      // FIXME: can this not be morphed at all? (issame arg being bool may be special case)
      it('should bail if issame args arent solved', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E, F [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? F
          @custom noleaf A B C D E F S
        `, 'issame,sum');
      });

      describe('leaf R with count=1 and pairs', function() {

        it('should R=all? for [0022]=[01]+[01] regardless of counts', function() {
          verify(`
            @custom var-strat throw
            : A [0 1]
            : B [0 1]
            : R [0 0 2 2]
            R = sum(A B)
            @custom noleaf A B R
            @custom nobool A B R
          `, 'isall'); // R = all?(A B)
        });

        it('should R=all? for [0055]=[01]+[01]+[01]+[01]+[01]', function() {
          verify(`
            @custom var-strat throw
            : A,B,C,D,E [0 1]
            : R [0 0 5 5]
            R = sum(A B C D E)
            @custom noleaf A B C D E R
            @custom nobool A B C D E R
          `, 'isall'); // R = all?(A B C D E)
        });

        it('should isall with two non-bool booly binary domains as non-booly leaf', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R [0 0 17 17]
            R = sum(A B)
            @custom noleaf A B R
            @custom nobool A B R
          `, 'isall'); // R = all?(A B)
        });

        it('should some(all?, nall?) [0055]=[0022]+[0033]', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 2 2]
            : B [0 0 3 3]
            : R [0 0 5 5]
            R = sum(A B)
            @custom noleaf A B R
            @custom nobool A B R
          `, 'isall'); // R = all?(A B)
        });

        it('should isall [0099]=[0022]+[0033]+[0044]', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 2 2]
            : B [0 0 3 3]
            : C [0 0 4 4]
            : R [0 0 9 9]
            R = sum(A B C)
            @custom noleaf A B C R
            @custom nobool A B C
          `, 'isall'); // R = all?(A B C)
        });

        it('should issome [09]=[0022]+[0033]+[0044] (when R is range not pair)', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 2 2]
            : B [0 0 3 3]
            : C [0 0 4 4]
            : R [0 9]
            R = sum(A B C)
            @custom noleaf A B C R
            @custom nobool A B C
          `, 'issome'); // R = some?(A B C)
        });

        it('should not isall when an arg is non-bool', function() {
          verify(`
            @custom var-strat throw
            : A [0 2] # nonbool
            : B [0 0 3 3]
            : C [0 0 4 4]
            : R [0 0 9 9]
            R = sum(A B C)
            @custom noleaf A B C R
            @custom nobool A B C
          `, 'sum'); // should be sum, certainly not isall, could be issome later (leaf)
        });

        it('should all?() [0 0 25 25]=[0055]+[0055]+[0055]+[0055]+[0055]', function() {
          verify(`
            @custom var-strat throw
            : A, B, C, D, E [0 0 5 5]
            : R [0 0 25 25]
            R = sum(A B C D E)
            @custom noleaf A B C D E R
            @custom nobool A B C D E R
          `, 'isall'); // R = all?(A B C D E)
        });
      });

      describe('leaf R with count=2 and nonbool pairs', function() {

        it('should isall with two non-bool booly binary domains on S', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R *
            : S [0 1]
            R = sum(A B)
            S = R ==? 17
            @custom noleaf A B S
            @custom nobool A B S
          `, 'isall'); // S = all?(A B)
        });

        // TODO:
        // for the next: R=sum(A B) with size(A)=size(B)=2 and min(A)=min(B)=0 and max(A)>max(B) (but order is irrelevant)
        // R = sum([0 0 10 10] [0 0 7 7]), S = R ==? 17          ->   S = all?( ... )
        // R = sum([0 0 10 10] [0 0 7 7]), S = R ==? 7           ->   S = A <? B  (note: only when checking lower value)
        // R = sum([0 0 10 10] [0 0 7 7]), S = R ==? 10          ->   S=all?(A B=?0)  (<? cant be used for higher value).

        // TODO: perhaps.
        it.skip('should islte with two non-bool booly binary domains on S when checking the lower value', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R *
            : S [0 1]
            R = sum(A B)
            S = R ==? 7
            @custom noleaf A B S
            @custom nobool A B S
          `, 'islte'); // S = A <? B
        });

        // TODO: perhaps.
        it.skip('should isall,issame with two non-bool booly binary domains on S when checking the higher value', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R *
            : S [0 1]
            R = sum(A B)
            S = R ==? 10
            @custom noleaf A B S
            @custom nobool A B S
          `, 'isall,issame'); // S = all?(A (B==?0))    or     S = nall?(A B) ==? some?(A B)
        });

        // TODO: perhaps.
        it.skip('should issome with two non-bool booly binary domains on S when checking R>0', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R *
            : S [0 1]
            R = sum(A B)
            S = R >? 0
            @custom noleaf A B S
            @custom nobool A B S
          `, 'issome'); // S = some?(A B)
        });

        // TODO: perhaps.
        it.skip('should isnall with two non-bool booly binary domains on S when checking R>0', function() {
          verify(`
            @custom var-strat throw
            : A [0 0 10 10]
            : B [0 0 7 7]
            : R *
            : S [0 1]
            R = sum(A B)
            S = R <? 17
            @custom noleaf A B S
            @custom nobool A B S
          `, 'issome'); // S = nall?(A B)
        });
      });
    });

    describe('to isnone', function() {

      it('should isnone base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone reverse base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          S = R ==? 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with swapped a constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          S = R ==? 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 0 # S=1 only when A B C and E end up 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 1 # S=1 only when A B C and E end up 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant lower than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 3 # S=1 only when A B C and E end up 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant bigger than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : R [0 11]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? 7 # S=1 only when A B C and E end up 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });
    });

    describe('to issome', function() {

      it('should issome base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : X [1 5]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome base case reversed', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : X [1 5]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = X ==? R
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should solve the issome when there is a nonzero arg', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 1
          : X [2 5]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should solve the issome when all args are zero', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E 0
          : X [1 5]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `);
      });

      it('should issome with >1 constant', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 5
          : X [6 9]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : X [1 4]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : X [2 5]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant lower than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : X [4 7]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant larger than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : X [8 11]
          : R [0 11]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'issome');
      });
    });

    describe('to isnall', function() {

      it('should isnone base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : X [0 4]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnone base case reversed', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : X [0 4]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = X ==? R
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should do isnone when there is a nonzero arg', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 1
          : X [1 4]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should solve the isnone when all args are zero', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E 0
          : X [0 4]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X
          @custom noleaf A B C D E S
        `);
      });

      it('should isnall with constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 0
          : X [0 3]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X     # C is unset, but also one of ABDE must be unset
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 1
          : X [1 4]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X     # C is set, but one of ABDE must be unset
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with constant smaller than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 3
          : X [3 6]
          : R [0 10]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X     # C is set, but one of ABDE must be unset
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with constant larger than number of vars', function() {
        verify(`
          @custom var-strat throw
          : A, B, D, E [0 1]
          : C 7
          : X [7 10]
          : R [0 11]
          : S [0 1]
          R = sum(A B C D E)
          S = R ==? X     # C is set, but one of ABDE must be unset
          @custom noleaf A B C D E S
        `, 'isnall');
      });
    });

    describe('to isall and isnall', function() {
      //: _1645_ [0,2] # T:true  # ocounts: 3  # ops (3): + ==? ==? $ meta: [ 0010000001000001: NOT_BOOLY, ISEQ_ARG, SUM_RESULT ]
      // ## _1645_ = _142_ + _202_                       # numdom([0,2]) = numdom([0,1]) + numdom([0,1])                  # indexes: 1645 = 142 + 202             # counts: 3 = 3 + 2
      // ## _1901_ = _1645_ ==? 1                        # numdom([0,1]) = numdom([0,2]) ==? lit(1)                       # indexes: 1901 = 1645 ==? 65535        # counts: 3 = 3 ==? -
      // ## _2001_ = _1645_ ==? 2                        # numdom([0,1]) = numdom([0,2]) ==? lit(2)                       # indexes: 2001 = 1645 ==? 65532        # counts: 5 = 3 ==? -

      it('should be able to apply the trick on two issames on same sum', function() {
        verify(`
          @custom var-strat throw
          : A,B   [0 1]
          : R     [0 2]
          : S,T   [0 1]
          R = A + B
          S = R ==? 1   # S = A !=? B     (only works on bools)
          T = R ==? 2   # T = all?(A B)
          @custom noleaf A B S T
        `, 'isall,isdiff');
      });

      describe('orders', function() {

        it('should 1', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            S = R ==? 1   # S = A !=? B     (only works on bools)
            R = A + B
            T = R ==? 2   # T = all?(A B)
            @custom noleaf A B S T
          `, 'isall,isdiff');
        });

        it('should 2', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            S = R ==? 1   # S = A !=? B     (only works on bools)
            T = R ==? 2   # T = all?(A B)
            R = A + B
            @custom noleaf A B S T
          `, 'isall,isdiff');
        });

        it('should 3', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            T = R ==? 2   # T = all?(A B)
            S = R ==? 1   # S = A !=? B     (only works on bools)
            @custom noleaf A B S T
          `, 'isall,isdiff');
        });

        it('should 4', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? 2   # T = all?(A B)
            T = R ==? 1   # S = A !=? B     (only works on bools)
            @custom noleaf A B S T
          `, 'isall,isdiff');
        });
      });

      //it('should do it to silly pseudo hack', function() {
      //  verify(`
      //    @custom var-strat throw
      //    : A,B   [0 1]
      //    : R     [0 2]
      //    R = A + B
      //    (R ==? 1) !& (R ==? 2)
      //    @custom noleaf A B
      //  `,'isall,isdiff')
      //});

      describe('bails', function() {

        it('should detect the double sum', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            S = R + 1     # bail
            R = A + B
            T = R ==? 2
            @custom noleaf A B S T
          `);
        });

        it('should detect another double sum', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? 1
            T = R + 2   # bail
            @custom noleaf A B S T
          `, 'reject');
        });

        it('should detect missing 1', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? 2
            T = R + 2
            @custom noleaf A B S T
          `, 'reject');
        });

        it('should detect another double sum', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? 1
            T = R + 1
            @custom noleaf A B S T
          `);
        });

        it('should detect missing constant', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? [0 1]
            T = R ==? 1
            @custom noleaf A B S T
        `, 'issame,issame,sum');
        });

        it('should detect missing other constant', function() {
          verify(`
            @custom var-strat throw
            : A,B   [0 1]
            : R     [0 2]
            : S,T   [0 1]
            R = A + B
            S = R ==? 1
            T = R ==? [0 1]
            @custom noleaf A B S T
        `, 'issame,issame,sum');
        });

      });
    });

    it('should presolve when issame literal is not part of R at all', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : R [0 5]
        : S [0 1]
        R = sum(A B C D E)
        S = R ==? 6
        @custom noleaf A B C D E S
      `);
    });

    it('should presolve when issame domain is not part of R at all', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 1]
        : X [6 10]
        : R [0 5]
        : S [0 1]
        R = sum(A B C D E)
        S = R ==? X
        @custom noleaf A B C D E S
      `);
    });
  });

  describe('trick sum+islte', function() {

    describe('to isall', function() {

      it('should isall base case', function() {
        //: _1285_ [0,2] # T:true  # ocounts: 2  # ops (2): + <=? $ meta: [ 0010000000000011: NOT_BOOLY, OTHER, PLUS_RESULT ]
        //## _1285_ = _614_ + _1007_                      # numdom([0,2]) = numdom([0,1]) + numdom([0,1])                  # indexes: 1285 = 614 + 1007            # counts: 2 = 4 + 3
        //## _1286_ = 1 <=? _1285_                        # numdom([0,1]) = lit(1) <=? numdom([0,2])                       # indexes: 1286 = 65535 <=? 1285        # counts: 3 = - <=? 2
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = 5 <=? R                    # R cant be lower than 5 so must be 5 so all vars must be set
          @custom noleaf A B C D E S
        `, 'isall');
      });

      it('should isall swapped case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          S = 5 <=? R                    # R cant be lower than 5 so must be 5 so all vars must be set
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isall');
      });

      it('should isall with constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          S = 4 <=? R                     # without D the vars are an isall
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isall');
      });

      it('should isall with constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : R [0 5]
          : S [0 1]
          S = 5 <=? R
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isall');
      });

      it('should isall with a constant smaller than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : R [0 7]
          : S [0 1]
          S = 7 <=? R
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isall');
      });

      it('should isall with a constant larger than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : R [0 11]
          : S [0 1]
          S = 11 <=? R
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isall');
      });
    });

    describe('to issome', function() {

      it('should issome base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = 1 <=? R                    # R cant be lower than 1 so at least one var must be set
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome swapped case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          S = 1 <=? R                    # R cant be lower than 1 so at least one var must be set
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          S = 1 <=? R
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : R [0 5]
          : S [0 1]
          S = 2 <=? R                  # besides D, which is always set, at least one other var must be set
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant smaller than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : R [0 7]
          : S [0 1]
          S = 4 <=? R                  # besides D, which is always set, at least one other var must be set
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'issome');
      });

      it('should issome with a constant larger than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : R [0 11]
          : S [0 1]
          S = 8 <=? R                  # besides D, which is always set, at least one other var must be set
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'issome');
      });
    });

    describe('to isnone', function() {

      it('should isnone base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R <=? 0                    # S=1 when all args are 0
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone swapped case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          S = R <=? 0                    # S=1 when all args are 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          S = R <=? 0                    # S=1 when all args are 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : R [0 5]
          : S [0 1]
          S = R <=? 1                    # S=1 when all args besides D are 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant smaller than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : R [0 7]
          : S [0 1]
          S = R <=? 3                    # S=1 when all args besides D are 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });

      it('should isnone with a constant larger than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : R [0 11]
          : S [0 1]
          S = R <=? 7                    # S=1 when all args besides D are 0
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnone');
      });
    });

    describe('to isnall', function() {

      it('should isnall base case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          R = sum(A B C D E)
          S = R <=? 4                    # S=1 when at least one arg is zero
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall swapped case', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, D, E [0 1]
          : R [0 5]
          : S [0 1]
          S = R <=? 4                    # S=1 when at least one arg is zero
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with constant 0', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 0
          : R [0 5]
          : S [0 1]
          S = R <=? 3                    # S=1 when at least one arg besides D is zero
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with constant 1', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 1
          : R [0 5]
          : S [0 1]
          S = R <=? 4                    # S=1 when at least one arg besides D is zero
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with a constant smaller than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 3
          : R [0 7]
          : S [0 1]
          S = R <=? 6                    # S=1 when at least one arg besides D is zero
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnall');
      });

      it('should isnall with a constant larger than args', function() {
        verify(`
          @custom var-strat throw
          : A, B, C, E [0 1]
          : D 7
          : R [0 11]
          : S [0 1]
          S = R <=? 10                    # S=1 when at least one arg besides D is zero
          R = sum(A B C D E)
          @custom noleaf A B C D E S
        `, 'isnall');
      });
    });
  });

  describe('trick isall_r+xor', function() {

    it('should isall base case', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : C [0 2]
        : R [0 1]
        R = all?(A B)
        R ^ C
        @custom noleaf A B C
        @custom free 100
      `, 'isnall');
    });

    it('should isall1 base case', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 1]
        : S [0 2]
        : R [0 1]
        R = all?(A B C D)
        R ^ S
        @custom noleaf A B C D S
        @custom free 100
      `, 'isnall');
    });
  });

  describe('trick plus to isSome', function() {
    // see sum (because a plus is just a sum with two args)

    //sum and plus, sum and sum

    it('should not isSome a leaf PLUS because it would be leaf cut anyways', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        : R [0 3]
        : S [0 1]
        R = A + B
        @custom free 100
        @custom noleaf A B R S
      `, 'issome');
    });

    describe('nonbooly binary ops', function() {

      it('should isSome a PLUS and eq because the eq is eliminated leaving the PLUS a leaf', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 3]
          R = A + B
          R == S
          @custom free 100
          @custom noleaf A B R S
        `, 'issome'); // the eq is eliminated because it only turns them into an alias
      });

      it('should not isSome a PLUS and eq when the eq restricts the R too much', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R == S
          @custom free 100
          @custom noleaf A B R S
        `, 'sum'); // the eq is eliminated because it only turns them into an alias
      });

      it('should not isSome a PLUS and diff', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R != S
          @custom free 100
          @custom noleaf A B R S
        `, 'diff,sum');
      });

      it('should not isSome a PLUS and lt', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 10]
          R = A + B
          R < S
          @custom free 100
          @custom noleaf A B R S
        `, 'lt,sum');
      });

      it('should not isSome a PLUS and lte', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 10]
          R = A + B
          R <= S
          @custom free 100
          @custom noleaf A B R S
        `, 'lte,sum');
      });

      it('should not isSome a PLUS and min', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = R - S
          @custom free 100
          @custom noleaf A B R S X
        `, 'minus,sum');
      });

      it('should not isSome a PLUS and DIFF', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          diff(R S X)
          @custom free 100
          @custom noleaf A B R S X
        `, 'diff,sum');
      });

      it('should isSome a PLUS and issame when R is the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          R = X ==? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'issame,issome');
      });

      it('should not isSome a PLUS and issame with R not the result (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = R ==? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'issame,sum');
      });

      it('should not isSome a PLUS and issame with R not the result (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = S ==? R
          @custom free 100
          @custom noleaf A B R S X
        `, 'issame,sum');
      });

      it('should not isSome a PLUS and issame with R the result but also arg (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R = S ==? R
          @custom free 100
          @custom noleaf A B R S
        `, 'issame,sum');
      });

      it('should not isSome a PLUS and issame with R the result but also arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R = R ==? S
          @custom free 100
          @custom noleaf A B R S
        `, 'issame,sum');
      });

      it('should not isSome a PLUS and issame with R the result but also arg (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R = R ==? R # ok ok
          @custom free 100
          @custom noleaf A B R S
        `, 'sum');
      });

      it('should not isSome a PLUS and issame with R the result but also arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R = R ==? S
          @custom free 100
          @custom noleaf A B R S
        `, 'issame,sum');
      });

      it('should not isSome a PLUS and isdiff with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = R !=? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'isdiff,sum');
      });

      it('should not isSome a PLUS and islt with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = R <? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'islt,sum');
      });

      it('should not isSome a PLUS and islte with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          X = R <=? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'islte,sum');
      });

      it('should isSome a PLUS and isdiff with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          R = X !=? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'isdiff,issome');
      });

      it('should isSome a PLUS and islt with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          R = X <? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'islt,issome');
      });

      it('should isSome a PLUS and islte with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          R = X <=? S
          @custom free 100
          @custom noleaf A B R S X
        `, 'islte,issome');
      });
    });

    describe('booly binary ops', function() {

      it('should not isSome a PLUS and AND because the AND restricts the result domain too much', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R & S # this will force R to be [1 3] which wouldnt hold for A=B=C=0
          @custom free 100
          @custom noleaf A B R S
        `, 'sum');
      });

      it('should isSome a PLUS and nall', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R !& S
          @custom free 100
          @custom noleaf A B R S
        `, 'issome,nall');
      });

      it('should isSome a PLUS and or', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R | S
          @custom free 100
          @custom noleaf A B R S
        `, 'issome,some');
      });

      it('should presolve a PLUS and nor', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R !| S
          @custom free 100
          @custom noleaf A B R S
        `);
      });

      it('should isSome a PLUS and xor', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R ^ S
          @custom free 100
          @custom noleaf A B S
          @custom free 100
        `, 'isnone');
      });

      it('should isSome a PLUS and xnor and then eliminate the xnor for being a booly-pseudo-alias', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R !^ S
          @custom free 100
          @custom noleaf A B R S
        `, 'issome');
      });

      it('should isSome a PLUS and imp', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R -> S
          @custom free 100
          @custom noleaf A B R S
        `, 'imp,issome');
      });

      it('should no isSome a PLUS and nimp when the nimp restricts R too much', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          R = A + B
          R !-> S
          @custom free 100
          @custom noleaf A B R S
        `, 'sum');
      });

      it('should isSome a PLUS and nall', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          nall(R S X)
          @custom free 100
          @custom noleaf A B R S X
        `, 'issome,nall');
      });

      it('should isSome a PLUS and some', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = A + B
          some(R S X)
          @custom free 100
          @custom noleaf A B R S X
        `, 'issome,some');
      });

      it('should isSome a PLUS and isAll with R not the result (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = all?(R Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isAll with R not the result (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = all?(Y R Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isAll with R not the result (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = all?(Y Z R)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isAll with R the result and arg (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          R = all?(R X Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isAll with R the result and arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          R = all?(X R Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isAll with R the result and arg (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          R = all?(X Y Z R)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a PLUS and isnall with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = nall?(R Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isnall,issome');
      });

      it('should isSome a PLUS and isnone with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = none?(R Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isnone,issome');
      });

      it('should isSome a PLUS and isSome with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = some?(R Y Z)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'issome,issome');
      });

      it('should isSome a PLUS and isall with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = A + B
          X = all?(R Y)
          @custom free 100
          @custom noleaf A B R S X Y Z
        `, 'isall,issome');
      });
    });
  });

  describe('trick sum to isSome', function() {
    // if you have a sum on some var then that var is zero if and only if all sum args are zero
    // so that's an isSome on that result var if the var is a leaf otherwise.
    // this only works if the var is only used as a booly in other ops

    // the tests in this describe exhaustively check all ops (also improves code coverage)

    it('should isSome a leaf sum because noleaf will still cause counts=2', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        : R [0 3]
        : S [0 1]
        R = sum(A B C)
        @custom noleaf A B C R S
      `, 'issome');
    });

    describe('nonbooly binary ops', function() {

      it('should isSome a sum and eq because the eq is eliminated leaving the sum a leaf', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 3]
          R = sum(A B C)
          R == S
          @custom noleaf A B C R S
        `, 'issome'); // the eq is eliminated because it only turns them into an alias
      });

      it('should not isSome a sum and eq when the eq restricts the R too much', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R == S
          @custom noleaf A B C R S
        `, 'sum'); // the eq is eliminated because it only turns them into an alias
      });

      it('should not isSome a sum and diff', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R != S
          @custom noleaf A B C R S
        `, 'diff,sum');
      });

      it('should not isSome a sum and lt', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 10]
          R = sum(A B C)
          R < S
          @custom noleaf A B C R S
        `, 'lt,sum');
      });

      it('should not isSome a sum and lte', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 10]
          R = sum(A B C)
          R <= S
          @custom noleaf A B C R S
        `, 'lte,sum');
      });

      it('should not isSome a sum and min', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = R - S
          @custom noleaf A B C R S X
        `, 'minus,sum');
      });

      it('should not isSome a sum and diff', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          diff(R S X)
          @custom noleaf A B C R S X
        `, 'diff,sum');
      });

      it('should isSome a sum and issame when R is the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          R = X ==? S
          @custom noleaf A B C R S X
        `, 'issame,issome');
      });

      it('should not isSome a sum and issame with R not the result (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = R ==? S
          @custom noleaf A B C R S X
        `, 'issame,sum');
      });

      it('should not isSome a sum and issame with R not the result (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = S ==? R
          @custom noleaf A B C R S X
        `, 'issame,sum');
      });

      it('should not isSome a sum and issame with R the result but also arg (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R = S ==? R
          @custom noleaf A B C R S
        `, 'issame,sum');
      });

      it('should not isSome a sum and issame with R the result but also arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R = R ==? S
          @custom noleaf A B C R S
        `, 'issame,sum');
      });

      it('should not isSome a sum and issame with R the result but also arg (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R = R ==? R # ok ok
          @custom noleaf A B C R S
        `, 'sum');
      });

      it('should not isSome a sum and issame with R the result but also arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R = R ==? S
          @custom noleaf A B C R S
        `, 'issame,sum');
      });

      it('should not isSome a sum and isdiff with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = R !=? S
          @custom noleaf A B C R S X
        `, 'isdiff,sum');
      });

      it('should not isSome a sum and islt with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = R <? S
          @custom noleaf A B C R S X
        `, 'islt,sum');
      });

      it('should not isSome a sum and islte with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          X = R <=? S
          @custom noleaf A B C R S X
        `, 'islte,sum');
      });

      it('should isSome a sum and isdiff with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          R = X !=? S
          @custom noleaf A B C R S X
        `, 'isdiff,issome');
      });

      it('should isSome a sum and islt with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          R = X <? S
          @custom noleaf A B C R S X
        `, 'islt,issome');
      });

      it('should isSome a sum and islte with R the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          R = X <=? S
          @custom noleaf A B C R S X
        `, 'islte,issome');
      });
    });

    describe('booly binary ops', function() {

      it('should not isSome a sum and AND because the AND restricts the result domain too much', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R & S # this will force R to be [1 3] which wouldnt hold for A=B=C=0
          @custom noleaf A B C R S
        `, 'sum');
      });

      it('should isSome a sum and nall', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R !& S
          @custom noleaf A B C R S
        `, 'issome,nall');
      });

      it('should isSome a sum and or', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R | S
          @custom noleaf A B C R S
        `, 'issome,some');
      });

      it('should presolve a sum and nor', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R !| S
          @custom noleaf A B C R S
        `);
      });

      it('should isSome a sum and xor', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R ^ S
          @custom noleaf A B C R S
          @custom free 100
        `, 'issome,xor');
      });

      it('should isSome a sum and xnor and then eliminate the xnor for being a booly-pseudo-alias', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R !^ S
          @custom noleaf A B C R S
        `, 'issome');
      });

      it('should isSome a sum and imp', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R -> S
          @custom noleaf A B C R S
        `, 'imp,issome');
      });

      it('should no isSome a sum and nimp when the nimp restricts R too much', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          R = sum(A B C)
          R !-> S
          @custom noleaf A B C R S
        `, 'sum');
      });

      it('should isSome a sum and nall', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          nall(R S X)
          @custom noleaf A B C R S X
        `, 'issome,nall');
      });

      it('should isSome a sum and some', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X *
          R = sum(A B C)
          some(R S X)
          @custom noleaf A B C R S X
        `, 'issome,some');
      });

      it('should isSome a sum and isAll with R not the result (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = all?(R Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isAll with R not the result (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = all?(Y R Z)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isAll with R not the result (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = all?(Y Z R)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isAll with R the result and arg (1)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          R = all?(R X Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isAll with R the result and arg (2)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          R = all?(X R Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isAll with R the result and arg (3)', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          R = all?(X Y Z R)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });

      it('should isSome a sum and isnall with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = nall?(R Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'isnall,issome');
      });

      it('should isSome a sum and isnone with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = none?(R Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'isnone,issome');
      });

      it('should isSome a sum and isSome with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = some?(R Y Z)
          @custom noleaf A B C R S X Y Z
        `, 'issome,issome');
      });

      it('should isSome a sum and isall with R not the result', function() {
        verify(`
          @custom var-strat throw
          : A, B, C [0 1]
          : R [0 3]
          : S [0 1]
          : X,Y,Z *
          R = sum(A B C)
          X = all?(R Y)
          @custom noleaf A B C R S X Y Z
        `, 'isall,issome');
      });
    });
  });

  describe('trick diff+xor', function() {

    it('should morph DIFF XOR on bools', function() {
      //## K19 != K47                                   # numdom([0,1]) != numdom([0,1])                                 # args: 19, 47                          # counts: 14 != 10
      //## K19 ^ __127                                  # numdom([0,1]) ^ numdom([0,1])                                  # args: 19, 247                         # counts: 14 ^ 4
      // A != B, A ^ C, bool(A B C)   =>   B == C, A ^ B   (unconditionally otherwise)
      verify(`
        @custom var-strat throw
        : A, B, C [0 1]
        A != B
        A ^ C
        # => B==C, leaf(A)            (the eq will be an alias and the whole thing solves)
        @custom noleaf B C
      `);
    });

    it('should solve DIFF XOR on bools', function() {
      verify(`
        : A, B, C [0 1]
        A != B
        A ^ C
        @custom noleaf B C
      `);
    });

    it('should morph DIFF XOR on same boolypair', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 0 10 10]
        A != B
        A ^ C
        # => B==C, leaf(A)            (the eq will be an alias and the whole thing solves)
        @custom noleaf B C
      `);
    });

    it('should solve DIFF XOR on different boolypairs', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 6 6 10 10]
        : B [0 0 6 6]
        : C [0 0 10 10]
        A != B
        A ^ C
        # => A==0,B==6,C==10
        # => A==[6 6 10 10],B==0,C==0
        @custom noleaf B C
      `);
      //`)
    });
  });

  describe('trick issome+xor', function() {

    it('should issome+xor=isnone base case (AB)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : R, S [0 10]
        R = some?(A B C)
        R ^ S
        # => S != some?(A B C)
        # => S = none?(A B C)
        # => works like R != S here, in the booly sense
        @custom noleaf A B C S
      `, 'isnone');
    });

    it('should not issome+xor=isnone when R isnt booly (AB)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : R, S [0 10]
        R = some?(A B C)
        R ^ S # kiiind of works like R != S here, in the booly sense
        @custom noleaf A B C R S
        @custom nobool R
      `, 'issome,xor');
    });

    it('should issome+xor=isnone base case (BA)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : R, S [0 10]
        R = some?(A B C)
        S ^ R # kiiind of works like R != S here, in the booly sense
        @custom noleaf A B C S
      `, 'isnone');
    });

    it('should not issome+xor=isnone when R isnt booly (BA)', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : R, S [0 10]
        R = some?(A B C)
        S ^ R # kiiind of works like R != S here, in the booly sense
        @custom noleaf A B C S
        @custom nobool R
      `, 'issome,xor');
    });
  });

  describe('trick imp+islte+c+v', function() {
    //: P6K1 [0,8] # T:false  # ocounts: 3  # index = 824  # ops (3): -> <=? sum $ meta: [ 00000000000000010000000100010001: NOT_BOOLY, IMP_LHS, ISLTE_ARG, SUM_RESULT ]
    //## P6K1 = sum( K24 K38 K42 __155 __206 __209 __245 __246 )   # numdom([0,8]) = sum( numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) numdom([0,1]) )    # indexes: 824 = 24 38 42 275 326 329 365 366    # counts: 3 = sum( 4 6 7 3 4 7 3 7 )
    //## P6K1 -> __692                                # numdom([0,8]) -> numdom([0,1])                                 # args: 824, 834                        # counts: 3 -> 2
    //## __692 = 2 <=? P6K1                           # numdom([0,1]) = lit(2) <=? numdom([0,8])                       # indexes: 834 = 65533 <=? 824          # counts: 2 = - <=? 3

    //: __692 [0,1] # T:false  # ocounts: 2  # index = 834  # ops (2): -> <=? $ meta: [ 00000000000000000000000000100010: BOOLY, OTHER, IMP_RHS ]
    //## P6K1 -> __692                                # numdom([0,8]) -> numdom([0,1])                                 # args: 824, 834                        # counts: 3 -> 2
    //## __692 = 2 <=? P6K1                           # numdom([0,1]) = lit(2) <=? numdom([0,8])                       # indexes: 834 = 65533 <=? 824          # counts: 2 = - <=? 3

    it('should morph base case', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 5]
        : X [0 8]
        : Y [0 1]
        X = sum(A B)
        X -> Y
        Y = 2 <=? X
      `, 'sum');
    });

    it('should morh case without other ops', function() {
      verify(`
        @custom var-strat throw
        : X [0 8]
        : Y [0 1]
        X -> Y
        Y = 2 <=? X
      `);
    });

    it('should not do this trick if the constant is 0', function() {
      verify(`
        @custom var-strat throw
        : X [0 8]
        : Y [0 1]
        X -> Y
        Y = 0 <=? X
      `);
    });

    it('should solve base case', function() {
      verify(`
        : X [0 8]
        : Y [0 1]
        X -> Y
        Y = 2 <=? X
      `);
    });
  });

  describe('trick imp+islte+v+c', function() {

    it('should morph base case', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 5]
        : X [0 8]
        : Y [0 1]
        X = sum(A B)
        X -> Y
        Y = X <=? 2
      `, 'sum');
    });

    it('should morh case without other ops', function() {
      verify(`
        @custom var-strat throw
        : X [0 8]
        : Y [0 1]
        X -> Y
        Y = X <=? 2
      `);
    });

    it('should solve base case', function() {
      verify(`
        : X [0 8]
        : Y [0 1]
        X -> Y
        Y = X <=? 2
      `);
    });
  });

  describe('trick some+xor', function() {
    //: __502 [0,1] # T:false  # ocounts: 2  # index = 623  # ops (2): ^ | $ meta: [ 00000000000000101000000000000000: BOOLY, SOME, XOR ]
    //## P0K0 ^ __502                                 # numdom([0,13]) ^ numdom([0,1])                                 # args: 609, 623                        # counts: 3 ^ 2
    //## __502 | __503                                # numdom([0,1]) | numdom([0,1])                                  # args: 623, 624                        # counts: 2 | 2

    it('should morph base case', function() {
      verify(`
        @custom var-strat throw
        : A [0 13]          # not a pair !!
        : B, C [0 1]
        A ^ B
        B | C
        # => A -> B
        @custom noleaf A C
        @custom nobool A
      `, 'imp');
    });

    it('should solve base case', function() {
      verify(`
        : A [0 13]          # not a pair !!
        : B, C [0 1]
        A ^ B
        B | C
        # => A -> B
        @custom noleaf A C
        @custom nobool A
      `);
    });
  });

  describe('old e2e tests', function() {

    it('was giving problems in e2e', function() {
      verify(`
        : A [1 1 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 5
        C !^ A
        # -> should remove the !^

        X = A + B # prevent presolve on xnor
        @custom noleaf A B X
      `);
    });

    it('should work without hashing the var names in the dsl', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : C [0 10]
        A != B
        A != C
        B != C
        C = A + B
      `, undefined, undefined, {hashNames: false});
    });

    it('should work when hashing the var names in the dsl', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : C [0 10]
        A != B
        A != C
        B != C
        C = A + B
      `, undefined, undefined, {hashNames: false});
    });

    it('should solve a sum that mimics a isnall', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        : R [0 3] # n-1
        R = sum(A B C D)
        @custom noleaf A B C D
      `);
    });


    describe('xnor', function() {

      it('should solve a sum that mimics a isnall with C>0', function() {
        verify(`
        : A [0 0 5 5]
        : B [0 10]
        : C [1 1]
        C = B ==? 5
        C !^ A
        # -> should remove the !^
        @custom noleaf A B
      `);
      });

      it('should solve an xnor but preserve pseudo alias status', function() {
        // in particular this asserts that the post solving alias code doesnt
        // enforce a strict alias (instead of the "xnor" alias we expect)
        verify(`
        : A, B [0 10]
        B !^ A
        B > 5
        @custom noleaf A B
      `);
      });

      it('should solve an xnor with different outcomes v2', function() {
        // in particular this asserts that the post solving alias code doesnt
        // enforce a strict alias (instead of the "xnor" alias we expect)
        verify(`
        : A, B [0 10]
        : C [0 10]
        B !^ A                      # this line should end up a pseudo alias. if one 0, both 0. else both any non-zero.
        nall(A B C)
        @custom noleaf C
      `);
      });

      it('should solve an xnor with different outcomes v3', function() {
        // in particular this asserts that the post solving alias code doesnt
        // enforce a strict alias (instead of the "xnor" alias we expect)
        verify(`
        : A, B [0 10]
        : C 0
        B !^ A                      # this line should end up a pseudo alias. if one 0, both 0. else both any non-zero.
        nall(A B C)
        @custom noleaf C
      `);
      });

      it('should trip up on the poison', function() {
        verify(`
        : A, B [0 10]
        : C 0
        B !^ A

        X = A + B # prevent presolve on xnor
        @custom noleaf A B X
      `);
      });

      it('should solve an xnor with different outcomes v4; should listen to fdo result', function() {
        // in particular this asserts that the post solving alias code doesnt
        // enforce a strict alias (instead of the "xnor" alias we expect)
        verify(`
        : A, B [0 10]
        : C, D [0 10]
        B !^ A                      # this line should end up a pseudo alias. if one 0, both 0. else both any non-zero.
        nall(A B C D)
        @custom noleaf C
      `);
      });

      it('should solve an xnor with different outcomes v5; should not force alias', function() {
        // in particular this asserts that the post solving alias code doesnt
        // enforce a strict alias (instead of the "xnor" alias we expect)
        // REGARDLESS: B CANNOT BE 6! the domain did not start with a 6
        //expect(solution).to.eql({A: 6, B: [1, 5, 7, 10], C: 0, D: 7});
        // (verify will confirm validity as that's the point)
        verify(`
        : A [0 10]
        : B [0 5 7 10]
        : C, D [0 10]
        B !^ A                      # this line should end up a pseudo alias. if one 0, both 0. else both any non-zero.
        nall(A B C D)
        @custom noleaf C D
      `);
      });
    });

    describe('deduper', function() {

      it('should properly alias a deduped reifier R=0', function() {
        verify(`
        : A, B [0 10]
        : R, S [0 1]
        R = A ==? B
        S = A ==? B
        # make sure R == S
        @custom noleaf A B R S
      `);
      });

      it('should properly alias a deduped reifier with R=1', function() {
        verify(`
        : A, B [0 10]
        : R, S [0 1]
        R = A ==? B
        S = A ==? B
        # make sure R == S
        @custom noleaf A B R S
      `);
      });
    });
  });

  describe('regressions', function() {

    it('ended up in empty domain because imp-leaf was wrong', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, X [0 1]
        X <= A
        X | B
        @custom noleaf B C
      `);
    });

    it('adding all the vars except A fixes this', function() {
      verify(`
        @custom var-strat throw
        : A, B, C *
        A != B
        A <= C
        @custom noleaf B
      `);
    });

    it('this uncovered a case where looping over op args was using a static offset', function() {
      verify(`
        : A, B, C [0 1]
        some(A B C)
        diff(A B)
      `);
    });

    it('triggered a problem with sum and constants', function() {
      verify(`
        : A [0 0 10 10]
        : B [0 0 7 7]
        : R *
        : S [0 1]
        R = sum(A B)
        S = R ==? 7
      `);
    });

    describe('was rejecting a value where it shouldnt', function() {

      it('main case', function() {
        verify(`
          : A,B [0, 3]
          : C [0, 1]
          : P, Q  [0 2]

          a0 = A ==? 0
          a1 = A ==? 1
          b0 = B ==? 0
          b1 = B ==? 1
          c0 = C ==? 0
          c1 = C ==? 1
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 c1)
          p0 = P ==? 0
          p2 = P >=? 2
          q0 = Q ==? 0
          q2 = Q >=? 2
          some( p0 p2 )
          some( q0 q2 )
        `);
      });

      it('[proof that there is a solution]', function() {
        verify(`
          : A,B 0
          : C 0

          : P, Q *

          a0 = A ==? 0
          a1 = A ==? 1
          b0 = B ==? 0
          b1 = B ==? 1
          c0 = C ==? 0
          c1 = C ==? 1
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 c1)
          p0 = P ==? 0
          p2 = P >=? 2
          q0 = Q ==? 0
          q2 = Q >=? 2
          some( p0 p2 )
          some( q0 q2 )
        `);
      });

      it('subcase1', function() {
        verify(`
          : A,B,C,D,E,J,K,L [0 3]
          : F,G [0 1]
          : $__1, $__2, $__3, $__4, $__5, $__6, $__7, $__8, $__9, $__10 [0 1]

          J ^ $__1
          G != $__4
          B ^ $__2
          F != $__6
          D ^ $__3
          A ^ $__5
          K ^ $__7
          E ^ $__8
          L ^ $__9
          C ^ $__10
        `);
      });

      it('subcase2 pre cut', function() {
        verify(`
          : A,B [0, 3]
          : C [0, 1]
          : P, Q  [0 2]

          : a0,a1,b0,b1,c0,c1,p0,p2,q0,q2 [0 1]

          a0 ^ A
          a1 = A ==? 1
          b0 ^ B
          b1 = B ==? 1
          C != c0
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 C)

          p0 ^ P
          p2 = 2 <=? P
          q0 ^ Q
          q2 = 2 <=? Q

          p0 | p2
          q0 | q2
        `);
      });

      it('subcase2 pre cut v2', function() {
        verify(`
          : A,B [0, 3]
          : C [0, 1]
          : P, Q  [0 2]

          : a0,a1,b0,b1,c0,c1,p0,p2,q0,q2 [0 1]
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 C)

          p0 ^ P
          p2 = 2 <=? P
          q0 ^ Q
          q2 = 2 <=? Q

          p0 | p2
          q0 | q2

          @custom noleaf a0 b0 c0 a1 b1 C
        `);
      });

      it('was oobing (1)', function() {
        verify(`
          : A,B [0, 3]
          : C [0, 1]
          : P, Q  [0 2]

          : a0,a1,b0,b1,c0,c1,p0,p2,q0,q2 [0 1]
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 C)

          p0 ^ P
          p2 = 2 <=? P
          q0 ^ Q
          q2 = 2 <=? Q

          q0 | q2

          @custom noleaf a0 b0 c0 a1 b1 C
        `);
      });

      it('was introducing new values', function() {
        verify(`
          : A,B [0, 3]
          : C [0, 1]
          : P, Q  [0 2]

          : a0,a1,b0,b1,c0,c1,p0,p2,q0,q2 [0 1]
          P = sum(a0 b0 c0)
          Q = sum(a1 b1 C)

          p0 ^ P
          p2 = 2 <=? P
          q0 ^ Q
          q2 = 2 <=? Q

          q0 | q2

          @custom noleaf a0 b0 c0 a1 b1 C
        `);
      });

      it('was oobing', function() {
        verify(`
          : P, Q  [0 2]
          : p2,q0,q2 [0 1]

          p2 = 2 <=? P
          q2 = 2 <=? Q
          q0 | q2
        `);
      });
    });

    it('was solved to an incorrect result', function() {
      verify(`
        : A [0,0,3,3]
        : B [0,0,6,6]
        : C [0,0,9,9]
        A <= B
        C ^ A
        @custom noleaf B C
      `);
      // was solving to:
      // { A: [ 0, 0, 3, 3 ], B: 0, C: 9 }
      // (which could lead to A being larger than B
    });

    it('lteneq was solving to incorrect result', function() {
      verify(`
        : A [0,0,3,3]
        : B [0,0,6,6]
        : C [0,0,9,9]
        A <= B
        C != A
        @custom noleaf B C
      `);

      // was solving to:
      // { A: [ 0, 0, 3, 3 ], B: 0, C: 9 }
      // (which could lead to A being larger than B
      // (caused by incorrectly resolving the diff-inversion solvestack)
    });

    it('plus solving to incorrect result', function() {
      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : R [0,100]
        B <= A
        R = C + A
        @custom noleaf B C
      `);

      // was solving to { A: 0, B: [ 0, 1 ], C: 0, R: 0 }
      // (B<=A so this violates the lte)
      // was caused by a morph (lte to imp) that wasnt adding a solvestack to actually enforce the lte (rather than imp)
    });

    it('lteneq solvestack problem where X was empty', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        B <= A
        C != A
        @custom noleaf B C
      `);

      // valid example: A=[0099],B=0,C=0
    });

    it('isdff resolving incorrectly', function() {
      verify(`
        : A [0,2]
        : B [0,2]
        : C [0,2]
        : R [0,2]
        : S [0,2]
        R = A !=? B
        S = A |? C
        @custom noleaf B C
      `);
    });

    it('islte caused an empty domain', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        R = A <=? C
        B != R
        @custom noleaf B C
      `);

      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        R = A <? C
        R -> B
        @custom noleaf B C
      `);
    });

    it('islte+and caused invalid result', function() {
      verify(`
        : A [0,0,3,3]
        : B [0,0,6,6]
        : C [0,0,9,9]
        : R [0,1]
        R = C <=? A
        B & A
        @custom noleaf B C
      `);
    });

    it('issome xor bad result', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        R = C |? A
        B ^ R
        @custom noleaf B C
      `);
    });

    it('plus+and shared arg bad result', function() {
      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : R [0,100]
        R = C + A
        B & A
        @custom noleaf B C
      `);
    });

    it('another plus+and shared arg bad result', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,100]
        R = C + A
        B & A
        # => R:[9 9 12 12] = C:[0 0 3 3] + 9
        @custom noleaf B C
      `);
    });

    it('plus+and shared R bad result', function() {
      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : R [0,100]
        R = C + A
        B & R
        # => R:[1 2] = some(A + C)
        # => some(A C)
        @custom noleaf B C
      `);
    });

    it('xnor+islte leading to empty domain', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        R = A <=? C
        B !^ R
        @custom noleaf B C
      `);
    });

    it('xnor+islt leading to empty domain', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        R = C <? A
        B !^ R
        @custom noleaf B C
      `);
    });

    it('xor+isall bad result', function() {
      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : R [0,1]
        R ^ B
        R = A &? C
        @custom noleaf B C
      `);
    });

    it('isdiff+sum leads to bad R', function() {
      verify(`
        : A [0,100]
        : B [0,10]
        : C [0,100]
        : D [0,100]
        : R [0,1]
        C = A !=? B
        S = D + C
        @custom noleaf B C R S
      `);
    });

    it('was being lame and im tired of it', function() {
      verify(`
        : A [0,100]
        : B [0,0,9,9]
        : C [0,0,6,6]
        : D [0,0,3,3]
        : R [0,1]
        S = D / R
        C = A !=? B
        @custom noleaf B C R S
      `);
    });

    it('ended in wrong result', function() {
      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : R [0,1]
        R = C <=? A
        B & R
        @custom noleaf A B C
      `);
    });

    it('islt+islte ended in bad result', function() {
      verify(`
        : A [0,1]
        : B [0,0,9,9]
        : C [0,0,6,6]
        : D [0,0,3,3]
        : R [0,1]
        R = D <? C
        R = B <=? A
        @custom noleaf A B C D
      `);

      verify(`
        : A [0,1]
        : B [0,1]
        : C [0,1]
        : D [0,1]
        : R [0,1]
        R = A <=? B
        R = D <? C
        @custom noleaf A B C D
      `);
    });

    it('should have same behavior', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        : S [0,100]
        S = C / A
        R = B / A
        @custom noleaf B C R S
      `);

      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        : S [0,100]
        S = C / A
        R = B / A
        @custom noleaf B C R S
      `);
    });

    it('sum+div incorrectly said bad result because it did not expect new values', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,6,6]
        : C [0,0,3,3]
        : R [0,1]
        : S [0,100]
        S = C + A
        R = B / A
        @custom noleaf B C R S
      `);
    });

    it('imp+islte trick was failing', function() {
      verify(`
        : A, B [0 3]
        : C [0 1]
        : P, Q [0 2]
        : a0, a1, b0, b1, c0 [0 1]
        : p2, q2 [0 1]

        A ^ a0
        a1 = A ==? 1
        B ^ b0
        b1 = B ==? 1
        C ^ c0
        P = sum(a0 b0 c0)
        Q = sum(C a1 b1)
        P -> p2
        p2 = 2 <=? P
        Q -> q2
        q2 = 2 <=? Q
      `);
    });

    it('throws unknown var error', function() {
      verify(`
        : a,b,c,d,e,g [0 1]
        : f [0 6]
        : r [0 1]

        A = b ==? 1
        B = all?( a b )
        r = f ==? 0
        C = all?( c d r )
        D = f ==? 5

        B | e
        A -> C
        g | D
      `);
    });

    it('verifier wasnt expecting a comma in an arg list', function() {
      verify(`
        : A, B [0 1]
        : R *
        R = sum(A, B)
      `);
    });

    it('throws "alias is itself" error (to investigate)', function() {
      verify(`
        : R  [0 1]
        : X, Y, Z [0 1]
        R = 0 |? X

        (Y |? Z) == (0 |? X)
        (0 |? X) == (Y |? Z)
      `, undefined, {skipVerify: true}); // contains complex dsl
    });

    it('caused problem for `@custom targets` in intermediate dsl', function() {
      verify(`
        : A [0, 5]
        : B [0 1]
        B = A ==? 1
        B == sum( [0 1] [0 1] )
        A == 1
      `, undefined, {skipVerify: true}); // contains complex dsl (domain lits in arg list)
    });

    it('was setting empty domain in solve stack because its constants werent added to sum', function() {
      verify(`
        : R *
        : X [0 1]
        : Y [0 1]
        X = 1 |? Y
        # the number of args (80) to R was key to the test. any fewer and the error wouldnt proc.
        R = sum( X [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] [0 1] )
        0 -> (R ==? 81)
      `, undefined, {skipVerify: true}); // contains complex dsl (domain lits in arg list)
    });

    it('should solve tiny hitori sub-problem', function() {
      /*
        The test below is the result of parsing this problem:

        # grid:
        #  [9][2]
        #  [2][0]

        : EMPTY 0
        : TOO_FAR 82

        : $11 9
        : $21 2
        : $12 2
        : $22 0

        : D$12$11, D$12$12, D$12$21, D$12$22 [0 82]

        ($11 ==? EMPTY) == (D$12$11 ==? TOO_FAR)
        ($11 !=? EMPTY) -> some?( (99 <? D$12$11) (D$12$21 <? D$12$11) (99 <? D$12$11) (D$12$12 <? D$12$11) )
        ($12 ==? EMPTY) == (D$12$12 ==? TOO_FAR)
        D$12$12 == 0
        ($21 ==? EMPTY) == (D$12$21 ==? TOO_FAR)
        ($21 !=? EMPTY) -> some?( (D$12$11 <? D$12$21) (99 <? D$12$21) (99 <? D$12$21) (D$12$22 <? D$12$21) )
        ($22 ==? EMPTY) == (D$12$22 ==? TOO_FAR)
        ($22 !=? EMPTY) -> some?( (D$12$12 <? D$12$22) (99 <? D$12$22) (D$12$21 <? D$12$22) (99 <? D$12$22) )
       */

      verify(`
        # vars:
        : D$12$11 [0,82]
        : D$12$12 [0,82]
        : D$12$21 [0,82]
        : D$12$22 [0,82]
        : $$1 [0,1]
        : $$2 [0,1]
        : $$3 [0,1]
        : $$4 [0,1]
        : $$5 [0,1]
        : $$6 [0,1]
        : $$7 [0,1]
        : $$8 [0,1]
        : $$9 [0,1]
        : $$10 [0,1]
        : $$11 [0,1]
        : $$12 [0,1]
        : $$13 [0,1]
        : $$14 [0,1]
        : $$15 [0,1]
        : $$16 [0,1]
        : $$17 [0,1]
        : $$18 [0,1]
        : $$19 [0,1]
        : $$20 [0,1]
        : $$21 [0,1]
        : $$22 [0,1]
        : $$23 [0,1]
        : $$24 [0,1]
        : $$25 [0,1]
        : $$26 [0,1]


        # Constraints:
        $$1 = 9 ==? 0
        $$2 = D$12$11 ==? 82
        $$1 == $$2
        $$3 = 9 !=? 0
        $$4 = 99 <? D$12$11
        $$5 = D$12$21 <? D$12$11
        $$6 = 99 <? D$12$11
        $$7 = D$12$12 <? D$12$11
        $$8 = some?( $$4 $$5 $$6 $$7 )
        $$3 -> $$8
        $$9 = 2 ==? 0
        $$10 = D$12$12 ==? 82
        $$9 == $$10
        D$12$12 == 0
        $$11 = 2 ==? 0
        $$12 = D$12$21 ==? 82
        $$11 == $$12
        $$13 = 2 !=? 0
        $$14 = D$12$11 <? D$12$21
        $$15 = 99 <? D$12$21
        $$16 = 99 <? D$12$21
        $$17 = D$12$22 <? D$12$21
        $$18 = some?( $$14 $$15 $$16 $$17 )
        $$13 -> $$18
        $$19 = 0 ==? 0
        $$20 = D$12$22 ==? 82
        $$19 == $$20
        $$21 = 0 !=? 0
        $$22 = D$12$12 <? D$12$22
        $$23 = 99 <? D$12$22
        $$24 = D$12$21 <? D$12$22
        $$25 = 99 <? D$12$22
        $$26 = some?( $$22 $$23 $$24 $$25 )
        $$21 -> $$26

        # Meta:
        @custom targets all # 4 / 30
      `);
    });

    it('verify reported bad iseq solve', function() {
      verify(`
        : $$1 [0,1]
        $$1 = 9 ==? 0
      `);
    });

    it('had an incorrect solve stack state', function() {
      verify(`
        # vars:
        : D$12$11 [0,82]
        : D$12$12 [0,82]
        : D$12$21 [0,82]
        : D$12$22 [0,82]
        : $$1 [0,1]
        : $$2 [0,1]
        : $$3 1
        : $$4 [0,1]
        : $$5 [0,1]
        : $$6 [0,1]
        : $$7 [0,1]
        : $$8 1
        : $$9 [0,1]
        : $$10 [0,1]
        : $$11 [0,1]
        : $$12 [0,1]
        : $$13 1
        : $$14 [0,1]
        : $$15 [0,1]
        : $$16 [0,1]
        : $$17 [0,1]
        : $$18 1
        : $$19 1
        : $$20 [0,1]
        : $$21 [0,1]
        : $$22 [0,1]
        : $$23 [0,1]
        : $$24 [0,1]
        : $$25 [0,1]
        : $$26 [0,1]

        : A, B, C, D, E, F, G, H [0 1]

        A = D$12$11 ==? 82
        B = D$12$12 ==? 82
        C = D$12$21 ==? 82
        D = D$12$22 ==? 82

        E = D$12$21 <? D$12$11
        F = D$12$12 <? D$12$11
        G = D$12$22 <? D$12$21
        H = D$12$11 <? D$12$21

        some( E F )
        some( G H )
      `);
    });

    it('was resolved incorrectly (A=0,C==82 leaving 0=82==?82 is falsum). solvestack for issame leaf trick was not updating if R was solved which left A and B unsound', function() {
      verify(`
        : A, B [0 1]
        : C, D [0,82]

        A = C ==? 82
        B = D ==? 82
        some( A B )
      `);
    });

    it('exposed a bug in solve stack flow for isdiff when args were solved and equal', function() {
      // teh lazy not cleanup
      verify(`
        : C0 [0,2,4,4]
        : C1 [0,4]
        : C2 [0,4]
        : N0 4
        : N2 [0,4]
        : D0 [0,4]
        : D1 [0,4]
        : D2 2
        : D3 [0,4]
        : D4 [0,4]
        : S0 [0,4]
        : S1 [0,4]
        : S2 [0,4]
        : S3 [0,4]
        : S4 [0,4]
        : P1 [0,4]
        : P2 [0,4]
        : P3 [0,4]
        : $$1 [0,1]
        : $$2 [0,1]
        : $$3 [0,1]
        : $$4 [0,1]
        : $$5 [0,1]
        : $$6 [0,1]
        : $$7 [0,1]
        : $$8 [0,1]
        : $$9 [0,1]
        : $$10 [0,1]
        : $$11 [0,1]
        : $$12 [0,1]
        : $$13 [0,1]
        : $$14 [0,1]
        : $$15 [0,1]
        : $$16 [0,1]
        : $$17 [0,1]
        : $$18 [0,1]
        : $$19 [0,1]
        : $$20 [0,1]
        : $$21 [0,1]
        : $$22 [0,1]
        : $$23 [0,1]
        : $$24 [0,1]
        : $$25 [0,1]
        : $$26 [0,1]
        : $$27 [0,1]
        : $$28 [0,1]
        : $$29 [0,1]
        : $$30 [0,1]
        : $$31 [0,1]
        : $$32 [0,1]
        : $$33 [0,1]
        : $$34 [0,1]
        : $$35 [0,1]
        : $$36 [0,1]


        # Constraints:
        diff( C0 C1 C2 )
        diff( D0 D1 D2 D3 D4 )
        diff( S0 S1 S2 S3 S4 )
        $$1 = N0 ==? 1
        $$1 = C0 ==? 2
        $$3 = N2 ==? 1
        $$3 = C2 ==? 2
        $$5 = C0 ==? 1
        $$5 = C1 ==? 3
        $$7 = C1 ==? 1
        $$7 = C2 ==? 3
        $$9 = C2 ==? 1
        $$9 = D2 ==? 1
        $$11 = S2 ==? 3
        $$11 = P2 ==? 0
        $$13 = S0 ==? 2
        $$13 = C0 ==? 4
        $$15 = S0 ==? 0
        $$15 = P1 ==? 1
        $$17 = S2 ==? 0
        $$18 = P1 ==? 1
        $$19 = P3 ==? 1
        $$20 = $$18 !=? $$19
        $$21 = S4 ==? 0
        $$21 = P3 ==? 1
        $$23 = S0 ==? 1
        $$23 = D0 ==? 0
        $$25 = S1 ==? 1
        $$25 = D1 ==? 0
        $$27 = S2 ==? 1
        $$27 = D2 ==? 0
        $$29 = S3 ==? 1
        $$29 = D3 ==? 0
        $$31 = S4 ==? 1
        $$31 = D4 ==? 0
        $$33 = N2 ==? 2
        $$33 = S2 ==? 4
        $$35 = N0 ==? 4
        $$35 = C1 ==? 0
      `);
    });

    it('ml2dsl caused a NORDOM error when problem rejected (it is not expecting empty domains)', function() {
      verify(`
        : D4 [3 4]
        diff(3 4 D4)
      `, 'reject');
    });

    it('problem with solution did not solve', function() {
      verify(`
        # note: the solution is A=3,B=1
        : A [0 0 3 3]
        : B [0 1]
        B = A ==? 3
        A != 1
        A != 0
      `);
    });

    it('(TODO) should not accept bad array (add to DSL test)', function() {
      verify(`
        # note: a cell value 0 means the cell is blacked out
        # this helps because that makes all those cells
        # booly-pairs which is highly optimizable with logic ops

        : EMPTY 0


        # intial domains (domains that include 0 are values not unique in its row or col)
        : $11 [0 1]
        : $21 0
        : $31 [0 1]
        : $41 [0 1]
        : $51 [0 1]
        : $61 0
        : $71 [0 1]
        : $81 [0 1]
        : $91 [0 1]
        : $12 [0 1]
        : $22 0
        : $32 [0 1]
        : $42 0
        : $52 [0 1]
        : $62 0
        : $72 [0 1]
        : $82 0
        : $92 [0 1]
        : $13 [0 1]
        : $23 [0 1]
        : $33 [0 1]
        : $43 0
        : $53 [0 1]
        : $63 [0 1]
        : $73 [0 1]
        : $83 0
        : $93 [0 1]
        : $14 0
        : $24 0
        : $34 0
        : $44 0
        : $54 0
        : $64 0
        : $74 0
        : $84 0
        : $94 [0 1]
        : $15 [0 1]
        : $25 [0 1]
        : $35 [0 1]
        : $45 0
        : $55 [0 1]
        : $65 [0 1]
        : $75 [0 1]
        : $85 0
        : $95 [0 1]
        : $16 [0 1]
        : $26 0
        : $36 [0 1]
        : $46 0
        : $56 [0 1]
        : $66 0
        : $76 [0 1]
        : $86 0
        : $96 [0 1]
        : $17 [0 1]
        : $27 0
        : $37 [0 1]
        : $47 0
        : $57 [0 1]
        : $67 0
        : $77 [0 1]
        : $87 0
        : $97 [0 1]
        : $18 [0 1]
        : $28 0
        : $38 [0 1]
        : $48 0
        : $58 [0 1]
        : $68 0
        : $78 [0 1]
        : $88 0
        : $98 [0 1]
        : $19 [0 1]
        : $29 0
        : $39 [0 1]
        : $49 [0 1]
        : $59 [0 1]
        : $69 0
        : $79 [0 1]
        : $89 [0 1]
        : $99 [0 1]


        # trying to get distance between each tile A and B
        : TOO_FAR 50
        : NEVER 99

        : D$12$11 [0,0,99,99]
        : D$12$12 0
        : D$12$13 [2,1,99,99]
        : D$12$14 99
        : D$12$15 [4,2,99,99]
        : D$12$16 [5,3,99,99]
        : D$12$17 [6,3,99,99]
        : D$12$18 [7,4,99,99]
        : D$12$19 [8,4,99,99]
        : D$12$21 99
        : D$12$22 99
        : D$12$23 [3,3,99,99]
        : D$12$24 99
        : D$12$25 [5,6,99,99]
        : D$12$26 99
        : D$12$27 99
        : D$12$28 99
        : D$12$29 99
        : D$12$31 [2,1,99,99]
        : D$12$32 [3,3,99,99]
        : D$12$33 [4,5,99,99]
        : D$12$34 99
        : D$12$35 [6,10,99,99]
        : D$12$36 [7,13,99,99]
        : D$12$37 [8,15,99,99]
        : D$12$38 [9,18,99,99]
        : D$12$39 [10,20,99,99]
        : D$12$41 [3,2,99,99]
        : D$12$42 99
        : D$12$43 99
        : D$12$44 99
        : D$12$45 99
        : D$12$46 99
        : D$12$47 99
        : D$12$48 99
        : D$12$49 [11,28,99,99]
        : D$12$51 [4,2,99,99]
        : D$12$52 [5,6,99,99]
        : D$12$53 [6,10,99,99]
        : D$12$54 99
        : D$12$55 [8,18,99,99]
        : D$12$56 [9,23,99,99]
        : D$12$57 [10,27,99,99]
        : D$12$58 [11,32,99,99]
        : D$12$59 [12,36,99,99]
        : D$12$61 99
        : D$12$62 99
        : D$12$63 [7,13,99,99]
        : D$12$64 99
        : D$12$65 [9,23,99,99]
        : D$12$66 99
        : D$12$67 99
        : D$12$68 99
        : D$12$69 99
        : D$12$71 [6,3,99,99]
        : D$12$72 [7,9,99,99]
        : D$12$73 [8,15,99,99]
        : D$12$74 99
        : D$12$75 [10,27,99,99]
        : D$12$76 [11,33,99,99]
        : D$12$77 [12,39,99,99]
        : D$12$78 [13,46,99,99]
        : D$12$79 [14,52,99,99]
        : D$12$81 [7,4,99,99]
        : D$12$82 99
        : D$12$83 99
        : D$12$84 99
        : D$12$85 99
        : D$12$86 99
        : D$12$87 99
        : D$12$88 99
        : D$12$89 [15,60,99,99]
        : D$12$91 [8,4,99,99]
        : D$12$92 [9,12,99,99]
        : D$12$93 [10,20,99,99]
        : D$12$94 [11,28,99,99]
        : D$12$95 [12,36,99,99]
        : D$12$96 [13,44,99,99]
        : D$12$97 [14,52,99,99]
        : D$12$98 [15,60,99,99]
        : D$12$99 [16,68,99,99]

      `);
    });

    it('procced case for implhs+nall trick', function() {
      verify(`
        : EMPTY 0
        : $42 0
        : $62 0
        : A, B [0 0 5 5]
        [0 1] -> (all?( (A !=? 0) ))
        (A ==? 0) -> B
        (B ==? 0) -> A
      `, undefined, {skipVerify: true}); // contains complex dsl
    });

    it('B shouldnt be empty', function() {
      verify(`
        # note: a cell value 0 means the cell is blacked out
        # this helps because that makes all those cells
        # booly-pairs which is highly optimizable with logic ops

        : EMPTY 0


        # intial domains (domains that include 0 are values not unique in its row or col)
        : $11 [0 0 9 9]
        : $21 2
        : $31 4
        : $41 3
        : $51 [0 0 5 5]
        : $61 [0 0 5 5]
        : $71 [0 0 6 6]
        : $81 8
        : $91 [0 0 6 6]
        : $12 [0 0 2 2]
        : $22 [0 0 7 7]
        : $32 [0 0 7 7]
        : $42 9
        : $52 [0 0 2 2]
        : $62 8
        : $72 [0 0 4 4]
        : $82 [0 0 4 4]
        : $92 [0 1]
        : $13 [0 0 7 7]
        : $23 4
        : $33 6
        : $43 [0 1]
        : $53 3
        : $63 2
        : $73 8
        : $83 [0 0 7 7]
        : $93 9
        : $14 4
        : $24 6
        : $34 [0 1]
        : $44 [0 1]
        : $54 [0 1]
        : $64 [0 0 7 7]
        : $74 3
        : $84 [0 0 5 5]
        : $94 [0 1]
        : $15 [0 0 9 9]
        : $25 1
        : $35 [0 0 5 5]
        : $45 2
        : $55 [0 0 7 7]
        : $65 [0 0 7 7]
        : $75 [0 0 4 4]
        : $85 [0 0 5 5]
        : $95 3
        : $16 1
        : $26 [0 0 5 5]
        : $36 9
        : $46 [0 0 7 7]
        : $56 [0 0 4 4]
        : $66 [0 0 5 5]
        : $76 [0 0 7 7]
        : $86 2
        : $96 [0 0 8 8]
        : $17 [0 0 7 7]
        : $27 3
        : $37 [0 1]
        : $47 [0 0 8 8]
        : $57 [0 0 4 4]
        : $67 [0 1]
        : $77 [0 0 7 7]
        : $87 6
        : $97 [0 0 8 8]
        : $18 [0 0 9 9]
        : $28 [0 0 5 5]
        : $38 8
        : $48 [0 0 7 7]
        : $58 6
        : $68 [0 0 9 9]
        : $78 1
        : $88 3
        : $98 2
        : $19 8
        : $29 [0 0 7 7]
        : $39 [0 0 5 5]
        : $49 [0 0 5 5]
        : $59 [0 0 5 5]
        : $69 3
        : $79 [0 0 7 7]
        : $89 1
        : $99 [0 0 5 5]

        # require unique values per row/col
        sum( ($11 !=? EMPTY) ($15 !=? EMPTY) ($18 !=? EMPTY)) <= 1
        sum( ($51 !=? EMPTY) ($59 !=? EMPTY)) <= 1
        sum( ($51 !=? EMPTY) ($61 !=? EMPTY)) <= 1
        sum( ($61 !=? EMPTY) ($66 !=? EMPTY)) <= 1
        sum( ($71 !=? EMPTY) ($91 !=? EMPTY)) <= 1
        sum( ($12 !=? EMPTY) ($52 !=? EMPTY)) <= 1
        sum( ($22 !=? EMPTY) ($29 !=? EMPTY)) <= 1
        sum( ($22 !=? EMPTY) ($32 !=? EMPTY)) <= 1
        sum( ($72 !=? EMPTY) ($75 !=? EMPTY)) <= 1
        sum( ($72 !=? EMPTY) ($82 !=? EMPTY)) <= 1
        sum( ($92 !=? EMPTY) ($94 !=? EMPTY)) <= 1
        sum( ($13 !=? EMPTY) ($17 !=? EMPTY)) <= 1
        sum( ($13 !=? EMPTY) ($83 !=? EMPTY)) <= 1
        sum( ($43 !=? EMPTY) ($44 !=? EMPTY)) <= 1
        sum( ($34 !=? EMPTY) ($37 !=? EMPTY)) <= 1
        sum( ($34 !=? EMPTY) ($44 !=? EMPTY) ($54 !=? EMPTY) ($94 !=? EMPTY)) <= 1
        sum( ($64 !=? EMPTY) ($65 !=? EMPTY)) <= 1
        sum( ($84 !=? EMPTY) ($85 !=? EMPTY)) <= 1
        sum( ($35 !=? EMPTY) ($39 !=? EMPTY)) <= 1
        sum( ($35 !=? EMPTY) ($85 !=? EMPTY)) <= 1
        sum( ($55 !=? EMPTY) ($65 !=? EMPTY)) <= 1
        sum( ($26 !=? EMPTY) ($28 !=? EMPTY)) <= 1
        sum( ($26 !=? EMPTY) ($66 !=? EMPTY)) <= 1
        sum( ($46 !=? EMPTY) ($48 !=? EMPTY)) <= 1
        sum( ($46 !=? EMPTY) ($76 !=? EMPTY)) <= 1
        sum( ($56 !=? EMPTY) ($57 !=? EMPTY)) <= 1
        sum( ($76 !=? EMPTY) ($77 !=? EMPTY) ($79 !=? EMPTY)) <= 1
        sum( ($96 !=? EMPTY) ($97 !=? EMPTY)) <= 1
        sum( ($17 !=? EMPTY) ($77 !=? EMPTY)) <= 1
        sum( ($37 !=? EMPTY) ($67 !=? EMPTY)) <= 1
        sum( ($47 !=? EMPTY) ($97 !=? EMPTY)) <= 1
        sum( ($18 !=? EMPTY) ($68 !=? EMPTY)) <= 1
        sum( ($29 !=? EMPTY) ($79 !=? EMPTY)) <= 1
        sum( ($39 !=? EMPTY) ($49 !=? EMPTY) ($59 !=? EMPTY) ($99 !=? EMPTY)) <= 1


        # Neighbor checks
        ($11 ==? EMPTY) -> (all?( (1 !=? EMPTY) (1 !=? EMPTY) ($12 !=? EMPTY) ($21 !=? EMPTY) ))
        ($21 ==? EMPTY) -> (all?( ($11 !=? EMPTY) (1 !=? EMPTY) ($22 !=? EMPTY) ($31 !=? EMPTY) ))
        ($31 ==? EMPTY) -> (all?( ($21 !=? EMPTY) (1 !=? EMPTY) ($32 !=? EMPTY) ($41 !=? EMPTY) ))
        ($41 ==? EMPTY) -> (all?( ($31 !=? EMPTY) (1 !=? EMPTY) ($42 !=? EMPTY) ($51 !=? EMPTY) ))
        ($51 ==? EMPTY) -> (all?( ($41 !=? EMPTY) (1 !=? EMPTY) ($52 !=? EMPTY) ($61 !=? EMPTY) ))
        ($61 ==? EMPTY) -> (all?( ($51 !=? EMPTY) (1 !=? EMPTY) ($62 !=? EMPTY) ($71 !=? EMPTY) ))
        ($71 ==? EMPTY) -> (all?( ($61 !=? EMPTY) (1 !=? EMPTY) ($72 !=? EMPTY) ($81 !=? EMPTY) ))
        ($81 ==? EMPTY) -> (all?( ($71 !=? EMPTY) (1 !=? EMPTY) ($82 !=? EMPTY) ($91 !=? EMPTY) ))
        ($91 ==? EMPTY) -> (all?( ($81 !=? EMPTY) (1 !=? EMPTY) ($92 !=? EMPTY) (1 !=? EMPTY) ))
        ($12 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($11 !=? EMPTY) ($13 !=? EMPTY) ($22 !=? EMPTY) ))
        ($22 ==? EMPTY) -> (all?( ($12 !=? EMPTY) ($21 !=? EMPTY) ($23 !=? EMPTY) ($32 !=? EMPTY) ))
        ($32 ==? EMPTY) -> (all?( ($22 !=? EMPTY) ($31 !=? EMPTY) ($33 !=? EMPTY) ($42 !=? EMPTY) ))
        ($42 ==? EMPTY) -> (all?( ($32 !=? EMPTY) ($41 !=? EMPTY) ($43 !=? EMPTY) ($52 !=? EMPTY) ))
        ($52 ==? EMPTY) -> (all?( ($42 !=? EMPTY) ($51 !=? EMPTY) ($53 !=? EMPTY) ($62 !=? EMPTY) ))
        ($62 ==? EMPTY) -> (all?( ($52 !=? EMPTY) ($61 !=? EMPTY) ($63 !=? EMPTY) ($72 !=? EMPTY) ))
        ($72 ==? EMPTY) -> (all?( ($62 !=? EMPTY) ($71 !=? EMPTY) ($73 !=? EMPTY) ($82 !=? EMPTY) ))
        ($82 ==? EMPTY) -> (all?( ($72 !=? EMPTY) ($81 !=? EMPTY) ($83 !=? EMPTY) ($92 !=? EMPTY) ))
        ($92 ==? EMPTY) -> (all?( ($82 !=? EMPTY) ($91 !=? EMPTY) ($93 !=? EMPTY) (1 !=? EMPTY) ))
        ($13 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($12 !=? EMPTY) ($14 !=? EMPTY) ($23 !=? EMPTY) ))
        ($23 ==? EMPTY) -> (all?( ($13 !=? EMPTY) ($22 !=? EMPTY) ($24 !=? EMPTY) ($33 !=? EMPTY) ))
        ($33 ==? EMPTY) -> (all?( ($23 !=? EMPTY) ($32 !=? EMPTY) ($34 !=? EMPTY) ($43 !=? EMPTY) ))
        ($43 ==? EMPTY) -> (all?( ($33 !=? EMPTY) ($42 !=? EMPTY) ($44 !=? EMPTY) ($53 !=? EMPTY) ))
        ($53 ==? EMPTY) -> (all?( ($43 !=? EMPTY) ($52 !=? EMPTY) ($54 !=? EMPTY) ($63 !=? EMPTY) ))
        ($63 ==? EMPTY) -> (all?( ($53 !=? EMPTY) ($62 !=? EMPTY) ($64 !=? EMPTY) ($73 !=? EMPTY) ))
        ($73 ==? EMPTY) -> (all?( ($63 !=? EMPTY) ($72 !=? EMPTY) ($74 !=? EMPTY) ($83 !=? EMPTY) ))
        ($83 ==? EMPTY) -> (all?( ($73 !=? EMPTY) ($82 !=? EMPTY) ($84 !=? EMPTY) ($93 !=? EMPTY) ))
        ($93 ==? EMPTY) -> (all?( ($83 !=? EMPTY) ($92 !=? EMPTY) ($94 !=? EMPTY) (1 !=? EMPTY) ))
        ($14 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($13 !=? EMPTY) ($15 !=? EMPTY) ($24 !=? EMPTY) ))
        ($24 ==? EMPTY) -> (all?( ($14 !=? EMPTY) ($23 !=? EMPTY) ($25 !=? EMPTY) ($34 !=? EMPTY) ))
        ($34 ==? EMPTY) -> (all?( ($24 !=? EMPTY) ($33 !=? EMPTY) ($35 !=? EMPTY) ($44 !=? EMPTY) ))
        ($44 ==? EMPTY) -> (all?( ($34 !=? EMPTY) ($43 !=? EMPTY) ($45 !=? EMPTY) ($54 !=? EMPTY) ))
        ($54 ==? EMPTY) -> (all?( ($44 !=? EMPTY) ($53 !=? EMPTY) ($55 !=? EMPTY) ($64 !=? EMPTY) ))
        ($64 ==? EMPTY) -> (all?( ($54 !=? EMPTY) ($63 !=? EMPTY) ($65 !=? EMPTY) ($74 !=? EMPTY) ))
        ($74 ==? EMPTY) -> (all?( ($64 !=? EMPTY) ($73 !=? EMPTY) ($75 !=? EMPTY) ($84 !=? EMPTY) ))
        ($84 ==? EMPTY) -> (all?( ($74 !=? EMPTY) ($83 !=? EMPTY) ($85 !=? EMPTY) ($94 !=? EMPTY) ))
        ($94 ==? EMPTY) -> (all?( ($84 !=? EMPTY) ($93 !=? EMPTY) ($95 !=? EMPTY) (1 !=? EMPTY) ))
        ($15 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($14 !=? EMPTY) ($16 !=? EMPTY) ($25 !=? EMPTY) ))
        ($25 ==? EMPTY) -> (all?( ($15 !=? EMPTY) ($24 !=? EMPTY) ($26 !=? EMPTY) ($35 !=? EMPTY) ))
        ($35 ==? EMPTY) -> (all?( ($25 !=? EMPTY) ($34 !=? EMPTY) ($36 !=? EMPTY) ($45 !=? EMPTY) ))
        ($45 ==? EMPTY) -> (all?( ($35 !=? EMPTY) ($44 !=? EMPTY) ($46 !=? EMPTY) ($55 !=? EMPTY) ))
        ($55 ==? EMPTY) -> (all?( ($45 !=? EMPTY) ($54 !=? EMPTY) ($56 !=? EMPTY) ($65 !=? EMPTY) ))
        ($65 ==? EMPTY) -> (all?( ($55 !=? EMPTY) ($64 !=? EMPTY) ($66 !=? EMPTY) ($75 !=? EMPTY) ))
        ($75 ==? EMPTY) -> (all?( ($65 !=? EMPTY) ($74 !=? EMPTY) ($76 !=? EMPTY) ($85 !=? EMPTY) ))
        ($85 ==? EMPTY) -> (all?( ($75 !=? EMPTY) ($84 !=? EMPTY) ($86 !=? EMPTY) ($95 !=? EMPTY) ))
        ($95 ==? EMPTY) -> (all?( ($85 !=? EMPTY) ($94 !=? EMPTY) ($96 !=? EMPTY) (1 !=? EMPTY) ))
        ($16 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($15 !=? EMPTY) ($17 !=? EMPTY) ($26 !=? EMPTY) ))
        ($26 ==? EMPTY) -> (all?( ($16 !=? EMPTY) ($25 !=? EMPTY) ($27 !=? EMPTY) ($36 !=? EMPTY) ))
        ($36 ==? EMPTY) -> (all?( ($26 !=? EMPTY) ($35 !=? EMPTY) ($37 !=? EMPTY) ($46 !=? EMPTY) ))
        ($46 ==? EMPTY) -> (all?( ($36 !=? EMPTY) ($45 !=? EMPTY) ($47 !=? EMPTY) ($56 !=? EMPTY) ))
        ($56 ==? EMPTY) -> (all?( ($46 !=? EMPTY) ($55 !=? EMPTY) ($57 !=? EMPTY) ($66 !=? EMPTY) ))
        ($66 ==? EMPTY) -> (all?( ($56 !=? EMPTY) ($65 !=? EMPTY) ($67 !=? EMPTY) ($76 !=? EMPTY) ))
        ($76 ==? EMPTY) -> (all?( ($66 !=? EMPTY) ($75 !=? EMPTY) ($77 !=? EMPTY) ($86 !=? EMPTY) ))
        ($86 ==? EMPTY) -> (all?( ($76 !=? EMPTY) ($85 !=? EMPTY) ($87 !=? EMPTY) ($96 !=? EMPTY) ))
        ($96 ==? EMPTY) -> (all?( ($86 !=? EMPTY) ($95 !=? EMPTY) ($97 !=? EMPTY) (1 !=? EMPTY) ))
        ($17 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($16 !=? EMPTY) ($18 !=? EMPTY) ($27 !=? EMPTY) ))
        ($27 ==? EMPTY) -> (all?( ($17 !=? EMPTY) ($26 !=? EMPTY) ($28 !=? EMPTY) ($37 !=? EMPTY) ))
        ($37 ==? EMPTY) -> (all?( ($27 !=? EMPTY) ($36 !=? EMPTY) ($38 !=? EMPTY) ($47 !=? EMPTY) ))
        ($47 ==? EMPTY) -> (all?( ($37 !=? EMPTY) ($46 !=? EMPTY) ($48 !=? EMPTY) ($57 !=? EMPTY) ))
        ($57 ==? EMPTY) -> (all?( ($47 !=? EMPTY) ($56 !=? EMPTY) ($58 !=? EMPTY) ($67 !=? EMPTY) ))
        ($67 ==? EMPTY) -> (all?( ($57 !=? EMPTY) ($66 !=? EMPTY) ($68 !=? EMPTY) ($77 !=? EMPTY) ))
        ($77 ==? EMPTY) -> (all?( ($67 !=? EMPTY) ($76 !=? EMPTY) ($78 !=? EMPTY) ($87 !=? EMPTY) ))
        ($87 ==? EMPTY) -> (all?( ($77 !=? EMPTY) ($86 !=? EMPTY) ($88 !=? EMPTY) ($97 !=? EMPTY) ))
        ($97 ==? EMPTY) -> (all?( ($87 !=? EMPTY) ($96 !=? EMPTY) ($98 !=? EMPTY) (1 !=? EMPTY) ))
        ($18 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($17 !=? EMPTY) ($19 !=? EMPTY) ($28 !=? EMPTY) ))
        ($28 ==? EMPTY) -> (all?( ($18 !=? EMPTY) ($27 !=? EMPTY) ($29 !=? EMPTY) ($38 !=? EMPTY) ))
        ($38 ==? EMPTY) -> (all?( ($28 !=? EMPTY) ($37 !=? EMPTY) ($39 !=? EMPTY) ($48 !=? EMPTY) ))
        ($48 ==? EMPTY) -> (all?( ($38 !=? EMPTY) ($47 !=? EMPTY) ($49 !=? EMPTY) ($58 !=? EMPTY) ))
        ($58 ==? EMPTY) -> (all?( ($48 !=? EMPTY) ($57 !=? EMPTY) ($59 !=? EMPTY) ($68 !=? EMPTY) ))
        ($68 ==? EMPTY) -> (all?( ($58 !=? EMPTY) ($67 !=? EMPTY) ($69 !=? EMPTY) ($78 !=? EMPTY) ))
        ($78 ==? EMPTY) -> (all?( ($68 !=? EMPTY) ($77 !=? EMPTY) ($79 !=? EMPTY) ($88 !=? EMPTY) ))
        ($88 ==? EMPTY) -> (all?( ($78 !=? EMPTY) ($87 !=? EMPTY) ($89 !=? EMPTY) ($98 !=? EMPTY) ))
        ($98 ==? EMPTY) -> (all?( ($88 !=? EMPTY) ($97 !=? EMPTY) ($99 !=? EMPTY) (1 !=? EMPTY) ))
        ($19 ==? EMPTY) -> (all?( (1 !=? EMPTY) ($18 !=? EMPTY) (1 !=? EMPTY) ($29 !=? EMPTY) ))
        ($29 ==? EMPTY) -> (all?( ($19 !=? EMPTY) ($28 !=? EMPTY) (1 !=? EMPTY) ($39 !=? EMPTY) ))
        ($39 ==? EMPTY) -> (all?( ($29 !=? EMPTY) ($38 !=? EMPTY) (1 !=? EMPTY) ($49 !=? EMPTY) ))
        ($49 ==? EMPTY) -> (all?( ($39 !=? EMPTY) ($48 !=? EMPTY) (1 !=? EMPTY) ($59 !=? EMPTY) ))
        ($59 ==? EMPTY) -> (all?( ($49 !=? EMPTY) ($58 !=? EMPTY) (1 !=? EMPTY) ($69 !=? EMPTY) ))
        ($69 ==? EMPTY) -> (all?( ($59 !=? EMPTY) ($68 !=? EMPTY) (1 !=? EMPTY) ($79 !=? EMPTY) ))
        ($79 ==? EMPTY) -> (all?( ($69 !=? EMPTY) ($78 !=? EMPTY) (1 !=? EMPTY) ($89 !=? EMPTY) ))
        ($89 ==? EMPTY) -> (all?( ($79 !=? EMPTY) ($88 !=? EMPTY) (1 !=? EMPTY) ($99 !=? EMPTY) ))
        ($99 ==? EMPTY) -> (all?( ($89 !=? EMPTY) ($98 !=? EMPTY) (1 !=? EMPTY) (1 !=? EMPTY) ))

        $11 == 0
        $21 == 2
        $42 == 9
        $52 == 0
        $62 == 8
        $72 == 0
        $82 == 4
        $92 == 1
        $13 == 0
        $23 == 4
        $33 == 6
        $43 == 0
        $53 == 3
        $63 == 2
        $73 == 8
        $83 == 7
        $93 == 9
        $14 == 4
        $24 == 6
        $34 == 0
        $44 == 1
        $54 == 0
        $64 == 7
        $74 == 3
        $84 == 5
        $94 == 0
        $25 == 1
        $35 == 5
        $45 == 2
        $55 == 7
        $65 == 0
        $75 == 4
        $85 == 0
        $95 == 3
        $16 == 1
        $26 == 0
        $36 == 9
        $66 == 5
        $86 == 2
        $96 == 8
        $27 == 3
        $37 == 0
        $47 == 8
        $67 == 1
        $87 == 6
        $97 == 0


        $28 == 5
        $38 == 8


        $78 == 1
        $88 == 3
        $98 == 2
        $19 == 8
        $29 == 7
        $39 == 0
        $49 == 5
        $59 == 0
        $69 == 3
        $79 == 0
        $89 == 1
        $99 == 0

      `, undefined, {skipVerify: true}); // contains complex dsl
    });

    it('lte solvestack was leaving B empty', function() {
      verify(`
        : A, B [0,0,7,7]
        : C,D,E,F [0,1]
        A !& B
        A ^ D
        D -> E
        B ^ F
        F -> C
      `);
    });

    it('verifier flagged bad isall solution', function() {
      verify(`
        : A [0,0,9,9]
        : B [0,0,5,5]
        : C [0,1]
        : D [0,1]
        : E [0,1]
        : F [0,1]
        : G [0,1]
        A ^ C
        E = B !=? 0
        F = all?( D E )
        C -> F
        B ^ G
      `);
    });

    it('ltelhs nalls some trick left var empty', function() {
      // about as minimal as i can get without going all out
      verify(`
         # vars (23x):
        : $76 [0,0,7,7]
        : $17 [0,0,7,7]
        : $77 [0,0,7,7]
        : $18 [0,0,9,9]
        : $28 [0,0,5,5]
        : $$82 [0,1]
        : $$83 [0,1]
        : $$85 [0,1]
        : $$89 [0,1]
        : $$90 [0,1]
        : $$91 [0,1]
        : $$433 [0,1]
        : $$436 [0,1]
        : $$469 [0,1]
        : $$471 [0,1]
        : $$487 [0,1]
        : $$489 [0,1]
        : $$491 [0,1]
        : $$492 [0,1]
        : $$493 [0,1]

        # Constraints (20x):
        $$82 = $76 !=? 0
        $$83 = $77 !=? 0
        $$85 = $$82 + $$83
        $$89 = $17 !=? 0
        $$90 = $77 !=? 0
        $$91 = $$89 + $$90
        $17 ^ $$433
        $$436 = $18 !=? 0
        $$433 -> $$436
        $77 ^ $$469
        $$471 = $76 !=? 0
        $$469 -> $$471
        $18 ^ $$487
        $$491 = $28 !=? 0
        $$492 = all?( $$489 $$491 )
        $$487 -> $$492
        $28 ^ $$493
      `);
    });

    it('ltelhs nalls some trick left was forcing solved non-zero vars to zero', function() {
      verify(`
         # vars (16x):
        : $46 [0,0,7,7]
        : $56 [0,0,4,4]
        : $$397 [0,1]
        : $$401 [0,1]
        : $$403 [0,1]
        : $$404 [0,1]
        : $$406 [0,1]
        : $$408 [0,1]


        # Constraints (8x):
        $46 ^ $$397
        $$397 -> $$401
        $56 ^ $$403
        $$404 = $46 !=? 0
        $$408 = all?( $$404 $$406 )
        $$403 -> $$408
      `);
    });

    it('sum to nall R was empty in solve stack because sum had same arg twice', function() {
      let dsl = `
        : A [0,0,1,1]
        : B [0,0,4,4]
        : E, F, G, H [0,1]

        E = A + A
        A ^ F
        F -> G
        G = B ==? 4
        B ^ H
      `;

      verify(dsl);
    });

    it('incorrectly trying to trick xor+nall into lte when the shared arg was non-bool', function() {
      let dsl = `
        # vars (9x):
        : A [0,0,7,7]
        : B [0,0,7,7]
        : C [0,0,7,7]
        : D [0,0,7,7]
        : E [0,1]
        : F [0,1]
        : G [0,1]
        : H [0,1]
        : I [0,1]


        # Constraints (10x):
        A !& B  # 1
        C !& D  # 8
        A ^ E   # 15
        E -> F  # 22
        C ^ G   # 29
        G -> H  # 36
        D ^ I   # 43
        I -> B  # 50
      `;
      /*
        was translating to
        =>
        # vars (9x):
        : B [0,0,7,7]
        : D [0,0,7,7]
        : E [0,1]
        : G [0,1]
        : I [0,1]


        # Constraints (10x):
        B <= E
        D <= G
        D ^ I
        I -> B

        (bascially A^E,A!&B => B<=E which is incorrect with non-bool booly-pairs, it should have been B->E
       */

      verify(dsl);
    });

    it('isall failed because the "all args set" initialized value was wrongly "false"', function() {
      verify(`
        # vars (9x total):
        : A [0,0,7,7]
        : B [0,0,5,5]
        : C [0,0,5,5]
        : D, E, F, G, H, I [0,1]

        # Constraints (11x):
        D ^ A
        E ^ B
        F = A !=? 0
        G = C !=? 0
        H = all?( F G )
        E -> H
        I ^ C
      `);
    });

    it('deduper issame-isdiff was creating an alias for same var', function() {
      let dsl = `
        : A [0 0 7 7]
        : B [0 1]
        B = A !=? 0
        B = A ==? 7
      `;

      verify(dsl);
    });

    it('bad xnor alias in minimizer', function(){
      verify(`
        # note: it was important that C was declared after A because of how the alias was declared
        : A [0,1]
        : B [0,1]
        : C [0,0,7,7]
        : D [0,7]
        A !^ C
        B !^ D
        2 = sum( A B )
        # minimizer would alias A to C, leaving '2=sum([01][0077])' which cant hold
      `)
    })
  });
});
