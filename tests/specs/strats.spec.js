// test various strategies

import {verify} from 'fdv/verifier';

describe('fdh/specs/strats.spec', function () {

  describe('list', function () {

    it('should work with @list first item', function () {
      verify(`
        : A [1 3] @list prio(3 2 1)
      `)
    });

    it('should work with set-valdist', function () {
      verify(`
        : A = [1 4]
        @custom set-valdist A {"valtype":"list","list":[3,2,1]}
      `)
    });

    it('should work with @list middle item', function () {
      verify(`
        : A [1 4] @list prio(5 2 1)
      `)
    });

    it('should work with @list last item', function () {
      verify(`
        : A [2 4] @list prio(5 1 3)
      `)
    });

    it('should work with @list last item', function () {
      verify(`
        : A [3 10] @list prio(1 2 3)
      `)
    });

    it('should work with @list unlisted item', function () {
      verify(`
        : A [5 10] @list prio(3 2 1)
      `)
    });
  });

  describe('min mid max naive', function () {

    it('should propagate @min', function () {
      verify(`
        : A [1 3] @min
        @custom noleaf A
      `)
    });

    it('should propagate @naive', function () {
      verify(`
        : A [1 3] @naive
        @custom noleaf A
      `)
    });

    it('should propagate @mid', function () {
      verify(`
        : A [1 3] @mid
        @custom noleaf A
      `)
    });

    it('should propagate @max', function () {
      verify(`
        : A [1 3] @max
        @custom noleaf A
      `)
    });
  });

  describe('when aliasing a var with a vardist', function () {

    it('should use naive=min by default', function () {
      verify(`
        : A [1 3]
        : B [1 3]
        A == B
        @custom noleaf A B
      `)
    });

    it('should keep the max left', function () {
      verify(`
        : A [1 3] @max
        : B [1 3]
        A == B
        @custom noleaf A B
      `)
    });

    it('should keep the max left', function () {
      verify(`
        : A [1 3]
        : B [1 3] @max
        A == B
        @custom noleaf A B
      `)
    });

    it('should keep the max both', function () {
      verify(`
        : A [1 3] @max
        : B [1 3] @max
        A == B
        @custom noleaf A B
      `)
    });

    it('should keep at least one valdist but which one is not defined', function () {
      verify(`
        : A [1 3] @mid
        : B [1 3] @max
        A == B
        @custom noleaf A B
      `)
    });
  });
});
