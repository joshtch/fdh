import {verify} from 'fdv/verifier';

describe('fdh/specs/runner.spec', function() {

  describe('problems without any branching', function() {

    describe('eq', function() {

      it('should solve a solved case', function() {
        verify(`
          @custom var-strat throw
          : A = 1
          : B = 1
          A == B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 8
          : B = 10
          A == B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 20]
          : B = [12 18]
          : C = 15
          A == B
          B == C
        `);
      });
    });

    describe('neq', function() {

      it('should solve a solved case', function() {
        verify(`
          @custom var-strat throw
          : A = 8
          : B = 10
          A != B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 1
          : B = 1
          A != B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [12 13]
          : C = 13
          A != B
          B != C
        `);
      });
    });

    describe('lt', function() {

      it('should solve a solved case', function() {
        verify(`
          @custom var-strat throw
          : A = 8
          : B = 10
          A < B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 1
          : B = 1
          A < B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [12 13]
          : C = 13
          A < B
          B < C
        `);
      });
    });

    describe('lte', function() {

      it('should solve a < case', function() {
        verify(`
          @custom var-strat throw
          : A = 8
          : B = 10
          A <= B
        `);
      });

      it('should solve a == case', function() {
        verify(`
          @custom var-strat throw
          : A = 1
          : B = 1
          A <= B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 2
          : B = 1
          A <= B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [11 12]
          : C = 11
          A <= B
          B <= C
        `);
      });
    });

    describe('gt', function() {

      it('should solve a solved case', function() {
        verify(`
          @custom var-strat throw
          : A = 21
          : B = 15
          A > B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 1
          : B = 1
          A > B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [10 11]
          : C = 10
          A > B
          B > C
        `);
      });
    });

    describe('gte', function() {

      it('should solve a > case', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = 3
          A >= B
        `);
      });

      it('should solve a == case', function() {
        verify(`
          @custom var-strat throw
          : A = 10
          : B = 10
          A >= B
        `);
      });

      it('should reject a bad case', function() {
        verify(`
          @custom var-strat throw
          : A = 0
          : B = 1
          A >= B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [11 12]
          : C = 12
          A >= B
          B >= C
        `);
      });
    });

    describe('diff', function() {

      it('should solve a solved case', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = 3
          diff(A B)
        `);
      });

      it('should reject a failed case', function() {
        verify(`
          @custom var-strat throw
          : A = 10
          : B = 10
          diff(A B)
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [11 12]
          : B = [11 12]
          : C = 12
          diff(A B)
          diff(B C)
        `);
      });
    });

    describe('plus', function() {

      it('should solve a solved case cci', function() {
        verify(`
          @custom var-strat throw
          : A = 50
          : B = 80
          : C *
          C = A + B
        `);
      });

      it('should solve a solved case ccu', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = 3
          : C = [0 10]
          C = A + B
        `);
      });

      it('should solve a solved case cuc', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = [0 10]
          : C = 15
          C = A + B
        `);
      });

      it('should solve a solved case ucc', function() {
        verify(`
          @custom var-strat throw
          : A = [20 25]
          : B = 8
          : C = 29
          C = A + B
        `);
      });

      it('should reject a failed case', function() {
        verify(`
          @custom var-strat throw
          : A = 10
          : B = 20
          : C = 4
          C = A + B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [5 8]
          : B = 8
          : C = [15, 100]
          : D = 8
          : E = 23
          C = A + B # force A to C-B=7 (after C is set to 15 below)
          E = C + D # force C to E-D=15
        `);
      });
    });

    describe('minus', function() {

      it('should solve a solved case cci', function() {
        verify(`
          @custom var-strat throw
          : A = 80
          : B = 50
          : C *
          C = A - B
        `);
      });

      it('should solve a solved case ccu', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = 3
          : C = [0 10]
          C = A - B
        `);
      });

      it('should solve a solved case cuc', function() {
        verify(`
          @custom var-strat throw
          : A = 5
          : B = [0 10]
          : C = 15
          C = A + B
        `);
      });

      it('should solve a solved case ucc', function() {
        verify(`
          @custom var-strat throw
          : A = [20 25]
          : B = 8
          : C = 14
          C = A - B
        `);
      });

      it('should reject a failed case', function() {
        verify(`
          @custom var-strat throw
          : A = 10
          : B = 20
          : C = 4
          C = A - B
        `, 'reject');
      });

      it('should solve transitivity', function() {
        verify(`
          @custom var-strat throw
          : A = [15 18] # 18
          : B = 8
          : C = [5, 100] # 10
          : D = 8
          : E = 2
          C = A - B # force A to A=B+C=18 (after C is set to 10 below)
          E = C - D # force C to C=D+E=10
        `);
      });
    });

    describe('div', function() {

      it('should solve a solved case cci', function() {
        verify(`
          @custom var-strat throw
          : A = 50
          : B = 10
          : C *
          C = A / B
        `);
      });

      it('should solve a solved case ccu', function() {
        verify(`
          @custom var-strat throw
          : A = 8
          : B = 4
          : C = [0 20]
          C = A / B
        `);
      });

      it('should solve a solved case cuc (regressed)', function() {
        verify(`
          @custom var-strat throw
          : A = 28
          : B = [0 10]
          : C = 4
          C = A / B
        `, 'div');
      });

      it('should solve a solved case ucc (regressed)', function() {
        verify(`
          @custom var-strat throw
          : A = [0 144]
          : B = 7
          : C = 18
          C = A / B
        `, 'div');
      });

      it('should reject a failed case', function() {
        verify(`
          @custom var-strat throw
          : A = 10
          : B = 20
          : C = 4
          C = A / B
        `, 'reject');
      });

      it('should solve transitivity (regressed divs)', function() {
        verify(`
          @custom var-strat throw
          : A = [170000 180000] # 173745
          : B = 33
          : C = [5000, 6000] # 5265
          : D = 27
          : E = 195
          C = A / B # force A to C/B=173745 (after C is set to 5265 below)
          E = C / D # force C to E*D=5265
        `, 'div,div');
      });

      it('should reject B=0', function() {
        verify(`
          @custom var-strat throw
          : A = 0
          : B = 0
          : C = 0
          C = A / B
        `, 'reject');
      });
    });

    describe('iseq', function() {

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 5
          : C [0 1]
          C = A ==? B
        `);
      });

      it('should solve C if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 6
          : C [0 1]
          C = A ==? B
        `);
      });

      it('should accept C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 5
          : C 1
          C = A ==? B
        `);
      });

      it('should accept C=0 if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 6
          : C 0
          C = A ==? B
        `);
      });

      it('should reject C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 5
          : C 0
          C = A ==? B
        `, 'reject');
      });

      it('should reject C=1 if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 6
          : C 1
          C = A ==? B
        `, 'reject');
      });

      it('should solve B with C=1', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [0 10]
          : C 1
          C = A ==? B
        `);
      });

      it('should solve B with C=0', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [80 81]
          : C 0
          C = A ==? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : B 5
          : C 1
          C = A ==? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [80 81]
          : B 80
          : C 0
          C = A ==? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 0
          : B 1
          : C [0 1] # 0
          : D 0
          : E 1
          C = A ==? B        # [0 1] = [0 1] ==? 1  -> 0 = [0 1] ==? 1  -> 0 = 0 ==? 1
          E = C ==? D        # 1 = [0 1] ==? 0      -> 1 = 0 ==? 0
        `);
      });
    });

    describe('isneq', function() {

      it('should solve C if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 56
          : B 77
          : C [0 1]
          C = A !=? B
        `);
      });

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 65
          : C [0 1]
          C = A !=? B
        `);
      });

      it('should accept C=1 if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 571
          : B 18
          : C 1
          C = A !=? B
        `);
      });

      it('should accept C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B 5
          : C 0
          C = A !=? B
        `);
      });

      it('should reject C=0 if A!=B', function() {
        verify(`
          @custom var-strat throw
          : A 38
          : B 404
          : C 0
          C = A !=? B
        `, 'reject');
      });

      it('should reject C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 20
          : B 20
          : C 1
          C = A !=? B
        `, 'reject');
      });

      it('should solve B with C=1', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [5 6]
          : C 1
          C = A !=? B
        `);
      });

      it('should solve B with C=0', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [0 100]
          : C 0
          C = A !=? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [10 11]
          : B 10
          : C 1
          C = A !=? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [0 100]
          : B 80
          : C 0
          C = A !=? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 0
          : B 1
          : C [0 1] # 1
          : D 0
          : E 1
          C = A !=? B        # [0 1] = [0 1] !=? 1  -> 1 = [0 1] !=? 1  -> 0 = 1 !=? 1
          E = C !=? D        # 1 = [0 1] !=? 0      -> 1 = 1 !=? 0
        `);
      });
    });

    describe('islt', function() {

      it('should solve C if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 64
          : B 65
          : C [0 1]
          C = A <? B
        `);
      });

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 65
          : C [0 1]
          C = A <? B
        `);
      });

      it('should solve C if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 66
          : B 65
          : C [0 1]
          C = A <? B
        `);
      });

      it('should accept C=1 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 18
          : B 571
          : C 1
          C = A <? B
        `);
      });

      it('should reject C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 1
          C = A <? B
        `, 'reject');
      });

      it('should reject C=1 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 1
          C = A <? B
        `, 'reject');
      });

      it('should reject C=0 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 0
          C = A <? B
        `, 'reject');
      });

      it('should accept C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 0
          C = A <? B
        `);
      });

      it('should accept C=0 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 0
          C = A <? B
        `);
      });

      it('should solve B with C=1', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [5 6]
          : C 1
          C = A <? B
        `);
      });

      it('should solve B with C=0 (=)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [80 81]
          : C 0
          C = A <? B
        `);
      });

      it('should solve B with C=0 (>)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 79 81 81]
          : C 0
          C = A <? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [10 11]
          : B 11
          : C 1
          C = A <? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [0 80]
          : B 80
          : C 0
          C = A <? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 0
          : B 1
          : C [0 1] # 1
          : D 1
          : E 0
          C = A <? B        # [0 1] = [0 1] <? 1  -> 1 = [0 1] <? 1  -> 0 = 1 <? 1
          E = C <? D        # 0 = [0 1] <? 1      -> 0 = 1 <? 1
        `);
      });
    });

    describe('islte', function() {

      it('should solve C if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 64
          : B 65
          : C [0 1]
          C = A <=? B
        `);
      });

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 65
          : C [0 1]
          C = A <=? B
        `);
      });

      it('should solve C if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 66
          : B 65
          : C [0 1]
          C = A <=? B
        `);
      });

      it('should accept C=1 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 18
          : B 571
          : C 1
          C = A <=? B
        `);
      });

      it('should accept C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 1
          C = A <=? B
        `);
      });

      it('should reject C=1 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 1
          C = A <=? B
        `, 'reject');
      });

      it('should reject C=0 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 0
          C = A <=? B
        `, 'reject');
      });

      it('should reject C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 0
          C = A <=? B
        `, 'reject');
      });

      it('should accept C=0 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 0
          C = A <=? B
        `);
      });

      it('should solve B with C=1 (=)', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [4 5]
          : C 1
          C = A <=? B
        `);
      });

      it('should solve B with C=1 (>)', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [4 4 6 6]
          : C 1
          C = A <=? B
        `);
      });

      it('should solve B with C=0', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 81]
          : C 0
          C = A <=? B
        `);
      });

      it('should solve B with C=0 (>)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 79 81 81]
          : C 0
          C = A <=? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [9 9 12 12]
          : B 11
          : C 1
          C = A <=? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [0 81]
          : B 80
          : C 0
          C = A <=? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 0
          : B 0
          : C [0 1] # 1
          : D 0
          : E 0
          C = A <=? B        # [0 1] = [0 1] <=? 0  ->  1 = [0 1] <=? 0  ->  1 = 0 <=? 0
          E = C <=? D        # 0 = [0 1] <=? 0  ->  0 = 1 <=? 0
        `);
      });
    });

    describe('isgt', function() {

      it('should solve C if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 64
          : C [0 1]
          C = A >? B
        `);
      });

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 65
          : C [0 1]
          C = A >? B
        `);
      });

      it('should solve C if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 66
          : C [0 1]
          C = A >? B
        `);
      });

      it('should accept C=1 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 571
          : B 18
          : C 1
          C = A >? B
        `);
      });

      it('should reject C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 1
          C = A >? B
        `, 'reject');
      });

      it('should reject C=1 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 1
          C = A >? B
        `, 'reject');
      });

      it('should reject C=0 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 0
          C = A >? B
        `, 'reject');
      });

      it('should accept C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 0
          C = A >? B
        `);
      });

      it('should accept C=0 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 0
          C = A >? B
        `);
      });

      it('should solve B with C=1', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [4 6]
          : C 1
          C = A >? B
        `);
      });

      it('should solve B with C=0 (=)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 80]
          : C 0
          C = A >? B
        `);
      });

      it('should solve B with C=0 (>)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 79 81 81]
          : C 0
          C = A >? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [10 12]
          : B 11
          : C 1
          C = A >? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [80 100]
          : B 80
          : C 0
          C = A >? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 1
          : B 0
          : C [0 1] # 1
          : D 0
          : E 1
          C = A >? B        # [0 1] = [0 1] >? 0  -> 1 = [0 1] >? 0  -> 0 = 1 >? 0
          E = C >? D        # 1 = [0 1] >? 0      -> 1 = 1 >? 0
        `);
      });
    });

    describe('isgte', function() {

      it('should solve C if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 64
          : C [0 1]
          C = A >=? B
        `);
      });

      it('should solve C if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 65
          : C [0 1]
          C = A >=? B
        `);
      });

      it('should solve C if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 65
          : B 66
          : C [0 1]
          C = A >=? B
        `);
      });

      it('should accept C=1 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 571
          : B 18
          : C 1
          C = A >=? B
        `);
      });

      it('should accept C=1 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 1
          C = A >=? B
        `);
      });

      it('should reject C=1 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 1
          C = A >=? B
        `, 'reject');
      });

      it('should reject C=0 if A>B', function() {
        verify(`
          @custom var-strat throw
          : A 51
          : B 50
          : C 0
          C = A >=? B
        `, 'reject');
      });

      it('should reject C=0 if A==B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 50
          : C 0
          C = A >=? B
        `, 'reject');
      });

      it('should accept C=0 if A<B', function() {
        verify(`
          @custom var-strat throw
          : A 50
          : B 51
          : C 0
          C = A >=? B
        `);
      });

      it('should solve B with C=1', function() {
        verify(`
          @custom var-strat throw
          : A 5
          : B [4 4 6 6]
          : C 1
          C = A >=? B
        `);
      });

      it('should solve B with C=0 (=)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 81]
          : C 0
          C = A >=? B
        `);
      });

      it('should solve B with C=0 (>)', function() {
        verify(`
          @custom var-strat throw
          : A 80
          : B [79 79 81 81]
          : C 0
          C = A >=? B
        `);
      });

      it('should solve A with C=1', function() {
        verify(`
          @custom var-strat throw
          : A [10 10 12 12]
          : B 11
          : C 1
          C = A >=? B
        `);
      });

      it('should solve A with C=0', function() {
        verify(`
          @custom var-strat throw
          : A [79 100]
          : B 80
          : C 0
          C = A >=? B
        `);
      });

      it('should solve transitively', function() {
        verify(`
          @custom var-strat throw
          : A [0 1] # 1
          : B 1
          : C [0 1] # 1
          : D 1
          : E 1
          C = A >=? B        # [0 1] = [0 1] >=? 1  -> 1 = [0 1] >=? 1  -> 0 = 1 >=? 1
          E = C >=? D        # 1 = [0 1] >=? 1      -> 1 = 1 >=? 1
        `);
      });
    });

    describe('sum', function() {

      it('should solve a simple sum with 1 var', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : R *
          R = sum(A)
        `);
      });

      it('should solve a simple sum with 2 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B 10
          : R *
          R = sum(A B)
        `);
      });

      it('should solve a simple sum with 3 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B 10
          : C 7
          : R *
          R = sum(A B C)
        `);
      });

      it('should solve a simple sum with 4 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B 10
          : C 7
          : D 4
          : R *
          R = sum(A B C D)
        `);
      });

      it('should solve when B is unsolved but R is', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B [5 10]
          : C 7
          : R 18
          R = sum(A B C)
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 2 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B [5 10]
          : X = 10
          : R *
          R = sum(A B)
          B == X
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 3 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B [5 10]
          : C 7
          : X = 10
          : R *
          R = sum(A B C)
          B == X
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 4 vars', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B [5 10]
          : C 7
          : D 11
          : X = 10
          : R *
          R = sum(A B C D)
          B == X
        `);
      });

      it('should accept one var', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : X 10
          : R *
          R = sum(A)
          A == X
        `);
      });

      it('should clear args if result is solved to zero immediately', function() {
        verify(`
          @custom var-strat throw
          : A 0
          : B [0 10]
          : C [0 80]
          : D [0 11]
          : E 0
          : R 0
          R = sum(A B C D E)
        `);
      });

      it('should clear args if result is solved to zero transitive', function() {
        verify(`
          @custom var-strat throw
          : A 0
          : B [0 10]
          : C [0 80]
          : D [0 11]
          : E 0
          : X 0
          X = sum(A B C D E)
          B == X
        `);
      });

      it('should rewrite special case to A<R', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B  1
          : R [1 2]
          R = sum(A B)
          # -> R = A + B
          # -> A < R (because ∀ A + 1 ϵ R)
          # (undetermined, either A=0,B=1 or A=1,B=2)
          # the cutter will force A<R to A=0,B=1
        `);
      });

      it('should rewrite special case to B<R', function() {
        verify(`
          @custom var-strat throw
          : A 1
          : B [0 1]
          : R [1 2]
          R = sum(A B)
          # see test above
        `);
      });

      it('should eliminate the zeroes that occur twice', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B  0
          : R [1 2]
          R = sum(A B B)
        `);
      });

      it('should reduce to plus and ignore the zeroes', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : B  0
          : C  1
          : R [1 2]
          R = sum(A B C B)
          # becomes R = A + 1
          # cutter will force a solution on that
        `);
      });

      it('should accept constants in sum', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : R [2 2]
          R = sum(A 1)
        `);
      });

      it('should reject a falsum caused by one constant', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : R [0 20]
          R = sum(100 A)
        `, 'reject');
      });

      it('should reject a falsum caused by multiple constants', function() {
        verify(`
          @custom var-strat throw
          : A [0 1]
          : R [0 29]
          R = sum(10 10 A 10) # individual constants dont reject per-se
        `, 'reject');
      });

      it('should reject (not throw assertion error) when R cant reflect constant sum (with vars)', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : C [0 8]
          : D [0 11]
          : R [0 11]
          R = sum(A B C D)
        `, 'reject');
      });
    });

    describe('product', function() {

      describe('legacy mul', function() {

        it('should solve a solved case cci', function() {
          verify(`
            @custom var-strat throw
            : A = 50
            : B = 80
            : C *
            C = A * B
          `);
        });

        it('should solve a solved case ccu', function() {
          verify(`
            @custom var-strat throw
            : A = 5
            : B = 3
            : C = [0 20]
            C = A * B
          `);
        });

        it('should solve a solved case cuc A', function() {
          verify(`
            @custom var-strat throw
            : A = 5
            : B = [0 10]
            : C = 45
            C = A * B
            # 45 = 5 * 9
          `);
        });

        it('should solve a solved case cuc B', function() {
          verify(`
            @custom var-strat throw
            : A = 5
            : B = [9 10]
            : C = 45
            C = A * B
            # 45 = 5 * 9
          `);
        });

        it('should solve a solved case cuc C', function() {
          verify(`
            @custom var-strat throw
            : A = 5
            : B = [8 9]
            : C = 45
            C = A * B
            # 45 = 5 * 9
          `);
        });

        it('should solve a solved case ucc', function() {
          verify(`
            @custom var-strat throw
            : A = [0 25]
            : B = 8
            : C = 32
            C = A * B
          `);
        });

        it('should reject a failed case', function() {
          verify(`
            @custom var-strat throw
            : A = 10
            : B = 20
            : C = 4
            C = A * B
          `, 'reject');
        });

        it('should solve transitivity', function() {
          verify(`
            @custom var-strat throw
            : A = [5 8] # 5
            : B = 10
            : C = [0, 100] # 50
            : D = 60
            : E = 3000
            C = A * B # force A to C/B=5 (after C is set to 50 below)
            E = C * D # force C to E/D=50
          `);
        });

        it('should work with all zeroes', function() {
          verify(`
            @custom var-strat throw
            : A = 0
            : B = 0
            : C = 0
            C = A * B
          `);
        });
      });

      it('should solve a simple product with 1 var', function() {
        verify(`
          @custom var-strat throw
          : A 28
          : R *
          R = product(A)
        `);
      });

      it('should solve a simple product with a zero', function() {
        verify(`
          @custom var-strat throw
          : A 0
          : R *
          R = product(A)
        `);
      });

      it('should solve a simple product with 2 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : R *
          R = product(A B)
        `);
      });

      it('should solve a simple product with a zero and non-zero', function() {
        verify(`
          @custom var-strat throw
          : A 14
          : B 0
          : R *
          R = product(A B)
        `);
      });

      it('should solve a simple product with 3 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : C 7
          : R *
          R = product(A B C)
        `);
      });

      it('should solve a simple product with 4 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : C 7
          : D 4
          : R *
          R = product(A B C D)
        `);
      });

      it('should solve when B is unsolved but R is', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B [5 10]
          : C 7
          : R 126
          R = product(A B C)
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 2 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B [5 10]
          : X = 9
          : R *
          R = product(A B)
          B == X
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 3 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B [5 10]
          : C 7
          : X = 5
          : R *
          R = product(A B C)
          B == X
        `);
      });

      it('should solve when B is unsolved and forced by other constraint with 4 vars', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B [5 10]
          : C 7
          : D 11
          : X = 10
          : R *
          R = product(A B C D)
          B == X
        `);
      });

      it('should reject (not throw assertion error) when R cant reflect constant product (without vars)', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : C 8
          : D 11
          : R [0 10]
          R = product(A B C D)
        `, 'reject');
      });

      it('should solve because R can be zero', function() {
        verify(`
          @custom var-strat throw
          : A 2
          : B 10
          : C [0 8]
          : D [0 11]
          : R [0 10]
          R = product(A B C D)
        `);
      });

      it('should accept one var', function() {
        verify(`
          @custom var-strat throw
          : A [0 10]
          : X 10
          : R *
          R = product(A)
          A == X
        `);
      });
    });
  });

  describe('op literals', function() {

    describe('eq', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A == 21
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A == 22
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          18 == 18
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          18 == 19
        `, 'reject');
      });


    });

    describe('neq', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A != 22
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A != 21
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          18 != 19
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          18 != 18
        `, 'reject');
      });
    });

    describe('lt', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A < 22
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A < 21
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          18 < 19
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          18 < 18
        `, 'reject');
      });
    });

    describe('lte', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A <= 22
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          A <= 21
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          18 <= 19
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          19 <= 18
        `, 'reject');
      });
    });

    describe('gt', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          A > 21
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A > 21
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          19 > 18
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          18 > 18
        `, 'reject');
      });
    });

    describe('gte', function() {

      it('v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          A >= 21
        `);
      });

      it('v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          A >= 22
        `, 'reject');
      });

      it('88 pass', function() {
        verify(`
          @custom var-strat throw
          19 >= 19
        `);
      });

      it('88 reject', function() {
        verify(`
          @custom var-strat throw
          18 >= 19
        `, 'reject');
      });
    });

    describe('iseq', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 1
          R = B ==? 22
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : A 21
          : R 1
          R = A ==? 22
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 1
          R = A ==? 22
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : B 21
          : R 1
          R = B ==? 22
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 22
          1 = A ==? A
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 21
          1 = A ==? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 22 ==? 22
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 21 ==? 22
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          1 = A ==? 22
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          1 = A ==? 21
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          1 = A ==? 22
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          1 = A ==? 21
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          1 = 22 ==? 22
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          1 = 22 ==? 21
        `, 'reject');
      });
    });

    describe('isneq', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 0
          R = B !=? 22
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : B 21
          : R 0
          R = B !=? 22
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 0
          R = A !=? 22
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : B 21
          : R 0
          R = B !=? 22
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 22
          0 = A !=? A
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 21
          0 = A !=? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 22 !=? 22
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 21 !=? 22
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          0 = A !=? 22
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          0 = A !=? 21
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          0 = A !=? 22
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          0 = A !=? 21
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          0 = 22 !=? 22
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          0 = 22 !=? 21
        `, 'reject');
      });
    });

    describe('islt', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 1
          R = 15 <? B
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 0
          R = 15 <? B
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 1
          R = A <? 30
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 0
          R = A <? 30
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 100
          1 = A <? B
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 100
          0 = A <? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 50 <? 100
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 50 <? 100
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 15
          1 = A <? 100
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 15
          0 = A <? 100
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : B 100
          1 = 30 <? B
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : B 20
          1 = 30 <? B
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          1 = 30 <? 50
        `);
      });

      it('888 with large constant pass', function() {
        verify(`
          @custom var-strat throw
          1 = 30 <? 300
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          0 = 30 <? 150
        `, 'reject');
      });
    });

    describe('islte', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 1
          R = 15 <=? B
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : B 22
          : R 0
          R = 15 <=? B
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 1
          R = A <=? 30
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : R 0
          R = A <=? 30
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 100
          1 = A <=? B
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 22
          : B 100
          0 = A <=? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 50 <=? 100
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 50 <=? 100
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 15
          1 = A <=? 100
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 15
          0 = A <=? 100
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : B 100
          1 = 30 <=? B
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : B 20
          1 = 30 <=? B
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          1 = 30 <=? 54
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          0 = 30 <=? 150
        `, 'reject');
      });
    });

    describe('isgt', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 2
          : R 1
          R = 15 >? B
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : B 2
          : R 0
          R = 15 >? B
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 52
          : R 1
          R = A >? 30
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : R 0
          R = A >? 30
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : B 100
          1 = A >? B
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : B 100
          0 = A >? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 150 >? 100
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 150 >? 100
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 115
          1 = A >? 100
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 115
          0 = A >? 100
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : B 100
          1 = 130 >? B
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : B 120
          1 = 30 >? B
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          1 = 130 >? 30
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          0 = 130 >? 50
        `, 'reject');
      });
    });

    describe('isgte', function() {

      it('8vv pass', function() {
        verify(`
          @custom var-strat throw
          : B 2
          : R 1
          R = 15 >=? B
        `);
      });

      it('8vv reject', function() {
        verify(`
          @custom var-strat throw
          : B 2
          : R 0
          R = 15 >=? B
        `, 'reject');
      });

      it('v8v pass', function() {
        verify(`
          @custom var-strat throw
          : A 52
          : R 1
          R = A >=? 30
        `);
      });

      it('v8v reject', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : R 0
          R = A >=? 30
        `, 'reject');
      });

      it('vv8 pass', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : B 100
          1 = A >=? B
        `);
      });

      it('vv8 reject', function() {
        verify(`
          @custom var-strat throw
          : A 122
          : B 100
          0 = A >=? B
        `, 'reject');
      });

      it('88v pass', function() {
        verify(`
          @custom var-strat throw
          : R 1
          R = 150 >=? 100
        `);
      });

      it('88v reject', function() {
        verify(`
          @custom var-strat throw
          : R 0
          R = 150 >=? 100
        `, 'reject');
      });

      it('v88 pass', function() {
        verify(`
          @custom var-strat throw
          : A 115
          1 = A >=? 100
        `);
      });

      it('v88 reject', function() {
        verify(`
          @custom var-strat throw
          : A 115
          0 = A >=? 100
        `, 'reject');
      });

      it('8v8 pass', function() {
        verify(`
          @custom var-strat throw
          : B 100
          1 = 130 >=? B
        `);
      });

      it('8v8 reject', function() {
        verify(`
          @custom var-strat throw
          : B 120
          1 = 30 >=? B
        `, 'reject');
      });

      it('888 pass', function() {
        verify(`
          @custom var-strat throw
          1 = 130 >=? 30
        `);
      });

      it('888 reject', function() {
        verify(`
          @custom var-strat throw
          0 = 130 >=? 50
        `, 'reject');
      });
    });
  });

  describe('optimize tricks', function() {

    it('should solve the count reflection when it cant pass', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 2]
        : D [0 1]
        C = A + B
        D = C ==? 2
        # and then
        A == 0
        # C should be reduced to [0 1]
        # which means C ==? 2 is false
        # so D = 0, constraint removed
        # A=0,B=[0 1],C=[0,1],D=0
      `);
    });

    it('should solve the count reflection when it cant pass (weird)', function() {
      verify(`
        @custom var-strat throw
        : A [0 1]
        : B [0 1]
        : C [0 2]
        C = A + B
        B = C ==? 2
        # ! B cant be higher than itself, but that's a difficult artifact to detect explicitly
        A == 0
        # C should be reduced to [0 1]
        # which means C ==? 2 is false
        # so B = 0, constraint removed
        # this solves C to 0. finished
      `);
    });

    it('should resolve the pseudo xnor case', function() {
      verify(`
        @custom var-strat throw

        : A [0 0 5 5]
        : B [0 0 6 6]
        : C [0 10]
        A !^ B
        C < A
        # A must be non-zero to be bigger than C, C must be under 5, B must follow C's suit and become non-zero
      `);
    });

    it('should not trigger regression', function() {
      verify(`
        @custom var-strat throw

        : A [0 0 5 5]
        : B [0 0 6 6]
        : C [0 20]
        : D, E [0 10]
        A !^ B
        D != E
        nall(A B C D)
        # => A=0,B=0,C=*,D!=E
      `);
    });
  });
});
