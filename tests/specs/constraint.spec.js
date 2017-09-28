import {
  verify,
} from '../../../fdv/verifier';

import {
  SUB,
  SUP,
} from '../../../fdlib/src/helpers';
import {
  domain__debug,
} from '../../../fdlib/src/domain';

let INPUT_MAP = {
  bool: {
    F: [0, 0],
    B: [0, 1],
    T: [1, 1],
  },
  booly: {
    F: [0, 0],
    B: [0, 0, 5, 5],
    T: [5, 5],
  },
};
let OUTPUT_MAP = {
  bool: {
    F: 0,
    T: 1,
  },
  booly: {
    F: 0,
    T: 5,
  },
};

describe('fdh/specs/constraint.spec', function() {

  it('should work without constraints (FIX THIS ONE FIRST)', function() {
    // if this test fails the problem is _probably_ unrelated to constraints... :)
    verify(`
      : A, B 100
    `);
  });

  describe('eq', function() {

    it('should work with a simple solved vars', function() {
      verify(`
        : A, B 100
        A == B
      `);
    });

    it('should work with a simple solved and unsolved vars', function() {
      verify(`
        : A 100
        : B [100 101]
        A == B
      `);
    });

    it('should work with a simple unsolved vars that do not reject', function() {
      verify(`
        : A, B [100 101]
        A == B
      `);
    });

    it('should work with a simple unsolved vars that reduce but do not reject', function() {
      verify(`
        : A [100 101]
        : B [100 102]
        A == B
      `);
    });

    it('should work with a simple unsolved vars that reject', function() {
      verify(`
        : A [100 101]
        : B [200 201]
        A == B
      `, 'reject');
    });

    describe('pre-computable without propagation', function() {

      function preEq(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A == B
          `, rejects);
        });
      }

      preEq('should not create a constraint if A is solved', [101, 101], [100, 102]);
      preEq('should not create a constraint if B is solved', [100, 102], [101, 101]);
      preEq('should not create a constraint if A and B solved and reject', [100, 100], [99, 99], 'reject');
      preEq('should not create a constraint if A and B solved and pass', [101, 101], [101, 101]);

      preEq('', [0, 0], [0, 0]);
      preEq('', [0, 1], [0, 0]);
      preEq('', [1, 1], [0, 0], 'reject');
      preEq('', [0, 0], [0, 1]);
      preEq('', [0, 1], [0, 1]);
      preEq('', [1, 1], [0, 1]);
      preEq('', [0, 0], [1, 1], 'reject');
      preEq('', [0, 1], [1, 1]);
      preEq('', [1, 1], [1, 1]);
    });
  });

  describe('neq', function() {

    it('should solve with a simple solved vars', function() {
      verify(`
        : A 100
        : B 105
        A != B
      `);
    });

    it('should reject with a simple solved vars', function() {
      verify(`
        : A, B 100
        A != B
      `, 'reject');
    });

    it('should work with a simple solved and unsolved vars', function() {
      verify(`
        : A 100
        : B [100 101]
        A != B
      `);
    });

    it('should work with a simple unsolved vars', function() {
      verify(`
        : A [100 101]
        : B [100 101]
        A != B
      `);
    });

    describe('pre-computable', function() {

      function preNeq(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A != B
          `, rejects);
        });
      }

      preNeq('should not create a constraint if A is solved', [101, 101], [100, 102]);
      preNeq('should not create a constraint if B is solved', [100, 102], [101, 101]);
      preNeq('should not create a constraint if A and B solved and reject', [101, 101], [101, 101], 'reject');
      preNeq('should not create a constraint if A and B solved and pass', [100,100], [99,99]);

      preNeq('', [0, 0], [0, 0], 'reject');
      preNeq('', [0, 1], [0, 0]);
      preNeq('', [1, 1], [0, 0]);
      preNeq('', [0, 0], [0, 1]);
      preNeq('', [0, 1], [0, 1]);
      preNeq('', [1, 1], [0, 1]);
      preNeq('', [0, 0], [1, 1]);
      preNeq('', [0, 1], [1, 1]);
      preNeq('', [1, 1], [1, 1], 'reject');
    });
  });

  describe('lt', function() {

    it('should work when A < B', function() {
      verify(`
        : A 100
        : B 101
        A < B
      `);
    });

    it('should work when A <= B', function() {
      verify(`
        : A 100
        : B [100 101]
        A < B
      `);
    });

    it('should work when A >= B', function() {
      verify(`
        : A [101 103]
        : B 101
        A < B
      `, 'reject');
    });

    it('should work when A <= B <= A', function() {
      verify(`
        : A [100 102]
        : B 101
        A < B
      `);
    });

    it('should work when B <= A <= B', function() {
      verify(`
        : A 101
        : B [100 102]
        A < B
      `);
    });

    it('should work A > B', function() {
      verify(`
        : A 101
        : B 100
        A < B
      `, 'reject');
    });

    describe('pre-computable', function() {

      function preLt(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A < B
          `, rejects);
        });
      }

      preLt('should not create a constraint if A is solved as number', [101, 101], [100, 102]);
      preLt('should not create a constraint if A is solved as array', [101, 101], [100, 102]);
      preLt('should not create a constraint if B is solved as number', [100, 102], [101, 101]);
      preLt('should not create a constraint if B is solved as array', [100, 102], [101, 101]);
      preLt('should not create a constraint if A and B solved as number and reject', [100, 100], [99, 99], 'reject');
      preLt('should not create a constraint if A and B solved as number and pass', [100, 100], [101, 101]);
      preLt('should not create a constraint if A and B solved as array and reject', [100, 100], [99, 99], 'reject');
      preLt('should not create a constraint if A and B solved as array and pass', [100, 100], [101, 101]);
    });

    describe('brute force bool table', function() {

      function test(A, B, rejects) {
        it('test: A=[' + A + '] B=[' + B + '], rejects? '+!!rejects, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A < B
          `, rejects);
        });
      }

      test([0, 0], [0, 0], 'reject');
      test([0, 1], [0, 0], 'reject');
      test([1, 1], [0, 0], 'reject');
      test([0, 0], [0, 1]);
      test([0, 1], [0, 1]);
      test([1, 1], [0, 1], 'reject');
      test([0, 0], [1, 1]);
      test([0, 1], [1, 1]);
      test([1, 1], [1, 1], 'reject');
    });
  });

  describe('lte', function() {

    it('should work when A < B', function() {
      verify(`
        : A 100
        : B 101
        A <= B
      `);
    });

    it('should work when A <= B', function() {
      verify(`
        : A 100
        : B [100 101]
        A <= B
      `);
    });

    it('should work when A >= B', function() {
      verify(`
        : A [100 101]
        : B 100
        A <= B
      `);
    });

    it('should work when A <= B <= A', function() {
      verify(`
        : A [100 102]
        : B 101
        A <= B
      `);
    });

    it('should work when B <= A <= B', function() {
      verify(`
        : A 101
        : B [100 102]
        A <= B
      `);
    });

    it('should work A > B', function() {
      verify(`
        : A 101
        : B 100
        A <= B
      `, 'reject');
    });

    describe('pre-computable', function() {

      function preLte(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A <= B
          `, rejects);
        });
      }

      preLte('should not create a constraint if A is solved as number', [101, 101], [100, 102]);
      preLte('should not create a constraint if A is solved as array', [101, 101], [100, 102]);
      preLte('should not create a constraint if B is solved as number', [100, 102], [101, 101]);
      preLte('should not create a constraint if B is solved as array', [100, 102], [101, 101]);
      preLte('should not create a constraint if A and B solved as number and reject', [100, 100], [99, 99], 'reject');
      preLte('should not create a constraint if A and B solved as number and pass', [100, 100], [100, 100]);
      preLte('should not create a constraint if A and B solved as array and reject', [100, 100], [99, 99], 'reject');
      preLte('should not create a constraint if A and B solved as array and pass', [100, 100], [100, 100]);
    });

    describe('brute force bool table', function() {

      function test(A, B, rejects) {
        it('test: A=[' + A + '] B=[' + B + '] rejects?' + !!rejects, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A <= B
          `, rejects);
        });
      }

      test([0, 0], [0, 0]);
      test([0, 1], [0, 0]);
      test([1, 1], [0, 0], 'reject');
      test([0, 0], [0, 1]);
      test([0, 1], [0, 1]);
      test([1, 1], [0, 1]);
      test([0, 0], [1, 1]);
      test([0, 1], [1, 1]);
      test([1, 1], [1, 1]);
    });
  });

  describe('gt', function() {

    it('should work when A < B', function() {
      verify(`
        : A 100
        : B 101
        A > B
      `, 'reject');
    });

    it('should work when A <= B', function() {
      verify(`
        : A 100
        : B [100 101]
        A > B
      `, 'reject');
    });

    it('should reject when A >= B', function() {
      verify(`
        : A [100 101]
        : B 101
        A > B
      `, 'reject');
    });

    it('should work when A <= B <= A', function() {
      verify(`
        : A [100 102]
        : B 101
        A > B
      `);
    });

    it('should work when B <= A <= B', function() {
      verify(`
        : A 101
        : B [100 102]
        A > B
      `);
    });

    it('should work A > B', function() {
      verify(`
        : A 101
        : B 100
        A > B
      `);
    });

    describe('pre-computable', function() {

      function preGt(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A > B
          `, rejects);
        });
      }

      preGt('should not create a constraint if A is solved as number', [101,101], [100, 102]);
      preGt('should not create a constraint if A is solved as array', [101,101], [100, 102]);
      preGt('should not create a constraint if B is solved as number', [100, 102], [101,101]);
      preGt('should not create a constraint if B is solved as array', [100, 102], [101, 101]);
      preGt('should not create a constraint if A and B solved as number and reject', [99,99], [100,100], 'reject');
      preGt('should not create a constraint if A and B solved as number and pass', [101,101], [100,100]);
      preGt('should not create a constraint if A and B solved as array and reject', [99,99], [100,100], 'reject');
      preGt('should not create a constraint if A and B solved as array and pass', [101,101], [100,100]);

      preGt('', [0, 0], [0, 0], 'reject');
      preGt('', [0, 1], [0, 0]);
      preGt('', [1, 1], [0, 0]);
      preGt('', [0, 0], [0, 1], 'reject');
      preGt('', [0, 1], [0, 1]);
      preGt('', [1, 1], [0, 1]);
      preGt('', [0, 0], [1, 1], 'reject');
      preGt('', [0, 1], [1, 1], 'reject');
      preGt('', [1, 1], [1, 1], 'reject');
    });
  });

  describe('gte', function() {

    it('should work when A < B', function() {
      verify(`
        : A 100
        : B 101
        A >= B
      `, 'reject');
    });

    it('should work when A <= B', function() {
      verify(`
        : A 100
        : B [100 101]
        A >= B
      `);
    });

    it('should work when A >= B', function() {
      verify(`
        : A [100 101]
        : B 100
        A >= B
      `);
    });

    it('should work when A <= B <= A', function() {
      verify(`
        : A [100 102]
        : B 101
        A >= B
      `);
    });

    it('should work when B <= A <= B', function() {
      verify(`
        : A 101
        : B [100 102]
        A >= B
      `);
    });

    it('should work A > B', function() {
      verify(`
        : A 101
        : B 100
        A >= B
      `);
    });

    describe('pre-computable', function() {

      function preGte(desc, A, B, rejects) {
        it(desc, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            A >= B
          `, rejects);
        });
      }

      preGte('should not create a constraint if A is solved as number', [101, 101], [100, 102]);
      preGte('should not create a constraint if A is solved as array', [101, 101], [100, 102]);
      preGte('should not create a constraint if B is solved as number', [100, 102], [101, 101]);
      preGte('should not create a constraint if B is solved as array', [100, 102], [101, 101]);
      preGte('should not create a constraint if A and B solved as number and reject', [99, 99], [100, 100], 'reject');
      preGte('should not create a constraint if A and B solved as number and pass', [101, 101], [100, 100]);
      preGte('should not create a constraint if A and B solved as array and reject', [99, 99], [100, 100], 'reject');
      preGte('should not create a constraint if A and B solved as array and pass', [101, 101], [100, 100]);

      preGte('', [0, 0], [0, 0]);
      preGte('', [0, 1], [0, 0]);
      preGte('', [1, 1], [0, 0]);
      preGte('', [0, 0], [0, 1]);
      preGte('', [0, 1], [0, 1]);
      preGte('', [1, 1], [0, 1]);
      preGte('', [0, 0], [1, 1], 'reject');
      preGte('', [0, 1], [1, 1]);
      preGte('', [1, 1], [1, 1]);
    });
  });

  describe('reifier (conceptual)', function() {

    it('should find two solutions with a constant left', function() {
      verify(`
        : A 0
        : B [0 1]
        : R [0 1]
        R = A <? B
      `);
    });

    it('should find two solutions with a constant right', function() {
      verify(`
        : A [0 1]
        : B 0
        : R [0 1]
        R = A <? B
      `);
    });

    describe('exhaustive bool tables to check optimizations in propagator_addReified', function() {

      describe('issame', function() {

        function test(A, B, R, rejects) {
          it('should solve despite optimizations. ' + [domain__debug(A), '==?', domain__debug(B), '->', domain__debug(R)] + ', rejects?' + !!rejects, function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : R [${R}]
              R = A ==? B
            `, rejects ? 'reject' : undefined);
          });
        }

        [
          // pure bools
          {A: [0, 0], B: [0, 0], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 0], C: [0, 1]},
          {A: [0, 0], B: [0, 0], C: [1, 1]},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 1]},
          {A: [0, 0], B: [0, 1], C: [1, 1]},
          {A: [0, 0], B: [1, 1], C: [0, 0]},
          {A: [0, 0], B: [1, 1], C: [0, 1]},
          {A: [0, 0], B: [1, 1], C: [1, 1], rejects: true},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 1]},
          {A: [0, 1], B: [0, 0], C: [1, 1]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 1]},
          {A: [0, 1], B: [0, 1], C: [1, 1]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 1]},
          {A: [0, 1], B: [1, 1], C: [1, 1]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 1]},
          {A: [1, 1], B: [0, 0], C: [1, 1], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 1]},
          {A: [1, 1], B: [0, 1], C: [1, 1]},
          {A: [1, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 1]},
          {A: [1, 1], B: [1, 1], C: [1, 1]},
          // booly, same but with C = [0 0 5 5]
          {A: [0, 0], B: [0, 0], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 0], C: [5, 5]},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 1], C: [5, 5]},
          {A: [0, 0], B: [1, 1], C: [0, 0]},
          {A: [0, 0], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [1, 1], C: [5, 5], rejects: true},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 0], C: [5, 5]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 1], C: [5, 5]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [1, 1], C: [5, 5]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 0], C: [5, 5], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 1], C: [5, 5]},
          {A: [1, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [1, 1], C: [5, 5]},
        ].forEach(testCase => test(testCase.A, testCase.B, testCase.C, testCase.rejects));
      });

      describe('isdiff', function() {

        function test(A, B, R, rejects) {
          it('should solve despite optimizations. ' + [domain__debug(A), '!=?', domain__debug(B), '->', domain__debug(R)] + ' rejects? ' + !!rejects, function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : R [${R}]
              R = A !=? B
            `, rejects ? 'reject' : undefined);
          });
        }

        [
          // pure bools
          {A: [0, 0], B: [0, 0], C: [0, 0]},
          {A: [0, 0], B: [0, 0], C: [0, 1]},
          {A: [0, 0], B: [0, 0], C: [1, 1], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 1]},
          {A: [0, 0], B: [0, 1], C: [1, 1]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 1]},
          {A: [0, 0], B: [1, 1], C: [1, 1]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 1]},
          {A: [0, 1], B: [0, 0], C: [1, 1]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 1]},
          {A: [0, 1], B: [0, 1], C: [1, 1]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 1]},
          {A: [0, 1], B: [1, 1], C: [1, 1]},
          {A: [1, 1], B: [0, 0], C: [0, 0], rejects: true},
          {A: [1, 1], B: [0, 0], C: [0, 1]},
          {A: [1, 1], B: [0, 0], C: [1, 1]},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 1]},
          {A: [1, 1], B: [0, 1], C: [1, 1]},
          {A: [1, 1], B: [1, 1], C: [0, 0]},
          {A: [1, 1], B: [1, 1], C: [0, 1]},
          {A: [1, 1], B: [1, 1], C: [1, 1], rejects: true},
          // booly, same but with C = [0 0 5 5]
          {A: [0, 0], B: [0, 0], C: [0, 0]},
          {A: [0, 0], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 0], C: [5, 5], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 1], C: [5, 5]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [1, 1], C: [5, 5]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 0], C: [5, 5]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 1], C: [5, 5]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [1, 1], C: [5, 5]},
          {A: [1, 1], B: [0, 0], C: [0, 0], rejects: true},
          {A: [1, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 0], C: [5, 5]},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 1], C: [5, 5]},
          {A: [1, 1], B: [1, 1], C: [0, 0]},
          {A: [1, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [1, 1], C: [5, 5], rejects: true},

        ].forEach(testCase => test(testCase.A, testCase.B, testCase.C, testCase.rejects));
      });

      describe('islt-', function() {

        function test(A, B, R, rejects) {
          it('should solve despite optimizations. ' + [domain__debug(A), '<?', domain__debug(B), '->', domain__debug(R)] + ' rejects? ' + !!rejects, function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : R [${R}]
              R = A <? B
            `, rejects ? 'reject' : undefined);
          });
        }

        [
          // pure bools
          {A: [0, 0], B: [0, 0], C: [0, 0]},
          {A: [0, 0], B: [0, 0], C: [0, 1]},
          {A: [0, 0], B: [0, 0], C: [1, 1], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 1]},
          {A: [0, 0], B: [0, 1], C: [1, 1]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 1]},
          {A: [0, 0], B: [1, 1], C: [1, 1]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 1]},
          {A: [0, 1], B: [0, 0], C: [1, 1], rejects: true},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 1]},
          {A: [0, 1], B: [0, 1], C: [1, 1]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 1]},
          {A: [0, 1], B: [1, 1], C: [1, 1]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 1]},
          {A: [1, 1], B: [0, 0], C: [1, 1], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 1]},
          {A: [1, 1], B: [0, 1], C: [1, 1], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 0]},
          {A: [1, 1], B: [1, 1], C: [0, 1]},
          {A: [1, 1], B: [1, 1], C: [1, 1], rejects: true},
          // booly, same but with C = [0 0 5 5]
          {A: [0, 0], B: [0, 0], C: [0, 0]},
          {A: [0, 0], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 0], C: [5, 5], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 0]},
          {A: [0, 0], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 1], C: [5, 5]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [1, 1], C: [5, 5]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 0], C: [5, 5], rejects: true},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 1], C: [5, 5]},
          {A: [0, 1], B: [1, 1], C: [0, 0]},
          {A: [0, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [1, 1], C: [5, 5]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 0], C: [5, 5], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 1], C: [5, 5], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 0]},
          {A: [1, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [1, 1], C: [5, 5], rejects: true},
        ].forEach(testCase => test(testCase.A, testCase.B, testCase.C, testCase.rejects));
      });

      describe('islte', function() {

        function test(A, B, R, rejects) {
          it('should solve despite optimizations. ' + [domain__debug(A), '<=?', domain__debug(B), '->', domain__debug(R)] + ' rejects? ' + !!rejects, function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : R [${R}]
              R = A <=? B
            `, rejects ? 'reject' : undefined);
          });
        }

        [
          // pure bools
          {A: [0, 0], B: [0, 0], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 0], C: [0, 1]},
          {A: [0, 0], B: [0, 0], C: [1, 1]},
          {A: [0, 0], B: [0, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 1]},
          {A: [0, 0], B: [0, 1], C: [1, 1]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 1]},
          {A: [0, 0], B: [1, 1], C: [1, 1]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 1]},
          {A: [0, 1], B: [0, 0], C: [1, 1]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 1]},
          {A: [0, 1], B: [0, 1], C: [1, 1]},
          {A: [0, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 1], B: [1, 1], C: [0, 1]},
          {A: [0, 1], B: [1, 1], C: [1, 1]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 1]},
          {A: [1, 1], B: [0, 0], C: [1, 1], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 1]},
          {A: [1, 1], B: [0, 1], C: [1, 1]},
          {A: [1, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 1]},
          {A: [1, 1], B: [1, 1], C: [1, 1]},
          // booly, same but with C = [0 0 5 5]
          {A: [0, 0], B: [0, 0], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 0], C: [5, 5]},
          {A: [0, 0], B: [0, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [0, 1], C: [5, 5]},
          {A: [0, 0], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 0], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 0], B: [1, 1], C: [5, 5]},
          {A: [0, 1], B: [0, 0], C: [0, 0]},
          {A: [0, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 0], C: [5, 5]},
          {A: [0, 1], B: [0, 1], C: [0, 0]},
          {A: [0, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [0, 1], C: [5, 5]},
          {A: [0, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [0, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [0, 1], B: [1, 1], C: [5, 5]},
          {A: [1, 1], B: [0, 0], C: [0, 0]},
          {A: [1, 1], B: [0, 0], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 0], C: [5, 5], rejects: true},
          {A: [1, 1], B: [0, 1], C: [0, 0]},
          {A: [1, 1], B: [0, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [0, 1], C: [5, 5]},
          {A: [1, 1], B: [1, 1], C: [0, 0], rejects: true},
          {A: [1, 1], B: [1, 1], C: [0, 0, 5, 5]},
          {A: [1, 1], B: [1, 1], C: [5, 5]},
        ].forEach(testCase => test(testCase.A, testCase.B, testCase.C, testCase.rejects));
      });

      it('should properly dsl solve an islte+islt case with shared R', function() {
        verify(`
          : v0 [0,1]
          : v1 [0,0,9,9]
          : v2 [0,0,6,6]
          : v3 [0,0,3,3]
          : v4 [0,1]

          # Constraints:
          v4 = v3 <? v2
          v4 = v1 <=? v0
        `);
      });

      // note: gt and gte map to lt and lte so there's no real need to test them as well... but we could :)
    });
  });

  describe('plus', function() {

    it('should work with simple case', function() {
      verify(`
        : A 100
        : B 101
        : R [150 250]
        R = A + B
      `)
    });

    function testABR(A, B, R) {
      it(`should work with A=${A} B=${B} R=${R}`, function() {
        verify(`
          : A [${A}]
          : B [${B}]
          : R [${R}]
          R = A + B
        `)
      });
    }

    testABR([0, 0], [1, 1], [1, 1]);
    testABR([1, 1], [0, 0], [1, 1]);
    testABR([0, 0], [0, 0], [0, 0]);
    testABR([1, 1], [1, 1], [2, 2]);
    testABR([100, 110], [50, 60], [150, 151]);

    it('should work without C', function() {
      verify(`
        : A [100 102]
        : B [50 52]
        R = A + B
      `, undefined, {skipVerify: true}); // verify cant handle this
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [0 50]
        : R 200
        R = A + B
      `)
    });

    describe('brute force bool table', function() {

      function test(A, B, R, rejects) {
        it('test: A=[' + A + '] B=[' + B + '] R=[' + R + '], rejects?' + !!rejects, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            : R [${R}]
            R = A + B
          `, rejects)
        });
      }

      [
        {A: [0, 0], B: [0, 0], R: [0, 0]},
        {A: [0, 0], B: [0, 0], R: [0, 10]},
        {A: [0, 0], B: [0, 0], R: [1, 1], rejects: 'reject'},
        {A: [0, 0], B: [0, 1], R: [0, 0]},
        {A: [0, 0], B: [0, 1], R: [0, 10]},
        {A: [0, 0], B: [0, 1], R: [1, 1]},
        {A: [0, 0], B: [1, 1], R: [0, 0], rejects: 'reject'},
        {A: [0, 0], B: [1, 1], R: [0, 10]},
        {A: [0, 0], B: [1, 1], R: [1, 1]},
        {A: [0, 1], B: [0, 0], R: [0, 0]},
        {A: [0, 1], B: [0, 0], R: [0, 10]},
        {A: [0, 1], B: [0, 0], R: [1, 1]},
        {A: [0, 1], B: [0, 1], R: [0, 0]},
        {A: [0, 1], B: [0, 1], R: [0, 10]},
        {A: [0, 1], B: [0, 1], R: [1, 1]},
        {A: [0, 1], B: [1, 1], R: [0, 0], rejects: 'reject'},
        {A: [0, 1], B: [1, 1], R: [0, 10]},
        {A: [0, 1], B: [1, 1], R: [1, 1]},
        {A: [1, 1], B: [0, 0], R: [0, 0], rejects: 'reject'},
        {A: [1, 1], B: [0, 0], R: [0, 10]},
        {A: [1, 1], B: [0, 0], R: [1, 1]},
        {A: [1, 1], B: [0, 1], R: [0, 0], rejects: 'reject'},
        {A: [1, 1], B: [0, 1], R: [0, 10]},
        {A: [1, 1], B: [0, 1], R: [1, 1]},
        {A: [1, 1], B: [1, 1], R: [0, 0], rejects: 'reject'},
        {A: [1, 1], B: [1, 1], R: [0, 10]},
        {A: [1, 1], B: [1, 1], R: [1, 1], rejects: 'reject'},
      ].forEach(testCase => test(testCase.A, testCase.B, testCase.R, testCase.rejects));
    });
  });

  describe('minus', function() {

    it('should work with simple case', function() {
      verify(`
        : A 500
        : B 100
        : R 400
        R = A - B
      `)
    });

    it('should reject if result is negative', function() {
      verify(`
        : A 100
        : B 101
        : R 0
        R = A - B
      `, 'reject')
    });

    function testABC(A, B, R, rejects) {
      it(`should work with A=${A} B=${B} R=${R}, rejects? ${!!rejects}`, function() {
        verify(`
          : A [${A}]
          : B [${B}]
          : R [${R}]
          R = A - B
        `, rejects)
      });
    }

    testABC([0, 0], [1, 1], [1, 1], 'reject');
    testABC([1, 1], [0, 0], [1, 1]);
    testABC([0, 0], [0, 0], [0, 0]);
    testABC([1, 1], [1, 1], [2, 2], 'reject');
    testABC([100, 110], [50, 60], [150, 151], 'reject');
    testABC([100, 110], [50, 60], [59, 100]);

    it('should work without R', function() {
      verify(`
        : A [100 102]
        : B [50 52]
        R = A - B
      `, undefined, {skipVerify: true}); // verify cant handle this
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [50 ${SUP}]
        : R 100
        R = A - B
      `)
    });

    describe('brute force bool table', function() {

      function test(A, B, R, rejects) {
        it('test: A=[' + A + '] B=[' + B + '] R=[' + R + '], rejects? ' + !!rejects, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            : R [${R}]
            R = A - B
          `, rejects)
        });
      }

      [
        {A: [0, 0], B: [0, 0], R: [0, 0]},
        {A: [0, 0], B: [0, 0], R: [0, 1]},
        {A: [0, 0], B: [0, 0], R: [1, 1], rejects: 'reject'},
        {A: [0, 0], B: [0, 1], R: [0, 0]},
        {A: [0, 0], B: [0, 1], R: [0, 1]},
        {A: [0, 0], B: [0, 1], R: [1, 1], rejects: 'reject'},
        {A: [0, 0], B: [1, 1], R: [0, 0], rejects: 'reject'},
        {A: [0, 0], B: [1, 1], R: [0, 1], rejects: 'reject'},
        {A: [0, 0], B: [1, 1], R: [1, 1], rejects: 'reject'},
        {A: [0, 1], B: [0, 0], R: [0, 0]},
        {A: [0, 1], B: [0, 0], R: [0, 1]},
        {A: [0, 1], B: [0, 0], R: [1, 1]},
        {A: [0, 1], B: [0, 1], R: [0, 0]},
        {A: [0, 1], B: [0, 1], R: [0, 1]},
        {A: [0, 1], B: [0, 1], R: [1, 1]},
        {A: [0, 1], B: [1, 1], R: [0, 0]},
        {A: [0, 1], B: [1, 1], R: [0, 1]},
        {A: [0, 1], B: [1, 1], R: [1, 1], rejects: 'reject'},
        {A: [1, 1], B: [0, 0], R: [0, 0], rejects: 'reject'},
        {A: [1, 1], B: [0, 0], R: [0, 1]},
        {A: [1, 1], B: [0, 0], R: [1, 1]},
        {A: [1, 1], B: [0, 1], R: [0, 0]},
        {A: [1, 1], B: [0, 1], R: [0, 1]},
        {A: [1, 1], B: [0, 1], R: [1, 1]},
        {A: [1, 1], B: [1, 1], R: [0, 0]},
        {A: [1, 1], B: [1, 1], R: [0, 1]},
        {A: [1, 1], B: [1, 1], R: [1, 1], rejects: 'reject'},
      ].forEach(testCase => test(testCase.A, testCase.B, testCase.R, testCase.rejects));
    });
  });

  describe('mul', function() {

    it('should work with simple case', function() {
      verify(`
        : A 50
        : B 10
        : R 500
        R = A * B
      `)
    });

    it(`should work A`, function() {
      verify(`
        : A 1
        : B 1
        : R 1
        R = A * B
      `)
    });

    it(`should work B`, function() {
      verify(`
        : A [100 110]
        : B [50 60]
        : R [150 151]
        R = A * B
      `, 'reject')
    });

    it('should work without C', function() {
      verify(`
        : A [50 52]
        : B [70 72]
        : R *
        R = A * B
      `)
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [10 ${SUP}]
        : R 1000
        R = A * B
      `)
    });


    describe('brute force bool table', function() {

      function test(A, B, R, rejects) {
        it('test: A=[' + A + '] B=[' + B + '] R=[' + R + '], rejects? ' + !!rejects, function() {
          verify(`
            : A [${A}]
            : B [${B}]
            : R [${R}]
            R = A * B
          `, rejects)
        });
      }

      [
        {A: [0, 0], B: [0, 0], R: [0, 0]},
        {A: [0, 0], B: [0, 0], R: [0, 10]},
        {A: [0, 0], B: [0, 0], R: [1, 1], rejects: 'reject'},
        {A: [0, 0], B: [0, 1], R: [0, 0]},
        {A: [0, 0], B: [0, 1], R: [0, 10]},
        {A: [0, 0], B: [0, 1], R: [1, 1], rejects: 'reject'},
        {A: [0, 0], B: [1, 1], R: [0, 0]},
        {A: [0, 0], B: [1, 1], R: [0, 10]},
        {A: [0, 0], B: [1, 1], R: [1, 1], rejects: 'reject'},
        {A: [0, 1], B: [0, 0], R: [0, 0]},
        {A: [0, 1], B: [0, 0], R: [0, 10]},
        {A: [0, 1], B: [0, 0], R: [1, 1], rejects: 'reject'},
        {A: [0, 1], B: [0, 1], R: [0, 0]},
        {A: [0, 1], B: [0, 1], R: [0, 10]},
        {A: [0, 1], B: [0, 1], R: [1, 1]},
        {A: [0, 1], B: [1, 1], R: [0, 0]},
        {A: [0, 1], B: [1, 1], R: [0, 10]},
        {A: [0, 1], B: [1, 1], R: [1, 1]},
        {A: [1, 1], B: [0, 0], R: [0, 0]},
        {A: [1, 1], B: [0, 0], R: [0, 10]},
        {A: [1, 1], B: [0, 0], R: [1, 1], rejects: 'reject'},
        {A: [1, 1], B: [0, 1], R: [0, 0]},
        {A: [1, 1], B: [0, 1], R: [0, 10]},
        {A: [1, 1], B: [0, 1], R: [1, 1]},
        {A: [1, 1], B: [1, 1], R: [0, 0], rejects: 'reject'},
        {A: [1, 1], B: [1, 1], R: [0, 10]},
        {A: [1, 1], B: [1, 1], R: [1, 1]},
      ].forEach(testCase => test(testCase.A, testCase.B, testCase.R, testCase.rejects));
    });
  });

  describe('div', function() {

    it('should work with simple case', function() {
      verify(`
        : A 50
        : B 10
        : R 5
        R = A / B
      `)
    });

    it('should work with simple case', function() {
      verify(`
        : A 1
        : B 1
        : R 1
        R = A / B
      `)
    });

    it('should work with simple case', function() {
      verify(`
        : A [100 110]
        : B [5 10]
        : R [1 2]
        R = A / B
      `, 'reject')
    });

    it('should reject with simple case', function() {
      verify(`
        : A [500 1100]
        : B [5 10]
        : R [10 20]
        R = A / B
      `, 'reject')
    });

    it('should work without C', function() {
      verify(`
        : A 75
        : B [5 10]
        R = A / B
      `, undefined, {skipVerify: true}) // verify doesnt support this
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [10 ${SUP}]
        : R 10
        R = A / B
      `)
    });
  });

  describe('sum', function() {

    it('should work with simple case', function() {
      verify(`
        : A 50
        : B 10
        : C 500
        : R 560
        R = sum(A B C)
      `)
    });


    it('should work with simple A', function() {
      verify(`
        : A 1
        : B 1
        : C 1
        : R 3
        R = sum(A B C)
      `)
    });


    it('should work with simple B', function() {
      verify(`
        : A 5
        : B 1
        : C 0
        : R 6
        R = sum(A B C)
      `)
    });

    it('should work with simple C', function() {
      verify(`
        : A [100 101]
        : B [50 51]
        : C [150 151]
        : R [300 321]
        R = sum(A B C)
      `)
    });

    it('should work with simple C', function() {
      verify(`
        : A [100 101]
        : B [50 51]
        : C [150 151]
        : R [300 321]
        R = sum(A B C)
      `)
    });

    it('should work without R param', function() {
      verify(`
        : A [70 72]
        : B [50 52]
        R = sum(A B)
      `, undefined, {skipVerify: true}) // verify cant handle this
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [99 ${SUP}]
        : R 200
        R = sum(A B)
      `)
    });

    it('should sum a single zero', function() {
      // edge case
      verify(`
        : A 0
        : R *
        R = sum(A)
      `)
    });

    it('should sum two zeroes', function() {
      // edge case
      verify(`
        : A, B 0
        : R *
        R = sum(A B)
      `)
    });

    it('should sum two zeroes into result', function() {
      // edge case
      verify(`
        : A, B 0
        : R [0 10]
        R = sum(A B)
      `)
    });

    it('should sum two zeroes and a one into result', function() {
      // edge case
      verify(`
        : A, B 0
        : C 1
        : R *
        R = sum(A B C)
      `)
    });

    it('should sum two zeroes and a bool into result', function() {
      // edge case
      verify(`
        : A, B 0
        : C [0 1]
        : R [0 10]
        R = sum(A B C)
      `)
    });
  });

  describe('product', function() {

    it('should work with simple case', function() {
      verify(`
        : A 50
        : B 10
        : C 500
        : R 250000
        R = product(A B C)
      `)
    });

    it('should verify a simple case', function() {
      verify(`
        : A 50
        : B 10
        : C 500
        : R *
        R = product(A B C)
      `)
    });

    it('should verify a simple A', function() {
      verify(`
        : A 1
        : B 1
        : C 1
        : R 1
        R = product(A B C)
      `)
    });

    it('should verify a simple B', function() {
      verify(`
        : A [100 101]
        : B [50 51]
        : C [150 151]
        : R [750000, 777801]
        R = product(A B C)
      `)
    });

    it('should work without param', function() {
      verify(`
        : A [100 101]
        : B [50 51]
        : C [150 151]
        R = product(A B C)
      `, undefined, {skipVerify: true}) // verify cant do this
    });

    it('should find a solution for A', function() {
      verify(`
        : A [100 150]
        : B [99 ${SUP}]
        : R 10000
        R = product(A B)
      `)
    });
  });

  describe('diff', function() {

    function test(A, B, C, rejects) {
      it(`should distinct(${A}, ${B}, ${C}), rejects? ${!!rejects}`, function() {
        verify(`
          : A [${A}]
          : B [${B}]
          : C [${C}]
          diff(A B C)
        `, rejects)
      });
    }

    test([50,50], [10,10], [0,0]);
    test([50,50], [50,50], [0,0], 'reject');
    test([50,50], [0,0], [50,50], 'reject');
    test([0, 0], [0, 0], [50, 50], 'reject');
    test([0, 0], [0, 0], [0, 0], 'reject');
    test([0, 0], [1, 1], [2, 2]);
    test([1, 1], [2, 2], [3, 3]);
    test([4, 7], [5, 5], [6, 6]);
    test([4, 5], [100, 101], [100, 101]);
  });

  describe('some', function() {

    it('should some(A B C)', function() {
      verify(`
        : A, B, C [0 1]
        some(A B C)
      `);
    });

    it('should some(A B)', function() {
      verify(`
        : A, B [0 1]
        some(A B)
      `);
    });

    it('should some(A)', function() {
      verify(`
        : A [0 1]
        some(A)
      `);
    });

    function test(A, B, C, solves) {
      it(`should some(${A}, ${B}, ${C}) -> ${solves}`, function() {
        verify(`
          : A ${A}
          : B ${B}
          : C ${C}
          some(A B C)
        `, solves);
      });
    }

    test(50, 10, 0);
    test(50, 0, 50);
    test(0, 50, 50);
    test(0, 0, 50);
    test(0, 0, 0, 'reject');
  });

  describe('issome', function() {

    it('should isSome(A B C)', function() {
      verify(`
        : A, B, C [0 1]
        : D [0 1]
        D = some?(A B C)
      `);
    });

    it('should 1=isSome(A B C)', function() {
      verify(`
        : A, B, C [0 1]
        1 = some?(A B C)
      `);
    });

    it('should isSome(A B C)', function() {
      verify(`
        : A, B, C 0
        : D [0 1]
        D = some?(A B C)
      `);
    });

    it('should isSome(A B)', function() {
      verify(`
        : A, B [0 1]
        : D [0 1]
        D = some?(A B)
      `);
    });

    it('should isSome(A)', function() {
      verify(`
        : A [0 1]
        : D [0 1]
        D = some?(A)
      `);
    });

    it('should isSome(A)', function() {
      verify(`
        : A [1 10]
        : D [0 1]
        D = some?(A)
      `);
    });

    it('should isSome(A)', function() {
      verify(`
        : A [0 0]
        : D [0 1]
        D = some?(A)
      `);
    });

    function test(A, B, C) {
      it(`should isSome(${A}, ${B}, ${C})`, function() {
        verify(`
          : A ${A}
          : B ${B}
          : C ${C}
          : D [0 1]
          D = some?(A B C)
        `);
      });
    }

    test(50, 10, 0);
    test(50, 0, 50);
    test(0, 50, 50);
    test(0, 0, 50);
    test(0, 0, 0);
  });

  describe('dupe constraints', function() {
    // this set contains integration tests with explicitly duplicate constraints.
    // this case can occur as an procedural artifact in the wild and is optimized.

    it('should work with duplicate eqs', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        A == B
        A == B
      `)
    });

    it('should work with optimizable constraints', function() {
      verify(`
        : A [0 0]
        : B [1 1]
        A != B
        A != B
      `)
    });

    it('should work with result var', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 2]
        R = A + B
        R = A + B
      `)
    });

    it('should work with different result vars on same constraint', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 2]
        : S [0 2]
        R = A + B
        S = A + B
      `)
    });

    it('should work with sum on same result', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : R [0 3]
        R = sum(A B C)
        R = sum(A B C)
      `)
    });

    it('should work with sum on different result', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : R [0 3]
        R = sum(A B C)
        S = sum(A B C)
      `)
    });

    it('should work with sum on partially same vars', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        : R [0 3]
        R = sum(A B C)
        S = sum(A B D)
      `)
    });

    it('should work with product on same result', function() {
      verify(`
        : A [1 2]
        : B [1 2]
        : C [1 2]
        : R [0 8]
        R = product(A B C)
        R = product(A B C)
      `)
    });

    it('should work with product on different result', function() {
      verify(`
        : A [1 2]
        : B [1 2]
        : C [1 2]
        : R [0 8]
        : S [0 8]
        R = product(A B C)
        S = product(A B C)
      `)
    });

    it('should work with product on partially same vars', function() {
      verify(`
        : A [1 2]
        : B [1 2]
        : C [1 2]
        : D [1 2]
        : R [0 8]
        : S [0 8]
        R = product(A B C)
        S = product(A B D)
      `)
    });

    it('should work with diff on same result', function() {
      verify(`
        : A [0 2]
        : B [0 2]
        : C [0 2]
        diff(A B C)
        diff(A B C)
      `)
    });

    it('should work with distinct on partially same vars', function() {
      verify(`
        : A [0 2]
        : B [0 2]
        : C [0 2]
        : D [0 2]
        diff(A B C)
        diff(A B D)
      `)
    });

    it('should work with reifiers on same result', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        R = A ==? B
        R = A ==? B
      `)
    });

    it('should work with reifiers on different result', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        : S [0 1]
        R = A ==? B
        S = A ==? B
      `)
    });

    it('should work with reifiers on dupe different result', function() {
      // this case is slightly different in that it should eliminate the
      // second redirection C->D when A=?B is compiled for D twice
      // (and if it doesn't it should still just work)
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        : S [0 1]
        R = A ==? B
        S = A ==? B
        S = A ==? B
      `)
    });

    it('should work with different reifiers on same var (regression)', function() {
      // make sure reifiers arent cached as "reifiers" but as their op
      // because same result var is used, when A!=B it wants different values for C and so it rejects
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        R = A >=? B
        R = A <=? B
      `)
    });

    it('should work with different reifiers on different var (regression)', function() {
      // make sure reifiers arent cached as "reifiers" but as their op
      // unlike before, C and D can verify now
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        : S [0 1]
        R = A >=? B
        S = A <=? B
      `)
    });

    it('should work with a reifier and a constraint on the same op', function() {
      // make sure reifiers arent cached as their op without reifier mark
      verify(`
        : A [0 1]
        : B [0 1]
        : R [0 1]
        R = A ==? B  # should cache A=?B -> R
        A == B       # should not use the cached A=?B for this but force A==B, so there can only be two results
      `)
    });
  });

  describe('nall', function() {

    it('should work with zeroes', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        nall(A B)
      `);
    });

    it('should work with A nonzero', function() {
      verify(`
        : A [5 10]
        : B [0 10]
        nall(A B)
      `);
    });

    it('should work with B nonzero', function() {
      verify(`
        : A [0 10]
        : B [1 8]
        nall(A B)
      `);
    });

    it('should reject both nonzero', function() {
      verify(`
        : A [18 20]
        : B [50 100]
        nall(A B)
      `, 'reject');
    });

    it('should work with zeroes', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : C [0 10]
        nall(A B C)
      `);
    });

    describe('brute force boolean tables should solve despite optimizations;', function() {

      function test(resultA, resultB, resultC, out, desc, _input) {
        //if (_input !== 'FFB') return;

        // brute force bools and boolies "truth table" (in a way)
        [
          ['bool', 'bool', 'bool'],
          ['booly', 'bool', 'bool'],
          ['bool', 'booly', 'bool'],
          ['bool', 'bool', 'booly'],
          ['booly', 'booly', 'bool'],
          ['bool', 'booly', 'booly'],
          ['booly', 'bool', 'booly'],
          ['booly', 'booly', 'booly'],
        ].some(([typeA, typeB, typeC]) => {
          let A = INPUT_MAP[typeA][resultA];
          let B = INPUT_MAP[typeB][resultB];
          let C = INPUT_MAP[typeC][resultC];
          let outs = out.map((solution) => ({
            A: OUTPUT_MAP[typeA][solution.A],
            B: OUTPUT_MAP[typeB][solution.B],
            C: OUTPUT_MAP[typeC][solution.C],
          }));

          let from = 'nall(' + [domain__debug(A), domain__debug(B), domain__debug(C)] + ')';
          let to = 'nall(' + (JSON.stringify(outs).replace(/"/g, '')) + ')';
          it(from + ' should solve to: ' + to + ' ' + desc + ' types = <' + [typeA, typeB, typeC] + '>', function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : C [${C}]

              nall(A B C)
            `, outs.length === 0 ? 'reject' : undefined);
          });
        });
      }

      // (NOTE: order of solutions is not relevant to the test)
      [
        // false/bool/true. left is input for ABC, right is expected solution(s)
        ['FFF', ['FFF']],
        ['FFB', ['FFF', 'FFT']],
        ['FFT', ['FFT']],
        ['FBF', ['FFF', 'FTF']],
        ['FBB', ['FFF', 'FFT', 'FTF', 'FTT']],
        ['FBT', ['FFT', 'FTT']],
        ['FTF', ['FTF']],
        ['FTB', ['FTF', 'FTT']],
        ['FTT', ['FTT']],
        ['BFF', ['FFF', 'TFF']],
        ['BFB', ['FFF', 'FFT', 'TFF', 'TFT']],
        ['BFT', ['FFT', 'TFT']],
        ['BBF', ['FFF', 'FTF', 'TFF', 'TTF']],
        ['BBB', ['FFF', 'FFT', 'FTF', 'FTT', 'TFF', 'TFT', 'TTF']],
        ['BBT', ['FFT', 'FTT', 'TFT']],
        ['BTF', ['FTF', 'TTF']],
        ['BTB', ['FTF', 'FTT', 'TTF']],
        ['BTT', ['FTT']],
        ['TFF', ['TFF']],
        ['TFB', ['TFF', 'TFT']],
        ['TFT', ['TFT']],
        ['TBF', ['TFF', 'TTF']],
        ['TBB', ['TFF', 'TFT', 'TTF']],
        ['TBT', ['TFT']],
        ['TTF', ['TTF']],
        ['TTB', ['TTF']],
        ['TTT', []],
      ].some(([input, outs]) => {
        let [A, B, C] = input.split('');
        let out = outs.map(expected => {
          // FTF => {A: F, B: T, C: F}
          let [A, B, C] = expected.split('');
          return {A, B, C};
        });
        return test(A, B, C, out, '(' + input + ' => ' + outs + ')', input);
      });
    });
  });

  describe('isall', function() {

    it('should reject if R=1 and A!=B', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        : R [1 1]
        R = A ==? B
      `, 'reject');
    });

    it('should work with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : R [0 10]
        R = all?(A B)
      `);
    });

    it('should work with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        : R [0 10]
        R = all?(A B)
      `);
    });

    it('should work with booly/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        : R [0 10]
        R = all?(A B)
      `);
    });

    it('should work with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [20 60]
        : R [0 10]
        R = all?(A B)
      `);
    });

    it('should force a pass when R is nonzero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [1 10]
        R = all?(A B)
      `);
    });

    it('should force a pass when R is zero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [0 0]
        R = all?(A B)
      `);
    });

    it('should reject when R is zero and cant be fulfilled', function() {
      verify(`
        : A [10 10]
        : B [23 60]
        : R [0 0]
        R = all?(A B)
      `, 'reject');
    });

    it('should reject when R is nonzero and cant be fulfilled', function() {
      verify(`
        : A [10 10]
        : B [0 0]
        : R [100 2000]
        R = all?(A B)
      `, 'reject');
    });

    it('should not fail previous test because R didnt have a 1', function() {
      verify(`
        : A [10 10]
        : B [0 0]
        : R [1 1]
        R = all?(A B)
      `, 'reject');
    });

    // TODO: we can enable this test once isall (and friends) are properly implemented and not through product()
    it.skip('should work with very high values that mul beyond sup', function() {
      // internally isall is mapped to a multiply which will try 100000*100000 which is way beyond
      // SUP and results in an empty domain which rejects the whole thing by default. tricky thing
      verify(`
        : A [100000 1000000]
        : B [100000 1000000]
        : R [1 1]
        R = all?(A B)
      `);
    });

    describe('brute force boolean tables should solve despite optimizations;', function() {

      function test(resultA, resultB, resultC, out, desc, _input) {
        //if (_input !== 'FFB') return;

        // brute force bools and boolies "truth table" (in a way)
        [
          ['bool', 'bool', 'bool'],
          ['booly', 'bool', 'bool'],
          ['bool', 'booly', 'bool'],
          ['bool', 'bool', 'booly'],
          ['booly', 'booly', 'bool'],
          ['bool', 'booly', 'booly'],
          ['booly', 'bool', 'booly'],
          ['booly', 'booly', 'booly'],
        ].some(([typeA, typeB, typeC]) => {

          let A = INPUT_MAP[typeA][resultA];
          let B = INPUT_MAP[typeB][resultB];
          let C = INPUT_MAP[typeC][resultC];
          let outs = out.map((solution) => ({
            A: OUTPUT_MAP[typeA][solution.A],
            B: OUTPUT_MAP[typeB][solution.B],
            C: OUTPUT_MAP[typeC][solution.C],
          }));

          let from = domain__debug(C) + ' = ' + 'all?(' + [domain__debug(A), domain__debug(B)] + ')';
          let to = JSON.stringify(outs).replace(/"/g, '');
          it(from + ' should solve to: ' + to + ' ' + desc + ' types = <' + [typeA, typeB, typeC] + '>', function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : C [${C}]

              C = all?(A B)
            `, outs.length === 0 ? 'reject' : undefined);
          });
        });
      }

      // (NOTE: order of solutions is not relevant to the test)
      [
        // false/bool/true. left is input for ABC, right is expected solution(s)
        ['FFF', ['FFF']],
        ['FFB', ['FFF']],
        ['FFT', []],
        ['FBF', ['FFF', 'FTF']],
        ['FBB', ['FFF', 'FTF']],
        ['FBT', []],
        ['FTF', ['FTF']],
        ['FTB', ['FTF']],
        ['FTT', []],
        ['BFF', ['FFF', 'TFF']],
        ['BFB', ['FFF', 'TFF']],
        ['BFT', []],
        ['BBF', ['FFF', 'FTF', 'TFF']],
        ['BBB', ['FFF', 'FTF', 'TFF', 'TTT']],
        ['BBT', ['TTT']],
        ['BTF', ['FTF']],
        ['BTB', ['FTF', 'TTT']],
        ['BTT', ['TTT']],
        ['TFF', ['TFF']],
        ['TFB', ['TFF']],
        ['TFT', []],
        ['TBF', ['TFF']],
        ['TBB', ['TFF', 'TTT']],
        ['TBT', ['TTT']],
        ['TTF', []],
        ['TTB', ['TTT']],
        ['TTT', ['TTT']],
      ].some(([input, outs]) => {
        let [A, B, C] = input.split('');
        let out = outs.map(expected => {
          // FTF => {A: F, B: T, C: F}
          let [A, B, C] = expected.split('');
          return {A, B, C};
        });
        return test(A, B, C, out, '(' + input + ' => ' + outs + ')', input);
      });
    });
  });

  describe('isnall', function() {

    it('should work with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : R [0 10]
        R = nall?(A B)
      `);
    });

    it('should work with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        : R [0 10]
        R = nall?(A B)
      `);
    });

    it('should work with booly/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        : R [0 10]
        R = nall?(A B)
      `);
    });

    it('should work with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [20 60]
        : R [0 10]
        R = nall?(A B)
      `);
    });

    it('should force a pass when R is nonzero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [1 10]
        R = nall?(A B)
      `);
    });

    it('should force a pass when R is zero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [0 0]
        R = nall?(A B)
      `);
    });

    it('should reject when R is zero and cant be fulfilled', function() {
      verify(`
        : A [0 0]
        : B [23 60]
        : R [0 0]
        R = nall?(A B)
      `, 'reject');
    });

    it('should reject when R is nonzero and cant be fulfilled', function() {
      verify(`
        : A [10 10]
        : B [450 2000]
        : R [100 2000]
        R = nall?(A B)
      `, 'reject');
    });

    it('should not fail previous test because R didnt have a 1', function() {
      verify(`
        : A [10 10]
        : B [450 2000]
        : R [1 1]
        R = nall?(A B)
      `, 'reject');
    });

    // TODO: we can enable this test once isall (and friends) are properly implemented and not through product()
    it.skip('should work with very high values that mul beyond sup', function() {
      // internally isall is mapped to a multiply which will try 100000*100000 which is way beyond
      // SUP and results in an empty domain which rejects the whole thing by default. tricky thing
      verify(`
        : A [100000 1000000]
        : B [100000 1000000]
        : R [0 0]
        R = nall?(A B)
      `);
    });

    describe('brute force boolean tables should solve despite optimizations;', function() {

      function test(resultA, resultB, resultC, out, desc, _input) {
        //if (_input !== 'FFB') return;

        // brute force bools and boolies "truth table" (in a way)
        [
          ['bool', 'bool', 'bool'],
          ['booly', 'bool', 'bool'],
          ['bool', 'booly', 'bool'],
          ['bool', 'bool', 'booly'],
          ['booly', 'booly', 'bool'],
          ['bool', 'booly', 'booly'],
          ['booly', 'bool', 'booly'],
          ['booly', 'booly', 'booly'],
        ].some(([typeA, typeB, typeC]) => {

          let A = INPUT_MAP[typeA][resultA];
          let B = INPUT_MAP[typeB][resultB];
          let C = INPUT_MAP[typeC][resultC];
          let outs = out.map((solution) => ({
            A: OUTPUT_MAP[typeA][solution.A],
            B: OUTPUT_MAP[typeB][solution.B],
            C: OUTPUT_MAP[typeC][solution.C],
          }));

          let from = domain__debug(C) + ' = ' + 'nall?(' + [domain__debug(A), domain__debug(B)] + ')';
          let to = JSON.stringify(outs).replace(/"/g, '');
          it(from + ' should solve to: ' + to + ' ' + desc + ' types = <' + [typeA, typeB, typeC] + '>', function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : C [${C}]

              C = nall?(A B)
            `, outs.length === 0 ? 'reject' : undefined);
          });
        });
      }

      // (NOTE: order of solutions is not relevant to the test)
      [
        // false/bool/true. left is input for ABC, right is expected solution(s)
        ['FFF', []],
        ['FFB', ['FFT']],
        ['FFT', ['FFT']],
        ['FBF', []],
        ['FBB', ['FFT', 'FTT']],
        ['FBT', ['FFT', 'FTT']],
        ['FTF', []],
        ['FTB', ['FTT']],
        ['FTT', ['FTT']],
        ['BFF', []],
        ['BFB', ['FFT', 'TFT']],
        ['BFT', ['FFT', 'TFT']],
        ['BBF', ['TTF']],
        ['BBB', ['FFT', 'FTT', 'TFT', 'TTF']],
        ['BBT', ['FFT', 'FTT', 'TFT']],
        ['BTF', ['TTF']],
        ['BTB', ['FTT', 'TTF']],
        ['BTT', ['FTT']],
        ['TFF', []],
        ['TFB', ['TFT']],
        ['TFT', ['TFT']],
        ['TBF', ['TTF']],
        ['TBB', ['TFT', 'TTF']],
        ['TBT', ['TFT']],
        ['TTF', ['TTF']],
        ['TTB', ['TTF']],
        ['TTT', []],
      ].some(([input, outs]) => {
        let [A, B, C] = input.split('');
        let out = outs.map(expected => {
          // FTF => {A: F, B: T, C: F}
          let [A, B, C] = expected.split('');
          return {A, B, C};
        });
        return test(A, B, C, out, '(' + input + ' => ' + outs + ')', input);
      });
    });
  });

  describe('isnone', function() {

    it('should work with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        : R [0 10]
        R = none?(A B)
      `);
    });

    it('should work with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        : R [0 10]
        R = none?(A B)
      `);
    });

    it('should work with booly/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        : R [0 10]
        R = none?(A B)
      `);
    });

    it('should work with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [20 60]
        : R [0 10]
        R = none?(A B)
      `);
    });

    it('should force a pass when R is nonzero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [1 10]
        R = none?(A B)
      `);
    });

    it('should force a pass when R is zero', function() {
      verify(`
        : A [0 10]
        : B [0 0 23 60]
        : R [0 0]
        R = none?(A B)
      `);
    });

    it('should reject when R is zero and cant be fulfilled', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        : R [0 0]
        R = none?(A B)
      `, 'reject');
    });

    it('should reject when R is nonzero and cant be fulfilled', function() {
      verify(`
        : A [10 200]
        : B [0 0]
        : R [100 2000]
        R = none?(A B)
      `, 'reject');
    });

    it('should not fail previous test because R didnt have a 1', function() {
      verify(`
        : A [10 200]
        : B [0 0]
        : R [1 1]
        R = none?(A B)
      `, 'reject');
    });

    // TODO: we can enable this test once isall (and friends) are properly implemented and not through sum()
    it.skip('should work with very high values that mul beyond sup', function() {
      // internally isall is mapped to a multiply which will try 100000*100000 which is way beyond
      // SUP and results in an empty domain which rejects the whole thing by default. tricky thing
      verify(`
        : A [100000 1000000]
        : B [100000 1000000]
        : R [0 0]
        R = none?(A B)
      `);
    });

    describe('brute force boolean tables should solve despite optimizations;', function() {

      function test(resultA, resultB, resultC, out, desc, _input) {
        //if (_input !== 'FFB') return;

        // brute force bools and boolies "truth table" (in a way)
        [
          ['bool', 'bool', 'bool'],
          ['booly', 'bool', 'bool'],
          ['bool', 'booly', 'bool'],
          ['bool', 'bool', 'booly'],
          ['booly', 'booly', 'bool'],
          ['bool', 'booly', 'booly'],
          ['booly', 'bool', 'booly'],
          ['booly', 'booly', 'booly'],
        ].some(([typeA, typeB, typeC]) => {

          let A = INPUT_MAP[typeA][resultA];
          let B = INPUT_MAP[typeB][resultB];
          let C = INPUT_MAP[typeC][resultC];
          let outs = out.map((solution) => ({
            A: OUTPUT_MAP[typeA][solution.A],
            B: OUTPUT_MAP[typeB][solution.B],
            C: OUTPUT_MAP[typeC][solution.C],
          }));

          let from = domain__debug(C) + ' = ' + 'nall?(' + [domain__debug(A), domain__debug(B)] + ')';
          let to = JSON.stringify(outs).replace(/"/g, '');

          it(from + ' should solve to: ' + to + ' ' + desc + ' types = <' + [typeA, typeB, typeC] + '>', function() {
            verify(`
              : A [${A}]
              : B [${B}]
              : C [${C}]

              C = none?(A B)
              @custom targets (A B C)
            `, outs.length === 0 ? 'reject' : undefined);
          });
        });
      }

      // (NOTE: order of solutions is not relevant to the test)
      [
        // false/bool/true. left is input for ABC, right is expected solution(s)
        ['FFF', []],
        ['FFB', ['FFT']],
        ['FFT', ['FFT']],
        ['FBF', ['FTF']],
        ['FBB', ['FFT', 'FTF']],
        ['FBT', ['FFT']],
        ['FTF', ['FTF']],
        ['FTB', ['FTF']],
        ['FTT', []],
        ['BFF', ['TFF']],
        ['BFB', ['FFT', 'TFF']],
        ['BFT', ['FFT']],
        ['BBF', ['FTF', 'TFF', 'TTF']],
        ['BBB', ['FFT', 'FTF', 'TFF', 'TTF']],
        ['BBT', ['FFT']],
        ['BTF', ['FTF', 'TTF']],
        ['BTB', ['FTF', 'TTF']],
        ['BTT', []],
        ['TFF', ['TFF']],
        ['TFB', ['TFF']],
        ['TFT', []],
        ['TBF', ['TFF', 'TTF']],
        ['TBB', ['TFF', 'TTF']],
        ['TBT', []],
        ['TTF', ['TTF']],
        ['TTB', ['TTF']],
        ['TTT', []],
      ].some(([input, outs]) => {
        let [A, B, C] = input.split('');
        let out = outs.map(expected => {
          // FTF => {A: F, B: T, C: F}
          let [A, B, C] = expected.split('');
          return {A, B, C};
        });
        return test(A, B, C, out, '(' + input + ' => ' + outs + ')', input);
      });
    });
  });

  describe('and', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A & B
      `);
    });

    it('should reject with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A & B
      `, 'reject');
    });

    it('should reject with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A & B
      `, 'reject');
    });

    it('should reject with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A & B
      `, 'reject');
    });

    it('should reject with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A & B
      `, 'reject');
    });

    it('should reject with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A & B
      `, 'reject');
    });

    it('should solve with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A & B
      `);
    });
  });

  describe('or', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A | B
      `);
    });

    it('should reject with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A & B
      `, 'reject');
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A | B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A | B
      `);
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A | B
      `);
    });

    it('should solve with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A | B
      `);
    });

    it('should solve with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A | B
      `);
    });
  });

  describe('nor', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !| B
      `);
    });

    it('should solve with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A !| B
      `);
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A !| B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A !| B
      `);
    });

    it('should reject with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A !| B
      `, 'reject');
    });

    it('should reject with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A !| B
      `, 'reject');
    });

    it('should reject with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A !| B
      `, 'reject');
    });
  });

  describe('implication', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A -> B
      `);
    });

    // need to investigate this because @max seems to be ignored here
    it.skip('should solve with boolies and max1', function() {
      verify(`
        : A [0 10] @max
        : B [0 10]
        A -> B
      `);
    });

    it.skip('should solve with boolies and max2', function() {
      verify(`
        : A [0 10]
        : B [0 10] @max
        A -> B
      `);
    });

    it.skip('should solve with boolies and max3', function() {
      verify(`
        : A [0 10] @max
        : B [0 10] @max
        A -> B
      `);
    });

    it('should solve with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A -> B
      `);
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [1 10]
        A -> B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A -> B
      `);
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A -> B
      `, 'reject');
    });

    it('should solve with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A -> B
      `);
    });

    it('should solve with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A -> B
      `);
    });
  });

  describe('inverse implication', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !-> B
      `);
    });

    it('should reject with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A !-> B
      `, 'reject');
    });

    it('should reject with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A !-> B
      `, 'reject');
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A !-> B
      `);
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A !-> B
      `);
    });

    it('should reject if A cant be nonzero', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A !-> B
      `, 'reject');
    });

    it('should reject if B cant be zero', function() {
      verify(`
        : A [0 10]
        : B [5 10]
        A !-> B
      `, 'reject');
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A !-> B
      `);
    });

    it('should reject with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A !-> B
      `, 'reject');
    });
  });

  describe('xor', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A ^ B
      `);
    });

    it('should reject with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A & B
      `, 'reject');
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A ^ B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A ^ B
      `);
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A ^ B
      `);
    });

    it('should solve with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A ^ B
      `);
    });

    it('should reject with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A ^ B
      `, 'reject');
    });
  });

  describe('nand', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !& B
      `);
    });

    it('should solve with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A !& B
      `);
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A !& B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A !& B
      `);
    });

    it('should solve with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A !& B
      `);
    });

    it('should solve with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A !& B
      `);
    });

    it('should reject with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A !& B
      `, 'reject');
    });
  });

  describe('xnor', function() {

    it('should solve with boolies', function() {
      verify(`
        : A [0 10]
        : B [0 10]
        A !^ B
      `);
    });

    it('should solve with zero/zero', function() {
      verify(`
        : A [0 0]
        : B [0 0]
        A !^ B
      `);
    });

    it('should solve with zero/booly', function() {
      verify(`
        : A [0 0]
        : B [0 10]
        A !^ B
      `);
    });

    it('should solve with booly/zero', function() {
      verify(`
        : A [0 10]
        : B [0 0]
        A !^ B
      `);
    });

    it('should reject with nonzero/zero', function() {
      verify(`
        : A [5 10]
        : B [0 0]
        A !^ B
      `, 'reject');
    });

    it('should reject with zero/nonzero', function() {
      verify(`
        : A [0 0]
        : B [5 10]
        A !^ B
      `, 'reject');
    });

    it('should solve with nonzeroes', function() {
      verify(`
        : A [1 10]
        : B [8 10]
        A !^ B
      `);
    });

    it('should solve a regression', function() {
      verify(`
        : A [0 0 5 5]
        : B [0 10]
        : C [0 1]
        C = B ==? 5
        C !^ A
        # -> should remove the !^

        X = A + B # prevent presolve on xnor
        @custom noleaf A B X
      `);
    });
  });

  describe('AND', function() {

    function test(A, B, reject) {
      it(`should work: ${A} & ${B} = ${JSON.stringify(reject)}`, function() {
        verify(`
          @custom var-strat throw
          : A ${A}
          : B ${B}
          A & B
        `, reject);
      });
    }

    test('[0 1]', '[0 1]');
    test('0', '[0 1]', 'reject');
    test('[0 1]', '0', 'reject');
    test('1', '[0 1]');
    test('[0 1]', '1');
    test('0', '0', 'reject');
    test('0', '1', 'reject');
    test('1', '0', 'reject');
    test('1', '1');
    test('[5 10]', '1');
    test('1', '[5 10]');
    test('[5 10]', '0', 'reject');
    test('0', '[5 10]', 'reject');
    test('[10 20]', '[5 10]');
  });

  describe('OR', function() {

    function test(A, B, reject) {
      it(`should work: ${A} | ${B} = ${JSON.stringify(reject)}`, function() {
        verify(`
          @custom var-strat throw
          : A ${A}
          : B ${B}
          A | B
        `, reject);
      });
    }

    test('[0 1]', '[0 1]'); // note: it will defer A and force solve B to min before solving A
    test('0', '[0 1]');
    test('[0 1]', '0');
    test('1', '[0 1]');
    test('[0 1]', '1');
    test('0', '0', 'reject');
    test('0', '1');
    test('1', '0');
    test('1', '1');
    test('[5 10]', '1');
    test('1', '[5 10]');
    test('[5 10]', '0');
    test('0', '[5 10]');
    test('[10 20]', '[5 10]');
  });

  describe('XOR', function() {

    function test(A, B, reject) {
      it(`should work: ${A} ^ ${B} = ${JSON.stringify(reject)}`, function() {
        verify(`
          @custom var-strat throw
          : A ${A}
          : B ${B}
          A ^ B
        `, reject);
      });
    }

    test('[0 1]', '[0 1]'); // note: it will defer A and force solve B to min before solving A
    test('0', '[0 1]');
    test('[0 1]', '0');
    test('1', '[0 1]');
    test('[0 1]', '1');
    test('0', '0', 'reject');
    test('0', '1');
    test('1', '0');
    test('1', '1', 'reject');
    test('[5 10]', '1', 'reject');
    test('1', '[5 10]', 'reject');
    test('[5 10]', '0');
    test('0', '[5 10]');
    test('[10 20]', '[5 10]', 'reject');
  });

  describe('NAND', function() {

    function test(A, B, reject) {
      it(`should work: ${A} !& ${B} = ${JSON.stringify(reject)}`, function() {
        verify(`
          @custom var-strat throw
          : A ${A}
          : B ${B}
          A !& B
        `, reject);
      });
    }

    test('[0 1]', '[0 1]'); // note: it will defer A and force solve A to min before solving B
    test('0', '[0 1]');
    test('[0 1]', '0');
    test('1', '[0 1]');
    test('[0 1]', '1');
    test('0', '0');
    test('0', '1');
    test('1', '0');
    test('1', '1', 'reject');
    test('[5 10]', '1', 'reject');
    test('1', '[5 10]', 'reject');
    test('[5 10]', '0');
    test('0', '[5 10]');
    test('[10 20]', '[5 10]', 'reject');
  });

  describe('XNOR', function() {

    function test(A, B, reject) {
      it(`should work: ${A} !^ ${B} = ${JSON.stringify(reject)}`, function() {
        verify(`
          @custom var-strat throw
          : A ${A}
          : B ${B}
          A !^ B
        `, reject);
      });
    }

    test('[0 1]', '[0 1]');
    test('0', '[0 1]');
    test('[0 1]', '0');
    test('1', '[0 1]');
    test('[0 1]', '1');
    test('0', '0');
    test('0', '1', 'reject');
    test('1', '0', 'reject');
    test('1', '1');
    test('[5 10]', '1');
    test('1', '[5 10]');
    test('[5 10]', '0', 'reject');
    test('0', '[5 10]', 'reject');
    test('[10 20]', '[5 10]');
  });

  it('should parse literals in the math ops', function() {
    verify(`
      @custom var-strat throw
      : A [0 1]
      : B [0 1]
      : C [0 1]

      A = B + C
      1 = B + C
      A = 1 + C
      A = B + 1
      1 = 1 + C
      A = 1 + 1
      1 = B + 1
      1 = 1 + 1

      A = B - C
      1 = B - C
      A = 1 - C
      A = B - 1
      1 = 1 - C
      A = 1 - 1
      1 = B - 1
      1 = 1 - 1

      A = B * C
      1 = B * C
      A = 1 * C
      A = B * 1
      1 = 1 * C
      A = 1 * 1
      1 = B * 1
      1 = 1 * 1

      A = B / C
      1 = B / C
      A = 1 / C
      A = B / 1
      1 = 1 / C
      A = 1 / 1
      1 = B / 1
      1 = 1 / 1
    `, 'reject');
  });

  describe('all nall', function() {

    it('should support nall', function() {
      verify(`
        : A [0 1]
        : B [0 1]
        : C [0 1]
        nall(A B C)
      `)
    });

    it('should support isall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        D = all?(A B C)
      `);
    });

    it('should support isnall', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 1]
        : D [0 1]
        D = nall?(A B C)
      `);
    });
  });

  describe('eq reifier with booleanesque', function() {

    it('should work when result is bool (C=0)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [15 20]
        : C [0 1]
        C = A ==? B
      `);
    });

    it('should work when result is bool (C=1)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [0 1]
        C = A ==? B
      `);
    });

    it('should work when result is [0 10] (C=0)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [15 20]
        : C [0 10]
        C = A ==? B
      `);
    });

    it('should work when result is [0 10] (C=1)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [0 10]
        C = A ==? B
      `);
    });

    it('should work when result is two values without 1 (C=0)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [15 20]
        : C [0 0 4 4]
        C = A ==? B
      `);
    });

    it('should work when result is two values without 1 (C=4)', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [0 0 4 4]
        C = A ==? B
      `);
    });

    it('should work when result is [0 0] v1', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [15 20]
        : C [0 0]
        C = A ==? B
      `);
    });

    it('should work when result is [0 0] v2', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [0 0]
        C = A ==? B
      `);
    });

    it('should work when result is [1 10] v1', function() {
      verify(`
        @custom var-strat throw
        : A [5 16]
        : B [15 20]
        : C [1 10]
        C = A ==? B
      `);
    });

    it('should work when result is [1 10] v2', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [1 10]
        C = A ==? B
      `);
    });

    it('should work when result is [5 10] v1', function() {
      verify(`
        @custom var-strat throw
        : A [5 16]
        : B [15 20]
        : C [5 10]
        C = A ==? B
      `);
    });

    it('should work when result is [5 10] v2', function() {
      verify(`
        @custom var-strat throw
        : A [5 10]
        : B [5 10]
        : C [5 10]
        C = A ==? B
      `);
    });
  });
});
