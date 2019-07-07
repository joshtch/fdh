import {verify} from 'fdv/verifier';

describe('fdh/specs/minimizer.spec', function() {

  describe('and / all', function() {

    it('should work with and', function() {
      verify(`
        @custom var-strat throw
        : A,B [0 1]
        A & B
      `);
    });

    it('should work with all', function() {
      verify(`
        @custom var-strat throw
        : A,B,C [0 1]
        all(A B C)
      `);
    });
  });

  describe('diff', function() {

    it('should work', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 10]
        diff(A B C D E)
        @custom noleaf A B C D E
      `, 'diff');
    });

    it('should fail neq contradictions', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        A != A
      `, 'reject');
    });

    it('should prune constants', function() {
      verify(`
        @custom var-strat throw
        : A, B, D, E [0 10]
        diff(A B 5 D E)
        @custom noleaf A B D E
      `, 'diff');
    });

    it('should prune a var that becomes constant', function() {
      verify(`
        @custom var-strat throw
        : A, B, D, E [0 10]
        : C [0 10]
        diff(A B C D E)
        C < 1
        @custom noleaf A B C D E
      `, 'diff');
    });
  });

  describe('lte', function() {

    it('should convert non-leaf bool lte to implication', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        A <= B
        @custom noleaf A B
      `, 'imp');
    });

    it('should convert non-leaf booly lte to implication', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 0 9 9]
        A <= B
        @custom noleaf A B
      `, 'imp');
    });

    it('should convert non-leaf booly lte where max(A)<max(B) to implication', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 6 6]
        : B [0 0 9 9]
        A <= B
        @custom noleaf A B
      `, 'imp');
    });

    it('should NOT convert non-leaf bool lte where max(A)<max(B) to implication', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 9 9]
        : B [0 0 6 6]
        A <= B
        # => remove > max(B) from A => A=0
        @custom noleaf A B
      `); // but solves anyways so hard to check :)
    });

    it('should NOT convert non-leaf non-bool lte with nonbools to implication', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 6]
        A <= B
        @custom noleaf A B
      `, 'lte');
    });

    it('should NOT convert non-leaf non-bool lte where max(A)<max(B) to implication', function() {
      verify(`
        @custom var-strat throw
        : A [0 6]
        : B [0 9]
        A <= B
        @custom noleaf A B
      `, 'lte');
    });
  });

  describe('isall', function() {

    it('should solve if all args are non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [20 20]
        : R [0 1]
        R = all?(A B C)
      `);
    });

    it('should solve if at least one arg is zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 0]
        : R *
        R = all?(A B C)
      `);
    });

    it('should solve by defer if unsolved immediately R=[01]', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 10] # this prevents solving because R can still go either way
        : R [0 1]
        R = all?(A B C)
      `);
    });

    it('should solve by defer if unsolved immediately R=*', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 10] # this prevents solving because R can still go either way
        : R *
        R = all?(A B C)
      `);
    });

    it('should morph if only right arg is non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [1 10]
        : R [0 1]
        R = all?(A B)
        @custom noleaf A B R
      `);
    });

    it('should morph if only left arg is non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : R [0 1]
        R = all?(A B)
        @custom noleaf A B R
      `);
    });

    it('should drop vars that are non-zero without solving it', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : C [1 10]
        : D [0 10]
        : R [0 1]
        R = all?(A B C D)
        @custom noleaf A B C D R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [1 10]
        : C [0 10]
        : D [0 10]
        : R [0 1]
        R = all?(A B C D)
        @custom noleaf A B C D R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [1 10]
        : D [1 10]
        : R [0 1]
        R = all?(A B C D)
        @custom noleaf A B C D R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [0 10]
        : C [1 10]
        : R [0 1]
        R = all?(A B C)
        @custom noleaf A B C R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : C [0 10]
        : R [0 1]
        R = all?(A B C)
        @custom noleaf A B C R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [0 10]
        : B [1 10]
        : C [0 10]
        : R [0 1]
        R = all?(A B C)
        @custom noleaf A B C R
      `, 'isall');

      verify(`
        @custom var-strat throw
        : A [1 10]
        : B [0 10]
        : C [1 10]
        : R [0 1]
        R = all?(A B C)
        @custom noleaf A B C R
      `);
    });

    it('should morph an 0=isall to nall()', function() {
      verify(`
        @custom var-strat throw
        : A,B,C,D [0 10]
        0 = all?(A B C D)
      `);
    });
  });

  describe('islt', function() {

    it('should solve R=0<?B', function() {
      verify(`
        : A 0
        : B [0 10]
        : R [0 1]
        R = A <? B

        @custom var-strat throw
        @custom noleaf A B R
      `);
    });

    it('should solve R=A<?0', function() {
      verify(`
        : A [0 10]
        : B 0
        : R [0 1]
        R = A <? B

        @custom var-strat throw
        @custom noleaf A B R
      `);
    });
  });

  describe('islte', function() {

    it('should solve boolean constant case v1 (no cutter)', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = A <=? 0
        # => A != R
        # => A ^ R
        @custom noleaf A R
      `, 'xor');
    });

    it('should solve boolean constant case [01]=[01]<=?0', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = A <=? 0
        @custom noleaf R
      `);
    });

    it('should solve boolean constant case [01]=[01]<=?1', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = A <=? 1
        @custom noleaf A R
      `);
    });

    it('should solve boolean constant case [01]=0<=?[01]', function() {
      verify(`
        @custom var-strat throw
        : B [0 1]
        : R [0 1]
        R = 0 <=? B
        @custom noleaf B R
      `);
    });

    it('should solve boolean constant case [01]=1<=?[01]', function() {
      verify(`
        @custom var-strat throw
        : B [0 1]
        : R [0 1]
        R = 1 <=? B
        @custom noleaf B R
      `);
    });
  });

  describe('isnall', function() {

    it('should solve if all args are non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [20 20]
        : R [0 1]
        R = nall?(A B C)
      `);
    });

    it('should solve if at least one arg is zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 0]
        : R [0 1]
        R = nall?(A B C)
      `);
    });

    it('should solve by defer if unsolved immediately R=[01]', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 10] # this prevents solving because R can still go either way
        : R [0 1]
        R = nall?(A B C)
      `);
    });

    it('should solve by defer if unsolved immediately R=*', function() {
      verify(`
        @custom var-strat throw
        : A [1 6]
        : B [5 8 10 42]
        : C [0 10] # this prevents solving because R can still go either way
        : R *
        R = nall?(A B C)
      `);
    });

    it('should force all args of 0=isnall() to nonzero', function() {
      verify(`
        @custom var-strat throw
        : A,B,C,D [0 10]
        0 = nall?(A B C D)
      `);
    });
  });

  describe('isnone', function() {

    it('should solve if at least one arg is nonzero', function() {
      verify(`
        @custom var-strat throw
        : A, C, D [0 5]
        : B [1 5]
        : R [0 10]
        R = none?(A B C D)
        @custom noleaf A B C D R
      `);
    });

    it('should solve if at all arg are zero', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 0]
        : R [0 10]
        R = none?(A B C D)
        @custom noleaf A B C D R
      `);
    });

    it('should morph to some if R=0', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 5]
        : R [0 0]
        R = none?(A B C D)
        @custom noleaf A B C D R
      `, 'some');
    });

    it('should force all args to zero if R>0', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 5]
        : R [1 10]
        R = none?(A B C D)
        @custom noleaf A B C D R
      `);
    });
  });

  describe('issame / iseq', function() {

    it('should iseq base case', function() {
      verify(`
        @custom var-strat throw
        : A,B [0 1]
        : R [0 1]
        R = A ==? B
        @custom noleaf A B R
      `, 'issame');
    });

    it('should issame base case', function() {
      verify(`
        @custom var-strat throw
        : A,B,C,D [0 1]
        : R [0 1]
        R = same?(A B C D)
        @custom noleaf A B C D R
      `, 'issame');
    });


    it('should rewrite 01=01==?0 to A!=R', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = A ==? 0
      `);
    });

    it('should rewrite 01=01==?1 to A==R', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = A ==? 1
      `);
    });

    it('should rewrite 01=1==?01 to A==R', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : R [0 1]
        R = 1 ==? A
        @custom noleaf A R
      `);
    });

    it('should rewrite 01=02==?0 to A!=R', function() {
      // R is leaf, constraint cut away, R's reflection is deferred, A becomes free, so it solves
      verify(`
        @custom var-strat throw
        : A [0 0 2 2]
        : R [0 1]
        R = A ==? 0
      `);
    });

    it('should rewrite [01]=[00xx]==?x to XNOR (A=[0022])', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 2 2]
        : R [0 1]
        R = A ==? 2
      `);
    });

    it('should rewrite [01]=[00xx]==?x to XNOR (A=[0020002000])', function() {
      verify(`
        @custom var-strat throw
        : A [0 0 2000 2000]
        : B = 2000
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should rewrite [01]=[00xx]==?x to XNOR (A=2000)', function() {
      verify(`
        @custom var-strat throw
        : A = 2000
        : B [0 0 2000 2000]
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should not even consider weird domain values sans 1', function() {
      verify(`
        @custom var-strat throw
        : A = [0 1]
        : B [0 0 2000 2000]
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should not even consider weird domain values lt 1', function() {
      verify(`
        @custom var-strat throw
        : A = [0 1]
        : B [2 2000]
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should not even consider weird domain values sans 0', function() {
      verify(`
        @custom var-strat throw
        : A = [0 1]
        : B [1 2000]
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should not even consider weird domain values bool', function() {
      verify(`
        @custom var-strat throw
        : A = [0 1]
        : B [0 2000]
        : R [0 1]
        R = A ==? B
      `);
    });

    it('should not rewrite to div because of this case', function() {
      verify(`
        @custom var-strat throw
        : A [0 5]
        : C [0 1]
        C = A ==? 5
        A == 4
      `);
    });

    it('should rewrite 01=03==?0 to A^R', function() {
      /*
        if R=0 then A must be [1 3]
        if R=1 then A must be 0
        so either A is 0 or R is 0 but not both. so XOR
      */
      verify(`
        @custom var-strat throw
        : A [0 3]
        : R [0 1]
        R = A ==? 0
        @custom noleaf R A
      `, 'xor');
    });

    it('should rewrite 01=0==?03 to B^R', function() {
      /*
        if R=0 then B must be [1 3]
        if R=1 then B must be 0
        so either B is 0 or R is 0 but not both. so XOR
      */
      verify(`
        @custom var-strat throw
        : B [0 3]
        : R [0 1]
        R = 0 ==? B
        @custom noleaf R B
      `, 'xor');
    });
  });

  describe('issome', function() {

    it('should solve if at least one arg is nonzero', function() {
      verify(`
        @custom var-strat throw
        : A, C, D [0 5]
        : B [1 5]
        : R [0 10]
        R = some?(A B C D)
        @custom noleaf A B C D R
      `);
    });

    it('should solve if at all arg are zero', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 0]
        : R [0 10]
        R = some?(A B C D)
        @custom noleaf A B C D R
      `);
    });

    it('should morph to some if R>0', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 5]
        : R [1 10]
        R = some?(A B C D)
        @custom noleaf A B C D R
      `, 'some');
    });

    it('should force all args to zero if R=0', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D [0 5]
        : R [0 0]
        R = some?(A B C D)
        @custom noleaf A B C D R
      `);
    });

    it('should remove zeroes from its [A,0] args', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : R [0 1]
        R = some?(A 0)
        @custom noleaf A R
      `);
    });

    it('should remove zeroes from its [0,A] args', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : R [0 1]
        R = some?(0 A)
        @custom noleaf A R
      `);
    });

    it('should remove zeroes from its [0,0,A,0] args', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        : R [0 1]
        R = some?(0 0 A 0)
        @custom noleaf A R
      `);
    });
  });

  describe('nall', function() {

    it('should remove dupes', function() {
      verify(`
        @custom var-strat throw
        : A [0 6]
        : B [5 8 10 42]
        nall(A A B)
      `);
    });

    it('should resolve a nall with only a dupe', function() {
      verify(`
        @custom var-strat throw
        : A [0 6]
        nall(A A)
      `);
    });

    it('should dedupe three dupes', function() {
      verify(`
        @custom var-strat throw
        : A [0 6]
        nall(A A A)
      `);
    });

    it('should accept three dupes of zero', function() {
      verify(`
        @custom var-strat throw
        : A [0 0]
        nall(A A A)
      `);
    });

    it('should reject three dupes of non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [5 5]
        nall(A A A)
      `, 'reject');
    });

    it('should properly remove resolved vars', function() {
      verify(`
        @custom var-strat throw
        : A, C, D [0 5]
        : B 10
        nall(A B C D)

        @custom noleaf A B C D
      `, 'nall');
    });

    it('should solve reflexive nall to zero', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        A !& A
      `);
    });

    it('should reject reflexive nall if it has no zero', function() {
      verify(`
        @custom var-strat throw
        : A [1 10]
        A !& A
      `, 'reject');
    });

    it('should reject reflexive nall if it must be non-zero', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        A !& A
        A > 0
      `, 'reject');
    });
  });

  describe('none / nor', function() {

    it('should work with NOR', function() {
      verify(`
        @custom var-strat throw
        : A,B [0 1]
        A !| B
      `);
    });

    it('should work with none', function() {
      verify(`
        @custom var-strat throw
        : A,B,C [0 1]
        none(A B C)
      `);
    });

    it('should work with nonzero constant', function() {
      verify(`
        @custom var-strat throw
        : A,B,C [0 1]
        none(A B 5 C)
      `, 'reject');
    });

    it('should work with zero constant', function() {
      verify(`
        @custom var-strat throw
        : A,B,C [0 1]
        none(A B 0 C)
      `);
    });

    it('should work with two constants', function() {
      verify(`
        @custom var-strat throw
        : A,B,C [0 1]
        none(A 5 B 0 C)
      `, 'reject');
    });

    it('should work with nonzero domain', function() {
      verify(`
        @custom var-strat throw
        : A,C [0 1]
        : B [5 25]
        none(A 5 B C)
      `, 'reject');
    });
  });

  describe('product', function() {

    // (missing basic tests)

    it('should rewrite a product with R=0 to a nall', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 10]
        : R 0
        R = product(A B C D E)
        @custom noleaf A B C D E R
      `, 'nall');
    });

    it('should rewrite a product with a zero constants to let other args free', function() {
      verify(`
        @custom var-strat throw
        : A, C, D, E [0 10]
        : B 0
        : R *
        R = product(A B C D E)
        @custom noleaf A B C D E R
      `);
    });

    it('should work with constants', function() {
      verify(`
        @custom var-strat throw
        : A, C, E [1 10]
        : B 5
        : D 8
        : R *
        R = product(A B C D E)
        @custom noleaf A B C D E R
      `, 'product');
    });

    it('should solve at least one arg to zero to force result to zero', function() {
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : D 0
        D = product(A B C)
        @custom noleaf A B C
      `, 'nall'); // note: nall is correct because it enforces at least one arg to be zero, which is all that product need when the result is zero
    });
  });

  describe('some', function() {

    it('should remove zeroes from its [A,0] args', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        some(A 0)
        @custom noleaf A
      `);
    });

    it('should remove zeroes from its [0,A] args', function() {
      verify(`
        @custom var-strat throw
        : A [0 10]
        some(A 0)
        @custom noleaf A
      `);
    });
  });

  describe('sum', function() {

    // (missing basic tests)

    it('should work with constants', function() {
      verify(`
        @custom var-strat throw
        : A, C, E [0 10]
        : B 5
        : D 8
        : R *
        R = sum(A B C D E)
        @custom noleaf A B C D E R
      `);
    });

    describe('eliminate all constants if they sum to zero', function() {

      it('should remain a sum if the constants arent removed', function() {
        verify(`
          @custom var-strat throw
          : A, C, E [0 10]
          : B 1
          : R *
          R = sum(A B C)
          R != E
          @custom noleaf A B C E R
        `, 'diff,sum');
      });

      it('should turn into a plus if the constants are removed', function() {
        verify(`
          @custom var-strat throw
          : A, C, E [0 10]
          : B 0
          : R *
          R = sum(A B C)
          R != E
          @custom noleaf A B C E R
        `, 'diff,sum');
      });
    });

    describe('sum with 2 args', function() {

      it('should rewrite 12=01+01 to OR', function() {
        // if A and B are max 1 and C is 12 then one must be one but both may be on
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B [0 1]
          : R [1 2]
          R = A + B
        `);
      });

      it('should not rewrite [01]=[12]+1 to LT', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : C [1 2]
          C = A + 1
        `);
      });

      it('should not rewrite [0055]=[1166]+1 to LT lr', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : C [1 1 6 6]
          C = A + 1
        `);
      });

      it('should not rewrite [0055]=[1166]+1 to LT rl', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : C [1 1 6 6]
          C = 1 + A
        `);
      });

      it('should not fall into this trap for [01]=[12]+1', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : C [1 2]
          C = A + 1
          # 0 < 2 but wont satisfy A < C
          A == 0
          C == 2
        `, 'reject');
      });

      it('should not fall into this trap for [01]=1+[12]', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : C [1 2]
          C = 1 + A
          # 0 < 2 but wont satisfy A < C
          A == 0
          C == 2
        `, 'reject');
      });

      it('should not fall into this trap for [0055]=[1166]+1', function() {
        verify(`
          @custom var-strat throw
          : A [0 0 5 5]
          : C [1 1 6 6]
          C = A + 1
          # 0 < 6 but wont satisfy A < C
          A == 0
          C == 6
        `, 'reject');
      });
    });

    it('should not trip up when R=0 already', function() {
      verify(`
        @custom var-strat throw
        : A, B, C, D, E [0 10]
        : R [0 0]
        R = sum(A B C D E)
        @custom noleaf A B C D E R
      `);
    });

    it('should not trip up with same var arg twice becoming solved', function() {
      // ok the regression being tested is when the minifier applies the R
      // value, 0, it sets A and B to zero in the same loop. however, B is
      // counted twice. In this same loop the number of constants and their
      // sum was increased. This caused the second occurence of the same
      // var to be considered an already seen constant, and ignored. So now
      // it just counts again and this test ensures that's okay.
      verify(`
        @custom var-strat throw
        : A, B, C [0 10]
        : R [0 0]
        R = sum(A B B C)
        @custom noleaf A B R
      `);
    });
  });

  describe('xnor', function() {

    it('should rewrite to eq if nonzero, both size=2, and same max', function() {
      // since xnor means "either zero or nonzero"; when both domains have two elements
      // and one is zero, if the non-zero is equal then the op is basically saying "both
      // must be zero or the same non-zero" which means "eq".
      verify(`
        @custom var-strat throw
        : A, B [0 1]
        A !^ B
        @custom noleaf A B
      `);
    });

    it('should also eq for non-bool low domain', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 0 5 5] @max
        A !^ B
        @custom noleaf A B
      `);
    });

    it('should also eq for non-bool high domain', function() {
      verify(`
        @custom var-strat throw
        : A, B [0 0 100 100] @max
        A !^ B
        @custom noleaf A B
      `);
    });

    it('should eliminate A!^A', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        A !^ A
        @custom noleaf A
      `);
    });
  });

  describe('regressions', function() {

    it('the extra math made it not solve', function() {
      // (the inverses of div were messed up)
      verify(`
        @custom var-strat throw
        : A, B = [0 0 10 10]
        : C = [0 0 100 100]
        : R = 100
        R = all?(A B)
        C <= R
        # -->  C <= A, C <= B
        # we want the solution: {A: 10, B: 10, C: 100, R: 100}


        # with R being >0, A and B must be >0, so they become 10
        # C can still be 0 or 100 so the math tries to indirectly force that
        # R/2=50, a+a=100. but it seems to break somewhere
        : a *
        a = R / 2
        C = a + a

        @custom noleaf A B C
        @custom free 0
      `);
    });

  });
});
