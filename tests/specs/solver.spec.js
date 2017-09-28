import {
  verify,
} from '../../../fdv/verifier';

import expect from '../../../fdlib/tests/lib/mocha_proxy.fixt';

import {
  LOG_NONE,
  LOG_STATS,
  LOG_SOLVES,
  LOG_MAX,
  LOG_MIN,
  SUB,
  SUP,
} from '../../../fdlib/src/helpers';

describe('fdh/specs/solver.spec', function () {

  describe('imported legacy tests', function () {

    // we could phase these out

    it('case 1', function () {
      verify(`
        : A, B, C, D [0 1]
        : A1, A2, A3, A4 [0 1]
        : B1, B2, B3, B4 [0 1]
        : C1, C2, C3, C4 [0 1]
        : D1, D2, D3, D4 [0 1]

        A = sum(A1 A2 A3 A4)
        B = sum(B1 B2 B3 B4)
        C = sum(C1 C2 C3 C4)
        D = sum(D1 D2 D3 D4)

        A == 1
        C == 1
        B == A2
        D == C2

        : BD [0 1]
        BD = B ==? D

        : BD1, BD2, BD3 [0 1]
        BD1 = B1 ==? D1
        BD2 = B2 ==? D2
        BD3 = B3 ==? D3

        BD1 >= BD
        BD2 >= BD
        BD3 >= BD
      `)
    });

    it('case 2', function () {

      verify(`
        : A, B, C, D [0 1]
        : A1, A2, A3 [0 1]
        : B1, B2, B3 [0 1]
        : C1, C2, C3 [0 1]
        : D1, D2, D3 [0 1]

        A = sum(A1 A2 A3)
        B = sum(B1 B2 B3)
        C = sum(C1 C2 C3)
        D = sum(D1 D2 D3)

        A == 1
        C == 1

        B == A2
        D == C2

        : BD [0 1]
        BD = B ==? D

        : BD1, BD2, BD3 [0 1]
        BD1 = B1 ==? D1
        BD2 = B2 ==? D2
        BD3 = B3 ==? D3

        BD1 >= BD
        BD2 >= BD
        BD3 >= BD
      `)
    });

    it('case 3', function () {
      verify(`
        : A, B, C, D [0 3]
        A >= 1
        C >= 1

        (A ==? 2) == (B ==? 1)
        (C ==? 2) == (D ==? 1)
        (B ==? D) >= ((B ==? 0) ==? (D ==? 0))
      `, undefined, {skipVerify: true})
    });
  });

  describe('plain tests', function () {

    it('should throw if the dsl contained an empty domain', function(){
      expect(_ => verify(`
        : A []
      `)).to.throw('Empty domain');
      expect(_ => verify(`
        : A [ ]
      `)).to.throw('Empty domain');
      expect(_ => verify(`
        : A [     ]
      `)).to.throw('Empty domain');
      expect(_ => verify(`
        : A [0 1]
        A == []
      `)).to.throw('Empty domain');
      expect(_ => verify(`
        : A [0 1]
        A == [   ]
      `)).to.throw('Empty domain');
      expect(_ => verify(`
        : A [0 1]
        A = sum(15 [])
      `)).to.throw('Empty domain');
    })

    it('should solve a sparse domain', function () {
      verify(`
        : A [1 5]
        : B [2 2 4 5]
        : C [1 5]
        : D 4
        : E [1 5]

        A < B
        B < C
        C < D
        D < E
      `)
    });

    it('should reject a simple > test (regression)', function () {
      // regression: x>y was wrongfully mapped to y<=x

      verify(`
        : A [1 5]
        : B [2 3 5 5]
        : C [1 5]
        : D 4
        : E [1 5]

        E == 5
        A > B
        B > C
        C > D
        D > E
      `, 'reject')
    });

    it('should solve a simple >= test', function () {
      verify(`
        : A [1 5]
        : B [2 3 5 5]
        : C [1 5]
        : D [4 5]
        : E [1 5]

        E == 5
        A >= B
        B >= C
        C >= D
        D >= E
      `)
    });

    it('should solve a simple < test', function () {
      // only solution is where each var is prev+1, 1 2 3 4 5
      verify(`
        : A [1 5]
        : B [2 3 5 5]
        : C [1 5]
        : D 4
        : E [1 5]

        E == 5
        A < B
        B < C
        C < D
        D < E
      `)
    });

    it('should solve a simple / test', function () {
      // there are two integer solutions (75/5 and 90/6) and
      // 9 fractional solutions whose floor result in 15
      verify(`
        : A [50 100]
        : B [5 10]
        : R [0 100]
        R = A / B
        R == 15
      `)
    });

    it('should solve another simple / test', function () {
      // expecting two solutions; one integer division and one floored fractional division
      verify(`
        : A [3 5]
        : B 2
        : R [0 100]
        R = A / B
        R == 2
      `)
    });

    it('should solve a simple * test', function () {
      verify(`
        : A [3 8]
        : B [2 10]
        : R [0 100]
        R = A * B
        R == 30
      `)
    });

    it('should solve a simple - test', function () {
      verify(`
        : A 400
        : B 50
        : R [0 10000]

        R = A - B
      `)
    });

    it('should not skip over when a var only has one propagator and is affected', function () {
      verify(`
        : A, B [0 1]
        A != B
      `)
    });
  });

  describe('targeting vars', function () {

    it('should want to solve all vars if targets are not set at all', function () {
      // a, b, c are not constrained in any way, so 2^3=8
      // no var is targeted so they should all solve
      // however, the constraint will force A and B to solve
      // to a single value, where C is left as "any"
      verify(`
        : A, B, C, R [0 1]
        R = A ==? B
      `)
    });

    it('should throw if explicitly targeting no vars', function () {
      expect(_ => verify(`
        : A, B, C, R [0 1]
        R = A ==? B
        @custom targets
      `)).to.throw('ONLY_USE_WITH_SOME_TARGET_VARS');
    });
  });

  it('quick minus test', function () {
    verify(`
      : A 1
      : B 1
      : C [0 1]
      C = A - B
    `)
  });

  it('should solve a regression plus case', function () {
    verify(`
      : A, B, C [0 1]
      C = A + B
    `)
  });

  describe('reifiers', function () {

    it('should resolve a simple reified eq case', function () {
      // C can be one of three elements.
      // there is a bool var C4 that checks whether C is resolved to 4
      // there is a constraint that requires C4 to be 1
      // ergo; C must be 4 to satisfy all constraints
      // ergo; there is 1 possible solution
      verify(`
        : A 1
        : B 4
        : C [2 2 4 4 9 9]
        : C4 [0 1]
        C4 = C ==? B
        C4 == A
      `)
    });

    it('should resolve a simple reified !eq case', function () {
      // list can be one of three elements.
      // there is a bool var that checks whether list is resolved to 4
      // there is a constraint that requires the above bool to be 0
      // ergo; list must be 2 or 9 to satisfy all constraints
      // ergo; there are 2 possible solutions
      verify(`
        : A 0
        : B 4
        : C [2 2 4 4 9 9]
        : C4 [0 1]
        C4 = C ==? B
        C4 == A
      `)
    });

    it('should resolve a simple reified neq case', function () {
      // list can be one of three elements.
      // there is a bool var that checks whether list is resolved to 4
      // there is a constraint that requires the above bool to be 1
      // ergo; list must be 2 or 9 to satisfy all constraints
      // ergo; there are 2 possible solutions
      verify(`
        : A 1
        : B 4
        : C [2 2 4 4 9 9]
        : C4 [0 1]
        C4 = C !=? B
        C4 == A
      `)
    });

    it('should resolve a simple reified !neq case', function () {
      // list can be one of three elements.
      // there is a bool var that checks whether list is resolved to 4
      // there is a constraint that requires the above bool to be 0
      // ergo; list must be 4 to satisfy all constraints
      // ergo; there is 1 possible solution
      verify(`
        : A 0
        : B 4
        : C [2 2 4 4 9 9]
        : C4 [0 1]
        C4 = C !=? B
        C4 == A
      `)
    });

    it('should resolve a simple reified lt case', function () {
      // two lists, 123 and 345
      // reified checks whether 123<345 which is only the case when
      // the 3 is dropped from at least one side
      // IS_LT is required to have one outcome
      // 3 + 3 + 2 = 8  ->  1:3 1:4 1:5 2:3 2:4 2:5 3:4 3:5
      verify(`
        : A 1
        : B [1 3]
        : C [4 5]
        : LT [0 1]
        LT = A <? B
        LT == A
      `)
    });

    it('should reject a simple reified !lt case', function () {
      // two lists, 123 and 345
      // reified checks whether 123<345 which is only the case when
      // the 3 is dropped from at least one side
      // IS_LT is required to have one outcome
      // since it must be 0, that is only when both lists are 3
      // ergo; one solution
      verify(`
        : A 0
        : B [1 3]
        : C [4 5]
        : LT [0 1]
        LT = A <? B
        LT == A
      `, 'reject')
    });

    it('should resolve a simple reified lte case', function () {
      // two lists, 123 and 345
      // reified checks whether 1234<=345 which is only the case when
      // the 4 is dropped from at least one side
      // IS_LTE is required to have one outcome
      // 3 + 3 + 3 + 2 = 11  ->  1:3 1:4 1:5 2:3 2:4 2:5 3:3 3:4 3:5 4:4 4:5
      verify(`
        : A 1
        : B [1 4]
        : C [3 5]
        : LT [0 1]
        LT = A <=? B
        LT == A
      `)
    });

    it('should reject a simple reified !lte case', function () {
      // two lists, 1234 and 345
      // reified checks whether 1234<=345 which is only the case when
      // the 4 is dropped from at least one side
      // IS_LTE is required to have one outcome
      // since it must be 0, that is only when left is 4 and right is 3
      // ergo; one solution
      verify(`
        : A 0
        : B [1 4]
        : C [3 5]
        : LT [0 1]
        LT = A <=? B
        LT == A
      `, 'reject')
    });

    it('should resolve an even simpler reified !lte case', function () {
      verify(`
        : A 4
        : B 5
        : R 0
        R = A <=? B
      `, 'reject')
    });

    it('should reject a simple reified gt case', function () {
      // two lists, 123 and 345
      // reified checks whether 345>123 which is only the case when
      // the 3 is dropped from at least one side
      // IS_GT is required to have one outcome
      // 3 + 3 + 2 = 8  ->  3:1 4:1 5:1 3:2 4:2 5:2 3:1 3:2
      verify(`
        : A 1
        : B [1 3]
        : C [3 5]
        : GT [0 1]
        GT = A >? B
        GT == A
      `, 'reject')
    });

    it('should resolve a simple reified !gt case', function () {
      // two lists, 123 and 345
      // reified checks whether 123<345 which is only the case when
      // the 3 is dropped from at least one side
      // IS_GT is required to have one outcome
      // since it must be 0, that is only when both lists are 3
      // ergo; one solution
      verify(`
        : A 0
        : B [1 3]
        : C [3 5]
        : GT [0 1]
        GT = A >? B
        GT == A
      `)
    });

    it('should reject a simple reified gte case', function () {
      // two lists, 1234 and 345
      // reified checks whether 345>=1234 which is only the case when
      // left is not 3 or right is not 4
      // IS_GTE is required to have one outcome
      // 3 + 3 + 3 + 2 = 11  ->
      //     3:1 4:1 5:1
      //     3:2 4:2 5:2
      //     3:3 4:3 5:3
      //     4:4 5:4
      //     5:5
      verify(`
        : A 1
        : B [1 4]
        : C [3 5]
        : GT [0 1]
        GT = A >? B
        GT == A
      `, 'reject')
    });

    it('should resolve an already solved 5>=4 trivial gte case', function () {
      verify(`
        : A 5
        : B 4
        : R 1
        R = A >? B
      `)
    });

    it('should reject 1=4>?4 trivial gt case', function () {
      verify(`
        : A 4
        : B 4
        : R 1
        R = A >? B
      `, 'reject')
    });

    it('should resolve a simple reified !gte case', function () {
      // two lists, 123 and 345
      // reified checks whether 1234<=345 which is only the case when
      // the 4 is dropped from at least one side
      // IS_LTE is required to have one outcome
      // since it must be 0, that is only when left is 3 and right is 4
      // ergo; one solution
      verify(`
        : A [1 4]
        : B [3 5]
        : R [0 1]
        : S 1
        R = A >? B
        R == S
      `)
    });

    it('should resolve a simple sum with lte case', function () {
      // a+b<=5
      // so that's the case for: 0+0, 0+1, 0+2, 0+3,
      // 0+4, 0+5, 1+0, 1+1, 1+2, 1+3, 1+4, 2+0, 2+1,
      // 2+2, 2+3, 3+0, 3+1, 3+2, 4+0, 4+1, and 5+0
      // ergo: 21 solutions
      verify(`
        : A [0 10]
        : B [0 10]
        : R [3 5]
        : S [0 100]
        S = A + B
        S <= R
      `)
    });

    it('should resolve a simple sum with lt case', function () {
      // a+b<5
      // so that's the case for: 0+0, 0+1, 0+2,
      // 0+3, 0+4, 1+0, 1+1, 1+2, 1+3, 2+0, 2+1,
      // 2+2, 3+0, 3+1, and 4+0
      // ergo: 16 solutions
      verify(`
        : A [0 10]
        : B [0 10]
        : R [5 5]
        : S [0 100]
        S = A + B
        S < R
      `)
    });

    it('should resolve a simple sum with gt case', function () {
      // a+b>5
      // there are 11x11=121 cases. a+b<=5 is 21 cases
      // (see other test) so there must be 100 results.
      verify(`
        : A [0 10]
        : B [0 10]
        : R [5 5]
        : S [0 100]
        S = A + B
        S > R
      `)
    });

    it('should resolve a simple sum with gte case', function () {
      // a+b>=5
      // there are 11x11=121 cases. a+b<5 is 15 cases
      // (see other test) so there must be 106 results.
      verify(`
        : A [0 10]
        : B [0 10]
        : R [5 5]
        : S [0 100]
        S = A + B
        S >= R
      `)
    });
  });

  // lets move this to examples
  it('gss poc with everything in fdq', function () {
    /*
     viewport is 1200 x 800
     boxes are 100x100
     box1 is 10 left to center so box1.x = 1200/2-110=490
     box2 is 10 right of center so box2.x = 1200/2+10=610
     box1 and box2 are vertically centered, same height so same y: (800/2)-(100/2)=350

     // assuming
     // ::window[width] is 1200
     // ::window[height] is 800

     #box1 {
     width:== 100;
     height:== 100;
     }
     #box2 {
     width: == 100;
     height: == 100;
     }

     #box1[right] == :window[center-x] - 10;
     #box2[left] == :window[center-x] + 10;

     #box1[center-y] == #box2[center-y] == ::window[center-y];

     solution:
     {
     box1_x: 490, // 490+100+10=600=1200/2
     box1_width: 100,
     box1_y: 350,
     box1_height: 100,
     box2_x: 610,
     box2_width: 100,
     box2_y: 350,
     box2_height: 100,

     VIEWPORT_WIDTH: 1200,
     VIEWPORT_HEIGHT: 800,
     VIEWPORT_MIDDLE_WIDTH: 600,
     VIEWPORT_MIDDLE_HEIGHT: 400,
     }

     */

    verify(`
      : VIEWPORT_WIDTH 1200
      : VIEWPORT_HEIGHT 800
      : VIEWPORT_MIDDLE_HEIGHT *
      : VIEWPORT_MIDDLE_WIDTH *

      : box1_x * #  490+100+10=600=1200/2
      : box1_y *
      : box2_x *
      : box2_y *
      : box1_width, box1_height, box2_width, box2_height *

      same(100, box1_width, box1_height, box2_width, box2_height)

      : W, X, Y, Z *
      W = VIEWPORT_WIDTH - box1_width
      box1_x < W
      X = VIEWPORT_HEIGHT - box1_height
      box1_y < X
      Y = VIEWPORT_WIDTH - box2_width
      box2_x < Y
      Z = VIEWPORT_HEIGHT - box2_height
      box2_y < Z

      #VIEWPORT_MIDDLE_WIDTH = VIEWPORT_WIDTH / 2

      VIEWPORT_MIDDLE_WIDTH = sum(box1_x box1_width 10)
      VIEWPORT_MIDDLE_WIDTH = box2_x - 10

      #VIEWPORT_MIDDLE_HEIGHT = VIEWPORT_HEIGHT / 2
      : A, B *
      A = box1_height / 2
      box1_y = VIEWPORT_MIDDLE_HEIGHT - A
      B = box2_height / 2
      box2_y = VIEWPORT_MIDDLE_HEIGHT - B
    `)
  });

  describe('debugging options', function () {

    it('should support _debug edge cases', function () {
      // note: this is only trying to improve test coverage in debugging
      // code. the actual test is not testing anything in particular.
      verify(`
        : A [0 100]
        : B [0 100]
        : R *
        A == B
        R = A ==? B
      `, undefined, undefined, undefined, {_debug: true})
    });

    // TOFIX (the compile-time optimization is causing empty domains the runtime does not (yet) expect)
    it.skip('should work with exportBare', function () {
      verify(`
        : A [0 1 4 5]
        : B [1 10]
        : R 5

        R = A + B
        R = A - B
        R = A * B
        R = A / B
        R = sum(A B)
        R = product(A B)
        diff(A B R)
        A == B
        A != B
        A <= B
        A < B
        A >= B
        A > B
        R = A ==? B
        R = A !=? B
        R = A <? B
        R = A <=? B
        R = A >? B
        R = A >=? B
      `, 'reject', undefined, undefined, {exportBare: true})
    });

    it('should support _debugSpace', function () {
      verify(`
        : A [0 100]
        : B [0 100]
        : R *
        A == B
        R = A ==? B
      `, undefined, undefined, undefined, {_debugSpace: true})
    });

    it('should support _debugSolver', function () {
      verify(`
        : A [0 100]
        : B [0 100]
        : R *
        A == B
        R = A ==? B
      `, undefined, undefined, undefined, {_debugSolver: true})
    });
  });

  describe('regressions', function () {

    it('importer was ignoring `A = 0` and `C = 6` and just solved it', function () {
      verify(`
        : A [0 0 5 5]
        : C [1 1 6 6]
        C = A + 1
        # 0 < 6 but wont satisfy A < C
        A = 0
        C = 6
      `, 'reject')
    });

    // TOFIX: compile-time optimization causing empty domain the runtime isnt expecting
    it.skip('caused empty domain warning', function () {
      verify(`
        : A [1 5]
        : B 4
        : C [1 5]
        : D [2, 3, 5, 5]
        : E [1 5]

        E == 5
        A < B
        B < C
        C < D
        D < E
      `, 'reject')
    });

    // takes too long in FD and has no real value anyways
    it.skip('should not take forever to solve', function() {
      // from fdq test case 'with viewport constants hardcoded'
      // (it's actually fdq itself that takes forever when solving this after being presolved)
      _verify(`
        @custom var-strat throw # we dont care about FD and pre won't solve it
        # vars:
        : $7$ [1,1,3,3,5,5,9,9,12,12]
        : $a$ [1,5]
        : $e$ [1,8]
        : $j$ [1,3,5,5,9,9,12,12]
        : $k$ [1,6]
        : $l$ [1,8]
        : $q$ [1,3,5,6,9,9,12,12]
        : $r$ [1,7]
        : $s$ [1,8]
        : $y$ [1,3,5,6,9,10,12,12]
        : $z$ [1,8]
        : $10$ [1,8]
        : $15$ [1,3,5,7,9,10,12,12]
        : $16$ [1,9]
        : $17$ [1,8]
        : $1c$ [2,3,5,10,12,12]
        : $1d$ [2,10]
        : $1e$ [1,8]
        : $1k$ [2,3,5,8,10,12]
        : $1l$ [3,11]
        : $1m$ [1,8]
        : $1r$ [2,2,4,8,10,12]
        : $1s$ [4,12]
        : $1t$ [1,8]
        : $1y$ [2,2,4,4,6,8,10,12]
        : $1z$ [5,12]
        : $20$ [1,8]
        : $25$ [2,2,4,4,6,8,10,11]
        : $26$ [6,12]
        : $2c$ [4,4,6,8,10,11]
        : $2d$ [7,12]
        : $2j$ [4,4,7,8,10,11]
        : $2k$ [8,12]
        : $2p$ [0,1]
        : $2r$ [0,1]
        : $2t$ [0,1]
        : $2v$ [0,1]
        : $2x$ [0,1]
        : $2z$ [0,1]
        : $31$ [0,1]
        : $33$ [0,1]
        : $35$ [0,1]
        : $37$ [0,1]
        : $39$ [0,1]
        : $3b$ [0,1]
        : $3d$ [0,1]
        : $3f$ [0,1]
        : $3h$ [0,1]
        : $3j$ [0,1]
        : $3l$ [0,1]
        : $3n$ [0,1]
        : $3p$ [0,1]
        : $3r$ [0,1]
        : $3t$ [0,1]
        : $3v$ [0,1]
        : $3x$ [0,1]
        : $3z$ [0,1]
        : $41$ [0,1]
        : $43$ [0,1]
        : $45$ [0,1]
        : $47$ [0,1]
        : $49$ [0,1]
        : $4b$ [0,1]
        : $4d$ [0,1]
        : $4f$ [0,1]
        : $4h$ [0,1]
        : $4j$ [0,1]
        : $4l$ [0,1]
        : $4n$ [0,1]
        : $4p$ [0,1]
        : $4r$ [0,1]
        : $4t$ [0,1]
        : $4v$ [0,1]
        : $4x$ [0,1]
        : $4z$ [0,1]
        : $51$ [0,1]
        : $53$ [0,1]
        : $55$ [0,1]
        : $57$ [0,1]
        : $59$ [0,1]
        : $5b$ [0,1]
        : $5d$ [0,1]
        : $5f$ [0,1]
        : $5h$ [0,1]
        : $5j$ [0,1]
        : $5l$ [0,1]
        : $5n$ [0,1]
        : $5p$ [0,1]
        : $5r$ [0,1]
        : $5t$ [0,1]
        : $5v$ [0,1]
        : $5x$ [0,1]
        : $5z$ [0,1]
        : $61$ [0,1]
        : $63$ [0,1]
        : $65$ [0,1]
        : $67$ [0,1]
        : $69$ [0,1]
        : $6b$ [0,1]
        : $6d$ [0,1]
        : $6f$ [0,1]
        : $6h$ [0,1]
        : $6j$ [0,1]
        : $6l$ [0,1]
        : $6n$ [0,1]
        : $6p$ [0,1]
        : $6r$ [0,1]
        : $6t$ [0,1]
        : $6v$ [0,1]
        : $6x$ [0,1]
        : $6z$ [0,1]
        : $71$ [0,1]
        : $73$ [0,1]
        : $75$ [0,1]
        : $77$ [0,1]
        : $79$ [0,1]
        : $7b$ [0,1]
        : $7d$ [0,1]
        : $7f$ [0,1]
        : $7h$ [0,1]
        : $7j$ [0,1]
        : $7l$ [0,1]
        : $7m$ [0,1]
        : $7n$ [0,1]
        : $7o$ [0,1]
        : $7p$ [0,1]
        : $7q$ [0,1]
        : $7r$ [0,1]
        : $7s$ [0,1]
        : $7t$ [0,1]
        : $7u$ [0,1]
        : $7v$ [0,1]
        : $7w$ [0,1]
        : $81$ [0,1]
        : $82$ [0,1]
        : $84$ [0,1]
        : $85$ [0,1]
        : $86$ [0,1]
        : $88$ [0,1]
        : $89$ [0,1]
        : $8a$ [0,1]
        : $8c$ [0,1]
        : $8d$ [0,1]
        : $8e$ [0,1]
        : $8g$ [0,1]
        : $8h$ [0,1]
        : $8i$ [0,1]
        : $8k$ [0,1]
        : $8l$ [0,1]
        : $8m$ [0,1]
        : $8o$ [0,1]
        : $8p$ [0,1]
        : $8q$ [0,1]
        : $8s$ [0,1]
        : $8t$ [0,1]
        : $8u$ [0,1]
        : $8w$ [0,1]
        : $8x$ [0,1]
        : $8z$ [0,1]


        # Constraints:
        diff( $a$ $k$ $r$ $z$ $16$ $1d$ $1l$ $1s$ $1z$ $26$ $2d$ $2k$ )
        $2p$ = $7$ ==? 1
        $2p$ = $a$ ==? 1
        $2r$ = $j$ ==? 1
        $2r$ = $k$ ==? 1
        $2t$ = $q$ ==? 1
        $2t$ = $r$ ==? 1
        $2v$ = $y$ ==? 1
        $2v$ = $z$ ==? 1
        $2x$ = $15$ ==? 1
        $2x$ = $16$ ==? 1
        $2z$ = $7$ ==? 9
        $2z$ = $a$ ==? 2
        $31$ = $j$ ==? 9
        $31$ = $k$ ==? 2
        $33$ = $q$ ==? 9
        $33$ = $r$ ==? 2
        $35$ = $y$ ==? 9
        $35$ = $z$ ==? 2
        $37$ = $15$ ==? 9
        $37$ = $16$ ==? 2
        $39$ = $1c$ ==? 9
        $39$ = $1d$ ==? 2
        $3b$ = $7$ ==? 3
        $3b$ = $a$ ==? 3
        $3d$ = $j$ ==? 3
        $3d$ = $k$ ==? 3
        $3f$ = $q$ ==? 3
        $3f$ = $r$ ==? 3
        $3h$ = $y$ ==? 3
        $3h$ = $z$ ==? 3
        $3j$ = $15$ ==? 3
        $3j$ = $16$ ==? 3
        $3l$ = $1c$ ==? 3
        $3l$ = $1d$ ==? 3
        $3n$ = $1k$ ==? 3
        $3n$ = $1l$ ==? 3
        $3p$ = $7$ ==? 5
        $3p$ = $a$ ==? 4
        $3r$ = $j$ ==? 5
        $3r$ = $k$ ==? 4
        $3t$ = $q$ ==? 5
        $3t$ = $r$ ==? 4
        $3v$ = $y$ ==? 5
        $3v$ = $z$ ==? 4
        $3x$ = $15$ ==? 5
        $3x$ = $16$ ==? 4
        $3z$ = $1c$ ==? 5
        $3z$ = $1d$ ==? 4
        $41$ = $1k$ ==? 5
        $41$ = $1l$ ==? 4
        $43$ = $1r$ ==? 5
        $43$ = $1s$ ==? 4
        $45$ = $7$ ==? 12
        $45$ = $a$ ==? 5
        $47$ = $j$ ==? 12
        $47$ = $k$ ==? 5
        $49$ = $q$ ==? 12
        $49$ = $r$ ==? 5
        $4b$ = $y$ ==? 12
        $4b$ = $z$ ==? 5
        $4d$ = $15$ ==? 12
        $4d$ = $16$ ==? 5
        $4f$ = $1c$ ==? 12
        $4f$ = $1d$ ==? 5
        $4h$ = $1k$ ==? 12
        $4h$ = $1l$ ==? 5
        $4j$ = $1r$ ==? 12
        $4j$ = $1s$ ==? 5
        $4l$ = $1y$ ==? 12
        $4l$ = $1z$ ==? 5
        $4n$ = $j$ ==? 2
        $4n$ = $k$ ==? 6
        $4p$ = $q$ ==? 2
        $4p$ = $r$ ==? 6
        $4r$ = $y$ ==? 2
        $4r$ = $z$ ==? 6
        $4t$ = $15$ ==? 2
        $4t$ = $16$ ==? 6
        $4v$ = $1c$ ==? 2
        $4v$ = $1d$ ==? 6
        $4x$ = $1k$ ==? 2
        $4x$ = $1l$ ==? 6
        $4z$ = $1r$ ==? 2
        $4z$ = $1s$ ==? 6
        $51$ = $1y$ ==? 2
        $51$ = $1z$ ==? 6
        $53$ = $25$ ==? 2
        $53$ = $26$ ==? 6
        $55$ = $q$ ==? 6
        $55$ = $r$ ==? 7
        $57$ = $y$ ==? 6
        $57$ = $z$ ==? 7
        $59$ = $15$ ==? 6
        $59$ = $16$ ==? 7
        $5b$ = $1c$ ==? 6
        $5b$ = $1d$ ==? 7
        $5d$ = $1k$ ==? 6
        $5d$ = $1l$ ==? 7
        $5f$ = $1r$ ==? 6
        $5f$ = $1s$ ==? 7
        $5h$ = $1y$ ==? 6
        $5h$ = $1z$ ==? 7
        $5j$ = $25$ ==? 6
        $5j$ = $26$ ==? 7
        $5l$ = $2c$ ==? 6
        $5l$ = $2d$ ==? 7
        $5n$ = $y$ ==? 10
        $5n$ = $z$ ==? 8
        $5p$ = $15$ ==? 10
        $5p$ = $16$ ==? 8
        $5r$ = $1c$ ==? 10
        $5r$ = $1d$ ==? 8
        $5t$ = $1k$ ==? 10
        $5t$ = $1l$ ==? 8
        $5v$ = $1r$ ==? 10
        $5v$ = $1s$ ==? 8
        $5x$ = $1y$ ==? 10
        $5x$ = $1z$ ==? 8
        $5z$ = $25$ ==? 10
        $5z$ = $26$ ==? 8
        $61$ = $2c$ ==? 10
        $61$ = $2d$ ==? 8
        $63$ = $2j$ ==? 10
        $63$ = $2k$ ==? 8
        $65$ = $15$ ==? 7
        $65$ = $16$ ==? 9
        $67$ = $1c$ ==? 7
        $67$ = $1d$ ==? 9
        $69$ = $1k$ ==? 7
        $69$ = $1l$ ==? 9
        $6b$ = $1r$ ==? 7
        $6b$ = $1s$ ==? 9
        $6d$ = $1y$ ==? 7
        $6d$ = $1z$ ==? 9
        $6f$ = $25$ ==? 7
        $6f$ = $26$ ==? 9
        $6h$ = $2c$ ==? 7
        $6h$ = $2d$ ==? 9
        $6j$ = $2j$ ==? 7
        $6j$ = $2k$ ==? 9
        $6l$ = $1c$ ==? 8
        $6l$ = $1d$ ==? 10
        $6n$ = $1k$ ==? 8
        $6n$ = $1l$ ==? 10
        $6p$ = $1r$ ==? 8
        $6p$ = $1s$ ==? 10
        $6r$ = $1y$ ==? 8
        $6r$ = $1z$ ==? 10
        $6t$ = $25$ ==? 8
        $6t$ = $26$ ==? 10
        $6v$ = $2c$ ==? 8
        $6v$ = $2d$ ==? 10
        $6x$ = $2j$ ==? 8
        $6x$ = $2k$ ==? 10
        $6z$ = $1k$ ==? 11
        $6z$ = $1l$ ==? 11
        $71$ = $1r$ ==? 11
        $71$ = $1s$ ==? 11
        $73$ = $1y$ ==? 11
        $73$ = $1z$ ==? 11
        $75$ = $25$ ==? 11
        $75$ = $26$ ==? 11
        $77$ = $2c$ ==? 11
        $77$ = $2d$ ==? 11
        $79$ = $2j$ ==? 11
        $79$ = $2k$ ==? 11
        $7b$ = $1r$ ==? 4
        $7b$ = $1s$ ==? 12
        $7d$ = $1y$ ==? 4
        $7d$ = $1z$ ==? 12
        $7f$ = $25$ ==? 4
        $7f$ = $26$ ==? 12
        $7h$ = $2c$ ==? 4
        $7h$ = $2d$ ==? 12
        $7j$ = $2j$ ==? 4
        $7j$ = $2k$ ==? 12
        $7l$ = $e$ ==? 3
        $7m$ = $l$ ==? 3
        $7n$ = $s$ ==? 3
        $7o$ = $10$ ==? 3
        $7p$ = $17$ ==? 3
        $7q$ = $1e$ ==? 3
        $7r$ = $1m$ ==? 3
        $7s$ = $1t$ ==? 3
        $7t$ = $20$ ==? 3
        $7l$ != $81$
        $7p$ != $82$
        $84$ = all?( $7m$ $7n$ $7o$ $81$ $82$ )
        $7m$ != $85$
        $7q$ != $86$
        $88$ = all?( $7n$ $7o$ $7p$ $85$ $86$ )
        $7n$ != $89$
        $7r$ != $8a$
        $8c$ = all?( $7o$ $7p$ $7q$ $89$ $8a$ )
        $7o$ != $8d$
        $7s$ != $8e$
        $8g$ = all?( $7p$ $7q$ $7r$ $8d$ $8e$ )
        $7p$ != $8h$
        $7t$ != $8i$
        $8k$ = all?( $7q$ $7r$ $7s$ $8h$ $8i$ )
        $7q$ != $8l$
        $7u$ != $8m$
        $8o$ = all?( $7r$ $7s$ $7t$ $8l$ $8m$ )
        $7r$ != $8p$
        $7v$ != $8q$
        $8s$ = all?( $7s$ $7t$ $7u$ $8p$ $8q$ )
        $7s$ != $8t$
        $7w$ != $8u$
        $8w$ = all?( $7t$ $7u$ $7v$ $8t$ $8u$ )
        $7t$ != $8x$
        $8z$ = all?( $7u$ $7v$ $7w$ $8x$ )
        $84$ = $e$ ==? 2
        $88$ = $l$ ==? 2
        $8c$ = $s$ ==? 2
        $8g$ = $10$ ==? 2
        $8k$ = $17$ ==? 2
        $8o$ = $1e$ ==? 2
        $8s$ = $1m$ ==? 2
        $8w$ = $1t$ ==? 2
        $8z$ = $20$ ==? 2

        # Meta:
        @custom targets( $7$ $a$ $e$ $j$ $k$ $l$ $q$ $r$ $s$ $y$ $z$ $10$ $15$ $16$ $17$ $1c$ $1d$ $1e$ $1k$ $1l$ $1m$ $1r$ $1s$ $1t$ $1y$ $1z$ $20$ $25$ $26$ $2c$ $2d$ $2j$ $2k$ $7l$ $7m$ $7n$ $7o$ $7p$ $7q$ $7r$ $7s$ $7t$ $7u$ $7v$ $7w$ $84$ $88$ $8c$ $8g$ $8k$ $8o$ $8s$ $8w$ $8z$ ) # 54 / 159
    `, '*');
    });
  });
});
