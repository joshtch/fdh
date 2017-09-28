# FDH - FDQ Health package

This package contains only the integration/e2e tests for both [fdo](https://github.com/qfox/fdo) and [fdp](https://github.com/qfox/fdp).

See [fdq](https://github.com/qfox/fdq) for details.

## FDO

[fdo](https://github.com/qfox/fdo) is a brute force finite domain constraint solver.

## FDP

[fdp](https://github.com/qfox/fdp) is a finite domain constraint problem reduction system. 

## Shared tests

Since FDP should be sound when reducing a problem, it must mean FDO should have the same result with and without FDP. So we can run the same test suite on both packages. In theory FDP should be slightly faster though that won't likely be the case on small or even medium problems (but the performance cliff is steep and wild).

The tests have cultivated in two separated repositories for a long time before being merged. Work is still done to merge and dedupe these.

Unit tests or tests for a specific package should still go in their respectful packages test dirs.

## FDV - FD Verifier

The tests mostly rely on [a basic verifier](https://github.com/qfox/fdv) which takes an input problem and line-by-line asserts the constraint in each line to the result of the test. This verifier is limited in that it it's (currently) incapable of asserting "complex" constraints. This would be constraints that use grouping, nesting, or anything beyond a single constraint per line in the `A @ B`, `R = A @ B`, `R = call?(args)`, `R = call(args)`, and `call(args)` forms. You can have the verifier skip the actual assertion part so it should be fine.

## Usage

See the [fdo](https://github.com/qfox/fdo) and [fdp](https://github.com/qfox/fdp) packages for details.

## DSL

The constraint language is custom and described in the docs of [fdq](https://github.com/qfox/fdq).
