import {
  verify,
} from '../../../fdv/verifier';

import {
  SUP,
} from '../../../fdlib/src/helpers';

describe('fdh/specs/solver.list.spec', function() {

  it('should try values in order of the list', function() {
    // the actual test is kind of lost in translation but it should be {A:2,B:3}
    verify(`
      : A [1 4] @list prio(2 4 3 1)
      : B [1 4] @list prio(3 1 4 2)
      A > 0
      B > 0
    `)
  });

  describe('list values trump domain values', function() {

    it('should ignore values in the domain that are not in the list', function() {
      verify(`
        : A [0 5] @list prio(0 3 4)
        A > 0
      `); // dont be 0 1 or 5..
    });

    it('should ignore values in the domain that are not in the list', function() {
      verify(`
        : A [0 5] @list prio(0 3 4)
      `); // dont be 1 or 5..
    });

    it('should solve when the list contains no values in the domain', function() {
      verify(`
        : A [0 10] @list prio(0 15)
        A > 0
        # just goes for 1
      `);
    });

    it('should use the fallback when the list contains no values in the domain', function() {
      // Ok. First the propagators run. this will reduce
      // V1 to [1, 5] because there's a constraint that
      // says [0,5]>0 meaning the 0 is removed from the
      // domain. So [1,5]. Then the propagators run into
      // a stalemate and a choice has to be made. There
      // is a value distributor based on a list. This
      // means a value from the domain to be picked has
      // to exist in that list. Since the list is [0,15]
      // and we just eliminated the 0, so we may only
      // pick 15 except the domain doesn't have that so
      // it ends up picking no value. That means the
      // fallback distributor will kick in, which is
      // "max". Since there are no other constraints it
      // will solve V1 for all remaining values of it
      // in descending order (5,4,3,2,1).

      verify(`
        : A [0 5]
        @custom set-valdist A {"valtype": "list", "list": [0, 15], "fallback": {"valtype": "max"}}
        A > 0
      `)
    });

    it('should prioritize the list before applying the fallback', function() {
      verify(`
        : A [0 5]
        @custom set-valdist A {"valtype": "list", "list": [3, 0, 1, 5], "fallback": {"valtype": "max"}}
        A > 0
      `)
    });

    it('should still be able to reject if fallback fails too', function() {
      // original domain contains 0~5 but constraint requires >6
      // list contains 15 but since domain doesnt thats irrelevant
      verify(`
        : A [0 5]
        @custom set-valdist A {"valtype": "list", "list": [3, 0, 1, 15, 5], "fallback": {"valtype": "max"}}
        A > 6
      `, 'reject')
    });
  });
});
