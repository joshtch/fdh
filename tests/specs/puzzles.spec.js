import {verify} from 'fdv/verifier';
import FDO from 'fdo';
import FDP from 'fdp';

// to analyze
describe.skip('fdh/puzzles.spec', function() {

  it('sudoku', function() {
    let sudoku = `
      # Blank Sudoku:

      : c11,c12,c13,c14,c15,c16,c17,c18,c19 [1, 9]
      : c21,c22,c23,c24,c25,c26,c27,c28,c29 [1, 9]
      : c31,c32,c33,c34,c35,c36,c37,c38,c39 [1, 9]
      : c41,c42,c43,c44,c45,c46,c47,c48,c49 [1, 9]
      : c51,c52,c53,c54,c55,c56,c57,c58,c59 [1, 9]
      : c61,c62,c63,c64,c65,c66,c67,c68,c69 [1, 9]
      : c71,c72,c73,c74,c75,c76,c77,c78,c79 [1, 9]
      : c81,c82,c83,c84,c85,c86,c87,c88,c89 [1, 9]
      : c91,c92,c93,c94,c95,c96,c97,c98,c99 [1, 9]

      # Enter all known cells here:

      ## Q1
      c21 == 2
      c31 == 3
      c13 == 1
      c33 == 4

      ## Q2
      c42 == 2
      c52 == 3
      c53 == 5
      c63 == 8

      ## Q3
      c71 == 9
      c82 == 7
      c73 == 6
      c83 == 3

      ## Q4
      c14 == 2
      c34 == 5
      c15 == 9
      c26 == 3

      ## Q5
      c45 == 1
      c65 == 5
      c56 == 4
      c66 == 6

      ## Q6
      c74 == 1
      c84 == 4
      c85 == 6
      c96 == 9

      ## Q7
      c27 == 1
      c37 == 7
      c28 == 9
      c19 == 3

      ## Q8
      c47 == 3
      c57 == 8
      c48 == 6
      c68 == 4

      ## Q9
      c77 == 2
      c88 == 8
      c98 == 7
      c89 == 9

      # Make sure all cells in each row, column, and 3x3 are unique

      diff(c11 c12 c13 c21 c22 c23 c31 c32 c33)
      diff(c14 c15 c16 c24 c25 c26 c34 c35 c36)
      diff(c17 c18 c19 c27 c28 c29 c37 c38 c39)
      diff(c41 c42 c43 c51 c52 c53 c61 c62 c63)
      diff(c44 c45 c46 c54 c55 c56 c64 c65 c66)
      diff(c47 c48 c49 c57 c58 c59 c67 c68 c69)
      diff(c71 c72 c73 c81 c82 c83 c91 c92 c93)
      diff(c74 c75 c76 c84 c85 c86 c94 c95 c96)
      diff(c77 c78 c79 c87 c88 c89 c97 c98 c99)

      diff(c11 c12 c13 c14 c15 c16 c17 c18 c19)
      diff(c21 c22 c23 c24 c25 c26 c27 c28 c29)
      diff(c31 c32 c33 c34 c35 c36 c37 c38 c39)
      diff(c41 c42 c43 c44 c45 c46 c47 c48 c49)
      diff(c51 c52 c53 c54 c55 c56 c57 c58 c59)
      diff(c61 c62 c63 c64 c65 c66 c67 c68 c69)
      diff(c71 c72 c73 c74 c75 c76 c77 c78 c79)
      diff(c81 c82 c83 c84 c85 c86 c87 c88 c89)
      diff(c91 c92 c93 c94 c95 c96 c97 c98 c99)

      diff(c11 c21 c31 c41 c51 c61 c71 c81 c91)
      diff(c12 c22 c32 c42 c52 c62 c72 c82 c92)
      diff(c13 c23 c33 c43 c53 c63 c73 c83 c93)
      diff(c14 c24 c34 c44 c54 c64 c74 c84 c94)
      diff(c15 c25 c35 c45 c55 c65 c75 c85 c95)
      diff(c16 c26 c36 c46 c56 c66 c76 c86 c96)
      diff(c17 c27 c37 c47 c57 c67 c77 c87 c97)
      diff(c18 c28 c38 c48 c58 c68 c78 c88 c98)
      diff(c19 c29 c39 c49 c59 c69 c79 c89 c99)
    `;
    verify(sudoku);
  });

  it('battleships', function() {
    let battleships = `
      # Blank sea:

      : WATER 0
      : HOR_MID 1 # middle piece of a horizontal boat
      : VER_MID 2 # middle piece of a vertical boat
      : TOP 3     # top of vert boat
      : RIGHT 4   # right of horz boat
      : BOTTOM 5  # bottom of vert boat
      : LEFT 6    # left of horz boat
      : ONE 7     # 1x1 boat
      #: MID 8 (this is translated to [1,2] when compiling the problem)

      : $11,$12,$13,$14,$15,$16,$17,$18,$19,$1a [0, 7]
      : $21,$22,$23,$24,$25,$26,$27,$28,$29,$2a [0, 7]
      : $31,$32,$33,$34,$35,$36,$37,$38,$39,$3a [0, 7]
      : $41,$42,$43,$44,$45,$46,$47,$48,$49,$4a [0, 7]
      : $51,$52,$53,$54,$55,$56,$57,$58,$59,$5a [0, 7]
      : $61,$62,$63,$64,$65,$66,$67,$68,$69,$6a [0, 7]
      : $71,$72,$73,$74,$75,$76,$77,$78,$79,$7a [0, 7]
      : $81,$82,$83,$84,$85,$86,$87,$88,$89,$8a [0, 7]
      : $91,$92,$93,$94,$95,$96,$97,$98,$99,$9a [0, 7]
      : $a1,$a2,$a3,$a4,$a5,$a6,$a7,$a8,$a9,$aa [0, 7]

      : $11L1, $12L1, $13L1, $14L1, $15L1, $16L1, $17L1, $18L1, $19L1, $1aL1, $21L1, $22L1, $23L1, $24L1, $25L1, $26L1, $27L1, $28L1, $29L1, $2aL1, $31L1, $32L1, $33L1, $34L1, $35L1, $36L1, $37L1, $38L1, $39L1, $3aL1, $41L1, $42L1, $43L1, $44L1, $45L1, $46L1, $47L1, $48L1, $49L1, $4aL1, $51L1, $52L1, $53L1, $54L1, $55L1, $56L1, $57L1, $58L1, $59L1, $5aL1, $61L1, $62L1, $63L1, $64L1, $65L1, $66L1, $67L1, $68L1, $69L1, $6aL1, $71L1, $72L1, $73L1, $74L1, $75L1, $76L1, $77L1, $78L1, $79L1, $7aL1, $81L1, $82L1, $83L1, $84L1, $85L1, $86L1, $87L1, $88L1, $89L1, $8aL1, $91L1, $92L1, $93L1, $94L1, $95L1, $96L1, $97L1, $98L1, $99L1, $9aL1, $a1L1, $a2L1, $a3L1, $a4L1, $a5L1, $a6L1, $a7L1, $a8L1, $a9L1, $aaL1 [0 1]
      : $11L2, $12L2, $13L2, $14L2, $15L2, $16L2, $17L2, $18L2, $19L2, $1aL2, $21L2, $22L2, $23L2, $24L2, $25L2, $26L2, $27L2, $28L2, $29L2, $2aL2, $31L2, $32L2, $33L2, $34L2, $35L2, $36L2, $37L2, $38L2, $39L2, $3aL2, $41L2, $42L2, $43L2, $44L2, $45L2, $46L2, $47L2, $48L2, $49L2, $4aL2, $51L2, $52L2, $53L2, $54L2, $55L2, $56L2, $57L2, $58L2, $59L2, $5aL2, $61L2, $62L2, $63L2, $64L2, $65L2, $66L2, $67L2, $68L2, $69L2, $6aL2, $71L2, $72L2, $73L2, $74L2, $75L2, $76L2, $77L2, $78L2, $79L2, $7aL2, $81L2, $82L2, $83L2, $84L2, $85L2, $86L2, $87L2, $88L2, $89L2, $8aL2, $91L2, $92L2, $93L2, $94L2, $95L2, $96L2, $97L2, $98L2, $99L2, $9aL2, $a1L2, $a2L2, $a3L2, $a4L2, $a5L2, $a6L2, $a7L2, $a8L2, $a9L2, $aaL2 [0 1]
      : $11L3, $12L3, $13L3, $14L3, $15L3, $16L3, $17L3, $18L3, $19L3, $1aL3, $21L3, $22L3, $23L3, $24L3, $25L3, $26L3, $27L3, $28L3, $29L3, $2aL3, $31L3, $32L3, $33L3, $34L3, $35L3, $36L3, $37L3, $38L3, $39L3, $3aL3, $41L3, $42L3, $43L3, $44L3, $45L3, $46L3, $47L3, $48L3, $49L3, $4aL3, $51L3, $52L3, $53L3, $54L3, $55L3, $56L3, $57L3, $58L3, $59L3, $5aL3, $61L3, $62L3, $63L3, $64L3, $65L3, $66L3, $67L3, $68L3, $69L3, $6aL3, $71L3, $72L3, $73L3, $74L3, $75L3, $76L3, $77L3, $78L3, $79L3, $7aL3, $81L3, $82L3, $83L3, $84L3, $85L3, $86L3, $87L3, $88L3, $89L3, $8aL3, $91L3, $92L3, $93L3, $94L3, $95L3, $96L3, $97L3, $98L3, $99L3, $9aL3, $a1L3, $a2L3, $a3L3, $a4L3, $a5L3, $a6L3, $a7L3, $a8L3, $a9L3, $aaL3 [0 1]
      : $11L4, $12L4, $13L4, $14L4, $15L4, $16L4, $17L4, $18L4, $19L4, $1aL4, $21L4, $22L4, $23L4, $24L4, $25L4, $26L4, $27L4, $28L4, $29L4, $2aL4, $31L4, $32L4, $33L4, $34L4, $35L4, $36L4, $37L4, $38L4, $39L4, $3aL4, $41L4, $42L4, $43L4, $44L4, $45L4, $46L4, $47L4, $48L4, $49L4, $4aL4, $51L4, $52L4, $53L4, $54L4, $55L4, $56L4, $57L4, $58L4, $59L4, $5aL4, $61L4, $62L4, $63L4, $64L4, $65L4, $66L4, $67L4, $68L4, $69L4, $6aL4, $71L4, $72L4, $73L4, $74L4, $75L4, $76L4, $77L4, $78L4, $79L4, $7aL4, $81L4, $82L4, $83L4, $84L4, $85L4, $86L4, $87L4, $88L4, $89L4, $8aL4, $91L4, $92L4, $93L4, $94L4, $95L4, $96L4, $97L4, $98L4, $99L4, $9aL4, $a1L4, $a2L4, $a3L4, $a4L4, $a5L4, $a6L4, $a7L4, $a8L4, $a9L4, $aaL4 [0 1]

      # Count the number of boat types
      : count1, count2, count3, count4 *
      count1 = sum($11L1, $12L1, $13L1, $14L1, $15L1, $16L1, $17L1, $18L1, $19L1, $1aL1, $21L1, $22L1, $23L1, $24L1, $25L1, $26L1, $27L1, $28L1, $29L1, $2aL1, $31L1, $32L1, $33L1, $34L1, $35L1, $36L1, $37L1, $38L1, $39L1, $3aL1, $41L1, $42L1, $43L1, $44L1, $45L1, $46L1, $47L1, $48L1, $49L1, $4aL1, $51L1, $52L1, $53L1, $54L1, $55L1, $56L1, $57L1, $58L1, $59L1, $5aL1, $61L1, $62L1, $63L1, $64L1, $65L1, $66L1, $67L1, $68L1, $69L1, $6aL1, $71L1, $72L1, $73L1, $74L1, $75L1, $76L1, $77L1, $78L1, $79L1, $7aL1, $81L1, $82L1, $83L1, $84L1, $85L1, $86L1, $87L1, $88L1, $89L1, $8aL1, $91L1, $92L1, $93L1, $94L1, $95L1, $96L1, $97L1, $98L1, $99L1, $9aL1, $a1L1, $a2L1, $a3L1, $a4L1, $a5L1, $a6L1, $a7L1, $a8L1, $a9L1, $aaL1)
      count2 = sum($11L2, $12L2, $13L2, $14L2, $15L2, $16L2, $17L2, $18L2, $19L2, $1aL2, $21L2, $22L2, $23L2, $24L2, $25L2, $26L2, $27L2, $28L2, $29L2, $2aL2, $31L2, $32L2, $33L2, $34L2, $35L2, $36L2, $37L2, $38L2, $39L2, $3aL2, $41L2, $42L2, $43L2, $44L2, $45L2, $46L2, $47L2, $48L2, $49L2, $4aL2, $51L2, $52L2, $53L2, $54L2, $55L2, $56L2, $57L2, $58L2, $59L2, $5aL2, $61L2, $62L2, $63L2, $64L2, $65L2, $66L2, $67L2, $68L2, $69L2, $6aL2, $71L2, $72L2, $73L2, $74L2, $75L2, $76L2, $77L2, $78L2, $79L2, $7aL2, $81L2, $82L2, $83L2, $84L2, $85L2, $86L2, $87L2, $88L2, $89L2, $8aL2, $91L2, $92L2, $93L2, $94L2, $95L2, $96L2, $97L2, $98L2, $99L2, $9aL2, $a1L2, $a2L2, $a3L2, $a4L2, $a5L2, $a6L2, $a7L2, $a8L2, $a9L2, $aaL2)
      count3 = sum($11L3, $12L3, $13L3, $14L3, $15L3, $16L3, $17L3, $18L3, $19L3, $1aL3, $21L3, $22L3, $23L3, $24L3, $25L3, $26L3, $27L3, $28L3, $29L3, $2aL3, $31L3, $32L3, $33L3, $34L3, $35L3, $36L3, $37L3, $38L3, $39L3, $3aL3, $41L3, $42L3, $43L3, $44L3, $45L3, $46L3, $47L3, $48L3, $49L3, $4aL3, $51L3, $52L3, $53L3, $54L3, $55L3, $56L3, $57L3, $58L3, $59L3, $5aL3, $61L3, $62L3, $63L3, $64L3, $65L3, $66L3, $67L3, $68L3, $69L3, $6aL3, $71L3, $72L3, $73L3, $74L3, $75L3, $76L3, $77L3, $78L3, $79L3, $7aL3, $81L3, $82L3, $83L3, $84L3, $85L3, $86L3, $87L3, $88L3, $89L3, $8aL3, $91L3, $92L3, $93L3, $94L3, $95L3, $96L3, $97L3, $98L3, $99L3, $9aL3, $a1L3, $a2L3, $a3L3, $a4L3, $a5L3, $a6L3, $a7L3, $a8L3, $a9L3, $aaL3)
      count4 = sum($11L4, $12L4, $13L4, $14L4, $15L4, $16L4, $17L4, $18L4, $19L4, $1aL4, $21L4, $22L4, $23L4, $24L4, $25L4, $26L4, $27L4, $28L4, $29L4, $2aL4, $31L4, $32L4, $33L4, $34L4, $35L4, $36L4, $37L4, $38L4, $39L4, $3aL4, $41L4, $42L4, $43L4, $44L4, $45L4, $46L4, $47L4, $48L4, $49L4, $4aL4, $51L4, $52L4, $53L4, $54L4, $55L4, $56L4, $57L4, $58L4, $59L4, $5aL4, $61L4, $62L4, $63L4, $64L4, $65L4, $66L4, $67L4, $68L4, $69L4, $6aL4, $71L4, $72L4, $73L4, $74L4, $75L4, $76L4, $77L4, $78L4, $79L4, $7aL4, $81L4, $82L4, $83L4, $84L4, $85L4, $86L4, $87L4, $88L4, $89L4, $8aL4, $91L4, $92L4, $93L4, $94L4, $95L4, $96L4, $97L4, $98L4, $99L4, $9aL4, $a1L4, $a2L4, $a3L4, $a4L4, $a5L4, $a6L4, $a7L4, $a8L4, $a9L4, $aaL4)


      ### Cell: $11

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($11 ==? LEFT) |? ($11 ==? HOR_MID)) == (($21 ==? HOR_MID) |? ($21 ==? RIGHT))
      (($11 ==? HOR_MID) |? ($11 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($11 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($11 ==? LEFT) ($11 ==? HOR_MID) ($11 ==? RIGHT) ) -> all?( (0 ==? WATER) ($12 ==? WATER) )
      ($11 ==? RIGHT) -> all?( (0 ==? WATER) ($21 ==? WATER) ($22 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($11 ==? LEFT) -> some?( ($21 ==? RIGHT) ($31 ==? RIGHT) ($41 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($11 ==? TOP) |? ($11 ==? VER_MID)) == (($12 ==? VER_MID) |? ($12 ==? BOTTOM))
      (($11 ==? VER_MID) |? ($11 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($11 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($11 ==? TOP) ($11 ==? VER_MID) ($11 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($21 ==? WATER) )
      ($11 ==? BOTTOM) -> all?( (0 ==? WATER) ($12 ==? WATER) ($22 ==? WATER) )
      ($11 ==? TOP) -> some?( ($12 ==? BOTTOM) ($13 ==? BOTTOM) ($14 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($11 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($12 ==? WATER) ($22 ==? WATER) )

      # Get size so we can count them
      $11L1 = $11 ==? ONE                                                                              # ●
      $11L2 = (all?( ($11 ==? LEFT) ($21 ==? RIGHT) )) |? (all?( ($11 ==? TOP) ($12 ==? BOTTOM) ))     # ◀▶
      $11L3 = (all?( ($11 ==? LEFT) ($31 ==? RIGHT) )) |? (all?( ($11 ==? TOP) ($13 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $11L4 = (all?( ($11 ==? LEFT) ($41 ==? RIGHT) )) |? (all?( ($11 ==? TOP) ($14 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $21

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($21 ==? LEFT) |? ($21 ==? HOR_MID)) == (($31 ==? HOR_MID) |? ($31 ==? RIGHT))
      (($21 ==? HOR_MID) |? ($21 ==? RIGHT)) == ( ($11 ==? LEFT) |? ($11 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($21 ==? LEFT) -> all?( (0 ==? WATER) ($11 ==? WATER) ($12 ==? WATER) )
      some?( ($21 ==? LEFT) ($21 ==? HOR_MID) ($21 ==? RIGHT) ) -> all?( (0 ==? WATER) ($22 ==? WATER) )
      ($21 ==? RIGHT) -> all?( (0 ==? WATER) ($31 ==? WATER) ($32 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($21 ==? LEFT) -> some?( ($31 ==? RIGHT) ($41 ==? RIGHT) ($51 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($21 ==? TOP) |? ($21 ==? VER_MID)) == (($22 ==? VER_MID) |? ($22 ==? BOTTOM))
      (($21 ==? VER_MID) |? ($21 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($21 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($21 ==? TOP) ($21 ==? VER_MID) ($21 ==? BOTTOM) ) -> all?( ($11 ==? WATER) ($31 ==? WATER) )
      ($21 ==? BOTTOM) -> all?( ($12 ==? WATER) ($22 ==? WATER) ($32 ==? WATER) )
      ($21 ==? TOP) -> some?( ($22 ==? BOTTOM) ($23 ==? BOTTOM) ($24 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($21 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($11 ==? WATER) (0 ==? WATER) ($12 ==? WATER) ($22 ==? WATER) ($32 ==? WATER) )

      # Get size so we can count them
      $21L1 = $21 ==? ONE                                                                              # ●
      $21L2 = (all?( ($21 ==? LEFT) ($31 ==? RIGHT) )) |? (all?( ($21 ==? TOP) ($22 ==? BOTTOM) ))     # ◀▶
      $21L3 = (all?( ($21 ==? LEFT) ($41 ==? RIGHT) )) |? (all?( ($21 ==? TOP) ($23 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $21L4 = (all?( ($21 ==? LEFT) ($51 ==? RIGHT) )) |? (all?( ($21 ==? TOP) ($24 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $31

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($31 ==? LEFT) |? ($31 ==? HOR_MID)) == (($41 ==? HOR_MID) |? ($41 ==? RIGHT))
      (($31 ==? HOR_MID) |? ($31 ==? RIGHT)) == ( ($21 ==? LEFT) |? ($21 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($31 ==? LEFT) -> all?( (0 ==? WATER) ($21 ==? WATER) ($22 ==? WATER) )
      some?( ($31 ==? LEFT) ($31 ==? HOR_MID) ($31 ==? RIGHT) ) -> all?( (0 ==? WATER) ($32 ==? WATER) )
      ($31 ==? RIGHT) -> all?( (0 ==? WATER) ($41 ==? WATER) ($42 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($31 ==? LEFT) -> some?( ($41 ==? RIGHT) ($51 ==? RIGHT) ($61 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($31 ==? TOP) |? ($31 ==? VER_MID)) == (($32 ==? VER_MID) |? ($32 ==? BOTTOM))
      (($31 ==? VER_MID) |? ($31 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($31 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($31 ==? TOP) ($31 ==? VER_MID) ($31 ==? BOTTOM) ) -> all?( ($21 ==? WATER) ($41 ==? WATER) )
      ($31 ==? BOTTOM) -> all?( ($22 ==? WATER) ($32 ==? WATER) ($42 ==? WATER) )
      ($31 ==? TOP) -> some?( ($32 ==? BOTTOM) ($33 ==? BOTTOM) ($34 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($31 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($21 ==? WATER) (0 ==? WATER) ($22 ==? WATER) ($32 ==? WATER) ($42 ==? WATER) )

      # Get size so we can count them
      $31L1 = $31 ==? ONE                                                                              # ●
      $31L2 = (all?( ($31 ==? LEFT) ($41 ==? RIGHT) )) |? (all?( ($31 ==? TOP) ($32 ==? BOTTOM) ))     # ◀▶
      $31L3 = (all?( ($31 ==? LEFT) ($51 ==? RIGHT) )) |? (all?( ($31 ==? TOP) ($33 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $31L4 = (all?( ($31 ==? LEFT) ($61 ==? RIGHT) )) |? (all?( ($31 ==? TOP) ($34 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $41

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($41 ==? LEFT) |? ($41 ==? HOR_MID)) == (($51 ==? HOR_MID) |? ($51 ==? RIGHT))
      (($41 ==? HOR_MID) |? ($41 ==? RIGHT)) == ( ($31 ==? LEFT) |? ($31 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($41 ==? LEFT) -> all?( (0 ==? WATER) ($31 ==? WATER) ($32 ==? WATER) )
      some?( ($41 ==? LEFT) ($41 ==? HOR_MID) ($41 ==? RIGHT) ) -> all?( (0 ==? WATER) ($42 ==? WATER) )
      ($41 ==? RIGHT) -> all?( (0 ==? WATER) ($51 ==? WATER) ($52 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($41 ==? LEFT) -> some?( ($51 ==? RIGHT) ($61 ==? RIGHT) ($71 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($41 ==? TOP) |? ($41 ==? VER_MID)) == (($42 ==? VER_MID) |? ($42 ==? BOTTOM))
      (($41 ==? VER_MID) |? ($41 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($41 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($41 ==? TOP) ($41 ==? VER_MID) ($41 ==? BOTTOM) ) -> all?( ($31 ==? WATER) ($51 ==? WATER) )
      ($41 ==? BOTTOM) -> all?( ($32 ==? WATER) ($42 ==? WATER) ($52 ==? WATER) )
      ($41 ==? TOP) -> some?( ($42 ==? BOTTOM) ($43 ==? BOTTOM) ($44 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($41 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($31 ==? WATER) (0 ==? WATER) ($32 ==? WATER) ($42 ==? WATER) ($52 ==? WATER) )

      # Get size so we can count them
      $41L1 = $41 ==? ONE                                                                              # ●
      $41L2 = (all?( ($41 ==? LEFT) ($51 ==? RIGHT) )) |? (all?( ($41 ==? TOP) ($42 ==? BOTTOM) ))     # ◀▶
      $41L3 = (all?( ($41 ==? LEFT) ($61 ==? RIGHT) )) |? (all?( ($41 ==? TOP) ($43 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $41L4 = (all?( ($41 ==? LEFT) ($71 ==? RIGHT) )) |? (all?( ($41 ==? TOP) ($44 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $51

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($51 ==? LEFT) |? ($51 ==? HOR_MID)) == (($61 ==? HOR_MID) |? ($61 ==? RIGHT))
      (($51 ==? HOR_MID) |? ($51 ==? RIGHT)) == ( ($41 ==? LEFT) |? ($41 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($51 ==? LEFT) -> all?( (0 ==? WATER) ($41 ==? WATER) ($42 ==? WATER) )
      some?( ($51 ==? LEFT) ($51 ==? HOR_MID) ($51 ==? RIGHT) ) -> all?( (0 ==? WATER) ($52 ==? WATER) )
      ($51 ==? RIGHT) -> all?( (0 ==? WATER) ($61 ==? WATER) ($62 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($51 ==? LEFT) -> some?( ($61 ==? RIGHT) ($71 ==? RIGHT) ($81 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($51 ==? TOP) |? ($51 ==? VER_MID)) == (($52 ==? VER_MID) |? ($52 ==? BOTTOM))
      (($51 ==? VER_MID) |? ($51 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($51 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($51 ==? TOP) ($51 ==? VER_MID) ($51 ==? BOTTOM) ) -> all?( ($41 ==? WATER) ($61 ==? WATER) )
      ($51 ==? BOTTOM) -> all?( ($42 ==? WATER) ($52 ==? WATER) ($62 ==? WATER) )
      ($51 ==? TOP) -> some?( ($52 ==? BOTTOM) ($53 ==? BOTTOM) ($54 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($51 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($41 ==? WATER) (0 ==? WATER) ($42 ==? WATER) ($52 ==? WATER) ($62 ==? WATER) )

      # Get size so we can count them
      $51L1 = $51 ==? ONE                                                                              # ●
      $51L2 = (all?( ($51 ==? LEFT) ($61 ==? RIGHT) )) |? (all?( ($51 ==? TOP) ($52 ==? BOTTOM) ))     # ◀▶
      $51L3 = (all?( ($51 ==? LEFT) ($71 ==? RIGHT) )) |? (all?( ($51 ==? TOP) ($53 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $51L4 = (all?( ($51 ==? LEFT) ($81 ==? RIGHT) )) |? (all?( ($51 ==? TOP) ($54 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $61

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($61 ==? LEFT) |? ($61 ==? HOR_MID)) == (($71 ==? HOR_MID) |? ($71 ==? RIGHT))
      (($61 ==? HOR_MID) |? ($61 ==? RIGHT)) == ( ($51 ==? LEFT) |? ($51 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($61 ==? LEFT) -> all?( (0 ==? WATER) ($51 ==? WATER) ($52 ==? WATER) )
      some?( ($61 ==? LEFT) ($61 ==? HOR_MID) ($61 ==? RIGHT) ) -> all?( (0 ==? WATER) ($62 ==? WATER) )
      ($61 ==? RIGHT) -> all?( (0 ==? WATER) ($71 ==? WATER) ($72 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($61 ==? LEFT) -> some?( ($71 ==? RIGHT) ($81 ==? RIGHT) ($91 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($61 ==? TOP) |? ($61 ==? VER_MID)) == (($62 ==? VER_MID) |? ($62 ==? BOTTOM))
      (($61 ==? VER_MID) |? ($61 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($61 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($61 ==? TOP) ($61 ==? VER_MID) ($61 ==? BOTTOM) ) -> all?( ($51 ==? WATER) ($71 ==? WATER) )
      ($61 ==? BOTTOM) -> all?( ($52 ==? WATER) ($62 ==? WATER) ($72 ==? WATER) )
      ($61 ==? TOP) -> some?( ($62 ==? BOTTOM) ($63 ==? BOTTOM) ($64 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($61 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($51 ==? WATER) (0 ==? WATER) ($52 ==? WATER) ($62 ==? WATER) ($72 ==? WATER) )

      # Get size so we can count them
      $61L1 = $61 ==? ONE                                                                              # ●
      $61L2 = (all?( ($61 ==? LEFT) ($71 ==? RIGHT) )) |? (all?( ($61 ==? TOP) ($62 ==? BOTTOM) ))     # ◀▶
      $61L3 = (all?( ($61 ==? LEFT) ($81 ==? RIGHT) )) |? (all?( ($61 ==? TOP) ($63 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $61L4 = (all?( ($61 ==? LEFT) ($91 ==? RIGHT) )) |? (all?( ($61 ==? TOP) ($64 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $71

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($71 ==? LEFT) |? ($71 ==? HOR_MID)) == (($81 ==? HOR_MID) |? ($81 ==? RIGHT))
      (($71 ==? HOR_MID) |? ($71 ==? RIGHT)) == ( ($61 ==? LEFT) |? ($61 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($71 ==? LEFT) -> all?( (0 ==? WATER) ($61 ==? WATER) ($62 ==? WATER) )
      some?( ($71 ==? LEFT) ($71 ==? HOR_MID) ($71 ==? RIGHT) ) -> all?( (0 ==? WATER) ($72 ==? WATER) )
      ($71 ==? RIGHT) -> all?( (0 ==? WATER) ($81 ==? WATER) ($82 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($71 ==? LEFT) -> some?( ($81 ==? RIGHT) ($91 ==? RIGHT) ($a1 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($71 ==? TOP) |? ($71 ==? VER_MID)) == (($72 ==? VER_MID) |? ($72 ==? BOTTOM))
      (($71 ==? VER_MID) |? ($71 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($71 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($71 ==? TOP) ($71 ==? VER_MID) ($71 ==? BOTTOM) ) -> all?( ($61 ==? WATER) ($81 ==? WATER) )
      ($71 ==? BOTTOM) -> all?( ($62 ==? WATER) ($72 ==? WATER) ($82 ==? WATER) )
      ($71 ==? TOP) -> some?( ($72 ==? BOTTOM) ($73 ==? BOTTOM) ($74 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($71 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($61 ==? WATER) (0 ==? WATER) ($62 ==? WATER) ($72 ==? WATER) ($82 ==? WATER) )

      # Get size so we can count them
      $71L1 = $71 ==? ONE                                                                              # ●
      $71L2 = (all?( ($71 ==? LEFT) ($81 ==? RIGHT) )) |? (all?( ($71 ==? TOP) ($72 ==? BOTTOM) ))     # ◀▶
      $71L3 = (all?( ($71 ==? LEFT) ($91 ==? RIGHT) )) |? (all?( ($71 ==? TOP) ($73 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $71L4 = (all?( ($71 ==? LEFT) ($a1 ==? RIGHT) )) |? (all?( ($71 ==? TOP) ($74 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $81

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($81 ==? LEFT) |? ($81 ==? HOR_MID)) == (($91 ==? HOR_MID) |? ($91 ==? RIGHT))
      (($81 ==? HOR_MID) |? ($81 ==? RIGHT)) == ( ($71 ==? LEFT) |? ($71 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($81 ==? LEFT) -> all?( (0 ==? WATER) ($71 ==? WATER) ($72 ==? WATER) )
      some?( ($81 ==? LEFT) ($81 ==? HOR_MID) ($81 ==? RIGHT) ) -> all?( (0 ==? WATER) ($82 ==? WATER) )
      ($81 ==? RIGHT) -> all?( (0 ==? WATER) ($91 ==? WATER) ($92 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($81 ==? LEFT) -> some?( ($91 ==? RIGHT) ($a1 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($81 ==? TOP) |? ($81 ==? VER_MID)) == (($82 ==? VER_MID) |? ($82 ==? BOTTOM))
      (($81 ==? VER_MID) |? ($81 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($81 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($81 ==? TOP) ($81 ==? VER_MID) ($81 ==? BOTTOM) ) -> all?( ($71 ==? WATER) ($91 ==? WATER) )
      ($81 ==? BOTTOM) -> all?( ($72 ==? WATER) ($82 ==? WATER) ($92 ==? WATER) )
      ($81 ==? TOP) -> some?( ($82 ==? BOTTOM) ($83 ==? BOTTOM) ($84 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($81 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($71 ==? WATER) (0 ==? WATER) ($72 ==? WATER) ($82 ==? WATER) ($92 ==? WATER) )

      # Get size so we can count them
      $81L1 = $81 ==? ONE                                                                              # ●
      $81L2 = (all?( ($81 ==? LEFT) ($91 ==? RIGHT) )) |? (all?( ($81 ==? TOP) ($82 ==? BOTTOM) ))     # ◀▶
      $81L3 = (all?( ($81 ==? LEFT) ($a1 ==? RIGHT) )) |? (all?( ($81 ==? TOP) ($83 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $81L4 = (all?( ($81 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($81 ==? TOP) ($84 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $91

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($91 ==? LEFT) |? ($91 ==? HOR_MID)) == (($a1 ==? HOR_MID) |? ($a1 ==? RIGHT))
      (($91 ==? HOR_MID) |? ($91 ==? RIGHT)) == ( ($81 ==? LEFT) |? ($81 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($91 ==? LEFT) -> all?( (0 ==? WATER) ($81 ==? WATER) ($82 ==? WATER) )
      some?( ($91 ==? LEFT) ($91 ==? HOR_MID) ($91 ==? RIGHT) ) -> all?( (0 ==? WATER) ($92 ==? WATER) )
      ($91 ==? RIGHT) -> all?( (0 ==? WATER) ($a1 ==? WATER) ($a2 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($91 ==? LEFT) -> some?( ($a1 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($91 ==? TOP) |? ($91 ==? VER_MID)) == (($92 ==? VER_MID) |? ($92 ==? BOTTOM))
      (($91 ==? VER_MID) |? ($91 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($91 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($91 ==? TOP) ($91 ==? VER_MID) ($91 ==? BOTTOM) ) -> all?( ($81 ==? WATER) ($a1 ==? WATER) )
      ($91 ==? BOTTOM) -> all?( ($82 ==? WATER) ($92 ==? WATER) ($a2 ==? WATER) )
      ($91 ==? TOP) -> some?( ($92 ==? BOTTOM) ($93 ==? BOTTOM) ($94 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($91 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($81 ==? WATER) (0 ==? WATER) ($82 ==? WATER) ($92 ==? WATER) ($a2 ==? WATER) )

      # Get size so we can count them
      $91L1 = $91 ==? ONE                                                                              # ●
      $91L2 = (all?( ($91 ==? LEFT) ($a1 ==? RIGHT) )) |? (all?( ($91 ==? TOP) ($92 ==? BOTTOM) ))     # ◀▶
      $91L3 = (all?( ($91 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($91 ==? TOP) ($93 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $91L4 = (all?( ($91 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($91 ==? TOP) ($94 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a1

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a1 ==? LEFT) |? ($a1 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a1 ==? HOR_MID) |? ($a1 ==? RIGHT)) == ( ($91 ==? LEFT) |? ($91 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a1 ==? LEFT) -> all?( (0 ==? WATER) ($91 ==? WATER) ($92 ==? WATER) )
      some?( ($a1 ==? LEFT) ($a1 ==? HOR_MID) ($a1 ==? RIGHT) ) -> all?( (0 ==? WATER) ($a2 ==? WATER) )
      ($a1 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a1 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a1 ==? TOP) |? ($a1 ==? VER_MID)) == (($a2 ==? VER_MID) |? ($a2 ==? BOTTOM))
      (($a1 ==? VER_MID) |? ($a1 ==? BOTTOM)) == ( (0 ==? TOP) |? (0 ==? VER_MID) )
      ($a1 ==? TOP) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($a1 ==? TOP) ($a1 ==? VER_MID) ($a1 ==? BOTTOM) ) -> all?( ($91 ==? WATER) (0 ==? WATER) )
      ($a1 ==? BOTTOM) -> all?( ($92 ==? WATER) ($a2 ==? WATER) (0 ==? WATER) )
      ($a1 ==? TOP) -> some?( ($a2 ==? BOTTOM) ($a3 ==? BOTTOM) ($a4 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a1 ==? ONE) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) ($91 ==? WATER) (0 ==? WATER) ($92 ==? WATER) ($a2 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a1L1 = $a1 ==? ONE                                                                              # ●
      $a1L2 = (all?( ($a1 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a1 ==? TOP) ($a2 ==? BOTTOM) ))     # ◀▶
      $a1L3 = (all?( ($a1 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a1 ==? TOP) ($a3 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a1L4 = (all?( ($a1 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a1 ==? TOP) ($a4 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $12

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($12 ==? LEFT) |? ($12 ==? HOR_MID)) == (($22 ==? HOR_MID) |? ($22 ==? RIGHT))
      (($12 ==? HOR_MID) |? ($12 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($12 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($12 ==? LEFT) ($12 ==? HOR_MID) ($12 ==? RIGHT) ) -> all?( ($11 ==? WATER) ($13 ==? WATER) )
      ($12 ==? RIGHT) -> all?( ($21 ==? WATER) ($22 ==? WATER) ($23 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($12 ==? LEFT) -> some?( ($22 ==? RIGHT) ($32 ==? RIGHT) ($42 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($12 ==? TOP) |? ($12 ==? VER_MID)) == (($13 ==? VER_MID) |? ($13 ==? BOTTOM))
      (($12 ==? VER_MID) |? ($12 ==? BOTTOM)) == ( ($11 ==? TOP) |? ($11 ==? VER_MID) )
      ($12 ==? TOP) -> all?( (0 ==? WATER) ($11 ==? WATER) ($21 ==? WATER) )
      some?( ($12 ==? TOP) ($12 ==? VER_MID) ($12 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($22 ==? WATER) )
      ($12 ==? BOTTOM) -> all?( (0 ==? WATER) ($13 ==? WATER) ($23 ==? WATER) )
      ($12 ==? TOP) -> some?( ($13 ==? BOTTOM) ($14 ==? BOTTOM) ($15 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($12 ==? ONE) -> all?( (0 ==? WATER) ($11 ==? WATER) ($21 ==? WATER) (0 ==? WATER) ($21 ==? WATER) (0 ==? WATER) ($13 ==? WATER) ($23 ==? WATER) )

      # Get size so we can count them
      $12L1 = $12 ==? ONE                                                                              # ●
      $12L2 = (all?( ($12 ==? LEFT) ($22 ==? RIGHT) )) |? (all?( ($12 ==? TOP) ($13 ==? BOTTOM) ))     # ◀▶
      $12L3 = (all?( ($12 ==? LEFT) ($32 ==? RIGHT) )) |? (all?( ($12 ==? TOP) ($14 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $12L4 = (all?( ($12 ==? LEFT) ($42 ==? RIGHT) )) |? (all?( ($12 ==? TOP) ($15 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $22

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($22 ==? LEFT) |? ($22 ==? HOR_MID)) == (($32 ==? HOR_MID) |? ($32 ==? RIGHT))
      (($22 ==? HOR_MID) |? ($22 ==? RIGHT)) == ( ($12 ==? LEFT) |? ($12 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($22 ==? LEFT) -> all?( ($11 ==? WATER) ($12 ==? WATER) ($13 ==? WATER) )
      some?( ($22 ==? LEFT) ($22 ==? HOR_MID) ($22 ==? RIGHT) ) -> all?( ($21 ==? WATER) ($23 ==? WATER) )
      ($22 ==? RIGHT) -> all?( ($31 ==? WATER) ($32 ==? WATER) ($33 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($22 ==? LEFT) -> some?( ($32 ==? RIGHT) ($42 ==? RIGHT) ($52 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($22 ==? TOP) |? ($22 ==? VER_MID)) == (($23 ==? VER_MID) |? ($23 ==? BOTTOM))
      (($22 ==? VER_MID) |? ($22 ==? BOTTOM)) == ( ($21 ==? TOP) |? ($21 ==? VER_MID) )
      ($22 ==? TOP) -> all?( ($11 ==? WATER) ($21 ==? WATER) ($31 ==? WATER) )
      some?( ($22 ==? TOP) ($22 ==? VER_MID) ($22 ==? BOTTOM) ) -> all?( ($12 ==? WATER) ($32 ==? WATER) )
      ($22 ==? BOTTOM) -> all?( ($13 ==? WATER) ($23 ==? WATER) ($33 ==? WATER) )
      ($22 ==? TOP) -> some?( ($23 ==? BOTTOM) ($24 ==? BOTTOM) ($25 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($22 ==? ONE) -> all?( ($11 ==? WATER) ($21 ==? WATER) ($31 ==? WATER) ($12 ==? WATER) ($31 ==? WATER) ($13 ==? WATER) ($23 ==? WATER) ($33 ==? WATER) )

      # Get size so we can count them
      $22L1 = $22 ==? ONE                                                                              # ●
      $22L2 = (all?( ($22 ==? LEFT) ($32 ==? RIGHT) )) |? (all?( ($22 ==? TOP) ($23 ==? BOTTOM) ))     # ◀▶
      $22L3 = (all?( ($22 ==? LEFT) ($42 ==? RIGHT) )) |? (all?( ($22 ==? TOP) ($24 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $22L4 = (all?( ($22 ==? LEFT) ($52 ==? RIGHT) )) |? (all?( ($22 ==? TOP) ($25 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $32

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($32 ==? LEFT) |? ($32 ==? HOR_MID)) == (($42 ==? HOR_MID) |? ($42 ==? RIGHT))
      (($32 ==? HOR_MID) |? ($32 ==? RIGHT)) == ( ($22 ==? LEFT) |? ($22 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($32 ==? LEFT) -> all?( ($21 ==? WATER) ($22 ==? WATER) ($23 ==? WATER) )
      some?( ($32 ==? LEFT) ($32 ==? HOR_MID) ($32 ==? RIGHT) ) -> all?( ($31 ==? WATER) ($33 ==? WATER) )
      ($32 ==? RIGHT) -> all?( ($41 ==? WATER) ($42 ==? WATER) ($43 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($32 ==? LEFT) -> some?( ($42 ==? RIGHT) ($52 ==? RIGHT) ($62 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($32 ==? TOP) |? ($32 ==? VER_MID)) == (($33 ==? VER_MID) |? ($33 ==? BOTTOM))
      (($32 ==? VER_MID) |? ($32 ==? BOTTOM)) == ( ($31 ==? TOP) |? ($31 ==? VER_MID) )
      ($32 ==? TOP) -> all?( ($21 ==? WATER) ($31 ==? WATER) ($41 ==? WATER) )
      some?( ($32 ==? TOP) ($32 ==? VER_MID) ($32 ==? BOTTOM) ) -> all?( ($22 ==? WATER) ($42 ==? WATER) )
      ($32 ==? BOTTOM) -> all?( ($23 ==? WATER) ($33 ==? WATER) ($43 ==? WATER) )
      ($32 ==? TOP) -> some?( ($33 ==? BOTTOM) ($34 ==? BOTTOM) ($35 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($32 ==? ONE) -> all?( ($21 ==? WATER) ($31 ==? WATER) ($41 ==? WATER) ($22 ==? WATER) ($41 ==? WATER) ($23 ==? WATER) ($33 ==? WATER) ($43 ==? WATER) )

      # Get size so we can count them
      $32L1 = $32 ==? ONE                                                                              # ●
      $32L2 = (all?( ($32 ==? LEFT) ($42 ==? RIGHT) )) |? (all?( ($32 ==? TOP) ($33 ==? BOTTOM) ))     # ◀▶
      $32L3 = (all?( ($32 ==? LEFT) ($52 ==? RIGHT) )) |? (all?( ($32 ==? TOP) ($34 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $32L4 = (all?( ($32 ==? LEFT) ($62 ==? RIGHT) )) |? (all?( ($32 ==? TOP) ($35 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $42

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($42 ==? LEFT) |? ($42 ==? HOR_MID)) == (($52 ==? HOR_MID) |? ($52 ==? RIGHT))
      (($42 ==? HOR_MID) |? ($42 ==? RIGHT)) == ( ($32 ==? LEFT) |? ($32 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($42 ==? LEFT) -> all?( ($31 ==? WATER) ($32 ==? WATER) ($33 ==? WATER) )
      some?( ($42 ==? LEFT) ($42 ==? HOR_MID) ($42 ==? RIGHT) ) -> all?( ($41 ==? WATER) ($43 ==? WATER) )
      ($42 ==? RIGHT) -> all?( ($51 ==? WATER) ($52 ==? WATER) ($53 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($42 ==? LEFT) -> some?( ($52 ==? RIGHT) ($62 ==? RIGHT) ($72 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($42 ==? TOP) |? ($42 ==? VER_MID)) == (($43 ==? VER_MID) |? ($43 ==? BOTTOM))
      (($42 ==? VER_MID) |? ($42 ==? BOTTOM)) == ( ($41 ==? TOP) |? ($41 ==? VER_MID) )
      ($42 ==? TOP) -> all?( ($31 ==? WATER) ($41 ==? WATER) ($51 ==? WATER) )
      some?( ($42 ==? TOP) ($42 ==? VER_MID) ($42 ==? BOTTOM) ) -> all?( ($32 ==? WATER) ($52 ==? WATER) )
      ($42 ==? BOTTOM) -> all?( ($33 ==? WATER) ($43 ==? WATER) ($53 ==? WATER) )
      ($42 ==? TOP) -> some?( ($43 ==? BOTTOM) ($44 ==? BOTTOM) ($45 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($42 ==? ONE) -> all?( ($31 ==? WATER) ($41 ==? WATER) ($51 ==? WATER) ($32 ==? WATER) ($51 ==? WATER) ($33 ==? WATER) ($43 ==? WATER) ($53 ==? WATER) )

      # Get size so we can count them
      $42L1 = $42 ==? ONE                                                                              # ●
      $42L2 = (all?( ($42 ==? LEFT) ($52 ==? RIGHT) )) |? (all?( ($42 ==? TOP) ($43 ==? BOTTOM) ))     # ◀▶
      $42L3 = (all?( ($42 ==? LEFT) ($62 ==? RIGHT) )) |? (all?( ($42 ==? TOP) ($44 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $42L4 = (all?( ($42 ==? LEFT) ($72 ==? RIGHT) )) |? (all?( ($42 ==? TOP) ($45 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $52

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($52 ==? LEFT) |? ($52 ==? HOR_MID)) == (($62 ==? HOR_MID) |? ($62 ==? RIGHT))
      (($52 ==? HOR_MID) |? ($52 ==? RIGHT)) == ( ($42 ==? LEFT) |? ($42 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($52 ==? LEFT) -> all?( ($41 ==? WATER) ($42 ==? WATER) ($43 ==? WATER) )
      some?( ($52 ==? LEFT) ($52 ==? HOR_MID) ($52 ==? RIGHT) ) -> all?( ($51 ==? WATER) ($53 ==? WATER) )
      ($52 ==? RIGHT) -> all?( ($61 ==? WATER) ($62 ==? WATER) ($63 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($52 ==? LEFT) -> some?( ($62 ==? RIGHT) ($72 ==? RIGHT) ($82 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($52 ==? TOP) |? ($52 ==? VER_MID)) == (($53 ==? VER_MID) |? ($53 ==? BOTTOM))
      (($52 ==? VER_MID) |? ($52 ==? BOTTOM)) == ( ($51 ==? TOP) |? ($51 ==? VER_MID) )
      ($52 ==? TOP) -> all?( ($41 ==? WATER) ($51 ==? WATER) ($61 ==? WATER) )
      some?( ($52 ==? TOP) ($52 ==? VER_MID) ($52 ==? BOTTOM) ) -> all?( ($42 ==? WATER) ($62 ==? WATER) )
      ($52 ==? BOTTOM) -> all?( ($43 ==? WATER) ($53 ==? WATER) ($63 ==? WATER) )
      ($52 ==? TOP) -> some?( ($53 ==? BOTTOM) ($54 ==? BOTTOM) ($55 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($52 ==? ONE) -> all?( ($41 ==? WATER) ($51 ==? WATER) ($61 ==? WATER) ($42 ==? WATER) ($61 ==? WATER) ($43 ==? WATER) ($53 ==? WATER) ($63 ==? WATER) )

      # Get size so we can count them
      $52L1 = $52 ==? ONE                                                                              # ●
      $52L2 = (all?( ($52 ==? LEFT) ($62 ==? RIGHT) )) |? (all?( ($52 ==? TOP) ($53 ==? BOTTOM) ))     # ◀▶
      $52L3 = (all?( ($52 ==? LEFT) ($72 ==? RIGHT) )) |? (all?( ($52 ==? TOP) ($54 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $52L4 = (all?( ($52 ==? LEFT) ($82 ==? RIGHT) )) |? (all?( ($52 ==? TOP) ($55 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $62

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($62 ==? LEFT) |? ($62 ==? HOR_MID)) == (($72 ==? HOR_MID) |? ($72 ==? RIGHT))
      (($62 ==? HOR_MID) |? ($62 ==? RIGHT)) == ( ($52 ==? LEFT) |? ($52 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($62 ==? LEFT) -> all?( ($51 ==? WATER) ($52 ==? WATER) ($53 ==? WATER) )
      some?( ($62 ==? LEFT) ($62 ==? HOR_MID) ($62 ==? RIGHT) ) -> all?( ($61 ==? WATER) ($63 ==? WATER) )
      ($62 ==? RIGHT) -> all?( ($71 ==? WATER) ($72 ==? WATER) ($73 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($62 ==? LEFT) -> some?( ($72 ==? RIGHT) ($82 ==? RIGHT) ($92 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($62 ==? TOP) |? ($62 ==? VER_MID)) == (($63 ==? VER_MID) |? ($63 ==? BOTTOM))
      (($62 ==? VER_MID) |? ($62 ==? BOTTOM)) == ( ($61 ==? TOP) |? ($61 ==? VER_MID) )
      ($62 ==? TOP) -> all?( ($51 ==? WATER) ($61 ==? WATER) ($71 ==? WATER) )
      some?( ($62 ==? TOP) ($62 ==? VER_MID) ($62 ==? BOTTOM) ) -> all?( ($52 ==? WATER) ($72 ==? WATER) )
      ($62 ==? BOTTOM) -> all?( ($53 ==? WATER) ($63 ==? WATER) ($73 ==? WATER) )
      ($62 ==? TOP) -> some?( ($63 ==? BOTTOM) ($64 ==? BOTTOM) ($65 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($62 ==? ONE) -> all?( ($51 ==? WATER) ($61 ==? WATER) ($71 ==? WATER) ($52 ==? WATER) ($71 ==? WATER) ($53 ==? WATER) ($63 ==? WATER) ($73 ==? WATER) )

      # Get size so we can count them
      $62L1 = $62 ==? ONE                                                                              # ●
      $62L2 = (all?( ($62 ==? LEFT) ($72 ==? RIGHT) )) |? (all?( ($62 ==? TOP) ($63 ==? BOTTOM) ))     # ◀▶
      $62L3 = (all?( ($62 ==? LEFT) ($82 ==? RIGHT) )) |? (all?( ($62 ==? TOP) ($64 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $62L4 = (all?( ($62 ==? LEFT) ($92 ==? RIGHT) )) |? (all?( ($62 ==? TOP) ($65 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $72

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($72 ==? LEFT) |? ($72 ==? HOR_MID)) == (($82 ==? HOR_MID) |? ($82 ==? RIGHT))
      (($72 ==? HOR_MID) |? ($72 ==? RIGHT)) == ( ($62 ==? LEFT) |? ($62 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($72 ==? LEFT) -> all?( ($61 ==? WATER) ($62 ==? WATER) ($63 ==? WATER) )
      some?( ($72 ==? LEFT) ($72 ==? HOR_MID) ($72 ==? RIGHT) ) -> all?( ($71 ==? WATER) ($73 ==? WATER) )
      ($72 ==? RIGHT) -> all?( ($81 ==? WATER) ($82 ==? WATER) ($83 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($72 ==? LEFT) -> some?( ($82 ==? RIGHT) ($92 ==? RIGHT) ($a2 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($72 ==? TOP) |? ($72 ==? VER_MID)) == (($73 ==? VER_MID) |? ($73 ==? BOTTOM))
      (($72 ==? VER_MID) |? ($72 ==? BOTTOM)) == ( ($71 ==? TOP) |? ($71 ==? VER_MID) )
      ($72 ==? TOP) -> all?( ($61 ==? WATER) ($71 ==? WATER) ($81 ==? WATER) )
      some?( ($72 ==? TOP) ($72 ==? VER_MID) ($72 ==? BOTTOM) ) -> all?( ($62 ==? WATER) ($82 ==? WATER) )
      ($72 ==? BOTTOM) -> all?( ($63 ==? WATER) ($73 ==? WATER) ($83 ==? WATER) )
      ($72 ==? TOP) -> some?( ($73 ==? BOTTOM) ($74 ==? BOTTOM) ($75 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($72 ==? ONE) -> all?( ($61 ==? WATER) ($71 ==? WATER) ($81 ==? WATER) ($62 ==? WATER) ($81 ==? WATER) ($63 ==? WATER) ($73 ==? WATER) ($83 ==? WATER) )

      # Get size so we can count them
      $72L1 = $72 ==? ONE                                                                              # ●
      $72L2 = (all?( ($72 ==? LEFT) ($82 ==? RIGHT) )) |? (all?( ($72 ==? TOP) ($73 ==? BOTTOM) ))     # ◀▶
      $72L3 = (all?( ($72 ==? LEFT) ($92 ==? RIGHT) )) |? (all?( ($72 ==? TOP) ($74 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $72L4 = (all?( ($72 ==? LEFT) ($a2 ==? RIGHT) )) |? (all?( ($72 ==? TOP) ($75 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $82

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($82 ==? LEFT) |? ($82 ==? HOR_MID)) == (($92 ==? HOR_MID) |? ($92 ==? RIGHT))
      (($82 ==? HOR_MID) |? ($82 ==? RIGHT)) == ( ($72 ==? LEFT) |? ($72 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($82 ==? LEFT) -> all?( ($71 ==? WATER) ($72 ==? WATER) ($73 ==? WATER) )
      some?( ($82 ==? LEFT) ($82 ==? HOR_MID) ($82 ==? RIGHT) ) -> all?( ($81 ==? WATER) ($83 ==? WATER) )
      ($82 ==? RIGHT) -> all?( ($91 ==? WATER) ($92 ==? WATER) ($93 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($82 ==? LEFT) -> some?( ($92 ==? RIGHT) ($a2 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($82 ==? TOP) |? ($82 ==? VER_MID)) == (($83 ==? VER_MID) |? ($83 ==? BOTTOM))
      (($82 ==? VER_MID) |? ($82 ==? BOTTOM)) == ( ($81 ==? TOP) |? ($81 ==? VER_MID) )
      ($82 ==? TOP) -> all?( ($71 ==? WATER) ($81 ==? WATER) ($91 ==? WATER) )
      some?( ($82 ==? TOP) ($82 ==? VER_MID) ($82 ==? BOTTOM) ) -> all?( ($72 ==? WATER) ($92 ==? WATER) )
      ($82 ==? BOTTOM) -> all?( ($73 ==? WATER) ($83 ==? WATER) ($93 ==? WATER) )
      ($82 ==? TOP) -> some?( ($83 ==? BOTTOM) ($84 ==? BOTTOM) ($85 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($82 ==? ONE) -> all?( ($71 ==? WATER) ($81 ==? WATER) ($91 ==? WATER) ($72 ==? WATER) ($91 ==? WATER) ($73 ==? WATER) ($83 ==? WATER) ($93 ==? WATER) )

      # Get size so we can count them
      $82L1 = $82 ==? ONE                                                                              # ●
      $82L2 = (all?( ($82 ==? LEFT) ($92 ==? RIGHT) )) |? (all?( ($82 ==? TOP) ($83 ==? BOTTOM) ))     # ◀▶
      $82L3 = (all?( ($82 ==? LEFT) ($a2 ==? RIGHT) )) |? (all?( ($82 ==? TOP) ($84 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $82L4 = (all?( ($82 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($82 ==? TOP) ($85 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $92

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($92 ==? LEFT) |? ($92 ==? HOR_MID)) == (($a2 ==? HOR_MID) |? ($a2 ==? RIGHT))
      (($92 ==? HOR_MID) |? ($92 ==? RIGHT)) == ( ($82 ==? LEFT) |? ($82 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($92 ==? LEFT) -> all?( ($81 ==? WATER) ($82 ==? WATER) ($83 ==? WATER) )
      some?( ($92 ==? LEFT) ($92 ==? HOR_MID) ($92 ==? RIGHT) ) -> all?( ($91 ==? WATER) ($93 ==? WATER) )
      ($92 ==? RIGHT) -> all?( ($a1 ==? WATER) ($a2 ==? WATER) ($a3 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($92 ==? LEFT) -> some?( ($a2 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($92 ==? TOP) |? ($92 ==? VER_MID)) == (($93 ==? VER_MID) |? ($93 ==? BOTTOM))
      (($92 ==? VER_MID) |? ($92 ==? BOTTOM)) == ( ($91 ==? TOP) |? ($91 ==? VER_MID) )
      ($92 ==? TOP) -> all?( ($81 ==? WATER) ($91 ==? WATER) ($a1 ==? WATER) )
      some?( ($92 ==? TOP) ($92 ==? VER_MID) ($92 ==? BOTTOM) ) -> all?( ($82 ==? WATER) ($a2 ==? WATER) )
      ($92 ==? BOTTOM) -> all?( ($83 ==? WATER) ($93 ==? WATER) ($a3 ==? WATER) )
      ($92 ==? TOP) -> some?( ($93 ==? BOTTOM) ($94 ==? BOTTOM) ($95 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($92 ==? ONE) -> all?( ($81 ==? WATER) ($91 ==? WATER) ($a1 ==? WATER) ($82 ==? WATER) ($a1 ==? WATER) ($83 ==? WATER) ($93 ==? WATER) ($a3 ==? WATER) )

      # Get size so we can count them
      $92L1 = $92 ==? ONE                                                                              # ●
      $92L2 = (all?( ($92 ==? LEFT) ($a2 ==? RIGHT) )) |? (all?( ($92 ==? TOP) ($93 ==? BOTTOM) ))     # ◀▶
      $92L3 = (all?( ($92 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($92 ==? TOP) ($94 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $92L4 = (all?( ($92 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($92 ==? TOP) ($95 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a2

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a2 ==? LEFT) |? ($a2 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a2 ==? HOR_MID) |? ($a2 ==? RIGHT)) == ( ($92 ==? LEFT) |? ($92 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a2 ==? LEFT) -> all?( ($91 ==? WATER) ($92 ==? WATER) ($93 ==? WATER) )
      some?( ($a2 ==? LEFT) ($a2 ==? HOR_MID) ($a2 ==? RIGHT) ) -> all?( ($a1 ==? WATER) ($a3 ==? WATER) )
      ($a2 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a2 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a2 ==? TOP) |? ($a2 ==? VER_MID)) == (($a3 ==? VER_MID) |? ($a3 ==? BOTTOM))
      (($a2 ==? VER_MID) |? ($a2 ==? BOTTOM)) == ( ($a1 ==? TOP) |? ($a1 ==? VER_MID) )
      ($a2 ==? TOP) -> all?( ($91 ==? WATER) ($a1 ==? WATER) (0 ==? WATER) )
      some?( ($a2 ==? TOP) ($a2 ==? VER_MID) ($a2 ==? BOTTOM) ) -> all?( ($92 ==? WATER) (0 ==? WATER) )
      ($a2 ==? BOTTOM) -> all?( ($93 ==? WATER) ($a3 ==? WATER) (0 ==? WATER) )
      ($a2 ==? TOP) -> some?( ($a3 ==? BOTTOM) ($a4 ==? BOTTOM) ($a5 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a2 ==? ONE) -> all?( ($91 ==? WATER) ($a1 ==? WATER) (0 ==? WATER) ($92 ==? WATER) (0 ==? WATER) ($93 ==? WATER) ($a3 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a2L1 = $a2 ==? ONE                                                                              # ●
      $a2L2 = (all?( ($a2 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a2 ==? TOP) ($a3 ==? BOTTOM) ))     # ◀▶
      $a2L3 = (all?( ($a2 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a2 ==? TOP) ($a4 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a2L4 = (all?( ($a2 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a2 ==? TOP) ($a5 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $13

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($13 ==? LEFT) |? ($13 ==? HOR_MID)) == (($23 ==? HOR_MID) |? ($23 ==? RIGHT))
      (($13 ==? HOR_MID) |? ($13 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($13 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($13 ==? LEFT) ($13 ==? HOR_MID) ($13 ==? RIGHT) ) -> all?( ($12 ==? WATER) ($14 ==? WATER) )
      ($13 ==? RIGHT) -> all?( ($22 ==? WATER) ($23 ==? WATER) ($24 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($13 ==? LEFT) -> some?( ($23 ==? RIGHT) ($33 ==? RIGHT) ($43 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($13 ==? TOP) |? ($13 ==? VER_MID)) == (($14 ==? VER_MID) |? ($14 ==? BOTTOM))
      (($13 ==? VER_MID) |? ($13 ==? BOTTOM)) == ( ($12 ==? TOP) |? ($12 ==? VER_MID) )
      ($13 ==? TOP) -> all?( (0 ==? WATER) ($12 ==? WATER) ($22 ==? WATER) )
      some?( ($13 ==? TOP) ($13 ==? VER_MID) ($13 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($23 ==? WATER) )
      ($13 ==? BOTTOM) -> all?( (0 ==? WATER) ($14 ==? WATER) ($24 ==? WATER) )
      ($13 ==? TOP) -> some?( ($14 ==? BOTTOM) ($15 ==? BOTTOM) ($16 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($13 ==? ONE) -> all?( (0 ==? WATER) ($12 ==? WATER) ($22 ==? WATER) (0 ==? WATER) ($22 ==? WATER) (0 ==? WATER) ($14 ==? WATER) ($24 ==? WATER) )

      # Get size so we can count them
      $13L1 = $13 ==? ONE                                                                              # ●
      $13L2 = (all?( ($13 ==? LEFT) ($23 ==? RIGHT) )) |? (all?( ($13 ==? TOP) ($14 ==? BOTTOM) ))     # ◀▶
      $13L3 = (all?( ($13 ==? LEFT) ($33 ==? RIGHT) )) |? (all?( ($13 ==? TOP) ($15 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $13L4 = (all?( ($13 ==? LEFT) ($43 ==? RIGHT) )) |? (all?( ($13 ==? TOP) ($16 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $23

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($23 ==? LEFT) |? ($23 ==? HOR_MID)) == (($33 ==? HOR_MID) |? ($33 ==? RIGHT))
      (($23 ==? HOR_MID) |? ($23 ==? RIGHT)) == ( ($13 ==? LEFT) |? ($13 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($23 ==? LEFT) -> all?( ($12 ==? WATER) ($13 ==? WATER) ($14 ==? WATER) )
      some?( ($23 ==? LEFT) ($23 ==? HOR_MID) ($23 ==? RIGHT) ) -> all?( ($22 ==? WATER) ($24 ==? WATER) )
      ($23 ==? RIGHT) -> all?( ($32 ==? WATER) ($33 ==? WATER) ($34 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($23 ==? LEFT) -> some?( ($33 ==? RIGHT) ($43 ==? RIGHT) ($53 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($23 ==? TOP) |? ($23 ==? VER_MID)) == (($24 ==? VER_MID) |? ($24 ==? BOTTOM))
      (($23 ==? VER_MID) |? ($23 ==? BOTTOM)) == ( ($22 ==? TOP) |? ($22 ==? VER_MID) )
      ($23 ==? TOP) -> all?( ($12 ==? WATER) ($22 ==? WATER) ($32 ==? WATER) )
      some?( ($23 ==? TOP) ($23 ==? VER_MID) ($23 ==? BOTTOM) ) -> all?( ($13 ==? WATER) ($33 ==? WATER) )
      ($23 ==? BOTTOM) -> all?( ($14 ==? WATER) ($24 ==? WATER) ($34 ==? WATER) )
      ($23 ==? TOP) -> some?( ($24 ==? BOTTOM) ($25 ==? BOTTOM) ($26 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($23 ==? ONE) -> all?( ($12 ==? WATER) ($22 ==? WATER) ($32 ==? WATER) ($13 ==? WATER) ($32 ==? WATER) ($14 ==? WATER) ($24 ==? WATER) ($34 ==? WATER) )

      # Get size so we can count them
      $23L1 = $23 ==? ONE                                                                              # ●
      $23L2 = (all?( ($23 ==? LEFT) ($33 ==? RIGHT) )) |? (all?( ($23 ==? TOP) ($24 ==? BOTTOM) ))     # ◀▶
      $23L3 = (all?( ($23 ==? LEFT) ($43 ==? RIGHT) )) |? (all?( ($23 ==? TOP) ($25 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $23L4 = (all?( ($23 ==? LEFT) ($53 ==? RIGHT) )) |? (all?( ($23 ==? TOP) ($26 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $33

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($33 ==? LEFT) |? ($33 ==? HOR_MID)) == (($43 ==? HOR_MID) |? ($43 ==? RIGHT))
      (($33 ==? HOR_MID) |? ($33 ==? RIGHT)) == ( ($23 ==? LEFT) |? ($23 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($33 ==? LEFT) -> all?( ($22 ==? WATER) ($23 ==? WATER) ($24 ==? WATER) )
      some?( ($33 ==? LEFT) ($33 ==? HOR_MID) ($33 ==? RIGHT) ) -> all?( ($32 ==? WATER) ($34 ==? WATER) )
      ($33 ==? RIGHT) -> all?( ($42 ==? WATER) ($43 ==? WATER) ($44 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($33 ==? LEFT) -> some?( ($43 ==? RIGHT) ($53 ==? RIGHT) ($63 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($33 ==? TOP) |? ($33 ==? VER_MID)) == (($34 ==? VER_MID) |? ($34 ==? BOTTOM))
      (($33 ==? VER_MID) |? ($33 ==? BOTTOM)) == ( ($32 ==? TOP) |? ($32 ==? VER_MID) )
      ($33 ==? TOP) -> all?( ($22 ==? WATER) ($32 ==? WATER) ($42 ==? WATER) )
      some?( ($33 ==? TOP) ($33 ==? VER_MID) ($33 ==? BOTTOM) ) -> all?( ($23 ==? WATER) ($43 ==? WATER) )
      ($33 ==? BOTTOM) -> all?( ($24 ==? WATER) ($34 ==? WATER) ($44 ==? WATER) )
      ($33 ==? TOP) -> some?( ($34 ==? BOTTOM) ($35 ==? BOTTOM) ($36 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($33 ==? ONE) -> all?( ($22 ==? WATER) ($32 ==? WATER) ($42 ==? WATER) ($23 ==? WATER) ($42 ==? WATER) ($24 ==? WATER) ($34 ==? WATER) ($44 ==? WATER) )

      # Get size so we can count them
      $33L1 = $33 ==? ONE                                                                              # ●
      $33L2 = (all?( ($33 ==? LEFT) ($43 ==? RIGHT) )) |? (all?( ($33 ==? TOP) ($34 ==? BOTTOM) ))     # ◀▶
      $33L3 = (all?( ($33 ==? LEFT) ($53 ==? RIGHT) )) |? (all?( ($33 ==? TOP) ($35 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $33L4 = (all?( ($33 ==? LEFT) ($63 ==? RIGHT) )) |? (all?( ($33 ==? TOP) ($36 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $43

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($43 ==? LEFT) |? ($43 ==? HOR_MID)) == (($53 ==? HOR_MID) |? ($53 ==? RIGHT))
      (($43 ==? HOR_MID) |? ($43 ==? RIGHT)) == ( ($33 ==? LEFT) |? ($33 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($43 ==? LEFT) -> all?( ($32 ==? WATER) ($33 ==? WATER) ($34 ==? WATER) )
      some?( ($43 ==? LEFT) ($43 ==? HOR_MID) ($43 ==? RIGHT) ) -> all?( ($42 ==? WATER) ($44 ==? WATER) )
      ($43 ==? RIGHT) -> all?( ($52 ==? WATER) ($53 ==? WATER) ($54 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($43 ==? LEFT) -> some?( ($53 ==? RIGHT) ($63 ==? RIGHT) ($73 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($43 ==? TOP) |? ($43 ==? VER_MID)) == (($44 ==? VER_MID) |? ($44 ==? BOTTOM))
      (($43 ==? VER_MID) |? ($43 ==? BOTTOM)) == ( ($42 ==? TOP) |? ($42 ==? VER_MID) )
      ($43 ==? TOP) -> all?( ($32 ==? WATER) ($42 ==? WATER) ($52 ==? WATER) )
      some?( ($43 ==? TOP) ($43 ==? VER_MID) ($43 ==? BOTTOM) ) -> all?( ($33 ==? WATER) ($53 ==? WATER) )
      ($43 ==? BOTTOM) -> all?( ($34 ==? WATER) ($44 ==? WATER) ($54 ==? WATER) )
      ($43 ==? TOP) -> some?( ($44 ==? BOTTOM) ($45 ==? BOTTOM) ($46 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($43 ==? ONE) -> all?( ($32 ==? WATER) ($42 ==? WATER) ($52 ==? WATER) ($33 ==? WATER) ($52 ==? WATER) ($34 ==? WATER) ($44 ==? WATER) ($54 ==? WATER) )

      # Get size so we can count them
      $43L1 = $43 ==? ONE                                                                              # ●
      $43L2 = (all?( ($43 ==? LEFT) ($53 ==? RIGHT) )) |? (all?( ($43 ==? TOP) ($44 ==? BOTTOM) ))     # ◀▶
      $43L3 = (all?( ($43 ==? LEFT) ($63 ==? RIGHT) )) |? (all?( ($43 ==? TOP) ($45 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $43L4 = (all?( ($43 ==? LEFT) ($73 ==? RIGHT) )) |? (all?( ($43 ==? TOP) ($46 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $53

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($53 ==? LEFT) |? ($53 ==? HOR_MID)) == (($63 ==? HOR_MID) |? ($63 ==? RIGHT))
      (($53 ==? HOR_MID) |? ($53 ==? RIGHT)) == ( ($43 ==? LEFT) |? ($43 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($53 ==? LEFT) -> all?( ($42 ==? WATER) ($43 ==? WATER) ($44 ==? WATER) )
      some?( ($53 ==? LEFT) ($53 ==? HOR_MID) ($53 ==? RIGHT) ) -> all?( ($52 ==? WATER) ($54 ==? WATER) )
      ($53 ==? RIGHT) -> all?( ($62 ==? WATER) ($63 ==? WATER) ($64 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($53 ==? LEFT) -> some?( ($63 ==? RIGHT) ($73 ==? RIGHT) ($83 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($53 ==? TOP) |? ($53 ==? VER_MID)) == (($54 ==? VER_MID) |? ($54 ==? BOTTOM))
      (($53 ==? VER_MID) |? ($53 ==? BOTTOM)) == ( ($52 ==? TOP) |? ($52 ==? VER_MID) )
      ($53 ==? TOP) -> all?( ($42 ==? WATER) ($52 ==? WATER) ($62 ==? WATER) )
      some?( ($53 ==? TOP) ($53 ==? VER_MID) ($53 ==? BOTTOM) ) -> all?( ($43 ==? WATER) ($63 ==? WATER) )
      ($53 ==? BOTTOM) -> all?( ($44 ==? WATER) ($54 ==? WATER) ($64 ==? WATER) )
      ($53 ==? TOP) -> some?( ($54 ==? BOTTOM) ($55 ==? BOTTOM) ($56 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($53 ==? ONE) -> all?( ($42 ==? WATER) ($52 ==? WATER) ($62 ==? WATER) ($43 ==? WATER) ($62 ==? WATER) ($44 ==? WATER) ($54 ==? WATER) ($64 ==? WATER) )

      # Get size so we can count them
      $53L1 = $53 ==? ONE                                                                              # ●
      $53L2 = (all?( ($53 ==? LEFT) ($63 ==? RIGHT) )) |? (all?( ($53 ==? TOP) ($54 ==? BOTTOM) ))     # ◀▶
      $53L3 = (all?( ($53 ==? LEFT) ($73 ==? RIGHT) )) |? (all?( ($53 ==? TOP) ($55 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $53L4 = (all?( ($53 ==? LEFT) ($83 ==? RIGHT) )) |? (all?( ($53 ==? TOP) ($56 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $63

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($63 ==? LEFT) |? ($63 ==? HOR_MID)) == (($73 ==? HOR_MID) |? ($73 ==? RIGHT))
      (($63 ==? HOR_MID) |? ($63 ==? RIGHT)) == ( ($53 ==? LEFT) |? ($53 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($63 ==? LEFT) -> all?( ($52 ==? WATER) ($53 ==? WATER) ($54 ==? WATER) )
      some?( ($63 ==? LEFT) ($63 ==? HOR_MID) ($63 ==? RIGHT) ) -> all?( ($62 ==? WATER) ($64 ==? WATER) )
      ($63 ==? RIGHT) -> all?( ($72 ==? WATER) ($73 ==? WATER) ($74 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($63 ==? LEFT) -> some?( ($73 ==? RIGHT) ($83 ==? RIGHT) ($93 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($63 ==? TOP) |? ($63 ==? VER_MID)) == (($64 ==? VER_MID) |? ($64 ==? BOTTOM))
      (($63 ==? VER_MID) |? ($63 ==? BOTTOM)) == ( ($62 ==? TOP) |? ($62 ==? VER_MID) )
      ($63 ==? TOP) -> all?( ($52 ==? WATER) ($62 ==? WATER) ($72 ==? WATER) )
      some?( ($63 ==? TOP) ($63 ==? VER_MID) ($63 ==? BOTTOM) ) -> all?( ($53 ==? WATER) ($73 ==? WATER) )
      ($63 ==? BOTTOM) -> all?( ($54 ==? WATER) ($64 ==? WATER) ($74 ==? WATER) )
      ($63 ==? TOP) -> some?( ($64 ==? BOTTOM) ($65 ==? BOTTOM) ($66 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($63 ==? ONE) -> all?( ($52 ==? WATER) ($62 ==? WATER) ($72 ==? WATER) ($53 ==? WATER) ($72 ==? WATER) ($54 ==? WATER) ($64 ==? WATER) ($74 ==? WATER) )

      # Get size so we can count them
      $63L1 = $63 ==? ONE                                                                              # ●
      $63L2 = (all?( ($63 ==? LEFT) ($73 ==? RIGHT) )) |? (all?( ($63 ==? TOP) ($64 ==? BOTTOM) ))     # ◀▶
      $63L3 = (all?( ($63 ==? LEFT) ($83 ==? RIGHT) )) |? (all?( ($63 ==? TOP) ($65 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $63L4 = (all?( ($63 ==? LEFT) ($93 ==? RIGHT) )) |? (all?( ($63 ==? TOP) ($66 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $73

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($73 ==? LEFT) |? ($73 ==? HOR_MID)) == (($83 ==? HOR_MID) |? ($83 ==? RIGHT))
      (($73 ==? HOR_MID) |? ($73 ==? RIGHT)) == ( ($63 ==? LEFT) |? ($63 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($73 ==? LEFT) -> all?( ($62 ==? WATER) ($63 ==? WATER) ($64 ==? WATER) )
      some?( ($73 ==? LEFT) ($73 ==? HOR_MID) ($73 ==? RIGHT) ) -> all?( ($72 ==? WATER) ($74 ==? WATER) )
      ($73 ==? RIGHT) -> all?( ($82 ==? WATER) ($83 ==? WATER) ($84 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($73 ==? LEFT) -> some?( ($83 ==? RIGHT) ($93 ==? RIGHT) ($a3 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($73 ==? TOP) |? ($73 ==? VER_MID)) == (($74 ==? VER_MID) |? ($74 ==? BOTTOM))
      (($73 ==? VER_MID) |? ($73 ==? BOTTOM)) == ( ($72 ==? TOP) |? ($72 ==? VER_MID) )
      ($73 ==? TOP) -> all?( ($62 ==? WATER) ($72 ==? WATER) ($82 ==? WATER) )
      some?( ($73 ==? TOP) ($73 ==? VER_MID) ($73 ==? BOTTOM) ) -> all?( ($63 ==? WATER) ($83 ==? WATER) )
      ($73 ==? BOTTOM) -> all?( ($64 ==? WATER) ($74 ==? WATER) ($84 ==? WATER) )
      ($73 ==? TOP) -> some?( ($74 ==? BOTTOM) ($75 ==? BOTTOM) ($76 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($73 ==? ONE) -> all?( ($62 ==? WATER) ($72 ==? WATER) ($82 ==? WATER) ($63 ==? WATER) ($82 ==? WATER) ($64 ==? WATER) ($74 ==? WATER) ($84 ==? WATER) )

      # Get size so we can count them
      $73L1 = $73 ==? ONE                                                                              # ●
      $73L2 = (all?( ($73 ==? LEFT) ($83 ==? RIGHT) )) |? (all?( ($73 ==? TOP) ($74 ==? BOTTOM) ))     # ◀▶
      $73L3 = (all?( ($73 ==? LEFT) ($93 ==? RIGHT) )) |? (all?( ($73 ==? TOP) ($75 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $73L4 = (all?( ($73 ==? LEFT) ($a3 ==? RIGHT) )) |? (all?( ($73 ==? TOP) ($76 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $83

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($83 ==? LEFT) |? ($83 ==? HOR_MID)) == (($93 ==? HOR_MID) |? ($93 ==? RIGHT))
      (($83 ==? HOR_MID) |? ($83 ==? RIGHT)) == ( ($73 ==? LEFT) |? ($73 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($83 ==? LEFT) -> all?( ($72 ==? WATER) ($73 ==? WATER) ($74 ==? WATER) )
      some?( ($83 ==? LEFT) ($83 ==? HOR_MID) ($83 ==? RIGHT) ) -> all?( ($82 ==? WATER) ($84 ==? WATER) )
      ($83 ==? RIGHT) -> all?( ($92 ==? WATER) ($93 ==? WATER) ($94 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($83 ==? LEFT) -> some?( ($93 ==? RIGHT) ($a3 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($83 ==? TOP) |? ($83 ==? VER_MID)) == (($84 ==? VER_MID) |? ($84 ==? BOTTOM))
      (($83 ==? VER_MID) |? ($83 ==? BOTTOM)) == ( ($82 ==? TOP) |? ($82 ==? VER_MID) )
      ($83 ==? TOP) -> all?( ($72 ==? WATER) ($82 ==? WATER) ($92 ==? WATER) )
      some?( ($83 ==? TOP) ($83 ==? VER_MID) ($83 ==? BOTTOM) ) -> all?( ($73 ==? WATER) ($93 ==? WATER) )
      ($83 ==? BOTTOM) -> all?( ($74 ==? WATER) ($84 ==? WATER) ($94 ==? WATER) )
      ($83 ==? TOP) -> some?( ($84 ==? BOTTOM) ($85 ==? BOTTOM) ($86 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($83 ==? ONE) -> all?( ($72 ==? WATER) ($82 ==? WATER) ($92 ==? WATER) ($73 ==? WATER) ($92 ==? WATER) ($74 ==? WATER) ($84 ==? WATER) ($94 ==? WATER) )

      # Get size so we can count them
      $83L1 = $83 ==? ONE                                                                              # ●
      $83L2 = (all?( ($83 ==? LEFT) ($93 ==? RIGHT) )) |? (all?( ($83 ==? TOP) ($84 ==? BOTTOM) ))     # ◀▶
      $83L3 = (all?( ($83 ==? LEFT) ($a3 ==? RIGHT) )) |? (all?( ($83 ==? TOP) ($85 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $83L4 = (all?( ($83 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($83 ==? TOP) ($86 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $93

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($93 ==? LEFT) |? ($93 ==? HOR_MID)) == (($a3 ==? HOR_MID) |? ($a3 ==? RIGHT))
      (($93 ==? HOR_MID) |? ($93 ==? RIGHT)) == ( ($83 ==? LEFT) |? ($83 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($93 ==? LEFT) -> all?( ($82 ==? WATER) ($83 ==? WATER) ($84 ==? WATER) )
      some?( ($93 ==? LEFT) ($93 ==? HOR_MID) ($93 ==? RIGHT) ) -> all?( ($92 ==? WATER) ($94 ==? WATER) )
      ($93 ==? RIGHT) -> all?( ($a2 ==? WATER) ($a3 ==? WATER) ($a4 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($93 ==? LEFT) -> some?( ($a3 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($93 ==? TOP) |? ($93 ==? VER_MID)) == (($94 ==? VER_MID) |? ($94 ==? BOTTOM))
      (($93 ==? VER_MID) |? ($93 ==? BOTTOM)) == ( ($92 ==? TOP) |? ($92 ==? VER_MID) )
      ($93 ==? TOP) -> all?( ($82 ==? WATER) ($92 ==? WATER) ($a2 ==? WATER) )
      some?( ($93 ==? TOP) ($93 ==? VER_MID) ($93 ==? BOTTOM) ) -> all?( ($83 ==? WATER) ($a3 ==? WATER) )
      ($93 ==? BOTTOM) -> all?( ($84 ==? WATER) ($94 ==? WATER) ($a4 ==? WATER) )
      ($93 ==? TOP) -> some?( ($94 ==? BOTTOM) ($95 ==? BOTTOM) ($96 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($93 ==? ONE) -> all?( ($82 ==? WATER) ($92 ==? WATER) ($a2 ==? WATER) ($83 ==? WATER) ($a2 ==? WATER) ($84 ==? WATER) ($94 ==? WATER) ($a4 ==? WATER) )

      # Get size so we can count them
      $93L1 = $93 ==? ONE                                                                              # ●
      $93L2 = (all?( ($93 ==? LEFT) ($a3 ==? RIGHT) )) |? (all?( ($93 ==? TOP) ($94 ==? BOTTOM) ))     # ◀▶
      $93L3 = (all?( ($93 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($93 ==? TOP) ($95 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $93L4 = (all?( ($93 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($93 ==? TOP) ($96 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a3

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a3 ==? LEFT) |? ($a3 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a3 ==? HOR_MID) |? ($a3 ==? RIGHT)) == ( ($93 ==? LEFT) |? ($93 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a3 ==? LEFT) -> all?( ($92 ==? WATER) ($93 ==? WATER) ($94 ==? WATER) )
      some?( ($a3 ==? LEFT) ($a3 ==? HOR_MID) ($a3 ==? RIGHT) ) -> all?( ($a2 ==? WATER) ($a4 ==? WATER) )
      ($a3 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a3 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a3 ==? TOP) |? ($a3 ==? VER_MID)) == (($a4 ==? VER_MID) |? ($a4 ==? BOTTOM))
      (($a3 ==? VER_MID) |? ($a3 ==? BOTTOM)) == ( ($a2 ==? TOP) |? ($a2 ==? VER_MID) )
      ($a3 ==? TOP) -> all?( ($92 ==? WATER) ($a2 ==? WATER) (0 ==? WATER) )
      some?( ($a3 ==? TOP) ($a3 ==? VER_MID) ($a3 ==? BOTTOM) ) -> all?( ($93 ==? WATER) (0 ==? WATER) )
      ($a3 ==? BOTTOM) -> all?( ($94 ==? WATER) ($a4 ==? WATER) (0 ==? WATER) )
      ($a3 ==? TOP) -> some?( ($a4 ==? BOTTOM) ($a5 ==? BOTTOM) ($a6 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a3 ==? ONE) -> all?( ($92 ==? WATER) ($a2 ==? WATER) (0 ==? WATER) ($93 ==? WATER) (0 ==? WATER) ($94 ==? WATER) ($a4 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a3L1 = $a3 ==? ONE                                                                              # ●
      $a3L2 = (all?( ($a3 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a3 ==? TOP) ($a4 ==? BOTTOM) ))     # ◀▶
      $a3L3 = (all?( ($a3 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a3 ==? TOP) ($a5 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a3L4 = (all?( ($a3 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a3 ==? TOP) ($a6 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $14

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($14 ==? LEFT) |? ($14 ==? HOR_MID)) == (($24 ==? HOR_MID) |? ($24 ==? RIGHT))
      (($14 ==? HOR_MID) |? ($14 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($14 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($14 ==? LEFT) ($14 ==? HOR_MID) ($14 ==? RIGHT) ) -> all?( ($13 ==? WATER) ($15 ==? WATER) )
      ($14 ==? RIGHT) -> all?( ($23 ==? WATER) ($24 ==? WATER) ($25 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($14 ==? LEFT) -> some?( ($24 ==? RIGHT) ($34 ==? RIGHT) ($44 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($14 ==? TOP) |? ($14 ==? VER_MID)) == (($15 ==? VER_MID) |? ($15 ==? BOTTOM))
      (($14 ==? VER_MID) |? ($14 ==? BOTTOM)) == ( ($13 ==? TOP) |? ($13 ==? VER_MID) )
      ($14 ==? TOP) -> all?( (0 ==? WATER) ($13 ==? WATER) ($23 ==? WATER) )
      some?( ($14 ==? TOP) ($14 ==? VER_MID) ($14 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($24 ==? WATER) )
      ($14 ==? BOTTOM) -> all?( (0 ==? WATER) ($15 ==? WATER) ($25 ==? WATER) )
      ($14 ==? TOP) -> some?( ($15 ==? BOTTOM) ($16 ==? BOTTOM) ($17 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($14 ==? ONE) -> all?( (0 ==? WATER) ($13 ==? WATER) ($23 ==? WATER) (0 ==? WATER) ($23 ==? WATER) (0 ==? WATER) ($15 ==? WATER) ($25 ==? WATER) )

      # Get size so we can count them
      $14L1 = $14 ==? ONE                                                                              # ●
      $14L2 = (all?( ($14 ==? LEFT) ($24 ==? RIGHT) )) |? (all?( ($14 ==? TOP) ($15 ==? BOTTOM) ))     # ◀▶
      $14L3 = (all?( ($14 ==? LEFT) ($34 ==? RIGHT) )) |? (all?( ($14 ==? TOP) ($16 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $14L4 = (all?( ($14 ==? LEFT) ($44 ==? RIGHT) )) |? (all?( ($14 ==? TOP) ($17 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $24

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($24 ==? LEFT) |? ($24 ==? HOR_MID)) == (($34 ==? HOR_MID) |? ($34 ==? RIGHT))
      (($24 ==? HOR_MID) |? ($24 ==? RIGHT)) == ( ($14 ==? LEFT) |? ($14 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($24 ==? LEFT) -> all?( ($13 ==? WATER) ($14 ==? WATER) ($15 ==? WATER) )
      some?( ($24 ==? LEFT) ($24 ==? HOR_MID) ($24 ==? RIGHT) ) -> all?( ($23 ==? WATER) ($25 ==? WATER) )
      ($24 ==? RIGHT) -> all?( ($33 ==? WATER) ($34 ==? WATER) ($35 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($24 ==? LEFT) -> some?( ($34 ==? RIGHT) ($44 ==? RIGHT) ($54 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($24 ==? TOP) |? ($24 ==? VER_MID)) == (($25 ==? VER_MID) |? ($25 ==? BOTTOM))
      (($24 ==? VER_MID) |? ($24 ==? BOTTOM)) == ( ($23 ==? TOP) |? ($23 ==? VER_MID) )
      ($24 ==? TOP) -> all?( ($13 ==? WATER) ($23 ==? WATER) ($33 ==? WATER) )
      some?( ($24 ==? TOP) ($24 ==? VER_MID) ($24 ==? BOTTOM) ) -> all?( ($14 ==? WATER) ($34 ==? WATER) )
      ($24 ==? BOTTOM) -> all?( ($15 ==? WATER) ($25 ==? WATER) ($35 ==? WATER) )
      ($24 ==? TOP) -> some?( ($25 ==? BOTTOM) ($26 ==? BOTTOM) ($27 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($24 ==? ONE) -> all?( ($13 ==? WATER) ($23 ==? WATER) ($33 ==? WATER) ($14 ==? WATER) ($33 ==? WATER) ($15 ==? WATER) ($25 ==? WATER) ($35 ==? WATER) )

      # Get size so we can count them
      $24L1 = $24 ==? ONE                                                                              # ●
      $24L2 = (all?( ($24 ==? LEFT) ($34 ==? RIGHT) )) |? (all?( ($24 ==? TOP) ($25 ==? BOTTOM) ))     # ◀▶
      $24L3 = (all?( ($24 ==? LEFT) ($44 ==? RIGHT) )) |? (all?( ($24 ==? TOP) ($26 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $24L4 = (all?( ($24 ==? LEFT) ($54 ==? RIGHT) )) |? (all?( ($24 ==? TOP) ($27 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $34

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($34 ==? LEFT) |? ($34 ==? HOR_MID)) == (($44 ==? HOR_MID) |? ($44 ==? RIGHT))
      (($34 ==? HOR_MID) |? ($34 ==? RIGHT)) == ( ($24 ==? LEFT) |? ($24 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($34 ==? LEFT) -> all?( ($23 ==? WATER) ($24 ==? WATER) ($25 ==? WATER) )
      some?( ($34 ==? LEFT) ($34 ==? HOR_MID) ($34 ==? RIGHT) ) -> all?( ($33 ==? WATER) ($35 ==? WATER) )
      ($34 ==? RIGHT) -> all?( ($43 ==? WATER) ($44 ==? WATER) ($45 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($34 ==? LEFT) -> some?( ($44 ==? RIGHT) ($54 ==? RIGHT) ($64 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($34 ==? TOP) |? ($34 ==? VER_MID)) == (($35 ==? VER_MID) |? ($35 ==? BOTTOM))
      (($34 ==? VER_MID) |? ($34 ==? BOTTOM)) == ( ($33 ==? TOP) |? ($33 ==? VER_MID) )
      ($34 ==? TOP) -> all?( ($23 ==? WATER) ($33 ==? WATER) ($43 ==? WATER) )
      some?( ($34 ==? TOP) ($34 ==? VER_MID) ($34 ==? BOTTOM) ) -> all?( ($24 ==? WATER) ($44 ==? WATER) )
      ($34 ==? BOTTOM) -> all?( ($25 ==? WATER) ($35 ==? WATER) ($45 ==? WATER) )
      ($34 ==? TOP) -> some?( ($35 ==? BOTTOM) ($36 ==? BOTTOM) ($37 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($34 ==? ONE) -> all?( ($23 ==? WATER) ($33 ==? WATER) ($43 ==? WATER) ($24 ==? WATER) ($43 ==? WATER) ($25 ==? WATER) ($35 ==? WATER) ($45 ==? WATER) )

      # Get size so we can count them
      $34L1 = $34 ==? ONE                                                                              # ●
      $34L2 = (all?( ($34 ==? LEFT) ($44 ==? RIGHT) )) |? (all?( ($34 ==? TOP) ($35 ==? BOTTOM) ))     # ◀▶
      $34L3 = (all?( ($34 ==? LEFT) ($54 ==? RIGHT) )) |? (all?( ($34 ==? TOP) ($36 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $34L4 = (all?( ($34 ==? LEFT) ($64 ==? RIGHT) )) |? (all?( ($34 ==? TOP) ($37 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $44

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($44 ==? LEFT) |? ($44 ==? HOR_MID)) == (($54 ==? HOR_MID) |? ($54 ==? RIGHT))
      (($44 ==? HOR_MID) |? ($44 ==? RIGHT)) == ( ($34 ==? LEFT) |? ($34 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($44 ==? LEFT) -> all?( ($33 ==? WATER) ($34 ==? WATER) ($35 ==? WATER) )
      some?( ($44 ==? LEFT) ($44 ==? HOR_MID) ($44 ==? RIGHT) ) -> all?( ($43 ==? WATER) ($45 ==? WATER) )
      ($44 ==? RIGHT) -> all?( ($53 ==? WATER) ($54 ==? WATER) ($55 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($44 ==? LEFT) -> some?( ($54 ==? RIGHT) ($64 ==? RIGHT) ($74 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($44 ==? TOP) |? ($44 ==? VER_MID)) == (($45 ==? VER_MID) |? ($45 ==? BOTTOM))
      (($44 ==? VER_MID) |? ($44 ==? BOTTOM)) == ( ($43 ==? TOP) |? ($43 ==? VER_MID) )
      ($44 ==? TOP) -> all?( ($33 ==? WATER) ($43 ==? WATER) ($53 ==? WATER) )
      some?( ($44 ==? TOP) ($44 ==? VER_MID) ($44 ==? BOTTOM) ) -> all?( ($34 ==? WATER) ($54 ==? WATER) )
      ($44 ==? BOTTOM) -> all?( ($35 ==? WATER) ($45 ==? WATER) ($55 ==? WATER) )
      ($44 ==? TOP) -> some?( ($45 ==? BOTTOM) ($46 ==? BOTTOM) ($47 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($44 ==? ONE) -> all?( ($33 ==? WATER) ($43 ==? WATER) ($53 ==? WATER) ($34 ==? WATER) ($53 ==? WATER) ($35 ==? WATER) ($45 ==? WATER) ($55 ==? WATER) )

      # Get size so we can count them
      $44L1 = $44 ==? ONE                                                                              # ●
      $44L2 = (all?( ($44 ==? LEFT) ($54 ==? RIGHT) )) |? (all?( ($44 ==? TOP) ($45 ==? BOTTOM) ))     # ◀▶
      $44L3 = (all?( ($44 ==? LEFT) ($64 ==? RIGHT) )) |? (all?( ($44 ==? TOP) ($46 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $44L4 = (all?( ($44 ==? LEFT) ($74 ==? RIGHT) )) |? (all?( ($44 ==? TOP) ($47 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $54

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($54 ==? LEFT) |? ($54 ==? HOR_MID)) == (($64 ==? HOR_MID) |? ($64 ==? RIGHT))
      (($54 ==? HOR_MID) |? ($54 ==? RIGHT)) == ( ($44 ==? LEFT) |? ($44 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($54 ==? LEFT) -> all?( ($43 ==? WATER) ($44 ==? WATER) ($45 ==? WATER) )
      some?( ($54 ==? LEFT) ($54 ==? HOR_MID) ($54 ==? RIGHT) ) -> all?( ($53 ==? WATER) ($55 ==? WATER) )
      ($54 ==? RIGHT) -> all?( ($63 ==? WATER) ($64 ==? WATER) ($65 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($54 ==? LEFT) -> some?( ($64 ==? RIGHT) ($74 ==? RIGHT) ($84 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($54 ==? TOP) |? ($54 ==? VER_MID)) == (($55 ==? VER_MID) |? ($55 ==? BOTTOM))
      (($54 ==? VER_MID) |? ($54 ==? BOTTOM)) == ( ($53 ==? TOP) |? ($53 ==? VER_MID) )
      ($54 ==? TOP) -> all?( ($43 ==? WATER) ($53 ==? WATER) ($63 ==? WATER) )
      some?( ($54 ==? TOP) ($54 ==? VER_MID) ($54 ==? BOTTOM) ) -> all?( ($44 ==? WATER) ($64 ==? WATER) )
      ($54 ==? BOTTOM) -> all?( ($45 ==? WATER) ($55 ==? WATER) ($65 ==? WATER) )
      ($54 ==? TOP) -> some?( ($55 ==? BOTTOM) ($56 ==? BOTTOM) ($57 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($54 ==? ONE) -> all?( ($43 ==? WATER) ($53 ==? WATER) ($63 ==? WATER) ($44 ==? WATER) ($63 ==? WATER) ($45 ==? WATER) ($55 ==? WATER) ($65 ==? WATER) )

      # Get size so we can count them
      $54L1 = $54 ==? ONE                                                                              # ●
      $54L2 = (all?( ($54 ==? LEFT) ($64 ==? RIGHT) )) |? (all?( ($54 ==? TOP) ($55 ==? BOTTOM) ))     # ◀▶
      $54L3 = (all?( ($54 ==? LEFT) ($74 ==? RIGHT) )) |? (all?( ($54 ==? TOP) ($56 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $54L4 = (all?( ($54 ==? LEFT) ($84 ==? RIGHT) )) |? (all?( ($54 ==? TOP) ($57 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $64

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($64 ==? LEFT) |? ($64 ==? HOR_MID)) == (($74 ==? HOR_MID) |? ($74 ==? RIGHT))
      (($64 ==? HOR_MID) |? ($64 ==? RIGHT)) == ( ($54 ==? LEFT) |? ($54 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($64 ==? LEFT) -> all?( ($53 ==? WATER) ($54 ==? WATER) ($55 ==? WATER) )
      some?( ($64 ==? LEFT) ($64 ==? HOR_MID) ($64 ==? RIGHT) ) -> all?( ($63 ==? WATER) ($65 ==? WATER) )
      ($64 ==? RIGHT) -> all?( ($73 ==? WATER) ($74 ==? WATER) ($75 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($64 ==? LEFT) -> some?( ($74 ==? RIGHT) ($84 ==? RIGHT) ($94 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($64 ==? TOP) |? ($64 ==? VER_MID)) == (($65 ==? VER_MID) |? ($65 ==? BOTTOM))
      (($64 ==? VER_MID) |? ($64 ==? BOTTOM)) == ( ($63 ==? TOP) |? ($63 ==? VER_MID) )
      ($64 ==? TOP) -> all?( ($53 ==? WATER) ($63 ==? WATER) ($73 ==? WATER) )
      some?( ($64 ==? TOP) ($64 ==? VER_MID) ($64 ==? BOTTOM) ) -> all?( ($54 ==? WATER) ($74 ==? WATER) )
      ($64 ==? BOTTOM) -> all?( ($55 ==? WATER) ($65 ==? WATER) ($75 ==? WATER) )
      ($64 ==? TOP) -> some?( ($65 ==? BOTTOM) ($66 ==? BOTTOM) ($67 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($64 ==? ONE) -> all?( ($53 ==? WATER) ($63 ==? WATER) ($73 ==? WATER) ($54 ==? WATER) ($73 ==? WATER) ($55 ==? WATER) ($65 ==? WATER) ($75 ==? WATER) )

      # Get size so we can count them
      $64L1 = $64 ==? ONE                                                                              # ●
      $64L2 = (all?( ($64 ==? LEFT) ($74 ==? RIGHT) )) |? (all?( ($64 ==? TOP) ($65 ==? BOTTOM) ))     # ◀▶
      $64L3 = (all?( ($64 ==? LEFT) ($84 ==? RIGHT) )) |? (all?( ($64 ==? TOP) ($66 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $64L4 = (all?( ($64 ==? LEFT) ($94 ==? RIGHT) )) |? (all?( ($64 ==? TOP) ($67 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $74

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($74 ==? LEFT) |? ($74 ==? HOR_MID)) == (($84 ==? HOR_MID) |? ($84 ==? RIGHT))
      (($74 ==? HOR_MID) |? ($74 ==? RIGHT)) == ( ($64 ==? LEFT) |? ($64 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($74 ==? LEFT) -> all?( ($63 ==? WATER) ($64 ==? WATER) ($65 ==? WATER) )
      some?( ($74 ==? LEFT) ($74 ==? HOR_MID) ($74 ==? RIGHT) ) -> all?( ($73 ==? WATER) ($75 ==? WATER) )
      ($74 ==? RIGHT) -> all?( ($83 ==? WATER) ($84 ==? WATER) ($85 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($74 ==? LEFT) -> some?( ($84 ==? RIGHT) ($94 ==? RIGHT) ($a4 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($74 ==? TOP) |? ($74 ==? VER_MID)) == (($75 ==? VER_MID) |? ($75 ==? BOTTOM))
      (($74 ==? VER_MID) |? ($74 ==? BOTTOM)) == ( ($73 ==? TOP) |? ($73 ==? VER_MID) )
      ($74 ==? TOP) -> all?( ($63 ==? WATER) ($73 ==? WATER) ($83 ==? WATER) )
      some?( ($74 ==? TOP) ($74 ==? VER_MID) ($74 ==? BOTTOM) ) -> all?( ($64 ==? WATER) ($84 ==? WATER) )
      ($74 ==? BOTTOM) -> all?( ($65 ==? WATER) ($75 ==? WATER) ($85 ==? WATER) )
      ($74 ==? TOP) -> some?( ($75 ==? BOTTOM) ($76 ==? BOTTOM) ($77 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($74 ==? ONE) -> all?( ($63 ==? WATER) ($73 ==? WATER) ($83 ==? WATER) ($64 ==? WATER) ($83 ==? WATER) ($65 ==? WATER) ($75 ==? WATER) ($85 ==? WATER) )

      # Get size so we can count them
      $74L1 = $74 ==? ONE                                                                              # ●
      $74L2 = (all?( ($74 ==? LEFT) ($84 ==? RIGHT) )) |? (all?( ($74 ==? TOP) ($75 ==? BOTTOM) ))     # ◀▶
      $74L3 = (all?( ($74 ==? LEFT) ($94 ==? RIGHT) )) |? (all?( ($74 ==? TOP) ($76 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $74L4 = (all?( ($74 ==? LEFT) ($a4 ==? RIGHT) )) |? (all?( ($74 ==? TOP) ($77 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $84

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($84 ==? LEFT) |? ($84 ==? HOR_MID)) == (($94 ==? HOR_MID) |? ($94 ==? RIGHT))
      (($84 ==? HOR_MID) |? ($84 ==? RIGHT)) == ( ($74 ==? LEFT) |? ($74 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($84 ==? LEFT) -> all?( ($73 ==? WATER) ($74 ==? WATER) ($75 ==? WATER) )
      some?( ($84 ==? LEFT) ($84 ==? HOR_MID) ($84 ==? RIGHT) ) -> all?( ($83 ==? WATER) ($85 ==? WATER) )
      ($84 ==? RIGHT) -> all?( ($93 ==? WATER) ($94 ==? WATER) ($95 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($84 ==? LEFT) -> some?( ($94 ==? RIGHT) ($a4 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($84 ==? TOP) |? ($84 ==? VER_MID)) == (($85 ==? VER_MID) |? ($85 ==? BOTTOM))
      (($84 ==? VER_MID) |? ($84 ==? BOTTOM)) == ( ($83 ==? TOP) |? ($83 ==? VER_MID) )
      ($84 ==? TOP) -> all?( ($73 ==? WATER) ($83 ==? WATER) ($93 ==? WATER) )
      some?( ($84 ==? TOP) ($84 ==? VER_MID) ($84 ==? BOTTOM) ) -> all?( ($74 ==? WATER) ($94 ==? WATER) )
      ($84 ==? BOTTOM) -> all?( ($75 ==? WATER) ($85 ==? WATER) ($95 ==? WATER) )
      ($84 ==? TOP) -> some?( ($85 ==? BOTTOM) ($86 ==? BOTTOM) ($87 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($84 ==? ONE) -> all?( ($73 ==? WATER) ($83 ==? WATER) ($93 ==? WATER) ($74 ==? WATER) ($93 ==? WATER) ($75 ==? WATER) ($85 ==? WATER) ($95 ==? WATER) )

      # Get size so we can count them
      $84L1 = $84 ==? ONE                                                                              # ●
      $84L2 = (all?( ($84 ==? LEFT) ($94 ==? RIGHT) )) |? (all?( ($84 ==? TOP) ($85 ==? BOTTOM) ))     # ◀▶
      $84L3 = (all?( ($84 ==? LEFT) ($a4 ==? RIGHT) )) |? (all?( ($84 ==? TOP) ($86 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $84L4 = (all?( ($84 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($84 ==? TOP) ($87 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $94

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($94 ==? LEFT) |? ($94 ==? HOR_MID)) == (($a4 ==? HOR_MID) |? ($a4 ==? RIGHT))
      (($94 ==? HOR_MID) |? ($94 ==? RIGHT)) == ( ($84 ==? LEFT) |? ($84 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($94 ==? LEFT) -> all?( ($83 ==? WATER) ($84 ==? WATER) ($85 ==? WATER) )
      some?( ($94 ==? LEFT) ($94 ==? HOR_MID) ($94 ==? RIGHT) ) -> all?( ($93 ==? WATER) ($95 ==? WATER) )
      ($94 ==? RIGHT) -> all?( ($a3 ==? WATER) ($a4 ==? WATER) ($a5 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($94 ==? LEFT) -> some?( ($a4 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($94 ==? TOP) |? ($94 ==? VER_MID)) == (($95 ==? VER_MID) |? ($95 ==? BOTTOM))
      (($94 ==? VER_MID) |? ($94 ==? BOTTOM)) == ( ($93 ==? TOP) |? ($93 ==? VER_MID) )
      ($94 ==? TOP) -> all?( ($83 ==? WATER) ($93 ==? WATER) ($a3 ==? WATER) )
      some?( ($94 ==? TOP) ($94 ==? VER_MID) ($94 ==? BOTTOM) ) -> all?( ($84 ==? WATER) ($a4 ==? WATER) )
      ($94 ==? BOTTOM) -> all?( ($85 ==? WATER) ($95 ==? WATER) ($a5 ==? WATER) )
      ($94 ==? TOP) -> some?( ($95 ==? BOTTOM) ($96 ==? BOTTOM) ($97 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($94 ==? ONE) -> all?( ($83 ==? WATER) ($93 ==? WATER) ($a3 ==? WATER) ($84 ==? WATER) ($a3 ==? WATER) ($85 ==? WATER) ($95 ==? WATER) ($a5 ==? WATER) )

      # Get size so we can count them
      $94L1 = $94 ==? ONE                                                                              # ●
      $94L2 = (all?( ($94 ==? LEFT) ($a4 ==? RIGHT) )) |? (all?( ($94 ==? TOP) ($95 ==? BOTTOM) ))     # ◀▶
      $94L3 = (all?( ($94 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($94 ==? TOP) ($96 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $94L4 = (all?( ($94 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($94 ==? TOP) ($97 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a4

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a4 ==? LEFT) |? ($a4 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a4 ==? HOR_MID) |? ($a4 ==? RIGHT)) == ( ($94 ==? LEFT) |? ($94 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a4 ==? LEFT) -> all?( ($93 ==? WATER) ($94 ==? WATER) ($95 ==? WATER) )
      some?( ($a4 ==? LEFT) ($a4 ==? HOR_MID) ($a4 ==? RIGHT) ) -> all?( ($a3 ==? WATER) ($a5 ==? WATER) )
      ($a4 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a4 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a4 ==? TOP) |? ($a4 ==? VER_MID)) == (($a5 ==? VER_MID) |? ($a5 ==? BOTTOM))
      (($a4 ==? VER_MID) |? ($a4 ==? BOTTOM)) == ( ($a3 ==? TOP) |? ($a3 ==? VER_MID) )
      ($a4 ==? TOP) -> all?( ($93 ==? WATER) ($a3 ==? WATER) (0 ==? WATER) )
      some?( ($a4 ==? TOP) ($a4 ==? VER_MID) ($a4 ==? BOTTOM) ) -> all?( ($94 ==? WATER) (0 ==? WATER) )
      ($a4 ==? BOTTOM) -> all?( ($95 ==? WATER) ($a5 ==? WATER) (0 ==? WATER) )
      ($a4 ==? TOP) -> some?( ($a5 ==? BOTTOM) ($a6 ==? BOTTOM) ($a7 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a4 ==? ONE) -> all?( ($93 ==? WATER) ($a3 ==? WATER) (0 ==? WATER) ($94 ==? WATER) (0 ==? WATER) ($95 ==? WATER) ($a5 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a4L1 = $a4 ==? ONE                                                                              # ●
      $a4L2 = (all?( ($a4 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a4 ==? TOP) ($a5 ==? BOTTOM) ))     # ◀▶
      $a4L3 = (all?( ($a4 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a4 ==? TOP) ($a6 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a4L4 = (all?( ($a4 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a4 ==? TOP) ($a7 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $15

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($15 ==? LEFT) |? ($15 ==? HOR_MID)) == (($25 ==? HOR_MID) |? ($25 ==? RIGHT))
      (($15 ==? HOR_MID) |? ($15 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($15 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($15 ==? LEFT) ($15 ==? HOR_MID) ($15 ==? RIGHT) ) -> all?( ($14 ==? WATER) ($16 ==? WATER) )
      ($15 ==? RIGHT) -> all?( ($24 ==? WATER) ($25 ==? WATER) ($26 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($15 ==? LEFT) -> some?( ($25 ==? RIGHT) ($35 ==? RIGHT) ($45 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($15 ==? TOP) |? ($15 ==? VER_MID)) == (($16 ==? VER_MID) |? ($16 ==? BOTTOM))
      (($15 ==? VER_MID) |? ($15 ==? BOTTOM)) == ( ($14 ==? TOP) |? ($14 ==? VER_MID) )
      ($15 ==? TOP) -> all?( (0 ==? WATER) ($14 ==? WATER) ($24 ==? WATER) )
      some?( ($15 ==? TOP) ($15 ==? VER_MID) ($15 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($25 ==? WATER) )
      ($15 ==? BOTTOM) -> all?( (0 ==? WATER) ($16 ==? WATER) ($26 ==? WATER) )
      ($15 ==? TOP) -> some?( ($16 ==? BOTTOM) ($17 ==? BOTTOM) ($18 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($15 ==? ONE) -> all?( (0 ==? WATER) ($14 ==? WATER) ($24 ==? WATER) (0 ==? WATER) ($24 ==? WATER) (0 ==? WATER) ($16 ==? WATER) ($26 ==? WATER) )

      # Get size so we can count them
      $15L1 = $15 ==? ONE                                                                              # ●
      $15L2 = (all?( ($15 ==? LEFT) ($25 ==? RIGHT) )) |? (all?( ($15 ==? TOP) ($16 ==? BOTTOM) ))     # ◀▶
      $15L3 = (all?( ($15 ==? LEFT) ($35 ==? RIGHT) )) |? (all?( ($15 ==? TOP) ($17 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $15L4 = (all?( ($15 ==? LEFT) ($45 ==? RIGHT) )) |? (all?( ($15 ==? TOP) ($18 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $25

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($25 ==? LEFT) |? ($25 ==? HOR_MID)) == (($35 ==? HOR_MID) |? ($35 ==? RIGHT))
      (($25 ==? HOR_MID) |? ($25 ==? RIGHT)) == ( ($15 ==? LEFT) |? ($15 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($25 ==? LEFT) -> all?( ($14 ==? WATER) ($15 ==? WATER) ($16 ==? WATER) )
      some?( ($25 ==? LEFT) ($25 ==? HOR_MID) ($25 ==? RIGHT) ) -> all?( ($24 ==? WATER) ($26 ==? WATER) )
      ($25 ==? RIGHT) -> all?( ($34 ==? WATER) ($35 ==? WATER) ($36 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($25 ==? LEFT) -> some?( ($35 ==? RIGHT) ($45 ==? RIGHT) ($55 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($25 ==? TOP) |? ($25 ==? VER_MID)) == (($26 ==? VER_MID) |? ($26 ==? BOTTOM))
      (($25 ==? VER_MID) |? ($25 ==? BOTTOM)) == ( ($24 ==? TOP) |? ($24 ==? VER_MID) )
      ($25 ==? TOP) -> all?( ($14 ==? WATER) ($24 ==? WATER) ($34 ==? WATER) )
      some?( ($25 ==? TOP) ($25 ==? VER_MID) ($25 ==? BOTTOM) ) -> all?( ($15 ==? WATER) ($35 ==? WATER) )
      ($25 ==? BOTTOM) -> all?( ($16 ==? WATER) ($26 ==? WATER) ($36 ==? WATER) )
      ($25 ==? TOP) -> some?( ($26 ==? BOTTOM) ($27 ==? BOTTOM) ($28 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($25 ==? ONE) -> all?( ($14 ==? WATER) ($24 ==? WATER) ($34 ==? WATER) ($15 ==? WATER) ($34 ==? WATER) ($16 ==? WATER) ($26 ==? WATER) ($36 ==? WATER) )

      # Get size so we can count them
      $25L1 = $25 ==? ONE                                                                              # ●
      $25L2 = (all?( ($25 ==? LEFT) ($35 ==? RIGHT) )) |? (all?( ($25 ==? TOP) ($26 ==? BOTTOM) ))     # ◀▶
      $25L3 = (all?( ($25 ==? LEFT) ($45 ==? RIGHT) )) |? (all?( ($25 ==? TOP) ($27 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $25L4 = (all?( ($25 ==? LEFT) ($55 ==? RIGHT) )) |? (all?( ($25 ==? TOP) ($28 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $35

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($35 ==? LEFT) |? ($35 ==? HOR_MID)) == (($45 ==? HOR_MID) |? ($45 ==? RIGHT))
      (($35 ==? HOR_MID) |? ($35 ==? RIGHT)) == ( ($25 ==? LEFT) |? ($25 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($35 ==? LEFT) -> all?( ($24 ==? WATER) ($25 ==? WATER) ($26 ==? WATER) )
      some?( ($35 ==? LEFT) ($35 ==? HOR_MID) ($35 ==? RIGHT) ) -> all?( ($34 ==? WATER) ($36 ==? WATER) )
      ($35 ==? RIGHT) -> all?( ($44 ==? WATER) ($45 ==? WATER) ($46 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($35 ==? LEFT) -> some?( ($45 ==? RIGHT) ($55 ==? RIGHT) ($65 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($35 ==? TOP) |? ($35 ==? VER_MID)) == (($36 ==? VER_MID) |? ($36 ==? BOTTOM))
      (($35 ==? VER_MID) |? ($35 ==? BOTTOM)) == ( ($34 ==? TOP) |? ($34 ==? VER_MID) )
      ($35 ==? TOP) -> all?( ($24 ==? WATER) ($34 ==? WATER) ($44 ==? WATER) )
      some?( ($35 ==? TOP) ($35 ==? VER_MID) ($35 ==? BOTTOM) ) -> all?( ($25 ==? WATER) ($45 ==? WATER) )
      ($35 ==? BOTTOM) -> all?( ($26 ==? WATER) ($36 ==? WATER) ($46 ==? WATER) )
      ($35 ==? TOP) -> some?( ($36 ==? BOTTOM) ($37 ==? BOTTOM) ($38 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($35 ==? ONE) -> all?( ($24 ==? WATER) ($34 ==? WATER) ($44 ==? WATER) ($25 ==? WATER) ($44 ==? WATER) ($26 ==? WATER) ($36 ==? WATER) ($46 ==? WATER) )

      # Get size so we can count them
      $35L1 = $35 ==? ONE                                                                              # ●
      $35L2 = (all?( ($35 ==? LEFT) ($45 ==? RIGHT) )) |? (all?( ($35 ==? TOP) ($36 ==? BOTTOM) ))     # ◀▶
      $35L3 = (all?( ($35 ==? LEFT) ($55 ==? RIGHT) )) |? (all?( ($35 ==? TOP) ($37 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $35L4 = (all?( ($35 ==? LEFT) ($65 ==? RIGHT) )) |? (all?( ($35 ==? TOP) ($38 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $45

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($45 ==? LEFT) |? ($45 ==? HOR_MID)) == (($55 ==? HOR_MID) |? ($55 ==? RIGHT))
      (($45 ==? HOR_MID) |? ($45 ==? RIGHT)) == ( ($35 ==? LEFT) |? ($35 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($45 ==? LEFT) -> all?( ($34 ==? WATER) ($35 ==? WATER) ($36 ==? WATER) )
      some?( ($45 ==? LEFT) ($45 ==? HOR_MID) ($45 ==? RIGHT) ) -> all?( ($44 ==? WATER) ($46 ==? WATER) )
      ($45 ==? RIGHT) -> all?( ($54 ==? WATER) ($55 ==? WATER) ($56 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($45 ==? LEFT) -> some?( ($55 ==? RIGHT) ($65 ==? RIGHT) ($75 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($45 ==? TOP) |? ($45 ==? VER_MID)) == (($46 ==? VER_MID) |? ($46 ==? BOTTOM))
      (($45 ==? VER_MID) |? ($45 ==? BOTTOM)) == ( ($44 ==? TOP) |? ($44 ==? VER_MID) )
      ($45 ==? TOP) -> all?( ($34 ==? WATER) ($44 ==? WATER) ($54 ==? WATER) )
      some?( ($45 ==? TOP) ($45 ==? VER_MID) ($45 ==? BOTTOM) ) -> all?( ($35 ==? WATER) ($55 ==? WATER) )
      ($45 ==? BOTTOM) -> all?( ($36 ==? WATER) ($46 ==? WATER) ($56 ==? WATER) )
      ($45 ==? TOP) -> some?( ($46 ==? BOTTOM) ($47 ==? BOTTOM) ($48 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($45 ==? ONE) -> all?( ($34 ==? WATER) ($44 ==? WATER) ($54 ==? WATER) ($35 ==? WATER) ($54 ==? WATER) ($36 ==? WATER) ($46 ==? WATER) ($56 ==? WATER) )

      # Get size so we can count them
      $45L1 = $45 ==? ONE                                                                              # ●
      $45L2 = (all?( ($45 ==? LEFT) ($55 ==? RIGHT) )) |? (all?( ($45 ==? TOP) ($46 ==? BOTTOM) ))     # ◀▶
      $45L3 = (all?( ($45 ==? LEFT) ($65 ==? RIGHT) )) |? (all?( ($45 ==? TOP) ($47 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $45L4 = (all?( ($45 ==? LEFT) ($75 ==? RIGHT) )) |? (all?( ($45 ==? TOP) ($48 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $55

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($55 ==? LEFT) |? ($55 ==? HOR_MID)) == (($65 ==? HOR_MID) |? ($65 ==? RIGHT))
      (($55 ==? HOR_MID) |? ($55 ==? RIGHT)) == ( ($45 ==? LEFT) |? ($45 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($55 ==? LEFT) -> all?( ($44 ==? WATER) ($45 ==? WATER) ($46 ==? WATER) )
      some?( ($55 ==? LEFT) ($55 ==? HOR_MID) ($55 ==? RIGHT) ) -> all?( ($54 ==? WATER) ($56 ==? WATER) )
      ($55 ==? RIGHT) -> all?( ($64 ==? WATER) ($65 ==? WATER) ($66 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($55 ==? LEFT) -> some?( ($65 ==? RIGHT) ($75 ==? RIGHT) ($85 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($55 ==? TOP) |? ($55 ==? VER_MID)) == (($56 ==? VER_MID) |? ($56 ==? BOTTOM))
      (($55 ==? VER_MID) |? ($55 ==? BOTTOM)) == ( ($54 ==? TOP) |? ($54 ==? VER_MID) )
      ($55 ==? TOP) -> all?( ($44 ==? WATER) ($54 ==? WATER) ($64 ==? WATER) )
      some?( ($55 ==? TOP) ($55 ==? VER_MID) ($55 ==? BOTTOM) ) -> all?( ($45 ==? WATER) ($65 ==? WATER) )
      ($55 ==? BOTTOM) -> all?( ($46 ==? WATER) ($56 ==? WATER) ($66 ==? WATER) )
      ($55 ==? TOP) -> some?( ($56 ==? BOTTOM) ($57 ==? BOTTOM) ($58 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($55 ==? ONE) -> all?( ($44 ==? WATER) ($54 ==? WATER) ($64 ==? WATER) ($45 ==? WATER) ($64 ==? WATER) ($46 ==? WATER) ($56 ==? WATER) ($66 ==? WATER) )

      # Get size so we can count them
      $55L1 = $55 ==? ONE                                                                              # ●
      $55L2 = (all?( ($55 ==? LEFT) ($65 ==? RIGHT) )) |? (all?( ($55 ==? TOP) ($56 ==? BOTTOM) ))     # ◀▶
      $55L3 = (all?( ($55 ==? LEFT) ($75 ==? RIGHT) )) |? (all?( ($55 ==? TOP) ($57 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $55L4 = (all?( ($55 ==? LEFT) ($85 ==? RIGHT) )) |? (all?( ($55 ==? TOP) ($58 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $65

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($65 ==? LEFT) |? ($65 ==? HOR_MID)) == (($75 ==? HOR_MID) |? ($75 ==? RIGHT))
      (($65 ==? HOR_MID) |? ($65 ==? RIGHT)) == ( ($55 ==? LEFT) |? ($55 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($65 ==? LEFT) -> all?( ($54 ==? WATER) ($55 ==? WATER) ($56 ==? WATER) )
      some?( ($65 ==? LEFT) ($65 ==? HOR_MID) ($65 ==? RIGHT) ) -> all?( ($64 ==? WATER) ($66 ==? WATER) )
      ($65 ==? RIGHT) -> all?( ($74 ==? WATER) ($75 ==? WATER) ($76 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($65 ==? LEFT) -> some?( ($75 ==? RIGHT) ($85 ==? RIGHT) ($95 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($65 ==? TOP) |? ($65 ==? VER_MID)) == (($66 ==? VER_MID) |? ($66 ==? BOTTOM))
      (($65 ==? VER_MID) |? ($65 ==? BOTTOM)) == ( ($64 ==? TOP) |? ($64 ==? VER_MID) )
      ($65 ==? TOP) -> all?( ($54 ==? WATER) ($64 ==? WATER) ($74 ==? WATER) )
      some?( ($65 ==? TOP) ($65 ==? VER_MID) ($65 ==? BOTTOM) ) -> all?( ($55 ==? WATER) ($75 ==? WATER) )
      ($65 ==? BOTTOM) -> all?( ($56 ==? WATER) ($66 ==? WATER) ($76 ==? WATER) )
      ($65 ==? TOP) -> some?( ($66 ==? BOTTOM) ($67 ==? BOTTOM) ($68 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($65 ==? ONE) -> all?( ($54 ==? WATER) ($64 ==? WATER) ($74 ==? WATER) ($55 ==? WATER) ($74 ==? WATER) ($56 ==? WATER) ($66 ==? WATER) ($76 ==? WATER) )

      # Get size so we can count them
      $65L1 = $65 ==? ONE                                                                              # ●
      $65L2 = (all?( ($65 ==? LEFT) ($75 ==? RIGHT) )) |? (all?( ($65 ==? TOP) ($66 ==? BOTTOM) ))     # ◀▶
      $65L3 = (all?( ($65 ==? LEFT) ($85 ==? RIGHT) )) |? (all?( ($65 ==? TOP) ($67 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $65L4 = (all?( ($65 ==? LEFT) ($95 ==? RIGHT) )) |? (all?( ($65 ==? TOP) ($68 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $75

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($75 ==? LEFT) |? ($75 ==? HOR_MID)) == (($85 ==? HOR_MID) |? ($85 ==? RIGHT))
      (($75 ==? HOR_MID) |? ($75 ==? RIGHT)) == ( ($65 ==? LEFT) |? ($65 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($75 ==? LEFT) -> all?( ($64 ==? WATER) ($65 ==? WATER) ($66 ==? WATER) )
      some?( ($75 ==? LEFT) ($75 ==? HOR_MID) ($75 ==? RIGHT) ) -> all?( ($74 ==? WATER) ($76 ==? WATER) )
      ($75 ==? RIGHT) -> all?( ($84 ==? WATER) ($85 ==? WATER) ($86 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($75 ==? LEFT) -> some?( ($85 ==? RIGHT) ($95 ==? RIGHT) ($a5 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($75 ==? TOP) |? ($75 ==? VER_MID)) == (($76 ==? VER_MID) |? ($76 ==? BOTTOM))
      (($75 ==? VER_MID) |? ($75 ==? BOTTOM)) == ( ($74 ==? TOP) |? ($74 ==? VER_MID) )
      ($75 ==? TOP) -> all?( ($64 ==? WATER) ($74 ==? WATER) ($84 ==? WATER) )
      some?( ($75 ==? TOP) ($75 ==? VER_MID) ($75 ==? BOTTOM) ) -> all?( ($65 ==? WATER) ($85 ==? WATER) )
      ($75 ==? BOTTOM) -> all?( ($66 ==? WATER) ($76 ==? WATER) ($86 ==? WATER) )
      ($75 ==? TOP) -> some?( ($76 ==? BOTTOM) ($77 ==? BOTTOM) ($78 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($75 ==? ONE) -> all?( ($64 ==? WATER) ($74 ==? WATER) ($84 ==? WATER) ($65 ==? WATER) ($84 ==? WATER) ($66 ==? WATER) ($76 ==? WATER) ($86 ==? WATER) )

      # Get size so we can count them
      $75L1 = $75 ==? ONE                                                                              # ●
      $75L2 = (all?( ($75 ==? LEFT) ($85 ==? RIGHT) )) |? (all?( ($75 ==? TOP) ($76 ==? BOTTOM) ))     # ◀▶
      $75L3 = (all?( ($75 ==? LEFT) ($95 ==? RIGHT) )) |? (all?( ($75 ==? TOP) ($77 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $75L4 = (all?( ($75 ==? LEFT) ($a5 ==? RIGHT) )) |? (all?( ($75 ==? TOP) ($78 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $85

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($85 ==? LEFT) |? ($85 ==? HOR_MID)) == (($95 ==? HOR_MID) |? ($95 ==? RIGHT))
      (($85 ==? HOR_MID) |? ($85 ==? RIGHT)) == ( ($75 ==? LEFT) |? ($75 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($85 ==? LEFT) -> all?( ($74 ==? WATER) ($75 ==? WATER) ($76 ==? WATER) )
      some?( ($85 ==? LEFT) ($85 ==? HOR_MID) ($85 ==? RIGHT) ) -> all?( ($84 ==? WATER) ($86 ==? WATER) )
      ($85 ==? RIGHT) -> all?( ($94 ==? WATER) ($95 ==? WATER) ($96 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($85 ==? LEFT) -> some?( ($95 ==? RIGHT) ($a5 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($85 ==? TOP) |? ($85 ==? VER_MID)) == (($86 ==? VER_MID) |? ($86 ==? BOTTOM))
      (($85 ==? VER_MID) |? ($85 ==? BOTTOM)) == ( ($84 ==? TOP) |? ($84 ==? VER_MID) )
      ($85 ==? TOP) -> all?( ($74 ==? WATER) ($84 ==? WATER) ($94 ==? WATER) )
      some?( ($85 ==? TOP) ($85 ==? VER_MID) ($85 ==? BOTTOM) ) -> all?( ($75 ==? WATER) ($95 ==? WATER) )
      ($85 ==? BOTTOM) -> all?( ($76 ==? WATER) ($86 ==? WATER) ($96 ==? WATER) )
      ($85 ==? TOP) -> some?( ($86 ==? BOTTOM) ($87 ==? BOTTOM) ($88 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($85 ==? ONE) -> all?( ($74 ==? WATER) ($84 ==? WATER) ($94 ==? WATER) ($75 ==? WATER) ($94 ==? WATER) ($76 ==? WATER) ($86 ==? WATER) ($96 ==? WATER) )

      # Get size so we can count them
      $85L1 = $85 ==? ONE                                                                              # ●
      $85L2 = (all?( ($85 ==? LEFT) ($95 ==? RIGHT) )) |? (all?( ($85 ==? TOP) ($86 ==? BOTTOM) ))     # ◀▶
      $85L3 = (all?( ($85 ==? LEFT) ($a5 ==? RIGHT) )) |? (all?( ($85 ==? TOP) ($87 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $85L4 = (all?( ($85 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($85 ==? TOP) ($88 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $95

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($95 ==? LEFT) |? ($95 ==? HOR_MID)) == (($a5 ==? HOR_MID) |? ($a5 ==? RIGHT))
      (($95 ==? HOR_MID) |? ($95 ==? RIGHT)) == ( ($85 ==? LEFT) |? ($85 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($95 ==? LEFT) -> all?( ($84 ==? WATER) ($85 ==? WATER) ($86 ==? WATER) )
      some?( ($95 ==? LEFT) ($95 ==? HOR_MID) ($95 ==? RIGHT) ) -> all?( ($94 ==? WATER) ($96 ==? WATER) )
      ($95 ==? RIGHT) -> all?( ($a4 ==? WATER) ($a5 ==? WATER) ($a6 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($95 ==? LEFT) -> some?( ($a5 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($95 ==? TOP) |? ($95 ==? VER_MID)) == (($96 ==? VER_MID) |? ($96 ==? BOTTOM))
      (($95 ==? VER_MID) |? ($95 ==? BOTTOM)) == ( ($94 ==? TOP) |? ($94 ==? VER_MID) )
      ($95 ==? TOP) -> all?( ($84 ==? WATER) ($94 ==? WATER) ($a4 ==? WATER) )
      some?( ($95 ==? TOP) ($95 ==? VER_MID) ($95 ==? BOTTOM) ) -> all?( ($85 ==? WATER) ($a5 ==? WATER) )
      ($95 ==? BOTTOM) -> all?( ($86 ==? WATER) ($96 ==? WATER) ($a6 ==? WATER) )
      ($95 ==? TOP) -> some?( ($96 ==? BOTTOM) ($97 ==? BOTTOM) ($98 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($95 ==? ONE) -> all?( ($84 ==? WATER) ($94 ==? WATER) ($a4 ==? WATER) ($85 ==? WATER) ($a4 ==? WATER) ($86 ==? WATER) ($96 ==? WATER) ($a6 ==? WATER) )

      # Get size so we can count them
      $95L1 = $95 ==? ONE                                                                              # ●
      $95L2 = (all?( ($95 ==? LEFT) ($a5 ==? RIGHT) )) |? (all?( ($95 ==? TOP) ($96 ==? BOTTOM) ))     # ◀▶
      $95L3 = (all?( ($95 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($95 ==? TOP) ($97 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $95L4 = (all?( ($95 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($95 ==? TOP) ($98 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a5

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a5 ==? LEFT) |? ($a5 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a5 ==? HOR_MID) |? ($a5 ==? RIGHT)) == ( ($95 ==? LEFT) |? ($95 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a5 ==? LEFT) -> all?( ($94 ==? WATER) ($95 ==? WATER) ($96 ==? WATER) )
      some?( ($a5 ==? LEFT) ($a5 ==? HOR_MID) ($a5 ==? RIGHT) ) -> all?( ($a4 ==? WATER) ($a6 ==? WATER) )
      ($a5 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a5 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a5 ==? TOP) |? ($a5 ==? VER_MID)) == (($a6 ==? VER_MID) |? ($a6 ==? BOTTOM))
      (($a5 ==? VER_MID) |? ($a5 ==? BOTTOM)) == ( ($a4 ==? TOP) |? ($a4 ==? VER_MID) )
      ($a5 ==? TOP) -> all?( ($94 ==? WATER) ($a4 ==? WATER) (0 ==? WATER) )
      some?( ($a5 ==? TOP) ($a5 ==? VER_MID) ($a5 ==? BOTTOM) ) -> all?( ($95 ==? WATER) (0 ==? WATER) )
      ($a5 ==? BOTTOM) -> all?( ($96 ==? WATER) ($a6 ==? WATER) (0 ==? WATER) )
      ($a5 ==? TOP) -> some?( ($a6 ==? BOTTOM) ($a7 ==? BOTTOM) ($a8 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a5 ==? ONE) -> all?( ($94 ==? WATER) ($a4 ==? WATER) (0 ==? WATER) ($95 ==? WATER) (0 ==? WATER) ($96 ==? WATER) ($a6 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a5L1 = $a5 ==? ONE                                                                              # ●
      $a5L2 = (all?( ($a5 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a5 ==? TOP) ($a6 ==? BOTTOM) ))     # ◀▶
      $a5L3 = (all?( ($a5 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a5 ==? TOP) ($a7 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a5L4 = (all?( ($a5 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a5 ==? TOP) ($a8 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $16

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($16 ==? LEFT) |? ($16 ==? HOR_MID)) == (($26 ==? HOR_MID) |? ($26 ==? RIGHT))
      (($16 ==? HOR_MID) |? ($16 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($16 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($16 ==? LEFT) ($16 ==? HOR_MID) ($16 ==? RIGHT) ) -> all?( ($15 ==? WATER) ($17 ==? WATER) )
      ($16 ==? RIGHT) -> all?( ($25 ==? WATER) ($26 ==? WATER) ($27 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($16 ==? LEFT) -> some?( ($26 ==? RIGHT) ($36 ==? RIGHT) ($46 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($16 ==? TOP) |? ($16 ==? VER_MID)) == (($17 ==? VER_MID) |? ($17 ==? BOTTOM))
      (($16 ==? VER_MID) |? ($16 ==? BOTTOM)) == ( ($15 ==? TOP) |? ($15 ==? VER_MID) )
      ($16 ==? TOP) -> all?( (0 ==? WATER) ($15 ==? WATER) ($25 ==? WATER) )
      some?( ($16 ==? TOP) ($16 ==? VER_MID) ($16 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($26 ==? WATER) )
      ($16 ==? BOTTOM) -> all?( (0 ==? WATER) ($17 ==? WATER) ($27 ==? WATER) )
      ($16 ==? TOP) -> some?( ($17 ==? BOTTOM) ($18 ==? BOTTOM) ($19 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($16 ==? ONE) -> all?( (0 ==? WATER) ($15 ==? WATER) ($25 ==? WATER) (0 ==? WATER) ($25 ==? WATER) (0 ==? WATER) ($17 ==? WATER) ($27 ==? WATER) )

      # Get size so we can count them
      $16L1 = $16 ==? ONE                                                                              # ●
      $16L2 = (all?( ($16 ==? LEFT) ($26 ==? RIGHT) )) |? (all?( ($16 ==? TOP) ($17 ==? BOTTOM) ))     # ◀▶
      $16L3 = (all?( ($16 ==? LEFT) ($36 ==? RIGHT) )) |? (all?( ($16 ==? TOP) ($18 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $16L4 = (all?( ($16 ==? LEFT) ($46 ==? RIGHT) )) |? (all?( ($16 ==? TOP) ($19 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $26

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($26 ==? LEFT) |? ($26 ==? HOR_MID)) == (($36 ==? HOR_MID) |? ($36 ==? RIGHT))
      (($26 ==? HOR_MID) |? ($26 ==? RIGHT)) == ( ($16 ==? LEFT) |? ($16 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($26 ==? LEFT) -> all?( ($15 ==? WATER) ($16 ==? WATER) ($17 ==? WATER) )
      some?( ($26 ==? LEFT) ($26 ==? HOR_MID) ($26 ==? RIGHT) ) -> all?( ($25 ==? WATER) ($27 ==? WATER) )
      ($26 ==? RIGHT) -> all?( ($35 ==? WATER) ($36 ==? WATER) ($37 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($26 ==? LEFT) -> some?( ($36 ==? RIGHT) ($46 ==? RIGHT) ($56 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($26 ==? TOP) |? ($26 ==? VER_MID)) == (($27 ==? VER_MID) |? ($27 ==? BOTTOM))
      (($26 ==? VER_MID) |? ($26 ==? BOTTOM)) == ( ($25 ==? TOP) |? ($25 ==? VER_MID) )
      ($26 ==? TOP) -> all?( ($15 ==? WATER) ($25 ==? WATER) ($35 ==? WATER) )
      some?( ($26 ==? TOP) ($26 ==? VER_MID) ($26 ==? BOTTOM) ) -> all?( ($16 ==? WATER) ($36 ==? WATER) )
      ($26 ==? BOTTOM) -> all?( ($17 ==? WATER) ($27 ==? WATER) ($37 ==? WATER) )
      ($26 ==? TOP) -> some?( ($27 ==? BOTTOM) ($28 ==? BOTTOM) ($29 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($26 ==? ONE) -> all?( ($15 ==? WATER) ($25 ==? WATER) ($35 ==? WATER) ($16 ==? WATER) ($35 ==? WATER) ($17 ==? WATER) ($27 ==? WATER) ($37 ==? WATER) )

      # Get size so we can count them
      $26L1 = $26 ==? ONE                                                                              # ●
      $26L2 = (all?( ($26 ==? LEFT) ($36 ==? RIGHT) )) |? (all?( ($26 ==? TOP) ($27 ==? BOTTOM) ))     # ◀▶
      $26L3 = (all?( ($26 ==? LEFT) ($46 ==? RIGHT) )) |? (all?( ($26 ==? TOP) ($28 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $26L4 = (all?( ($26 ==? LEFT) ($56 ==? RIGHT) )) |? (all?( ($26 ==? TOP) ($29 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $36

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($36 ==? LEFT) |? ($36 ==? HOR_MID)) == (($46 ==? HOR_MID) |? ($46 ==? RIGHT))
      (($36 ==? HOR_MID) |? ($36 ==? RIGHT)) == ( ($26 ==? LEFT) |? ($26 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($36 ==? LEFT) -> all?( ($25 ==? WATER) ($26 ==? WATER) ($27 ==? WATER) )
      some?( ($36 ==? LEFT) ($36 ==? HOR_MID) ($36 ==? RIGHT) ) -> all?( ($35 ==? WATER) ($37 ==? WATER) )
      ($36 ==? RIGHT) -> all?( ($45 ==? WATER) ($46 ==? WATER) ($47 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($36 ==? LEFT) -> some?( ($46 ==? RIGHT) ($56 ==? RIGHT) ($66 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($36 ==? TOP) |? ($36 ==? VER_MID)) == (($37 ==? VER_MID) |? ($37 ==? BOTTOM))
      (($36 ==? VER_MID) |? ($36 ==? BOTTOM)) == ( ($35 ==? TOP) |? ($35 ==? VER_MID) )
      ($36 ==? TOP) -> all?( ($25 ==? WATER) ($35 ==? WATER) ($45 ==? WATER) )
      some?( ($36 ==? TOP) ($36 ==? VER_MID) ($36 ==? BOTTOM) ) -> all?( ($26 ==? WATER) ($46 ==? WATER) )
      ($36 ==? BOTTOM) -> all?( ($27 ==? WATER) ($37 ==? WATER) ($47 ==? WATER) )
      ($36 ==? TOP) -> some?( ($37 ==? BOTTOM) ($38 ==? BOTTOM) ($39 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($36 ==? ONE) -> all?( ($25 ==? WATER) ($35 ==? WATER) ($45 ==? WATER) ($26 ==? WATER) ($45 ==? WATER) ($27 ==? WATER) ($37 ==? WATER) ($47 ==? WATER) )

      # Get size so we can count them
      $36L1 = $36 ==? ONE                                                                              # ●
      $36L2 = (all?( ($36 ==? LEFT) ($46 ==? RIGHT) )) |? (all?( ($36 ==? TOP) ($37 ==? BOTTOM) ))     # ◀▶
      $36L3 = (all?( ($36 ==? LEFT) ($56 ==? RIGHT) )) |? (all?( ($36 ==? TOP) ($38 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $36L4 = (all?( ($36 ==? LEFT) ($66 ==? RIGHT) )) |? (all?( ($36 ==? TOP) ($39 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $46

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($46 ==? LEFT) |? ($46 ==? HOR_MID)) == (($56 ==? HOR_MID) |? ($56 ==? RIGHT))
      (($46 ==? HOR_MID) |? ($46 ==? RIGHT)) == ( ($36 ==? LEFT) |? ($36 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($46 ==? LEFT) -> all?( ($35 ==? WATER) ($36 ==? WATER) ($37 ==? WATER) )
      some?( ($46 ==? LEFT) ($46 ==? HOR_MID) ($46 ==? RIGHT) ) -> all?( ($45 ==? WATER) ($47 ==? WATER) )
      ($46 ==? RIGHT) -> all?( ($55 ==? WATER) ($56 ==? WATER) ($57 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($46 ==? LEFT) -> some?( ($56 ==? RIGHT) ($66 ==? RIGHT) ($76 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($46 ==? TOP) |? ($46 ==? VER_MID)) == (($47 ==? VER_MID) |? ($47 ==? BOTTOM))
      (($46 ==? VER_MID) |? ($46 ==? BOTTOM)) == ( ($45 ==? TOP) |? ($45 ==? VER_MID) )
      ($46 ==? TOP) -> all?( ($35 ==? WATER) ($45 ==? WATER) ($55 ==? WATER) )
      some?( ($46 ==? TOP) ($46 ==? VER_MID) ($46 ==? BOTTOM) ) -> all?( ($36 ==? WATER) ($56 ==? WATER) )
      ($46 ==? BOTTOM) -> all?( ($37 ==? WATER) ($47 ==? WATER) ($57 ==? WATER) )
      ($46 ==? TOP) -> some?( ($47 ==? BOTTOM) ($48 ==? BOTTOM) ($49 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($46 ==? ONE) -> all?( ($35 ==? WATER) ($45 ==? WATER) ($55 ==? WATER) ($36 ==? WATER) ($55 ==? WATER) ($37 ==? WATER) ($47 ==? WATER) ($57 ==? WATER) )

      # Get size so we can count them
      $46L1 = $46 ==? ONE                                                                              # ●
      $46L2 = (all?( ($46 ==? LEFT) ($56 ==? RIGHT) )) |? (all?( ($46 ==? TOP) ($47 ==? BOTTOM) ))     # ◀▶
      $46L3 = (all?( ($46 ==? LEFT) ($66 ==? RIGHT) )) |? (all?( ($46 ==? TOP) ($48 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $46L4 = (all?( ($46 ==? LEFT) ($76 ==? RIGHT) )) |? (all?( ($46 ==? TOP) ($49 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $56

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($56 ==? LEFT) |? ($56 ==? HOR_MID)) == (($66 ==? HOR_MID) |? ($66 ==? RIGHT))
      (($56 ==? HOR_MID) |? ($56 ==? RIGHT)) == ( ($46 ==? LEFT) |? ($46 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($56 ==? LEFT) -> all?( ($45 ==? WATER) ($46 ==? WATER) ($47 ==? WATER) )
      some?( ($56 ==? LEFT) ($56 ==? HOR_MID) ($56 ==? RIGHT) ) -> all?( ($55 ==? WATER) ($57 ==? WATER) )
      ($56 ==? RIGHT) -> all?( ($65 ==? WATER) ($66 ==? WATER) ($67 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($56 ==? LEFT) -> some?( ($66 ==? RIGHT) ($76 ==? RIGHT) ($86 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($56 ==? TOP) |? ($56 ==? VER_MID)) == (($57 ==? VER_MID) |? ($57 ==? BOTTOM))
      (($56 ==? VER_MID) |? ($56 ==? BOTTOM)) == ( ($55 ==? TOP) |? ($55 ==? VER_MID) )
      ($56 ==? TOP) -> all?( ($45 ==? WATER) ($55 ==? WATER) ($65 ==? WATER) )
      some?( ($56 ==? TOP) ($56 ==? VER_MID) ($56 ==? BOTTOM) ) -> all?( ($46 ==? WATER) ($66 ==? WATER) )
      ($56 ==? BOTTOM) -> all?( ($47 ==? WATER) ($57 ==? WATER) ($67 ==? WATER) )
      ($56 ==? TOP) -> some?( ($57 ==? BOTTOM) ($58 ==? BOTTOM) ($59 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($56 ==? ONE) -> all?( ($45 ==? WATER) ($55 ==? WATER) ($65 ==? WATER) ($46 ==? WATER) ($65 ==? WATER) ($47 ==? WATER) ($57 ==? WATER) ($67 ==? WATER) )

      # Get size so we can count them
      $56L1 = $56 ==? ONE                                                                              # ●
      $56L2 = (all?( ($56 ==? LEFT) ($66 ==? RIGHT) )) |? (all?( ($56 ==? TOP) ($57 ==? BOTTOM) ))     # ◀▶
      $56L3 = (all?( ($56 ==? LEFT) ($76 ==? RIGHT) )) |? (all?( ($56 ==? TOP) ($58 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $56L4 = (all?( ($56 ==? LEFT) ($86 ==? RIGHT) )) |? (all?( ($56 ==? TOP) ($59 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $66

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($66 ==? LEFT) |? ($66 ==? HOR_MID)) == (($76 ==? HOR_MID) |? ($76 ==? RIGHT))
      (($66 ==? HOR_MID) |? ($66 ==? RIGHT)) == ( ($56 ==? LEFT) |? ($56 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($66 ==? LEFT) -> all?( ($55 ==? WATER) ($56 ==? WATER) ($57 ==? WATER) )
      some?( ($66 ==? LEFT) ($66 ==? HOR_MID) ($66 ==? RIGHT) ) -> all?( ($65 ==? WATER) ($67 ==? WATER) )
      ($66 ==? RIGHT) -> all?( ($75 ==? WATER) ($76 ==? WATER) ($77 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($66 ==? LEFT) -> some?( ($76 ==? RIGHT) ($86 ==? RIGHT) ($96 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($66 ==? TOP) |? ($66 ==? VER_MID)) == (($67 ==? VER_MID) |? ($67 ==? BOTTOM))
      (($66 ==? VER_MID) |? ($66 ==? BOTTOM)) == ( ($65 ==? TOP) |? ($65 ==? VER_MID) )
      ($66 ==? TOP) -> all?( ($55 ==? WATER) ($65 ==? WATER) ($75 ==? WATER) )
      some?( ($66 ==? TOP) ($66 ==? VER_MID) ($66 ==? BOTTOM) ) -> all?( ($56 ==? WATER) ($76 ==? WATER) )
      ($66 ==? BOTTOM) -> all?( ($57 ==? WATER) ($67 ==? WATER) ($77 ==? WATER) )
      ($66 ==? TOP) -> some?( ($67 ==? BOTTOM) ($68 ==? BOTTOM) ($69 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($66 ==? ONE) -> all?( ($55 ==? WATER) ($65 ==? WATER) ($75 ==? WATER) ($56 ==? WATER) ($75 ==? WATER) ($57 ==? WATER) ($67 ==? WATER) ($77 ==? WATER) )

      # Get size so we can count them
      $66L1 = $66 ==? ONE                                                                              # ●
      $66L2 = (all?( ($66 ==? LEFT) ($76 ==? RIGHT) )) |? (all?( ($66 ==? TOP) ($67 ==? BOTTOM) ))     # ◀▶
      $66L3 = (all?( ($66 ==? LEFT) ($86 ==? RIGHT) )) |? (all?( ($66 ==? TOP) ($68 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $66L4 = (all?( ($66 ==? LEFT) ($96 ==? RIGHT) )) |? (all?( ($66 ==? TOP) ($69 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $76

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($76 ==? LEFT) |? ($76 ==? HOR_MID)) == (($86 ==? HOR_MID) |? ($86 ==? RIGHT))
      (($76 ==? HOR_MID) |? ($76 ==? RIGHT)) == ( ($66 ==? LEFT) |? ($66 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($76 ==? LEFT) -> all?( ($65 ==? WATER) ($66 ==? WATER) ($67 ==? WATER) )
      some?( ($76 ==? LEFT) ($76 ==? HOR_MID) ($76 ==? RIGHT) ) -> all?( ($75 ==? WATER) ($77 ==? WATER) )
      ($76 ==? RIGHT) -> all?( ($85 ==? WATER) ($86 ==? WATER) ($87 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($76 ==? LEFT) -> some?( ($86 ==? RIGHT) ($96 ==? RIGHT) ($a6 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($76 ==? TOP) |? ($76 ==? VER_MID)) == (($77 ==? VER_MID) |? ($77 ==? BOTTOM))
      (($76 ==? VER_MID) |? ($76 ==? BOTTOM)) == ( ($75 ==? TOP) |? ($75 ==? VER_MID) )
      ($76 ==? TOP) -> all?( ($65 ==? WATER) ($75 ==? WATER) ($85 ==? WATER) )
      some?( ($76 ==? TOP) ($76 ==? VER_MID) ($76 ==? BOTTOM) ) -> all?( ($66 ==? WATER) ($86 ==? WATER) )
      ($76 ==? BOTTOM) -> all?( ($67 ==? WATER) ($77 ==? WATER) ($87 ==? WATER) )
      ($76 ==? TOP) -> some?( ($77 ==? BOTTOM) ($78 ==? BOTTOM) ($79 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($76 ==? ONE) -> all?( ($65 ==? WATER) ($75 ==? WATER) ($85 ==? WATER) ($66 ==? WATER) ($85 ==? WATER) ($67 ==? WATER) ($77 ==? WATER) ($87 ==? WATER) )

      # Get size so we can count them
      $76L1 = $76 ==? ONE                                                                              # ●
      $76L2 = (all?( ($76 ==? LEFT) ($86 ==? RIGHT) )) |? (all?( ($76 ==? TOP) ($77 ==? BOTTOM) ))     # ◀▶
      $76L3 = (all?( ($76 ==? LEFT) ($96 ==? RIGHT) )) |? (all?( ($76 ==? TOP) ($78 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $76L4 = (all?( ($76 ==? LEFT) ($a6 ==? RIGHT) )) |? (all?( ($76 ==? TOP) ($79 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $86

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($86 ==? LEFT) |? ($86 ==? HOR_MID)) == (($96 ==? HOR_MID) |? ($96 ==? RIGHT))
      (($86 ==? HOR_MID) |? ($86 ==? RIGHT)) == ( ($76 ==? LEFT) |? ($76 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($86 ==? LEFT) -> all?( ($75 ==? WATER) ($76 ==? WATER) ($77 ==? WATER) )
      some?( ($86 ==? LEFT) ($86 ==? HOR_MID) ($86 ==? RIGHT) ) -> all?( ($85 ==? WATER) ($87 ==? WATER) )
      ($86 ==? RIGHT) -> all?( ($95 ==? WATER) ($96 ==? WATER) ($97 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($86 ==? LEFT) -> some?( ($96 ==? RIGHT) ($a6 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($86 ==? TOP) |? ($86 ==? VER_MID)) == (($87 ==? VER_MID) |? ($87 ==? BOTTOM))
      (($86 ==? VER_MID) |? ($86 ==? BOTTOM)) == ( ($85 ==? TOP) |? ($85 ==? VER_MID) )
      ($86 ==? TOP) -> all?( ($75 ==? WATER) ($85 ==? WATER) ($95 ==? WATER) )
      some?( ($86 ==? TOP) ($86 ==? VER_MID) ($86 ==? BOTTOM) ) -> all?( ($76 ==? WATER) ($96 ==? WATER) )
      ($86 ==? BOTTOM) -> all?( ($77 ==? WATER) ($87 ==? WATER) ($97 ==? WATER) )
      ($86 ==? TOP) -> some?( ($87 ==? BOTTOM) ($88 ==? BOTTOM) ($89 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($86 ==? ONE) -> all?( ($75 ==? WATER) ($85 ==? WATER) ($95 ==? WATER) ($76 ==? WATER) ($95 ==? WATER) ($77 ==? WATER) ($87 ==? WATER) ($97 ==? WATER) )

      # Get size so we can count them
      $86L1 = $86 ==? ONE                                                                              # ●
      $86L2 = (all?( ($86 ==? LEFT) ($96 ==? RIGHT) )) |? (all?( ($86 ==? TOP) ($87 ==? BOTTOM) ))     # ◀▶
      $86L3 = (all?( ($86 ==? LEFT) ($a6 ==? RIGHT) )) |? (all?( ($86 ==? TOP) ($88 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $86L4 = (all?( ($86 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($86 ==? TOP) ($89 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $96

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($96 ==? LEFT) |? ($96 ==? HOR_MID)) == (($a6 ==? HOR_MID) |? ($a6 ==? RIGHT))
      (($96 ==? HOR_MID) |? ($96 ==? RIGHT)) == ( ($86 ==? LEFT) |? ($86 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($96 ==? LEFT) -> all?( ($85 ==? WATER) ($86 ==? WATER) ($87 ==? WATER) )
      some?( ($96 ==? LEFT) ($96 ==? HOR_MID) ($96 ==? RIGHT) ) -> all?( ($95 ==? WATER) ($97 ==? WATER) )
      ($96 ==? RIGHT) -> all?( ($a5 ==? WATER) ($a6 ==? WATER) ($a7 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($96 ==? LEFT) -> some?( ($a6 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($96 ==? TOP) |? ($96 ==? VER_MID)) == (($97 ==? VER_MID) |? ($97 ==? BOTTOM))
      (($96 ==? VER_MID) |? ($96 ==? BOTTOM)) == ( ($95 ==? TOP) |? ($95 ==? VER_MID) )
      ($96 ==? TOP) -> all?( ($85 ==? WATER) ($95 ==? WATER) ($a5 ==? WATER) )
      some?( ($96 ==? TOP) ($96 ==? VER_MID) ($96 ==? BOTTOM) ) -> all?( ($86 ==? WATER) ($a6 ==? WATER) )
      ($96 ==? BOTTOM) -> all?( ($87 ==? WATER) ($97 ==? WATER) ($a7 ==? WATER) )
      ($96 ==? TOP) -> some?( ($97 ==? BOTTOM) ($98 ==? BOTTOM) ($99 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($96 ==? ONE) -> all?( ($85 ==? WATER) ($95 ==? WATER) ($a5 ==? WATER) ($86 ==? WATER) ($a5 ==? WATER) ($87 ==? WATER) ($97 ==? WATER) ($a7 ==? WATER) )

      # Get size so we can count them
      $96L1 = $96 ==? ONE                                                                              # ●
      $96L2 = (all?( ($96 ==? LEFT) ($a6 ==? RIGHT) )) |? (all?( ($96 ==? TOP) ($97 ==? BOTTOM) ))     # ◀▶
      $96L3 = (all?( ($96 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($96 ==? TOP) ($98 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $96L4 = (all?( ($96 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($96 ==? TOP) ($99 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a6

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a6 ==? LEFT) |? ($a6 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a6 ==? HOR_MID) |? ($a6 ==? RIGHT)) == ( ($96 ==? LEFT) |? ($96 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a6 ==? LEFT) -> all?( ($95 ==? WATER) ($96 ==? WATER) ($97 ==? WATER) )
      some?( ($a6 ==? LEFT) ($a6 ==? HOR_MID) ($a6 ==? RIGHT) ) -> all?( ($a5 ==? WATER) ($a7 ==? WATER) )
      ($a6 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a6 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a6 ==? TOP) |? ($a6 ==? VER_MID)) == (($a7 ==? VER_MID) |? ($a7 ==? BOTTOM))
      (($a6 ==? VER_MID) |? ($a6 ==? BOTTOM)) == ( ($a5 ==? TOP) |? ($a5 ==? VER_MID) )
      ($a6 ==? TOP) -> all?( ($95 ==? WATER) ($a5 ==? WATER) (0 ==? WATER) )
      some?( ($a6 ==? TOP) ($a6 ==? VER_MID) ($a6 ==? BOTTOM) ) -> all?( ($96 ==? WATER) (0 ==? WATER) )
      ($a6 ==? BOTTOM) -> all?( ($97 ==? WATER) ($a7 ==? WATER) (0 ==? WATER) )
      ($a6 ==? TOP) -> some?( ($a7 ==? BOTTOM) ($a8 ==? BOTTOM) ($a9 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a6 ==? ONE) -> all?( ($95 ==? WATER) ($a5 ==? WATER) (0 ==? WATER) ($96 ==? WATER) (0 ==? WATER) ($97 ==? WATER) ($a7 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a6L1 = $a6 ==? ONE                                                                              # ●
      $a6L2 = (all?( ($a6 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a6 ==? TOP) ($a7 ==? BOTTOM) ))     # ◀▶
      $a6L3 = (all?( ($a6 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a6 ==? TOP) ($a8 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a6L4 = (all?( ($a6 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a6 ==? TOP) ($a9 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $17

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($17 ==? LEFT) |? ($17 ==? HOR_MID)) == (($27 ==? HOR_MID) |? ($27 ==? RIGHT))
      (($17 ==? HOR_MID) |? ($17 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($17 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($17 ==? LEFT) ($17 ==? HOR_MID) ($17 ==? RIGHT) ) -> all?( ($16 ==? WATER) ($18 ==? WATER) )
      ($17 ==? RIGHT) -> all?( ($26 ==? WATER) ($27 ==? WATER) ($28 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($17 ==? LEFT) -> some?( ($27 ==? RIGHT) ($37 ==? RIGHT) ($47 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($17 ==? TOP) |? ($17 ==? VER_MID)) == (($18 ==? VER_MID) |? ($18 ==? BOTTOM))
      (($17 ==? VER_MID) |? ($17 ==? BOTTOM)) == ( ($16 ==? TOP) |? ($16 ==? VER_MID) )
      ($17 ==? TOP) -> all?( (0 ==? WATER) ($16 ==? WATER) ($26 ==? WATER) )
      some?( ($17 ==? TOP) ($17 ==? VER_MID) ($17 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($27 ==? WATER) )
      ($17 ==? BOTTOM) -> all?( (0 ==? WATER) ($18 ==? WATER) ($28 ==? WATER) )
      ($17 ==? TOP) -> some?( ($18 ==? BOTTOM) ($19 ==? BOTTOM) ($1a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($17 ==? ONE) -> all?( (0 ==? WATER) ($16 ==? WATER) ($26 ==? WATER) (0 ==? WATER) ($26 ==? WATER) (0 ==? WATER) ($18 ==? WATER) ($28 ==? WATER) )

      # Get size so we can count them
      $17L1 = $17 ==? ONE                                                                              # ●
      $17L2 = (all?( ($17 ==? LEFT) ($27 ==? RIGHT) )) |? (all?( ($17 ==? TOP) ($18 ==? BOTTOM) ))     # ◀▶
      $17L3 = (all?( ($17 ==? LEFT) ($37 ==? RIGHT) )) |? (all?( ($17 ==? TOP) ($19 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $17L4 = (all?( ($17 ==? LEFT) ($47 ==? RIGHT) )) |? (all?( ($17 ==? TOP) ($1a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $27

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($27 ==? LEFT) |? ($27 ==? HOR_MID)) == (($37 ==? HOR_MID) |? ($37 ==? RIGHT))
      (($27 ==? HOR_MID) |? ($27 ==? RIGHT)) == ( ($17 ==? LEFT) |? ($17 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($27 ==? LEFT) -> all?( ($16 ==? WATER) ($17 ==? WATER) ($18 ==? WATER) )
      some?( ($27 ==? LEFT) ($27 ==? HOR_MID) ($27 ==? RIGHT) ) -> all?( ($26 ==? WATER) ($28 ==? WATER) )
      ($27 ==? RIGHT) -> all?( ($36 ==? WATER) ($37 ==? WATER) ($38 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($27 ==? LEFT) -> some?( ($37 ==? RIGHT) ($47 ==? RIGHT) ($57 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($27 ==? TOP) |? ($27 ==? VER_MID)) == (($28 ==? VER_MID) |? ($28 ==? BOTTOM))
      (($27 ==? VER_MID) |? ($27 ==? BOTTOM)) == ( ($26 ==? TOP) |? ($26 ==? VER_MID) )
      ($27 ==? TOP) -> all?( ($16 ==? WATER) ($26 ==? WATER) ($36 ==? WATER) )
      some?( ($27 ==? TOP) ($27 ==? VER_MID) ($27 ==? BOTTOM) ) -> all?( ($17 ==? WATER) ($37 ==? WATER) )
      ($27 ==? BOTTOM) -> all?( ($18 ==? WATER) ($28 ==? WATER) ($38 ==? WATER) )
      ($27 ==? TOP) -> some?( ($28 ==? BOTTOM) ($29 ==? BOTTOM) ($2a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($27 ==? ONE) -> all?( ($16 ==? WATER) ($26 ==? WATER) ($36 ==? WATER) ($17 ==? WATER) ($36 ==? WATER) ($18 ==? WATER) ($28 ==? WATER) ($38 ==? WATER) )

      # Get size so we can count them
      $27L1 = $27 ==? ONE                                                                              # ●
      $27L2 = (all?( ($27 ==? LEFT) ($37 ==? RIGHT) )) |? (all?( ($27 ==? TOP) ($28 ==? BOTTOM) ))     # ◀▶
      $27L3 = (all?( ($27 ==? LEFT) ($47 ==? RIGHT) )) |? (all?( ($27 ==? TOP) ($29 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $27L4 = (all?( ($27 ==? LEFT) ($57 ==? RIGHT) )) |? (all?( ($27 ==? TOP) ($2a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $37

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($37 ==? LEFT) |? ($37 ==? HOR_MID)) == (($47 ==? HOR_MID) |? ($47 ==? RIGHT))
      (($37 ==? HOR_MID) |? ($37 ==? RIGHT)) == ( ($27 ==? LEFT) |? ($27 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($37 ==? LEFT) -> all?( ($26 ==? WATER) ($27 ==? WATER) ($28 ==? WATER) )
      some?( ($37 ==? LEFT) ($37 ==? HOR_MID) ($37 ==? RIGHT) ) -> all?( ($36 ==? WATER) ($38 ==? WATER) )
      ($37 ==? RIGHT) -> all?( ($46 ==? WATER) ($47 ==? WATER) ($48 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($37 ==? LEFT) -> some?( ($47 ==? RIGHT) ($57 ==? RIGHT) ($67 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($37 ==? TOP) |? ($37 ==? VER_MID)) == (($38 ==? VER_MID) |? ($38 ==? BOTTOM))
      (($37 ==? VER_MID) |? ($37 ==? BOTTOM)) == ( ($36 ==? TOP) |? ($36 ==? VER_MID) )
      ($37 ==? TOP) -> all?( ($26 ==? WATER) ($36 ==? WATER) ($46 ==? WATER) )
      some?( ($37 ==? TOP) ($37 ==? VER_MID) ($37 ==? BOTTOM) ) -> all?( ($27 ==? WATER) ($47 ==? WATER) )
      ($37 ==? BOTTOM) -> all?( ($28 ==? WATER) ($38 ==? WATER) ($48 ==? WATER) )
      ($37 ==? TOP) -> some?( ($38 ==? BOTTOM) ($39 ==? BOTTOM) ($3a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($37 ==? ONE) -> all?( ($26 ==? WATER) ($36 ==? WATER) ($46 ==? WATER) ($27 ==? WATER) ($46 ==? WATER) ($28 ==? WATER) ($38 ==? WATER) ($48 ==? WATER) )

      # Get size so we can count them
      $37L1 = $37 ==? ONE                                                                              # ●
      $37L2 = (all?( ($37 ==? LEFT) ($47 ==? RIGHT) )) |? (all?( ($37 ==? TOP) ($38 ==? BOTTOM) ))     # ◀▶
      $37L3 = (all?( ($37 ==? LEFT) ($57 ==? RIGHT) )) |? (all?( ($37 ==? TOP) ($39 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $37L4 = (all?( ($37 ==? LEFT) ($67 ==? RIGHT) )) |? (all?( ($37 ==? TOP) ($3a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $47

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($47 ==? LEFT) |? ($47 ==? HOR_MID)) == (($57 ==? HOR_MID) |? ($57 ==? RIGHT))
      (($47 ==? HOR_MID) |? ($47 ==? RIGHT)) == ( ($37 ==? LEFT) |? ($37 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($47 ==? LEFT) -> all?( ($36 ==? WATER) ($37 ==? WATER) ($38 ==? WATER) )
      some?( ($47 ==? LEFT) ($47 ==? HOR_MID) ($47 ==? RIGHT) ) -> all?( ($46 ==? WATER) ($48 ==? WATER) )
      ($47 ==? RIGHT) -> all?( ($56 ==? WATER) ($57 ==? WATER) ($58 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($47 ==? LEFT) -> some?( ($57 ==? RIGHT) ($67 ==? RIGHT) ($77 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($47 ==? TOP) |? ($47 ==? VER_MID)) == (($48 ==? VER_MID) |? ($48 ==? BOTTOM))
      (($47 ==? VER_MID) |? ($47 ==? BOTTOM)) == ( ($46 ==? TOP) |? ($46 ==? VER_MID) )
      ($47 ==? TOP) -> all?( ($36 ==? WATER) ($46 ==? WATER) ($56 ==? WATER) )
      some?( ($47 ==? TOP) ($47 ==? VER_MID) ($47 ==? BOTTOM) ) -> all?( ($37 ==? WATER) ($57 ==? WATER) )
      ($47 ==? BOTTOM) -> all?( ($38 ==? WATER) ($48 ==? WATER) ($58 ==? WATER) )
      ($47 ==? TOP) -> some?( ($48 ==? BOTTOM) ($49 ==? BOTTOM) ($4a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($47 ==? ONE) -> all?( ($36 ==? WATER) ($46 ==? WATER) ($56 ==? WATER) ($37 ==? WATER) ($56 ==? WATER) ($38 ==? WATER) ($48 ==? WATER) ($58 ==? WATER) )

      # Get size so we can count them
      $47L1 = $47 ==? ONE                                                                              # ●
      $47L2 = (all?( ($47 ==? LEFT) ($57 ==? RIGHT) )) |? (all?( ($47 ==? TOP) ($48 ==? BOTTOM) ))     # ◀▶
      $47L3 = (all?( ($47 ==? LEFT) ($67 ==? RIGHT) )) |? (all?( ($47 ==? TOP) ($49 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $47L4 = (all?( ($47 ==? LEFT) ($77 ==? RIGHT) )) |? (all?( ($47 ==? TOP) ($4a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $57

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($57 ==? LEFT) |? ($57 ==? HOR_MID)) == (($67 ==? HOR_MID) |? ($67 ==? RIGHT))
      (($57 ==? HOR_MID) |? ($57 ==? RIGHT)) == ( ($47 ==? LEFT) |? ($47 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($57 ==? LEFT) -> all?( ($46 ==? WATER) ($47 ==? WATER) ($48 ==? WATER) )
      some?( ($57 ==? LEFT) ($57 ==? HOR_MID) ($57 ==? RIGHT) ) -> all?( ($56 ==? WATER) ($58 ==? WATER) )
      ($57 ==? RIGHT) -> all?( ($66 ==? WATER) ($67 ==? WATER) ($68 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($57 ==? LEFT) -> some?( ($67 ==? RIGHT) ($77 ==? RIGHT) ($87 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($57 ==? TOP) |? ($57 ==? VER_MID)) == (($58 ==? VER_MID) |? ($58 ==? BOTTOM))
      (($57 ==? VER_MID) |? ($57 ==? BOTTOM)) == ( ($56 ==? TOP) |? ($56 ==? VER_MID) )
      ($57 ==? TOP) -> all?( ($46 ==? WATER) ($56 ==? WATER) ($66 ==? WATER) )
      some?( ($57 ==? TOP) ($57 ==? VER_MID) ($57 ==? BOTTOM) ) -> all?( ($47 ==? WATER) ($67 ==? WATER) )
      ($57 ==? BOTTOM) -> all?( ($48 ==? WATER) ($58 ==? WATER) ($68 ==? WATER) )
      ($57 ==? TOP) -> some?( ($58 ==? BOTTOM) ($59 ==? BOTTOM) ($5a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($57 ==? ONE) -> all?( ($46 ==? WATER) ($56 ==? WATER) ($66 ==? WATER) ($47 ==? WATER) ($66 ==? WATER) ($48 ==? WATER) ($58 ==? WATER) ($68 ==? WATER) )

      # Get size so we can count them
      $57L1 = $57 ==? ONE                                                                              # ●
      $57L2 = (all?( ($57 ==? LEFT) ($67 ==? RIGHT) )) |? (all?( ($57 ==? TOP) ($58 ==? BOTTOM) ))     # ◀▶
      $57L3 = (all?( ($57 ==? LEFT) ($77 ==? RIGHT) )) |? (all?( ($57 ==? TOP) ($59 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $57L4 = (all?( ($57 ==? LEFT) ($87 ==? RIGHT) )) |? (all?( ($57 ==? TOP) ($5a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $67

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($67 ==? LEFT) |? ($67 ==? HOR_MID)) == (($77 ==? HOR_MID) |? ($77 ==? RIGHT))
      (($67 ==? HOR_MID) |? ($67 ==? RIGHT)) == ( ($57 ==? LEFT) |? ($57 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($67 ==? LEFT) -> all?( ($56 ==? WATER) ($57 ==? WATER) ($58 ==? WATER) )
      some?( ($67 ==? LEFT) ($67 ==? HOR_MID) ($67 ==? RIGHT) ) -> all?( ($66 ==? WATER) ($68 ==? WATER) )
      ($67 ==? RIGHT) -> all?( ($76 ==? WATER) ($77 ==? WATER) ($78 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($67 ==? LEFT) -> some?( ($77 ==? RIGHT) ($87 ==? RIGHT) ($97 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($67 ==? TOP) |? ($67 ==? VER_MID)) == (($68 ==? VER_MID) |? ($68 ==? BOTTOM))
      (($67 ==? VER_MID) |? ($67 ==? BOTTOM)) == ( ($66 ==? TOP) |? ($66 ==? VER_MID) )
      ($67 ==? TOP) -> all?( ($56 ==? WATER) ($66 ==? WATER) ($76 ==? WATER) )
      some?( ($67 ==? TOP) ($67 ==? VER_MID) ($67 ==? BOTTOM) ) -> all?( ($57 ==? WATER) ($77 ==? WATER) )
      ($67 ==? BOTTOM) -> all?( ($58 ==? WATER) ($68 ==? WATER) ($78 ==? WATER) )
      ($67 ==? TOP) -> some?( ($68 ==? BOTTOM) ($69 ==? BOTTOM) ($6a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($67 ==? ONE) -> all?( ($56 ==? WATER) ($66 ==? WATER) ($76 ==? WATER) ($57 ==? WATER) ($76 ==? WATER) ($58 ==? WATER) ($68 ==? WATER) ($78 ==? WATER) )

      # Get size so we can count them
      $67L1 = $67 ==? ONE                                                                              # ●
      $67L2 = (all?( ($67 ==? LEFT) ($77 ==? RIGHT) )) |? (all?( ($67 ==? TOP) ($68 ==? BOTTOM) ))     # ◀▶
      $67L3 = (all?( ($67 ==? LEFT) ($87 ==? RIGHT) )) |? (all?( ($67 ==? TOP) ($69 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $67L4 = (all?( ($67 ==? LEFT) ($97 ==? RIGHT) )) |? (all?( ($67 ==? TOP) ($6a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $77

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($77 ==? LEFT) |? ($77 ==? HOR_MID)) == (($87 ==? HOR_MID) |? ($87 ==? RIGHT))
      (($77 ==? HOR_MID) |? ($77 ==? RIGHT)) == ( ($67 ==? LEFT) |? ($67 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($77 ==? LEFT) -> all?( ($66 ==? WATER) ($67 ==? WATER) ($68 ==? WATER) )
      some?( ($77 ==? LEFT) ($77 ==? HOR_MID) ($77 ==? RIGHT) ) -> all?( ($76 ==? WATER) ($78 ==? WATER) )
      ($77 ==? RIGHT) -> all?( ($86 ==? WATER) ($87 ==? WATER) ($88 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($77 ==? LEFT) -> some?( ($87 ==? RIGHT) ($97 ==? RIGHT) ($a7 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($77 ==? TOP) |? ($77 ==? VER_MID)) == (($78 ==? VER_MID) |? ($78 ==? BOTTOM))
      (($77 ==? VER_MID) |? ($77 ==? BOTTOM)) == ( ($76 ==? TOP) |? ($76 ==? VER_MID) )
      ($77 ==? TOP) -> all?( ($66 ==? WATER) ($76 ==? WATER) ($86 ==? WATER) )
      some?( ($77 ==? TOP) ($77 ==? VER_MID) ($77 ==? BOTTOM) ) -> all?( ($67 ==? WATER) ($87 ==? WATER) )
      ($77 ==? BOTTOM) -> all?( ($68 ==? WATER) ($78 ==? WATER) ($88 ==? WATER) )
      ($77 ==? TOP) -> some?( ($78 ==? BOTTOM) ($79 ==? BOTTOM) ($7a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($77 ==? ONE) -> all?( ($66 ==? WATER) ($76 ==? WATER) ($86 ==? WATER) ($67 ==? WATER) ($86 ==? WATER) ($68 ==? WATER) ($78 ==? WATER) ($88 ==? WATER) )

      # Get size so we can count them
      $77L1 = $77 ==? ONE                                                                              # ●
      $77L2 = (all?( ($77 ==? LEFT) ($87 ==? RIGHT) )) |? (all?( ($77 ==? TOP) ($78 ==? BOTTOM) ))     # ◀▶
      $77L3 = (all?( ($77 ==? LEFT) ($97 ==? RIGHT) )) |? (all?( ($77 ==? TOP) ($79 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $77L4 = (all?( ($77 ==? LEFT) ($a7 ==? RIGHT) )) |? (all?( ($77 ==? TOP) ($7a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $87

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($87 ==? LEFT) |? ($87 ==? HOR_MID)) == (($97 ==? HOR_MID) |? ($97 ==? RIGHT))
      (($87 ==? HOR_MID) |? ($87 ==? RIGHT)) == ( ($77 ==? LEFT) |? ($77 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($87 ==? LEFT) -> all?( ($76 ==? WATER) ($77 ==? WATER) ($78 ==? WATER) )
      some?( ($87 ==? LEFT) ($87 ==? HOR_MID) ($87 ==? RIGHT) ) -> all?( ($86 ==? WATER) ($88 ==? WATER) )
      ($87 ==? RIGHT) -> all?( ($96 ==? WATER) ($97 ==? WATER) ($98 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($87 ==? LEFT) -> some?( ($97 ==? RIGHT) ($a7 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($87 ==? TOP) |? ($87 ==? VER_MID)) == (($88 ==? VER_MID) |? ($88 ==? BOTTOM))
      (($87 ==? VER_MID) |? ($87 ==? BOTTOM)) == ( ($86 ==? TOP) |? ($86 ==? VER_MID) )
      ($87 ==? TOP) -> all?( ($76 ==? WATER) ($86 ==? WATER) ($96 ==? WATER) )
      some?( ($87 ==? TOP) ($87 ==? VER_MID) ($87 ==? BOTTOM) ) -> all?( ($77 ==? WATER) ($97 ==? WATER) )
      ($87 ==? BOTTOM) -> all?( ($78 ==? WATER) ($88 ==? WATER) ($98 ==? WATER) )
      ($87 ==? TOP) -> some?( ($88 ==? BOTTOM) ($89 ==? BOTTOM) ($8a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($87 ==? ONE) -> all?( ($76 ==? WATER) ($86 ==? WATER) ($96 ==? WATER) ($77 ==? WATER) ($96 ==? WATER) ($78 ==? WATER) ($88 ==? WATER) ($98 ==? WATER) )

      # Get size so we can count them
      $87L1 = $87 ==? ONE                                                                              # ●
      $87L2 = (all?( ($87 ==? LEFT) ($97 ==? RIGHT) )) |? (all?( ($87 ==? TOP) ($88 ==? BOTTOM) ))     # ◀▶
      $87L3 = (all?( ($87 ==? LEFT) ($a7 ==? RIGHT) )) |? (all?( ($87 ==? TOP) ($89 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $87L4 = (all?( ($87 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($87 ==? TOP) ($8a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $97

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($97 ==? LEFT) |? ($97 ==? HOR_MID)) == (($a7 ==? HOR_MID) |? ($a7 ==? RIGHT))
      (($97 ==? HOR_MID) |? ($97 ==? RIGHT)) == ( ($87 ==? LEFT) |? ($87 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($97 ==? LEFT) -> all?( ($86 ==? WATER) ($87 ==? WATER) ($88 ==? WATER) )
      some?( ($97 ==? LEFT) ($97 ==? HOR_MID) ($97 ==? RIGHT) ) -> all?( ($96 ==? WATER) ($98 ==? WATER) )
      ($97 ==? RIGHT) -> all?( ($a6 ==? WATER) ($a7 ==? WATER) ($a8 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($97 ==? LEFT) -> some?( ($a7 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($97 ==? TOP) |? ($97 ==? VER_MID)) == (($98 ==? VER_MID) |? ($98 ==? BOTTOM))
      (($97 ==? VER_MID) |? ($97 ==? BOTTOM)) == ( ($96 ==? TOP) |? ($96 ==? VER_MID) )
      ($97 ==? TOP) -> all?( ($86 ==? WATER) ($96 ==? WATER) ($a6 ==? WATER) )
      some?( ($97 ==? TOP) ($97 ==? VER_MID) ($97 ==? BOTTOM) ) -> all?( ($87 ==? WATER) ($a7 ==? WATER) )
      ($97 ==? BOTTOM) -> all?( ($88 ==? WATER) ($98 ==? WATER) ($a8 ==? WATER) )
      ($97 ==? TOP) -> some?( ($98 ==? BOTTOM) ($99 ==? BOTTOM) ($9a ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($97 ==? ONE) -> all?( ($86 ==? WATER) ($96 ==? WATER) ($a6 ==? WATER) ($87 ==? WATER) ($a6 ==? WATER) ($88 ==? WATER) ($98 ==? WATER) ($a8 ==? WATER) )

      # Get size so we can count them
      $97L1 = $97 ==? ONE                                                                              # ●
      $97L2 = (all?( ($97 ==? LEFT) ($a7 ==? RIGHT) )) |? (all?( ($97 ==? TOP) ($98 ==? BOTTOM) ))     # ◀▶
      $97L3 = (all?( ($97 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($97 ==? TOP) ($99 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $97L4 = (all?( ($97 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($97 ==? TOP) ($9a ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a7

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a7 ==? LEFT) |? ($a7 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a7 ==? HOR_MID) |? ($a7 ==? RIGHT)) == ( ($97 ==? LEFT) |? ($97 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a7 ==? LEFT) -> all?( ($96 ==? WATER) ($97 ==? WATER) ($98 ==? WATER) )
      some?( ($a7 ==? LEFT) ($a7 ==? HOR_MID) ($a7 ==? RIGHT) ) -> all?( ($a6 ==? WATER) ($a8 ==? WATER) )
      ($a7 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a7 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a7 ==? TOP) |? ($a7 ==? VER_MID)) == (($a8 ==? VER_MID) |? ($a8 ==? BOTTOM))
      (($a7 ==? VER_MID) |? ($a7 ==? BOTTOM)) == ( ($a6 ==? TOP) |? ($a6 ==? VER_MID) )
      ($a7 ==? TOP) -> all?( ($96 ==? WATER) ($a6 ==? WATER) (0 ==? WATER) )
      some?( ($a7 ==? TOP) ($a7 ==? VER_MID) ($a7 ==? BOTTOM) ) -> all?( ($97 ==? WATER) (0 ==? WATER) )
      ($a7 ==? BOTTOM) -> all?( ($98 ==? WATER) ($a8 ==? WATER) (0 ==? WATER) )
      ($a7 ==? TOP) -> some?( ($a8 ==? BOTTOM) ($a9 ==? BOTTOM) ($aa ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a7 ==? ONE) -> all?( ($96 ==? WATER) ($a6 ==? WATER) (0 ==? WATER) ($97 ==? WATER) (0 ==? WATER) ($98 ==? WATER) ($a8 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a7L1 = $a7 ==? ONE                                                                              # ●
      $a7L2 = (all?( ($a7 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a7 ==? TOP) ($a8 ==? BOTTOM) ))     # ◀▶
      $a7L3 = (all?( ($a7 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a7 ==? TOP) ($a9 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a7L4 = (all?( ($a7 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a7 ==? TOP) ($aa ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $18

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($18 ==? LEFT) |? ($18 ==? HOR_MID)) == (($28 ==? HOR_MID) |? ($28 ==? RIGHT))
      (($18 ==? HOR_MID) |? ($18 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($18 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($18 ==? LEFT) ($18 ==? HOR_MID) ($18 ==? RIGHT) ) -> all?( ($17 ==? WATER) ($19 ==? WATER) )
      ($18 ==? RIGHT) -> all?( ($27 ==? WATER) ($28 ==? WATER) ($29 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($18 ==? LEFT) -> some?( ($28 ==? RIGHT) ($38 ==? RIGHT) ($48 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($18 ==? TOP) |? ($18 ==? VER_MID)) == (($19 ==? VER_MID) |? ($19 ==? BOTTOM))
      (($18 ==? VER_MID) |? ($18 ==? BOTTOM)) == ( ($17 ==? TOP) |? ($17 ==? VER_MID) )
      ($18 ==? TOP) -> all?( (0 ==? WATER) ($17 ==? WATER) ($27 ==? WATER) )
      some?( ($18 ==? TOP) ($18 ==? VER_MID) ($18 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($28 ==? WATER) )
      ($18 ==? BOTTOM) -> all?( (0 ==? WATER) ($19 ==? WATER) ($29 ==? WATER) )
      ($18 ==? TOP) -> some?( ($19 ==? BOTTOM) ($1a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($18 ==? ONE) -> all?( (0 ==? WATER) ($17 ==? WATER) ($27 ==? WATER) (0 ==? WATER) ($27 ==? WATER) (0 ==? WATER) ($19 ==? WATER) ($29 ==? WATER) )

      # Get size so we can count them
      $18L1 = $18 ==? ONE                                                                              # ●
      $18L2 = (all?( ($18 ==? LEFT) ($28 ==? RIGHT) )) |? (all?( ($18 ==? TOP) ($19 ==? BOTTOM) ))     # ◀▶
      $18L3 = (all?( ($18 ==? LEFT) ($38 ==? RIGHT) )) |? (all?( ($18 ==? TOP) ($1a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $18L4 = (all?( ($18 ==? LEFT) ($48 ==? RIGHT) )) |? (all?( ($18 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $28

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($28 ==? LEFT) |? ($28 ==? HOR_MID)) == (($38 ==? HOR_MID) |? ($38 ==? RIGHT))
      (($28 ==? HOR_MID) |? ($28 ==? RIGHT)) == ( ($18 ==? LEFT) |? ($18 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($28 ==? LEFT) -> all?( ($17 ==? WATER) ($18 ==? WATER) ($19 ==? WATER) )
      some?( ($28 ==? LEFT) ($28 ==? HOR_MID) ($28 ==? RIGHT) ) -> all?( ($27 ==? WATER) ($29 ==? WATER) )
      ($28 ==? RIGHT) -> all?( ($37 ==? WATER) ($38 ==? WATER) ($39 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($28 ==? LEFT) -> some?( ($38 ==? RIGHT) ($48 ==? RIGHT) ($58 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($28 ==? TOP) |? ($28 ==? VER_MID)) == (($29 ==? VER_MID) |? ($29 ==? BOTTOM))
      (($28 ==? VER_MID) |? ($28 ==? BOTTOM)) == ( ($27 ==? TOP) |? ($27 ==? VER_MID) )
      ($28 ==? TOP) -> all?( ($17 ==? WATER) ($27 ==? WATER) ($37 ==? WATER) )
      some?( ($28 ==? TOP) ($28 ==? VER_MID) ($28 ==? BOTTOM) ) -> all?( ($18 ==? WATER) ($38 ==? WATER) )
      ($28 ==? BOTTOM) -> all?( ($19 ==? WATER) ($29 ==? WATER) ($39 ==? WATER) )
      ($28 ==? TOP) -> some?( ($29 ==? BOTTOM) ($2a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($28 ==? ONE) -> all?( ($17 ==? WATER) ($27 ==? WATER) ($37 ==? WATER) ($18 ==? WATER) ($37 ==? WATER) ($19 ==? WATER) ($29 ==? WATER) ($39 ==? WATER) )

      # Get size so we can count them
      $28L1 = $28 ==? ONE                                                                              # ●
      $28L2 = (all?( ($28 ==? LEFT) ($38 ==? RIGHT) )) |? (all?( ($28 ==? TOP) ($29 ==? BOTTOM) ))     # ◀▶
      $28L3 = (all?( ($28 ==? LEFT) ($48 ==? RIGHT) )) |? (all?( ($28 ==? TOP) ($2a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $28L4 = (all?( ($28 ==? LEFT) ($58 ==? RIGHT) )) |? (all?( ($28 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $38

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($38 ==? LEFT) |? ($38 ==? HOR_MID)) == (($48 ==? HOR_MID) |? ($48 ==? RIGHT))
      (($38 ==? HOR_MID) |? ($38 ==? RIGHT)) == ( ($28 ==? LEFT) |? ($28 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($38 ==? LEFT) -> all?( ($27 ==? WATER) ($28 ==? WATER) ($29 ==? WATER) )
      some?( ($38 ==? LEFT) ($38 ==? HOR_MID) ($38 ==? RIGHT) ) -> all?( ($37 ==? WATER) ($39 ==? WATER) )
      ($38 ==? RIGHT) -> all?( ($47 ==? WATER) ($48 ==? WATER) ($49 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($38 ==? LEFT) -> some?( ($48 ==? RIGHT) ($58 ==? RIGHT) ($68 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($38 ==? TOP) |? ($38 ==? VER_MID)) == (($39 ==? VER_MID) |? ($39 ==? BOTTOM))
      (($38 ==? VER_MID) |? ($38 ==? BOTTOM)) == ( ($37 ==? TOP) |? ($37 ==? VER_MID) )
      ($38 ==? TOP) -> all?( ($27 ==? WATER) ($37 ==? WATER) ($47 ==? WATER) )
      some?( ($38 ==? TOP) ($38 ==? VER_MID) ($38 ==? BOTTOM) ) -> all?( ($28 ==? WATER) ($48 ==? WATER) )
      ($38 ==? BOTTOM) -> all?( ($29 ==? WATER) ($39 ==? WATER) ($49 ==? WATER) )
      ($38 ==? TOP) -> some?( ($39 ==? BOTTOM) ($3a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($38 ==? ONE) -> all?( ($27 ==? WATER) ($37 ==? WATER) ($47 ==? WATER) ($28 ==? WATER) ($47 ==? WATER) ($29 ==? WATER) ($39 ==? WATER) ($49 ==? WATER) )

      # Get size so we can count them
      $38L1 = $38 ==? ONE                                                                              # ●
      $38L2 = (all?( ($38 ==? LEFT) ($48 ==? RIGHT) )) |? (all?( ($38 ==? TOP) ($39 ==? BOTTOM) ))     # ◀▶
      $38L3 = (all?( ($38 ==? LEFT) ($58 ==? RIGHT) )) |? (all?( ($38 ==? TOP) ($3a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $38L4 = (all?( ($38 ==? LEFT) ($68 ==? RIGHT) )) |? (all?( ($38 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $48

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($48 ==? LEFT) |? ($48 ==? HOR_MID)) == (($58 ==? HOR_MID) |? ($58 ==? RIGHT))
      (($48 ==? HOR_MID) |? ($48 ==? RIGHT)) == ( ($38 ==? LEFT) |? ($38 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($48 ==? LEFT) -> all?( ($37 ==? WATER) ($38 ==? WATER) ($39 ==? WATER) )
      some?( ($48 ==? LEFT) ($48 ==? HOR_MID) ($48 ==? RIGHT) ) -> all?( ($47 ==? WATER) ($49 ==? WATER) )
      ($48 ==? RIGHT) -> all?( ($57 ==? WATER) ($58 ==? WATER) ($59 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($48 ==? LEFT) -> some?( ($58 ==? RIGHT) ($68 ==? RIGHT) ($78 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($48 ==? TOP) |? ($48 ==? VER_MID)) == (($49 ==? VER_MID) |? ($49 ==? BOTTOM))
      (($48 ==? VER_MID) |? ($48 ==? BOTTOM)) == ( ($47 ==? TOP) |? ($47 ==? VER_MID) )
      ($48 ==? TOP) -> all?( ($37 ==? WATER) ($47 ==? WATER) ($57 ==? WATER) )
      some?( ($48 ==? TOP) ($48 ==? VER_MID) ($48 ==? BOTTOM) ) -> all?( ($38 ==? WATER) ($58 ==? WATER) )
      ($48 ==? BOTTOM) -> all?( ($39 ==? WATER) ($49 ==? WATER) ($59 ==? WATER) )
      ($48 ==? TOP) -> some?( ($49 ==? BOTTOM) ($4a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($48 ==? ONE) -> all?( ($37 ==? WATER) ($47 ==? WATER) ($57 ==? WATER) ($38 ==? WATER) ($57 ==? WATER) ($39 ==? WATER) ($49 ==? WATER) ($59 ==? WATER) )

      # Get size so we can count them
      $48L1 = $48 ==? ONE                                                                              # ●
      $48L2 = (all?( ($48 ==? LEFT) ($58 ==? RIGHT) )) |? (all?( ($48 ==? TOP) ($49 ==? BOTTOM) ))     # ◀▶
      $48L3 = (all?( ($48 ==? LEFT) ($68 ==? RIGHT) )) |? (all?( ($48 ==? TOP) ($4a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $48L4 = (all?( ($48 ==? LEFT) ($78 ==? RIGHT) )) |? (all?( ($48 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $58

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($58 ==? LEFT) |? ($58 ==? HOR_MID)) == (($68 ==? HOR_MID) |? ($68 ==? RIGHT))
      (($58 ==? HOR_MID) |? ($58 ==? RIGHT)) == ( ($48 ==? LEFT) |? ($48 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($58 ==? LEFT) -> all?( ($47 ==? WATER) ($48 ==? WATER) ($49 ==? WATER) )
      some?( ($58 ==? LEFT) ($58 ==? HOR_MID) ($58 ==? RIGHT) ) -> all?( ($57 ==? WATER) ($59 ==? WATER) )
      ($58 ==? RIGHT) -> all?( ($67 ==? WATER) ($68 ==? WATER) ($69 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($58 ==? LEFT) -> some?( ($68 ==? RIGHT) ($78 ==? RIGHT) ($88 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($58 ==? TOP) |? ($58 ==? VER_MID)) == (($59 ==? VER_MID) |? ($59 ==? BOTTOM))
      (($58 ==? VER_MID) |? ($58 ==? BOTTOM)) == ( ($57 ==? TOP) |? ($57 ==? VER_MID) )
      ($58 ==? TOP) -> all?( ($47 ==? WATER) ($57 ==? WATER) ($67 ==? WATER) )
      some?( ($58 ==? TOP) ($58 ==? VER_MID) ($58 ==? BOTTOM) ) -> all?( ($48 ==? WATER) ($68 ==? WATER) )
      ($58 ==? BOTTOM) -> all?( ($49 ==? WATER) ($59 ==? WATER) ($69 ==? WATER) )
      ($58 ==? TOP) -> some?( ($59 ==? BOTTOM) ($5a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($58 ==? ONE) -> all?( ($47 ==? WATER) ($57 ==? WATER) ($67 ==? WATER) ($48 ==? WATER) ($67 ==? WATER) ($49 ==? WATER) ($59 ==? WATER) ($69 ==? WATER) )

      # Get size so we can count them
      $58L1 = $58 ==? ONE                                                                              # ●
      $58L2 = (all?( ($58 ==? LEFT) ($68 ==? RIGHT) )) |? (all?( ($58 ==? TOP) ($59 ==? BOTTOM) ))     # ◀▶
      $58L3 = (all?( ($58 ==? LEFT) ($78 ==? RIGHT) )) |? (all?( ($58 ==? TOP) ($5a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $58L4 = (all?( ($58 ==? LEFT) ($88 ==? RIGHT) )) |? (all?( ($58 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $68

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($68 ==? LEFT) |? ($68 ==? HOR_MID)) == (($78 ==? HOR_MID) |? ($78 ==? RIGHT))
      (($68 ==? HOR_MID) |? ($68 ==? RIGHT)) == ( ($58 ==? LEFT) |? ($58 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($68 ==? LEFT) -> all?( ($57 ==? WATER) ($58 ==? WATER) ($59 ==? WATER) )
      some?( ($68 ==? LEFT) ($68 ==? HOR_MID) ($68 ==? RIGHT) ) -> all?( ($67 ==? WATER) ($69 ==? WATER) )
      ($68 ==? RIGHT) -> all?( ($77 ==? WATER) ($78 ==? WATER) ($79 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($68 ==? LEFT) -> some?( ($78 ==? RIGHT) ($88 ==? RIGHT) ($98 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($68 ==? TOP) |? ($68 ==? VER_MID)) == (($69 ==? VER_MID) |? ($69 ==? BOTTOM))
      (($68 ==? VER_MID) |? ($68 ==? BOTTOM)) == ( ($67 ==? TOP) |? ($67 ==? VER_MID) )
      ($68 ==? TOP) -> all?( ($57 ==? WATER) ($67 ==? WATER) ($77 ==? WATER) )
      some?( ($68 ==? TOP) ($68 ==? VER_MID) ($68 ==? BOTTOM) ) -> all?( ($58 ==? WATER) ($78 ==? WATER) )
      ($68 ==? BOTTOM) -> all?( ($59 ==? WATER) ($69 ==? WATER) ($79 ==? WATER) )
      ($68 ==? TOP) -> some?( ($69 ==? BOTTOM) ($6a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($68 ==? ONE) -> all?( ($57 ==? WATER) ($67 ==? WATER) ($77 ==? WATER) ($58 ==? WATER) ($77 ==? WATER) ($59 ==? WATER) ($69 ==? WATER) ($79 ==? WATER) )

      # Get size so we can count them
      $68L1 = $68 ==? ONE                                                                              # ●
      $68L2 = (all?( ($68 ==? LEFT) ($78 ==? RIGHT) )) |? (all?( ($68 ==? TOP) ($69 ==? BOTTOM) ))     # ◀▶
      $68L3 = (all?( ($68 ==? LEFT) ($88 ==? RIGHT) )) |? (all?( ($68 ==? TOP) ($6a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $68L4 = (all?( ($68 ==? LEFT) ($98 ==? RIGHT) )) |? (all?( ($68 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $78

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($78 ==? LEFT) |? ($78 ==? HOR_MID)) == (($88 ==? HOR_MID) |? ($88 ==? RIGHT))
      (($78 ==? HOR_MID) |? ($78 ==? RIGHT)) == ( ($68 ==? LEFT) |? ($68 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($78 ==? LEFT) -> all?( ($67 ==? WATER) ($68 ==? WATER) ($69 ==? WATER) )
      some?( ($78 ==? LEFT) ($78 ==? HOR_MID) ($78 ==? RIGHT) ) -> all?( ($77 ==? WATER) ($79 ==? WATER) )
      ($78 ==? RIGHT) -> all?( ($87 ==? WATER) ($88 ==? WATER) ($89 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($78 ==? LEFT) -> some?( ($88 ==? RIGHT) ($98 ==? RIGHT) ($a8 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($78 ==? TOP) |? ($78 ==? VER_MID)) == (($79 ==? VER_MID) |? ($79 ==? BOTTOM))
      (($78 ==? VER_MID) |? ($78 ==? BOTTOM)) == ( ($77 ==? TOP) |? ($77 ==? VER_MID) )
      ($78 ==? TOP) -> all?( ($67 ==? WATER) ($77 ==? WATER) ($87 ==? WATER) )
      some?( ($78 ==? TOP) ($78 ==? VER_MID) ($78 ==? BOTTOM) ) -> all?( ($68 ==? WATER) ($88 ==? WATER) )
      ($78 ==? BOTTOM) -> all?( ($69 ==? WATER) ($79 ==? WATER) ($89 ==? WATER) )
      ($78 ==? TOP) -> some?( ($79 ==? BOTTOM) ($7a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($78 ==? ONE) -> all?( ($67 ==? WATER) ($77 ==? WATER) ($87 ==? WATER) ($68 ==? WATER) ($87 ==? WATER) ($69 ==? WATER) ($79 ==? WATER) ($89 ==? WATER) )

      # Get size so we can count them
      $78L1 = $78 ==? ONE                                                                              # ●
      $78L2 = (all?( ($78 ==? LEFT) ($88 ==? RIGHT) )) |? (all?( ($78 ==? TOP) ($79 ==? BOTTOM) ))     # ◀▶
      $78L3 = (all?( ($78 ==? LEFT) ($98 ==? RIGHT) )) |? (all?( ($78 ==? TOP) ($7a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $78L4 = (all?( ($78 ==? LEFT) ($a8 ==? RIGHT) )) |? (all?( ($78 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $88

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($88 ==? LEFT) |? ($88 ==? HOR_MID)) == (($98 ==? HOR_MID) |? ($98 ==? RIGHT))
      (($88 ==? HOR_MID) |? ($88 ==? RIGHT)) == ( ($78 ==? LEFT) |? ($78 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($88 ==? LEFT) -> all?( ($77 ==? WATER) ($78 ==? WATER) ($79 ==? WATER) )
      some?( ($88 ==? LEFT) ($88 ==? HOR_MID) ($88 ==? RIGHT) ) -> all?( ($87 ==? WATER) ($89 ==? WATER) )
      ($88 ==? RIGHT) -> all?( ($97 ==? WATER) ($98 ==? WATER) ($99 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($88 ==? LEFT) -> some?( ($98 ==? RIGHT) ($a8 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($88 ==? TOP) |? ($88 ==? VER_MID)) == (($89 ==? VER_MID) |? ($89 ==? BOTTOM))
      (($88 ==? VER_MID) |? ($88 ==? BOTTOM)) == ( ($87 ==? TOP) |? ($87 ==? VER_MID) )
      ($88 ==? TOP) -> all?( ($77 ==? WATER) ($87 ==? WATER) ($97 ==? WATER) )
      some?( ($88 ==? TOP) ($88 ==? VER_MID) ($88 ==? BOTTOM) ) -> all?( ($78 ==? WATER) ($98 ==? WATER) )
      ($88 ==? BOTTOM) -> all?( ($79 ==? WATER) ($89 ==? WATER) ($99 ==? WATER) )
      ($88 ==? TOP) -> some?( ($89 ==? BOTTOM) ($8a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($88 ==? ONE) -> all?( ($77 ==? WATER) ($87 ==? WATER) ($97 ==? WATER) ($78 ==? WATER) ($97 ==? WATER) ($79 ==? WATER) ($89 ==? WATER) ($99 ==? WATER) )

      # Get size so we can count them
      $88L1 = $88 ==? ONE                                                                              # ●
      $88L2 = (all?( ($88 ==? LEFT) ($98 ==? RIGHT) )) |? (all?( ($88 ==? TOP) ($89 ==? BOTTOM) ))     # ◀▶
      $88L3 = (all?( ($88 ==? LEFT) ($a8 ==? RIGHT) )) |? (all?( ($88 ==? TOP) ($8a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $88L4 = (all?( ($88 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($88 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $98

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($98 ==? LEFT) |? ($98 ==? HOR_MID)) == (($a8 ==? HOR_MID) |? ($a8 ==? RIGHT))
      (($98 ==? HOR_MID) |? ($98 ==? RIGHT)) == ( ($88 ==? LEFT) |? ($88 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($98 ==? LEFT) -> all?( ($87 ==? WATER) ($88 ==? WATER) ($89 ==? WATER) )
      some?( ($98 ==? LEFT) ($98 ==? HOR_MID) ($98 ==? RIGHT) ) -> all?( ($97 ==? WATER) ($99 ==? WATER) )
      ($98 ==? RIGHT) -> all?( ($a7 ==? WATER) ($a8 ==? WATER) ($a9 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($98 ==? LEFT) -> some?( ($a8 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($98 ==? TOP) |? ($98 ==? VER_MID)) == (($99 ==? VER_MID) |? ($99 ==? BOTTOM))
      (($98 ==? VER_MID) |? ($98 ==? BOTTOM)) == ( ($97 ==? TOP) |? ($97 ==? VER_MID) )
      ($98 ==? TOP) -> all?( ($87 ==? WATER) ($97 ==? WATER) ($a7 ==? WATER) )
      some?( ($98 ==? TOP) ($98 ==? VER_MID) ($98 ==? BOTTOM) ) -> all?( ($88 ==? WATER) ($a8 ==? WATER) )
      ($98 ==? BOTTOM) -> all?( ($89 ==? WATER) ($99 ==? WATER) ($a9 ==? WATER) )
      ($98 ==? TOP) -> some?( ($99 ==? BOTTOM) ($9a ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($98 ==? ONE) -> all?( ($87 ==? WATER) ($97 ==? WATER) ($a7 ==? WATER) ($88 ==? WATER) ($a7 ==? WATER) ($89 ==? WATER) ($99 ==? WATER) ($a9 ==? WATER) )

      # Get size so we can count them
      $98L1 = $98 ==? ONE                                                                              # ●
      $98L2 = (all?( ($98 ==? LEFT) ($a8 ==? RIGHT) )) |? (all?( ($98 ==? TOP) ($99 ==? BOTTOM) ))     # ◀▶
      $98L3 = (all?( ($98 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($98 ==? TOP) ($9a ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $98L4 = (all?( ($98 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($98 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a8

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a8 ==? LEFT) |? ($a8 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a8 ==? HOR_MID) |? ($a8 ==? RIGHT)) == ( ($98 ==? LEFT) |? ($98 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a8 ==? LEFT) -> all?( ($97 ==? WATER) ($98 ==? WATER) ($99 ==? WATER) )
      some?( ($a8 ==? LEFT) ($a8 ==? HOR_MID) ($a8 ==? RIGHT) ) -> all?( ($a7 ==? WATER) ($a9 ==? WATER) )
      ($a8 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a8 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a8 ==? TOP) |? ($a8 ==? VER_MID)) == (($a9 ==? VER_MID) |? ($a9 ==? BOTTOM))
      (($a8 ==? VER_MID) |? ($a8 ==? BOTTOM)) == ( ($a7 ==? TOP) |? ($a7 ==? VER_MID) )
      ($a8 ==? TOP) -> all?( ($97 ==? WATER) ($a7 ==? WATER) (0 ==? WATER) )
      some?( ($a8 ==? TOP) ($a8 ==? VER_MID) ($a8 ==? BOTTOM) ) -> all?( ($98 ==? WATER) (0 ==? WATER) )
      ($a8 ==? BOTTOM) -> all?( ($99 ==? WATER) ($a9 ==? WATER) (0 ==? WATER) )
      ($a8 ==? TOP) -> some?( ($a9 ==? BOTTOM) ($aa ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a8 ==? ONE) -> all?( ($97 ==? WATER) ($a7 ==? WATER) (0 ==? WATER) ($98 ==? WATER) (0 ==? WATER) ($99 ==? WATER) ($a9 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a8L1 = $a8 ==? ONE                                                                              # ●
      $a8L2 = (all?( ($a8 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a8 ==? TOP) ($a9 ==? BOTTOM) ))     # ◀▶
      $a8L3 = (all?( ($a8 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a8 ==? TOP) ($aa ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a8L4 = (all?( ($a8 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a8 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $19

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($19 ==? LEFT) |? ($19 ==? HOR_MID)) == (($29 ==? HOR_MID) |? ($29 ==? RIGHT))
      (($19 ==? HOR_MID) |? ($19 ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($19 ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($19 ==? LEFT) ($19 ==? HOR_MID) ($19 ==? RIGHT) ) -> all?( ($18 ==? WATER) ($1a ==? WATER) )
      ($19 ==? RIGHT) -> all?( ($28 ==? WATER) ($29 ==? WATER) ($2a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($19 ==? LEFT) -> some?( ($29 ==? RIGHT) ($39 ==? RIGHT) ($49 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($19 ==? TOP) |? ($19 ==? VER_MID)) == (($1a ==? VER_MID) |? ($1a ==? BOTTOM))
      (($19 ==? VER_MID) |? ($19 ==? BOTTOM)) == ( ($18 ==? TOP) |? ($18 ==? VER_MID) )
      ($19 ==? TOP) -> all?( (0 ==? WATER) ($18 ==? WATER) ($28 ==? WATER) )
      some?( ($19 ==? TOP) ($19 ==? VER_MID) ($19 ==? BOTTOM) ) -> all?( (0 ==? WATER) ($29 ==? WATER) )
      ($19 ==? BOTTOM) -> all?( (0 ==? WATER) ($1a ==? WATER) ($2a ==? WATER) )
      ($19 ==? TOP) -> some?( ($1a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($19 ==? ONE) -> all?( (0 ==? WATER) ($18 ==? WATER) ($28 ==? WATER) (0 ==? WATER) ($28 ==? WATER) (0 ==? WATER) ($1a ==? WATER) ($2a ==? WATER) )

      # Get size so we can count them
      $19L1 = $19 ==? ONE                                                                              # ●
      $19L2 = (all?( ($19 ==? LEFT) ($29 ==? RIGHT) )) |? (all?( ($19 ==? TOP) ($1a ==? BOTTOM) ))     # ◀▶
      $19L3 = (all?( ($19 ==? LEFT) ($39 ==? RIGHT) )) |? (all?( ($19 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $19L4 = (all?( ($19 ==? LEFT) ($49 ==? RIGHT) )) |? (all?( ($19 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $29

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($29 ==? LEFT) |? ($29 ==? HOR_MID)) == (($39 ==? HOR_MID) |? ($39 ==? RIGHT))
      (($29 ==? HOR_MID) |? ($29 ==? RIGHT)) == ( ($19 ==? LEFT) |? ($19 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($29 ==? LEFT) -> all?( ($18 ==? WATER) ($19 ==? WATER) ($1a ==? WATER) )
      some?( ($29 ==? LEFT) ($29 ==? HOR_MID) ($29 ==? RIGHT) ) -> all?( ($28 ==? WATER) ($2a ==? WATER) )
      ($29 ==? RIGHT) -> all?( ($38 ==? WATER) ($39 ==? WATER) ($3a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($29 ==? LEFT) -> some?( ($39 ==? RIGHT) ($49 ==? RIGHT) ($59 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($29 ==? TOP) |? ($29 ==? VER_MID)) == (($2a ==? VER_MID) |? ($2a ==? BOTTOM))
      (($29 ==? VER_MID) |? ($29 ==? BOTTOM)) == ( ($28 ==? TOP) |? ($28 ==? VER_MID) )
      ($29 ==? TOP) -> all?( ($18 ==? WATER) ($28 ==? WATER) ($38 ==? WATER) )
      some?( ($29 ==? TOP) ($29 ==? VER_MID) ($29 ==? BOTTOM) ) -> all?( ($19 ==? WATER) ($39 ==? WATER) )
      ($29 ==? BOTTOM) -> all?( ($1a ==? WATER) ($2a ==? WATER) ($3a ==? WATER) )
      ($29 ==? TOP) -> some?( ($2a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($29 ==? ONE) -> all?( ($18 ==? WATER) ($28 ==? WATER) ($38 ==? WATER) ($19 ==? WATER) ($38 ==? WATER) ($1a ==? WATER) ($2a ==? WATER) ($3a ==? WATER) )

      # Get size so we can count them
      $29L1 = $29 ==? ONE                                                                              # ●
      $29L2 = (all?( ($29 ==? LEFT) ($39 ==? RIGHT) )) |? (all?( ($29 ==? TOP) ($2a ==? BOTTOM) ))     # ◀▶
      $29L3 = (all?( ($29 ==? LEFT) ($49 ==? RIGHT) )) |? (all?( ($29 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $29L4 = (all?( ($29 ==? LEFT) ($59 ==? RIGHT) )) |? (all?( ($29 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $39

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($39 ==? LEFT) |? ($39 ==? HOR_MID)) == (($49 ==? HOR_MID) |? ($49 ==? RIGHT))
      (($39 ==? HOR_MID) |? ($39 ==? RIGHT)) == ( ($29 ==? LEFT) |? ($29 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($39 ==? LEFT) -> all?( ($28 ==? WATER) ($29 ==? WATER) ($2a ==? WATER) )
      some?( ($39 ==? LEFT) ($39 ==? HOR_MID) ($39 ==? RIGHT) ) -> all?( ($38 ==? WATER) ($3a ==? WATER) )
      ($39 ==? RIGHT) -> all?( ($48 ==? WATER) ($49 ==? WATER) ($4a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($39 ==? LEFT) -> some?( ($49 ==? RIGHT) ($59 ==? RIGHT) ($69 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($39 ==? TOP) |? ($39 ==? VER_MID)) == (($3a ==? VER_MID) |? ($3a ==? BOTTOM))
      (($39 ==? VER_MID) |? ($39 ==? BOTTOM)) == ( ($38 ==? TOP) |? ($38 ==? VER_MID) )
      ($39 ==? TOP) -> all?( ($28 ==? WATER) ($38 ==? WATER) ($48 ==? WATER) )
      some?( ($39 ==? TOP) ($39 ==? VER_MID) ($39 ==? BOTTOM) ) -> all?( ($29 ==? WATER) ($49 ==? WATER) )
      ($39 ==? BOTTOM) -> all?( ($2a ==? WATER) ($3a ==? WATER) ($4a ==? WATER) )
      ($39 ==? TOP) -> some?( ($3a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($39 ==? ONE) -> all?( ($28 ==? WATER) ($38 ==? WATER) ($48 ==? WATER) ($29 ==? WATER) ($48 ==? WATER) ($2a ==? WATER) ($3a ==? WATER) ($4a ==? WATER) )

      # Get size so we can count them
      $39L1 = $39 ==? ONE                                                                              # ●
      $39L2 = (all?( ($39 ==? LEFT) ($49 ==? RIGHT) )) |? (all?( ($39 ==? TOP) ($3a ==? BOTTOM) ))     # ◀▶
      $39L3 = (all?( ($39 ==? LEFT) ($59 ==? RIGHT) )) |? (all?( ($39 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $39L4 = (all?( ($39 ==? LEFT) ($69 ==? RIGHT) )) |? (all?( ($39 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $49

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($49 ==? LEFT) |? ($49 ==? HOR_MID)) == (($59 ==? HOR_MID) |? ($59 ==? RIGHT))
      (($49 ==? HOR_MID) |? ($49 ==? RIGHT)) == ( ($39 ==? LEFT) |? ($39 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($49 ==? LEFT) -> all?( ($38 ==? WATER) ($39 ==? WATER) ($3a ==? WATER) )
      some?( ($49 ==? LEFT) ($49 ==? HOR_MID) ($49 ==? RIGHT) ) -> all?( ($48 ==? WATER) ($4a ==? WATER) )
      ($49 ==? RIGHT) -> all?( ($58 ==? WATER) ($59 ==? WATER) ($5a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($49 ==? LEFT) -> some?( ($59 ==? RIGHT) ($69 ==? RIGHT) ($79 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($49 ==? TOP) |? ($49 ==? VER_MID)) == (($4a ==? VER_MID) |? ($4a ==? BOTTOM))
      (($49 ==? VER_MID) |? ($49 ==? BOTTOM)) == ( ($48 ==? TOP) |? ($48 ==? VER_MID) )
      ($49 ==? TOP) -> all?( ($38 ==? WATER) ($48 ==? WATER) ($58 ==? WATER) )
      some?( ($49 ==? TOP) ($49 ==? VER_MID) ($49 ==? BOTTOM) ) -> all?( ($39 ==? WATER) ($59 ==? WATER) )
      ($49 ==? BOTTOM) -> all?( ($3a ==? WATER) ($4a ==? WATER) ($5a ==? WATER) )
      ($49 ==? TOP) -> some?( ($4a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($49 ==? ONE) -> all?( ($38 ==? WATER) ($48 ==? WATER) ($58 ==? WATER) ($39 ==? WATER) ($58 ==? WATER) ($3a ==? WATER) ($4a ==? WATER) ($5a ==? WATER) )

      # Get size so we can count them
      $49L1 = $49 ==? ONE                                                                              # ●
      $49L2 = (all?( ($49 ==? LEFT) ($59 ==? RIGHT) )) |? (all?( ($49 ==? TOP) ($4a ==? BOTTOM) ))     # ◀▶
      $49L3 = (all?( ($49 ==? LEFT) ($69 ==? RIGHT) )) |? (all?( ($49 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $49L4 = (all?( ($49 ==? LEFT) ($79 ==? RIGHT) )) |? (all?( ($49 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $59

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($59 ==? LEFT) |? ($59 ==? HOR_MID)) == (($69 ==? HOR_MID) |? ($69 ==? RIGHT))
      (($59 ==? HOR_MID) |? ($59 ==? RIGHT)) == ( ($49 ==? LEFT) |? ($49 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($59 ==? LEFT) -> all?( ($48 ==? WATER) ($49 ==? WATER) ($4a ==? WATER) )
      some?( ($59 ==? LEFT) ($59 ==? HOR_MID) ($59 ==? RIGHT) ) -> all?( ($58 ==? WATER) ($5a ==? WATER) )
      ($59 ==? RIGHT) -> all?( ($68 ==? WATER) ($69 ==? WATER) ($6a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($59 ==? LEFT) -> some?( ($69 ==? RIGHT) ($79 ==? RIGHT) ($89 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($59 ==? TOP) |? ($59 ==? VER_MID)) == (($5a ==? VER_MID) |? ($5a ==? BOTTOM))
      (($59 ==? VER_MID) |? ($59 ==? BOTTOM)) == ( ($58 ==? TOP) |? ($58 ==? VER_MID) )
      ($59 ==? TOP) -> all?( ($48 ==? WATER) ($58 ==? WATER) ($68 ==? WATER) )
      some?( ($59 ==? TOP) ($59 ==? VER_MID) ($59 ==? BOTTOM) ) -> all?( ($49 ==? WATER) ($69 ==? WATER) )
      ($59 ==? BOTTOM) -> all?( ($4a ==? WATER) ($5a ==? WATER) ($6a ==? WATER) )
      ($59 ==? TOP) -> some?( ($5a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($59 ==? ONE) -> all?( ($48 ==? WATER) ($58 ==? WATER) ($68 ==? WATER) ($49 ==? WATER) ($68 ==? WATER) ($4a ==? WATER) ($5a ==? WATER) ($6a ==? WATER) )

      # Get size so we can count them
      $59L1 = $59 ==? ONE                                                                              # ●
      $59L2 = (all?( ($59 ==? LEFT) ($69 ==? RIGHT) )) |? (all?( ($59 ==? TOP) ($5a ==? BOTTOM) ))     # ◀▶
      $59L3 = (all?( ($59 ==? LEFT) ($79 ==? RIGHT) )) |? (all?( ($59 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $59L4 = (all?( ($59 ==? LEFT) ($89 ==? RIGHT) )) |? (all?( ($59 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $69

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($69 ==? LEFT) |? ($69 ==? HOR_MID)) == (($79 ==? HOR_MID) |? ($79 ==? RIGHT))
      (($69 ==? HOR_MID) |? ($69 ==? RIGHT)) == ( ($59 ==? LEFT) |? ($59 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($69 ==? LEFT) -> all?( ($58 ==? WATER) ($59 ==? WATER) ($5a ==? WATER) )
      some?( ($69 ==? LEFT) ($69 ==? HOR_MID) ($69 ==? RIGHT) ) -> all?( ($68 ==? WATER) ($6a ==? WATER) )
      ($69 ==? RIGHT) -> all?( ($78 ==? WATER) ($79 ==? WATER) ($7a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($69 ==? LEFT) -> some?( ($79 ==? RIGHT) ($89 ==? RIGHT) ($99 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($69 ==? TOP) |? ($69 ==? VER_MID)) == (($6a ==? VER_MID) |? ($6a ==? BOTTOM))
      (($69 ==? VER_MID) |? ($69 ==? BOTTOM)) == ( ($68 ==? TOP) |? ($68 ==? VER_MID) )
      ($69 ==? TOP) -> all?( ($58 ==? WATER) ($68 ==? WATER) ($78 ==? WATER) )
      some?( ($69 ==? TOP) ($69 ==? VER_MID) ($69 ==? BOTTOM) ) -> all?( ($59 ==? WATER) ($79 ==? WATER) )
      ($69 ==? BOTTOM) -> all?( ($5a ==? WATER) ($6a ==? WATER) ($7a ==? WATER) )
      ($69 ==? TOP) -> some?( ($6a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($69 ==? ONE) -> all?( ($58 ==? WATER) ($68 ==? WATER) ($78 ==? WATER) ($59 ==? WATER) ($78 ==? WATER) ($5a ==? WATER) ($6a ==? WATER) ($7a ==? WATER) )

      # Get size so we can count them
      $69L1 = $69 ==? ONE                                                                              # ●
      $69L2 = (all?( ($69 ==? LEFT) ($79 ==? RIGHT) )) |? (all?( ($69 ==? TOP) ($6a ==? BOTTOM) ))     # ◀▶
      $69L3 = (all?( ($69 ==? LEFT) ($89 ==? RIGHT) )) |? (all?( ($69 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $69L4 = (all?( ($69 ==? LEFT) ($99 ==? RIGHT) )) |? (all?( ($69 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $79

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($79 ==? LEFT) |? ($79 ==? HOR_MID)) == (($89 ==? HOR_MID) |? ($89 ==? RIGHT))
      (($79 ==? HOR_MID) |? ($79 ==? RIGHT)) == ( ($69 ==? LEFT) |? ($69 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($79 ==? LEFT) -> all?( ($68 ==? WATER) ($69 ==? WATER) ($6a ==? WATER) )
      some?( ($79 ==? LEFT) ($79 ==? HOR_MID) ($79 ==? RIGHT) ) -> all?( ($78 ==? WATER) ($7a ==? WATER) )
      ($79 ==? RIGHT) -> all?( ($88 ==? WATER) ($89 ==? WATER) ($8a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($79 ==? LEFT) -> some?( ($89 ==? RIGHT) ($99 ==? RIGHT) ($a9 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($79 ==? TOP) |? ($79 ==? VER_MID)) == (($7a ==? VER_MID) |? ($7a ==? BOTTOM))
      (($79 ==? VER_MID) |? ($79 ==? BOTTOM)) == ( ($78 ==? TOP) |? ($78 ==? VER_MID) )
      ($79 ==? TOP) -> all?( ($68 ==? WATER) ($78 ==? WATER) ($88 ==? WATER) )
      some?( ($79 ==? TOP) ($79 ==? VER_MID) ($79 ==? BOTTOM) ) -> all?( ($69 ==? WATER) ($89 ==? WATER) )
      ($79 ==? BOTTOM) -> all?( ($6a ==? WATER) ($7a ==? WATER) ($8a ==? WATER) )
      ($79 ==? TOP) -> some?( ($7a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($79 ==? ONE) -> all?( ($68 ==? WATER) ($78 ==? WATER) ($88 ==? WATER) ($69 ==? WATER) ($88 ==? WATER) ($6a ==? WATER) ($7a ==? WATER) ($8a ==? WATER) )

      # Get size so we can count them
      $79L1 = $79 ==? ONE                                                                              # ●
      $79L2 = (all?( ($79 ==? LEFT) ($89 ==? RIGHT) )) |? (all?( ($79 ==? TOP) ($7a ==? BOTTOM) ))     # ◀▶
      $79L3 = (all?( ($79 ==? LEFT) ($99 ==? RIGHT) )) |? (all?( ($79 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $79L4 = (all?( ($79 ==? LEFT) ($a9 ==? RIGHT) )) |? (all?( ($79 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $89

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($89 ==? LEFT) |? ($89 ==? HOR_MID)) == (($99 ==? HOR_MID) |? ($99 ==? RIGHT))
      (($89 ==? HOR_MID) |? ($89 ==? RIGHT)) == ( ($79 ==? LEFT) |? ($79 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($89 ==? LEFT) -> all?( ($78 ==? WATER) ($79 ==? WATER) ($7a ==? WATER) )
      some?( ($89 ==? LEFT) ($89 ==? HOR_MID) ($89 ==? RIGHT) ) -> all?( ($88 ==? WATER) ($8a ==? WATER) )
      ($89 ==? RIGHT) -> all?( ($98 ==? WATER) ($99 ==? WATER) ($9a ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($89 ==? LEFT) -> some?( ($99 ==? RIGHT) ($a9 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($89 ==? TOP) |? ($89 ==? VER_MID)) == (($8a ==? VER_MID) |? ($8a ==? BOTTOM))
      (($89 ==? VER_MID) |? ($89 ==? BOTTOM)) == ( ($88 ==? TOP) |? ($88 ==? VER_MID) )
      ($89 ==? TOP) -> all?( ($78 ==? WATER) ($88 ==? WATER) ($98 ==? WATER) )
      some?( ($89 ==? TOP) ($89 ==? VER_MID) ($89 ==? BOTTOM) ) -> all?( ($79 ==? WATER) ($99 ==? WATER) )
      ($89 ==? BOTTOM) -> all?( ($7a ==? WATER) ($8a ==? WATER) ($9a ==? WATER) )
      ($89 ==? TOP) -> some?( ($8a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($89 ==? ONE) -> all?( ($78 ==? WATER) ($88 ==? WATER) ($98 ==? WATER) ($79 ==? WATER) ($98 ==? WATER) ($7a ==? WATER) ($8a ==? WATER) ($9a ==? WATER) )

      # Get size so we can count them
      $89L1 = $89 ==? ONE                                                                              # ●
      $89L2 = (all?( ($89 ==? LEFT) ($99 ==? RIGHT) )) |? (all?( ($89 ==? TOP) ($8a ==? BOTTOM) ))     # ◀▶
      $89L3 = (all?( ($89 ==? LEFT) ($a9 ==? RIGHT) )) |? (all?( ($89 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $89L4 = (all?( ($89 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($89 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $99

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($99 ==? LEFT) |? ($99 ==? HOR_MID)) == (($a9 ==? HOR_MID) |? ($a9 ==? RIGHT))
      (($99 ==? HOR_MID) |? ($99 ==? RIGHT)) == ( ($89 ==? LEFT) |? ($89 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($99 ==? LEFT) -> all?( ($88 ==? WATER) ($89 ==? WATER) ($8a ==? WATER) )
      some?( ($99 ==? LEFT) ($99 ==? HOR_MID) ($99 ==? RIGHT) ) -> all?( ($98 ==? WATER) ($9a ==? WATER) )
      ($99 ==? RIGHT) -> all?( ($a8 ==? WATER) ($a9 ==? WATER) ($aa ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($99 ==? LEFT) -> some?( ($a9 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($99 ==? TOP) |? ($99 ==? VER_MID)) == (($9a ==? VER_MID) |? ($9a ==? BOTTOM))
      (($99 ==? VER_MID) |? ($99 ==? BOTTOM)) == ( ($98 ==? TOP) |? ($98 ==? VER_MID) )
      ($99 ==? TOP) -> all?( ($88 ==? WATER) ($98 ==? WATER) ($a8 ==? WATER) )
      some?( ($99 ==? TOP) ($99 ==? VER_MID) ($99 ==? BOTTOM) ) -> all?( ($89 ==? WATER) ($a9 ==? WATER) )
      ($99 ==? BOTTOM) -> all?( ($8a ==? WATER) ($9a ==? WATER) ($aa ==? WATER) )
      ($99 ==? TOP) -> some?( ($9a ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($99 ==? ONE) -> all?( ($88 ==? WATER) ($98 ==? WATER) ($a8 ==? WATER) ($89 ==? WATER) ($a8 ==? WATER) ($8a ==? WATER) ($9a ==? WATER) ($aa ==? WATER) )

      # Get size so we can count them
      $99L1 = $99 ==? ONE                                                                              # ●
      $99L2 = (all?( ($99 ==? LEFT) ($a9 ==? RIGHT) )) |? (all?( ($99 ==? TOP) ($9a ==? BOTTOM) ))     # ◀▶
      $99L3 = (all?( ($99 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($99 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $99L4 = (all?( ($99 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($99 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $a9

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($a9 ==? LEFT) |? ($a9 ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($a9 ==? HOR_MID) |? ($a9 ==? RIGHT)) == ( ($99 ==? LEFT) |? ($99 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($a9 ==? LEFT) -> all?( ($98 ==? WATER) ($99 ==? WATER) ($9a ==? WATER) )
      some?( ($a9 ==? LEFT) ($a9 ==? HOR_MID) ($a9 ==? RIGHT) ) -> all?( ($a8 ==? WATER) ($aa ==? WATER) )
      ($a9 ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($a9 ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($a9 ==? TOP) |? ($a9 ==? VER_MID)) == (($aa ==? VER_MID) |? ($aa ==? BOTTOM))
      (($a9 ==? VER_MID) |? ($a9 ==? BOTTOM)) == ( ($a8 ==? TOP) |? ($a8 ==? VER_MID) )
      ($a9 ==? TOP) -> all?( ($98 ==? WATER) ($a8 ==? WATER) (0 ==? WATER) )
      some?( ($a9 ==? TOP) ($a9 ==? VER_MID) ($a9 ==? BOTTOM) ) -> all?( ($99 ==? WATER) (0 ==? WATER) )
      ($a9 ==? BOTTOM) -> all?( ($9a ==? WATER) ($aa ==? WATER) (0 ==? WATER) )
      ($a9 ==? TOP) -> some?( ($aa ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($a9 ==? ONE) -> all?( ($98 ==? WATER) ($a8 ==? WATER) (0 ==? WATER) ($99 ==? WATER) (0 ==? WATER) ($9a ==? WATER) ($aa ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $a9L1 = $a9 ==? ONE                                                                              # ●
      $a9L2 = (all?( ($a9 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a9 ==? TOP) ($aa ==? BOTTOM) ))     # ◀▶
      $a9L3 = (all?( ($a9 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a9 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $a9L4 = (all?( ($a9 ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($a9 ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $1a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($1a ==? LEFT) |? ($1a ==? HOR_MID)) == (($2a ==? HOR_MID) |? ($2a ==? RIGHT))
      (($1a ==? HOR_MID) |? ($1a ==? RIGHT)) == ( (0 ==? LEFT) |? (0 ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($1a ==? LEFT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      some?( ($1a ==? LEFT) ($1a ==? HOR_MID) ($1a ==? RIGHT) ) -> all?( ($19 ==? WATER) (0 ==? WATER) )
      ($1a ==? RIGHT) -> all?( ($29 ==? WATER) ($2a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($1a ==? LEFT) -> some?( ($2a ==? RIGHT) ($3a ==? RIGHT) ($4a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($1a ==? TOP) |? ($1a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($1a ==? VER_MID) |? ($1a ==? BOTTOM)) == ( ($19 ==? TOP) |? ($19 ==? VER_MID) )
      ($1a ==? TOP) -> all?( (0 ==? WATER) ($19 ==? WATER) ($29 ==? WATER) )
      some?( ($1a ==? TOP) ($1a ==? VER_MID) ($1a ==? BOTTOM) ) -> all?( (0 ==? WATER) ($2a ==? WATER) )
      ($1a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($1a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($1a ==? ONE) -> all?( (0 ==? WATER) ($19 ==? WATER) ($29 ==? WATER) (0 ==? WATER) ($29 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $1aL1 = $1a ==? ONE                                                                              # ●
      $1aL2 = (all?( ($1a ==? LEFT) ($2a ==? RIGHT) )) |? (all?( ($1a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $1aL3 = (all?( ($1a ==? LEFT) ($3a ==? RIGHT) )) |? (all?( ($1a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $1aL4 = (all?( ($1a ==? LEFT) ($4a ==? RIGHT) )) |? (all?( ($1a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $2a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($2a ==? LEFT) |? ($2a ==? HOR_MID)) == (($3a ==? HOR_MID) |? ($3a ==? RIGHT))
      (($2a ==? HOR_MID) |? ($2a ==? RIGHT)) == ( ($1a ==? LEFT) |? ($1a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($2a ==? LEFT) -> all?( ($19 ==? WATER) ($1a ==? WATER) (0 ==? WATER) )
      some?( ($2a ==? LEFT) ($2a ==? HOR_MID) ($2a ==? RIGHT) ) -> all?( ($29 ==? WATER) (0 ==? WATER) )
      ($2a ==? RIGHT) -> all?( ($39 ==? WATER) ($3a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($2a ==? LEFT) -> some?( ($3a ==? RIGHT) ($4a ==? RIGHT) ($5a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($2a ==? TOP) |? ($2a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($2a ==? VER_MID) |? ($2a ==? BOTTOM)) == ( ($29 ==? TOP) |? ($29 ==? VER_MID) )
      ($2a ==? TOP) -> all?( ($19 ==? WATER) ($29 ==? WATER) ($39 ==? WATER) )
      some?( ($2a ==? TOP) ($2a ==? VER_MID) ($2a ==? BOTTOM) ) -> all?( ($1a ==? WATER) ($3a ==? WATER) )
      ($2a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($2a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($2a ==? ONE) -> all?( ($19 ==? WATER) ($29 ==? WATER) ($39 ==? WATER) ($1a ==? WATER) ($39 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $2aL1 = $2a ==? ONE                                                                              # ●
      $2aL2 = (all?( ($2a ==? LEFT) ($3a ==? RIGHT) )) |? (all?( ($2a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $2aL3 = (all?( ($2a ==? LEFT) ($4a ==? RIGHT) )) |? (all?( ($2a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $2aL4 = (all?( ($2a ==? LEFT) ($5a ==? RIGHT) )) |? (all?( ($2a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $3a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($3a ==? LEFT) |? ($3a ==? HOR_MID)) == (($4a ==? HOR_MID) |? ($4a ==? RIGHT))
      (($3a ==? HOR_MID) |? ($3a ==? RIGHT)) == ( ($2a ==? LEFT) |? ($2a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($3a ==? LEFT) -> all?( ($29 ==? WATER) ($2a ==? WATER) (0 ==? WATER) )
      some?( ($3a ==? LEFT) ($3a ==? HOR_MID) ($3a ==? RIGHT) ) -> all?( ($39 ==? WATER) (0 ==? WATER) )
      ($3a ==? RIGHT) -> all?( ($49 ==? WATER) ($4a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($3a ==? LEFT) -> some?( ($4a ==? RIGHT) ($5a ==? RIGHT) ($6a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($3a ==? TOP) |? ($3a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($3a ==? VER_MID) |? ($3a ==? BOTTOM)) == ( ($39 ==? TOP) |? ($39 ==? VER_MID) )
      ($3a ==? TOP) -> all?( ($29 ==? WATER) ($39 ==? WATER) ($49 ==? WATER) )
      some?( ($3a ==? TOP) ($3a ==? VER_MID) ($3a ==? BOTTOM) ) -> all?( ($2a ==? WATER) ($4a ==? WATER) )
      ($3a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($3a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($3a ==? ONE) -> all?( ($29 ==? WATER) ($39 ==? WATER) ($49 ==? WATER) ($2a ==? WATER) ($49 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $3aL1 = $3a ==? ONE                                                                              # ●
      $3aL2 = (all?( ($3a ==? LEFT) ($4a ==? RIGHT) )) |? (all?( ($3a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $3aL3 = (all?( ($3a ==? LEFT) ($5a ==? RIGHT) )) |? (all?( ($3a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $3aL4 = (all?( ($3a ==? LEFT) ($6a ==? RIGHT) )) |? (all?( ($3a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $4a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($4a ==? LEFT) |? ($4a ==? HOR_MID)) == (($5a ==? HOR_MID) |? ($5a ==? RIGHT))
      (($4a ==? HOR_MID) |? ($4a ==? RIGHT)) == ( ($3a ==? LEFT) |? ($3a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($4a ==? LEFT) -> all?( ($39 ==? WATER) ($3a ==? WATER) (0 ==? WATER) )
      some?( ($4a ==? LEFT) ($4a ==? HOR_MID) ($4a ==? RIGHT) ) -> all?( ($49 ==? WATER) (0 ==? WATER) )
      ($4a ==? RIGHT) -> all?( ($59 ==? WATER) ($5a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($4a ==? LEFT) -> some?( ($5a ==? RIGHT) ($6a ==? RIGHT) ($7a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($4a ==? TOP) |? ($4a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($4a ==? VER_MID) |? ($4a ==? BOTTOM)) == ( ($49 ==? TOP) |? ($49 ==? VER_MID) )
      ($4a ==? TOP) -> all?( ($39 ==? WATER) ($49 ==? WATER) ($59 ==? WATER) )
      some?( ($4a ==? TOP) ($4a ==? VER_MID) ($4a ==? BOTTOM) ) -> all?( ($3a ==? WATER) ($5a ==? WATER) )
      ($4a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($4a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($4a ==? ONE) -> all?( ($39 ==? WATER) ($49 ==? WATER) ($59 ==? WATER) ($3a ==? WATER) ($59 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $4aL1 = $4a ==? ONE                                                                              # ●
      $4aL2 = (all?( ($4a ==? LEFT) ($5a ==? RIGHT) )) |? (all?( ($4a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $4aL3 = (all?( ($4a ==? LEFT) ($6a ==? RIGHT) )) |? (all?( ($4a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $4aL4 = (all?( ($4a ==? LEFT) ($7a ==? RIGHT) )) |? (all?( ($4a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $5a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($5a ==? LEFT) |? ($5a ==? HOR_MID)) == (($6a ==? HOR_MID) |? ($6a ==? RIGHT))
      (($5a ==? HOR_MID) |? ($5a ==? RIGHT)) == ( ($4a ==? LEFT) |? ($4a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($5a ==? LEFT) -> all?( ($49 ==? WATER) ($4a ==? WATER) (0 ==? WATER) )
      some?( ($5a ==? LEFT) ($5a ==? HOR_MID) ($5a ==? RIGHT) ) -> all?( ($59 ==? WATER) (0 ==? WATER) )
      ($5a ==? RIGHT) -> all?( ($69 ==? WATER) ($6a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($5a ==? LEFT) -> some?( ($6a ==? RIGHT) ($7a ==? RIGHT) ($8a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($5a ==? TOP) |? ($5a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($5a ==? VER_MID) |? ($5a ==? BOTTOM)) == ( ($59 ==? TOP) |? ($59 ==? VER_MID) )
      ($5a ==? TOP) -> all?( ($49 ==? WATER) ($59 ==? WATER) ($69 ==? WATER) )
      some?( ($5a ==? TOP) ($5a ==? VER_MID) ($5a ==? BOTTOM) ) -> all?( ($4a ==? WATER) ($6a ==? WATER) )
      ($5a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($5a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($5a ==? ONE) -> all?( ($49 ==? WATER) ($59 ==? WATER) ($69 ==? WATER) ($4a ==? WATER) ($69 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $5aL1 = $5a ==? ONE                                                                              # ●
      $5aL2 = (all?( ($5a ==? LEFT) ($6a ==? RIGHT) )) |? (all?( ($5a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $5aL3 = (all?( ($5a ==? LEFT) ($7a ==? RIGHT) )) |? (all?( ($5a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $5aL4 = (all?( ($5a ==? LEFT) ($8a ==? RIGHT) )) |? (all?( ($5a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $6a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($6a ==? LEFT) |? ($6a ==? HOR_MID)) == (($7a ==? HOR_MID) |? ($7a ==? RIGHT))
      (($6a ==? HOR_MID) |? ($6a ==? RIGHT)) == ( ($5a ==? LEFT) |? ($5a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($6a ==? LEFT) -> all?( ($59 ==? WATER) ($5a ==? WATER) (0 ==? WATER) )
      some?( ($6a ==? LEFT) ($6a ==? HOR_MID) ($6a ==? RIGHT) ) -> all?( ($69 ==? WATER) (0 ==? WATER) )
      ($6a ==? RIGHT) -> all?( ($79 ==? WATER) ($7a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($6a ==? LEFT) -> some?( ($7a ==? RIGHT) ($8a ==? RIGHT) ($9a ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($6a ==? TOP) |? ($6a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($6a ==? VER_MID) |? ($6a ==? BOTTOM)) == ( ($69 ==? TOP) |? ($69 ==? VER_MID) )
      ($6a ==? TOP) -> all?( ($59 ==? WATER) ($69 ==? WATER) ($79 ==? WATER) )
      some?( ($6a ==? TOP) ($6a ==? VER_MID) ($6a ==? BOTTOM) ) -> all?( ($5a ==? WATER) ($7a ==? WATER) )
      ($6a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($6a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($6a ==? ONE) -> all?( ($59 ==? WATER) ($69 ==? WATER) ($79 ==? WATER) ($5a ==? WATER) ($79 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $6aL1 = $6a ==? ONE                                                                              # ●
      $6aL2 = (all?( ($6a ==? LEFT) ($7a ==? RIGHT) )) |? (all?( ($6a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $6aL3 = (all?( ($6a ==? LEFT) ($8a ==? RIGHT) )) |? (all?( ($6a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $6aL4 = (all?( ($6a ==? LEFT) ($9a ==? RIGHT) )) |? (all?( ($6a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $7a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($7a ==? LEFT) |? ($7a ==? HOR_MID)) == (($8a ==? HOR_MID) |? ($8a ==? RIGHT))
      (($7a ==? HOR_MID) |? ($7a ==? RIGHT)) == ( ($6a ==? LEFT) |? ($6a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($7a ==? LEFT) -> all?( ($69 ==? WATER) ($6a ==? WATER) (0 ==? WATER) )
      some?( ($7a ==? LEFT) ($7a ==? HOR_MID) ($7a ==? RIGHT) ) -> all?( ($79 ==? WATER) (0 ==? WATER) )
      ($7a ==? RIGHT) -> all?( ($89 ==? WATER) ($8a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($7a ==? LEFT) -> some?( ($8a ==? RIGHT) ($9a ==? RIGHT) ($aa ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($7a ==? TOP) |? ($7a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($7a ==? VER_MID) |? ($7a ==? BOTTOM)) == ( ($79 ==? TOP) |? ($79 ==? VER_MID) )
      ($7a ==? TOP) -> all?( ($69 ==? WATER) ($79 ==? WATER) ($89 ==? WATER) )
      some?( ($7a ==? TOP) ($7a ==? VER_MID) ($7a ==? BOTTOM) ) -> all?( ($6a ==? WATER) ($8a ==? WATER) )
      ($7a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($7a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($7a ==? ONE) -> all?( ($69 ==? WATER) ($79 ==? WATER) ($89 ==? WATER) ($6a ==? WATER) ($89 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $7aL1 = $7a ==? ONE                                                                              # ●
      $7aL2 = (all?( ($7a ==? LEFT) ($8a ==? RIGHT) )) |? (all?( ($7a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $7aL3 = (all?( ($7a ==? LEFT) ($9a ==? RIGHT) )) |? (all?( ($7a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $7aL4 = (all?( ($7a ==? LEFT) ($aa ==? RIGHT) )) |? (all?( ($7a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $8a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($8a ==? LEFT) |? ($8a ==? HOR_MID)) == (($9a ==? HOR_MID) |? ($9a ==? RIGHT))
      (($8a ==? HOR_MID) |? ($8a ==? RIGHT)) == ( ($7a ==? LEFT) |? ($7a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($8a ==? LEFT) -> all?( ($79 ==? WATER) ($7a ==? WATER) (0 ==? WATER) )
      some?( ($8a ==? LEFT) ($8a ==? HOR_MID) ($8a ==? RIGHT) ) -> all?( ($89 ==? WATER) (0 ==? WATER) )
      ($8a ==? RIGHT) -> all?( ($99 ==? WATER) ($9a ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($8a ==? LEFT) -> some?( ($9a ==? RIGHT) ($aa ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($8a ==? TOP) |? ($8a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($8a ==? VER_MID) |? ($8a ==? BOTTOM)) == ( ($89 ==? TOP) |? ($89 ==? VER_MID) )
      ($8a ==? TOP) -> all?( ($79 ==? WATER) ($89 ==? WATER) ($99 ==? WATER) )
      some?( ($8a ==? TOP) ($8a ==? VER_MID) ($8a ==? BOTTOM) ) -> all?( ($7a ==? WATER) ($9a ==? WATER) )
      ($8a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($8a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($8a ==? ONE) -> all?( ($79 ==? WATER) ($89 ==? WATER) ($99 ==? WATER) ($7a ==? WATER) ($99 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $8aL1 = $8a ==? ONE                                                                              # ●
      $8aL2 = (all?( ($8a ==? LEFT) ($9a ==? RIGHT) )) |? (all?( ($8a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $8aL3 = (all?( ($8a ==? LEFT) ($aa ==? RIGHT) )) |? (all?( ($8a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $8aL4 = (all?( ($8a ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($8a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $9a

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($9a ==? LEFT) |? ($9a ==? HOR_MID)) == (($aa ==? HOR_MID) |? ($aa ==? RIGHT))
      (($9a ==? HOR_MID) |? ($9a ==? RIGHT)) == ( ($8a ==? LEFT) |? ($8a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($9a ==? LEFT) -> all?( ($89 ==? WATER) ($8a ==? WATER) (0 ==? WATER) )
      some?( ($9a ==? LEFT) ($9a ==? HOR_MID) ($9a ==? RIGHT) ) -> all?( ($99 ==? WATER) (0 ==? WATER) )
      ($9a ==? RIGHT) -> all?( ($a9 ==? WATER) ($aa ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($9a ==? LEFT) -> some?( ($aa ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($9a ==? TOP) |? ($9a ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($9a ==? VER_MID) |? ($9a ==? BOTTOM)) == ( ($99 ==? TOP) |? ($99 ==? VER_MID) )
      ($9a ==? TOP) -> all?( ($89 ==? WATER) ($99 ==? WATER) ($a9 ==? WATER) )
      some?( ($9a ==? TOP) ($9a ==? VER_MID) ($9a ==? BOTTOM) ) -> all?( ($8a ==? WATER) ($aa ==? WATER) )
      ($9a ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($9a ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($9a ==? ONE) -> all?( ($89 ==? WATER) ($99 ==? WATER) ($a9 ==? WATER) ($8a ==? WATER) ($a9 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $9aL1 = $9a ==? ONE                                                                              # ●
      $9aL2 = (all?( ($9a ==? LEFT) ($aa ==? RIGHT) )) |? (all?( ($9a ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $9aL3 = (all?( ($9a ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($9a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $9aL4 = (all?( ($9a ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($9a ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats



      ### Cell: $aa

      # Check pieces of a horizontal boat. LEFT and HOR_MID must have HOR_MID or RIGHT to their right.
      (($aa ==? LEFT) |? ($aa ==? HOR_MID)) == ((0 ==? HOR_MID) |? (0 ==? RIGHT))
      (($aa ==? HOR_MID) |? ($aa ==? RIGHT)) == ( ($9a ==? LEFT) |? ($9a ==? HOR_MID) )
      # Check for water of horizontal boat pieces
      ($aa ==? LEFT) -> all?( ($99 ==? WATER) ($9a ==? WATER) (0 ==? WATER) )
      some?( ($aa ==? LEFT) ($aa ==? HOR_MID) ($aa ==? RIGHT) ) -> all?( ($a9 ==? WATER) (0 ==? WATER) )
      ($aa ==? RIGHT) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      # Restrict a boat size to 4 (note: <><> is illegal)
      ($aa ==? LEFT) -> some?( (0 ==? RIGHT) (0 ==? RIGHT) (0 ==? RIGHT))

      # Now do the same for vertical boats. Same logic so no comments.
      (($aa ==? TOP) |? ($aa ==? VER_MID)) == ((0 ==? VER_MID) |? (0 ==? BOTTOM))
      (($aa ==? VER_MID) |? ($aa ==? BOTTOM)) == ( ($a9 ==? TOP) |? ($a9 ==? VER_MID) )
      ($aa ==? TOP) -> all?( ($99 ==? WATER) ($a9 ==? WATER) (0 ==? WATER) )
      some?( ($aa ==? TOP) ($aa ==? VER_MID) ($aa ==? BOTTOM) ) -> all?( ($9a ==? WATER) (0 ==? WATER) )
      ($aa ==? BOTTOM) -> all?( (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )
      ($aa ==? TOP) -> some?( (0 ==? BOTTOM) (0 ==? BOTTOM) (0 ==? BOTTOM))

      # 1x1 boats (if that then completely surrounded by water)
      ($aa ==? ONE) -> all?( ($99 ==? WATER) ($a9 ==? WATER) (0 ==? WATER) ($9a ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) (0 ==? WATER) )

      # Get size so we can count them
      $aaL1 = $aa ==? ONE                                                                              # ●
      $aaL2 = (all?( ($aa ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($aa ==? TOP) (0 ==? BOTTOM) ))     # ◀▶
      $aaL3 = (all?( ($aa ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($aa ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▶    if ki=right then ji must be mid, no need to check this
      $aaL4 = (all?( ($aa ==? LEFT) (0 ==? RIGHT) )) |? (all?( ($aa ==? TOP) (0 ==? BOTTOM) ))     # ◀▢▢▶   if li=right then ji and ki must be mid because <><> would be touching boats

      # Occurrence requirement per boat type
      count1 == 4
      count2 == 3
      count3 == 2
      count4 == 1


      # Cell Hints:

      $31 >= 1
      $31 <= 2
      $63 == 3
      $34 == 6
      $65 == 0
      $18 == 3
      $59 == 6

      # Side Hints:

      3 = sum( ($11 >? 0) ($12 >? 0) ($13 >? 0) ($14 >? 0) ($15 >? 0) ($16 >? 0) ($17 >? 0) ($18 >? 0) ($19 >? 0) ($1a >? 0) )
      1 = sum( ($21 >? 0) ($22 >? 0) ($23 >? 0) ($24 >? 0) ($25 >? 0) ($26 >? 0) ($27 >? 0) ($28 >? 0) ($29 >? 0) ($2a >? 0) )
      4 = sum( ($31 >? 0) ($32 >? 0) ($33 >? 0) ($34 >? 0) ($35 >? 0) ($36 >? 0) ($37 >? 0) ($38 >? 0) ($39 >? 0) ($3a >? 0) )
      2 = sum( ($41 >? 0) ($42 >? 0) ($43 >? 0) ($44 >? 0) ($45 >? 0) ($46 >? 0) ($47 >? 0) ($48 >? 0) ($49 >? 0) ($4a >? 0) )
      2 = sum( ($51 >? 0) ($52 >? 0) ($53 >? 0) ($54 >? 0) ($55 >? 0) ($56 >? 0) ($57 >? 0) ($58 >? 0) ($59 >? 0) ($5a >? 0) )
      4 = sum( ($61 >? 0) ($62 >? 0) ($63 >? 0) ($64 >? 0) ($65 >? 0) ($66 >? 0) ($67 >? 0) ($68 >? 0) ($69 >? 0) ($6a >? 0) )
      1 = sum( ($71 >? 0) ($72 >? 0) ($73 >? 0) ($74 >? 0) ($75 >? 0) ($76 >? 0) ($77 >? 0) ($78 >? 0) ($79 >? 0) ($7a >? 0) )
      1 = sum( ($81 >? 0) ($82 >? 0) ($83 >? 0) ($84 >? 0) ($85 >? 0) ($86 >? 0) ($87 >? 0) ($88 >? 0) ($89 >? 0) ($8a >? 0) )
      0 = sum( ($91 >? 0) ($92 >? 0) ($93 >? 0) ($94 >? 0) ($95 >? 0) ($96 >? 0) ($97 >? 0) ($98 >? 0) ($99 >? 0) ($9a >? 0) )
      2 = sum( ($a1 >? 0) ($a2 >? 0) ($a3 >? 0) ($a4 >? 0) ($a5 >? 0) ($a6 >? 0) ($a7 >? 0) ($a8 >? 0) ($a9 >? 0) ($aa >? 0) )
      4 = sum( ($11 >? 0) ($21 >? 0) ($31 >? 0) ($41 >? 0) ($51 >? 0) ($61 >? 0) ($71 >? 0) ($81 >? 0) ($91 >? 0) ($a1 >? 0) )
      0 = sum( ($12 >? 0) ($22 >? 0) ($32 >? 0) ($42 >? 0) ($52 >? 0) ($62 >? 0) ($72 >? 0) ($82 >? 0) ($92 >? 0) ($a2 >? 0) )
      1 = sum( ($13 >? 0) ($23 >? 0) ($33 >? 0) ($43 >? 0) ($53 >? 0) ($63 >? 0) ($73 >? 0) ($83 >? 0) ($93 >? 0) ($a3 >? 0) )
      3 = sum( ($14 >? 0) ($24 >? 0) ($34 >? 0) ($44 >? 0) ($54 >? 0) ($64 >? 0) ($74 >? 0) ($84 >? 0) ($94 >? 0) ($a4 >? 0) )
      1 = sum( ($15 >? 0) ($25 >? 0) ($35 >? 0) ($45 >? 0) ($55 >? 0) ($65 >? 0) ($75 >? 0) ($85 >? 0) ($95 >? 0) ($a5 >? 0) )
      3 = sum( ($16 >? 0) ($26 >? 0) ($36 >? 0) ($46 >? 0) ($56 >? 0) ($66 >? 0) ($76 >? 0) ($86 >? 0) ($96 >? 0) ($a6 >? 0) )
      2 = sum( ($17 >? 0) ($27 >? 0) ($37 >? 0) ($47 >? 0) ($57 >? 0) ($67 >? 0) ($77 >? 0) ($87 >? 0) ($97 >? 0) ($a7 >? 0) )
      1 = sum( ($18 >? 0) ($28 >? 0) ($38 >? 0) ($48 >? 0) ($58 >? 0) ($68 >? 0) ($78 >? 0) ($88 >? 0) ($98 >? 0) ($a8 >? 0) )
      3 = sum( ($19 >? 0) ($29 >? 0) ($39 >? 0) ($49 >? 0) ($59 >? 0) ($69 >? 0) ($79 >? 0) ($89 >? 0) ($99 >? 0) ($a9 >? 0) )
      2 = sum( ($1a >? 0) ($2a >? 0) ($3a >? 0) ($4a >? 0) ($5a >? 0) ($6a >? 0) ($7a >? 0) ($8a >? 0) ($9a >? 0) ($aa >? 0) )
    `;
    verify(battleships);
  });

  it('camping', function() {
    verify(`

# Blank sea:

: EMPTY 0
: TREE 1
: TENT_UP 2
: TENT_RIGHT 3
: TENT_DOWN 4
: TENT_LEFT 5

: $11,$12,$13,$14,$15,$16,$17,$18,$19,$1a [0, 5]
: $21,$22,$23,$24,$25,$26,$27,$28,$29,$2a [0, 5]
: $31,$32,$33,$34,$35,$36,$37,$38,$39,$3a [0, 5]
: $41,$42,$43,$44,$45,$46,$47,$48,$49,$4a [0, 5]
: $51,$52,$53,$54,$55,$56,$57,$58,$59,$5a [0, 5]
: $61,$62,$63,$64,$65,$66,$67,$68,$69,$6a [0, 5]
: $71,$72,$73,$74,$75,$76,$77,$78,$79,$7a [0, 5]
: $81,$82,$83,$84,$85,$86,$87,$88,$89,$8a [0, 5]
: $91,$92,$93,$94,$95,$96,$97,$98,$99,$9a [0, 5]
: $a1,$a2,$a3,$a4,$a5,$a6,$a7,$a8,$a9,$aa [0, 5]




### Cell: $21

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($21 ==? TREE) == sum( ($11 ==? TENT_RIGHT) (0 ==? TENT_DOWN) ($31 ==? TENT_LEFT) ($22 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  0 0 0
#  $11 $21 $31
#  $12 $22 $32
#




### Cell: $31

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($31 ==? TREE) == sum( ($21 ==? TENT_RIGHT) (0 ==? TENT_DOWN) ($41 ==? TENT_LEFT) ($32 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  0 0 0
#  $21 $31 $41
#  $22 $32 $42
#
($31 >? TREE) -> (none?( (0 >? TREE) ($21 >? TREE) ($22 >? TREE) (0 >? TREE) ($32 >? TREE) (0 >? TREE) ($41 >? TREE) ($42 >? TREE) ))




### Cell: $41

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($41 ==? TREE) == sum( ($31 ==? TENT_RIGHT) (0 ==? TENT_DOWN) ($51 ==? TENT_LEFT) ($42 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  0 0 0
#  $31 $41 $51
#  $32 $42 $52
#
($41 >? TREE) -> (none?( (0 >? TREE) ($31 >? TREE) ($32 >? TREE) (0 >? TREE) ($42 >? TREE) (0 >? TREE) ($51 >? TREE) ($52 >? TREE) ))




### Cell: $51

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($51 ==? TREE) == sum( ($41 ==? TENT_RIGHT) (0 ==? TENT_DOWN) ($61 ==? TENT_LEFT) ($52 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  0 0 0
#  $41 $51 $61
#  $42 $52 $62
#
($51 >? TREE) -> (none?( (0 >? TREE) ($41 >? TREE) ($42 >? TREE) (0 >? TREE) ($52 >? TREE) (0 >? TREE) ($61 >? TREE) ($62 >? TREE) ))






### Cell: $12

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($12 ==? TREE) == sum( (0 ==? TENT_RIGHT) ($11 ==? TENT_DOWN) ($22 ==? TENT_LEFT) ($13 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  0 $11 $21
#  0 $12 $22
#  0 $13 $23
#
($12 >? TREE) -> (none?( (0 >? TREE) (0 >? TREE) (0 >? TREE) ($11 >? TREE) ($13 >? TREE) ($21 >? TREE) ($22 >? TREE) ($23 >? TREE) ))




### Cell: $22

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($22 ==? TREE) == sum( ($12 ==? TENT_RIGHT) ($21 ==? TENT_DOWN) ($32 ==? TENT_LEFT) ($23 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $11 $21 $31
#  $12 $22 $32
#  $13 $23 $33
#
($22 >? TREE) -> (none?( ($11 >? TREE) ($12 >? TREE) ($13 >? TREE) ($21 >? TREE) ($23 >? TREE) ($31 >? TREE) ($32 >? TREE) ($33 >? TREE) ))




### Cell: $32

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($32 ==? TREE) == sum( ($22 ==? TENT_RIGHT) ($31 ==? TENT_DOWN) ($42 ==? TENT_LEFT) ($33 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $21 $31 $41
#  $22 $32 $42
#  $23 $33 $43
#
($32 >? TREE) -> (none?( ($21 >? TREE) ($22 >? TREE) ($23 >? TREE) ($31 >? TREE) ($33 >? TREE) ($41 >? TREE) ($42 >? TREE) ($43 >? TREE) ))




### Cell: $42

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($42 ==? TREE) == sum( ($32 ==? TENT_RIGHT) ($41 ==? TENT_DOWN) ($52 ==? TENT_LEFT) ($43 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $31 $41 $51
#  $32 $42 $52
#  $33 $43 $53
#
($42 >? TREE) -> (none?( ($31 >? TREE) ($32 >? TREE) ($33 >? TREE) ($41 >? TREE) ($43 >? TREE) ($51 >? TREE) ($52 >? TREE) ($53 >? TREE) ))




### Cell: $52

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($52 ==? TREE) == sum( ($42 ==? TENT_RIGHT) ($51 ==? TENT_DOWN) ($62 ==? TENT_LEFT) ($53 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $41 $51 $61
#  $42 $52 $62
#  $43 $53 $63
#
($52 >? TREE) -> (none?( ($41 >? TREE) ($42 >? TREE) ($43 >? TREE) ($51 >? TREE) ($53 >? TREE) ($61 >? TREE) ($62 >? TREE) ($63 >? TREE) ))




### Cell: $62

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($62 ==? TREE) == sum( ($52 ==? TENT_RIGHT) ($61 ==? TENT_DOWN) ($72 ==? TENT_LEFT) ($63 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $51 $61 $71
#  $52 $62 $72
#  $53 $63 $73
#
($62 >? TREE) -> (none?( ($51 >? TREE) ($52 >? TREE) ($53 >? TREE) ($61 >? TREE) ($63 >? TREE) ($71 >? TREE) ($72 >? TREE) ($73 >? TREE) ))








### Cell: $23

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($23 ==? TREE) == sum( ($13 ==? TENT_RIGHT) ($22 ==? TENT_DOWN) ($33 ==? TENT_LEFT) ($24 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $12 $22 $32
#  $13 $23 $33
#  $14 $24 $34
#
($23 >? TREE) -> (none?( ($12 >? TREE) ($13 >? TREE) ($14 >? TREE) ($22 >? TREE) ($24 >? TREE) ($32 >? TREE) ($33 >? TREE) ($34 >? TREE) ))




### Cell: $33

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($33 ==? TREE) == sum( ($23 ==? TENT_RIGHT) ($32 ==? TENT_DOWN) ($43 ==? TENT_LEFT) ($34 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $22 $32 $42
#  $23 $33 $43
#  $24 $34 $44
#
($33 >? TREE) -> (none?( ($22 >? TREE) ($23 >? TREE) ($24 >? TREE) ($32 >? TREE) ($34 >? TREE) ($42 >? TREE) ($43 >? TREE) ($44 >? TREE) ))




### Cell: $43

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($43 ==? TREE) == sum( ($33 ==? TENT_RIGHT) ($42 ==? TENT_DOWN) ($53 ==? TENT_LEFT) ($44 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $32 $42 $52
#  $33 $43 $53
#  $34 $44 $54
#
($43 >? TREE) -> (none?( ($32 >? TREE) ($33 >? TREE) ($34 >? TREE) ($42 >? TREE) ($44 >? TREE) ($52 >? TREE) ($53 >? TREE) ($54 >? TREE) ))




### Cell: $53

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($53 ==? TREE) == sum( ($43 ==? TENT_RIGHT) ($52 ==? TENT_DOWN) ($63 ==? TENT_LEFT) ($54 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $42 $52 $62
#  $43 $53 $63
#  $44 $54 $64
#
($53 >? TREE) -> (none?( ($42 >? TREE) ($43 >? TREE) ($44 >? TREE) ($52 >? TREE) ($54 >? TREE) ($62 >? TREE) ($63 >? TREE) ($64 >? TREE) ))





### Cell: $24

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($24 ==? TREE) == sum( ($14 ==? TENT_RIGHT) ($23 ==? TENT_DOWN) ($34 ==? TENT_LEFT) ($25 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $13 $23 $33
#  $14 $24 $34
#  $15 $25 $35
#
($24 >? TREE) -> (none?( ($13 >? TREE) ($14 >? TREE) ($15 >? TREE) ($23 >? TREE) ($25 >? TREE) ($33 >? TREE) ($34 >? TREE) ($35 >? TREE) ))




### Cell: $34

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($34 ==? TREE) == sum( ($24 ==? TENT_RIGHT) ($33 ==? TENT_DOWN) ($44 ==? TENT_LEFT) ($35 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $23 $33 $43
#  $24 $34 $44
#  $25 $35 $45
#
($34 >? TREE) -> (none?( ($23 >? TREE) ($24 >? TREE) ($25 >? TREE) ($33 >? TREE) ($35 >? TREE) ($43 >? TREE) ($44 >? TREE) ($45 >? TREE) ))




### Cell: $44

# if this cell is a tree, there must be exactly one tent pointing to it. otherwise none.
($44 ==? TREE) == sum( ($34 ==? TENT_RIGHT) ($43 ==? TENT_DOWN) ($54 ==? TENT_LEFT) ($45 ==? TENT_UP) )
# if this cell is neither a tree nor EMPTY then all adjacent (even diagonal) cells cannot be TENT (but TREE is okay)
#
#  $33 $43 $53
#  $34 $44 $54
#  $35 $45 $55
#
($44 >? TREE) -> (none?( ($33 >? TREE) ($34 >? TREE) ($35 >? TREE) ($43 >? TREE) ($45 >? TREE) ($53 >? TREE) ($54 >? TREE) ($55 >? TREE) ))





# Cell Hints:

$11 != TREE
$21 != TREE
$31 != TREE
$41 != TREE
$51 != TREE
$61 != TREE
$71 != TREE
$81 != TREE
$91 != TREE
$a1 != TREE
$12 != TREE
$22 != TREE
$32 == 1
$42 == 1
$52 != TREE
$62 != TREE
$72 != TREE
$82 != TREE
$92 != TREE
$a2 != TREE
$13 != TREE
$23 != TREE
$33 != TREE
$43 != TREE
$53 != TREE
$63 != TREE
$73 != TREE
$83 != TREE
$93 != TREE
$a3 != TREE
$14 != TREE
$24 != TREE
$34 != TREE
$44 != TREE
$54 != TREE
$64 != TREE
$74 != TREE
$84 != TREE
$94 != TREE
$a4 != TREE
$15 != TREE
$25 != TREE
$35 != TREE
$45 != TREE
$55 != TREE
$65 != TREE
$75 != TREE
$85 != TREE
$95 != TREE
$a5 != TREE
$16 != TREE
$26 != TREE
$36 != TREE
$46 != TREE
$56 != TREE
$66 != TREE
$76 != TREE
$86 != TREE
$96 != TREE
$a6 != TREE
$17 != TREE
$27 != TREE
$37 != TREE
$47 != TREE
$57 != TREE
$67 != TREE
$77 != TREE
$87 != TREE
$97 != TREE
$a7 != TREE
$18 != TREE
$28 != TREE
$38 != TREE
$48 != TREE
$58 != TREE
$68 != TREE
$78 != TREE
$88 != TREE
$98 != TREE
$a8 != TREE
$19 != TREE
$29 != TREE
$39 != TREE
$49 != TREE
$59 != TREE
$69 != TREE
$79 != TREE
$89 != TREE
$99 != TREE
$a9 != TREE
$1a != TREE
$2a != TREE
$3a != TREE
$4a != TREE
$5a != TREE
$6a != TREE
$7a != TREE
$8a != TREE
$9a != TREE
$aa != TREE

# Side Hints:


    `);
  });

  it('einstein', function() {

    let dsl = `
      # https://web.stanford.edu/~laurik/fsmbook/examples/Einstein'sPuzzle.html
      #
      # Let us assume that there are five houses of different colors next to each
      # other on the same road. In each house lives a man of a different nationality.
      # Every man has his favorite drink, his favorite brand of cigarettes, and
      # keeps pets of a particular kind:
      #
      #  1 The Englishman lives in the red house.
      #  2 The Swede keeps dogs.
      #  3 The Dane drinks tea.
      #  4 The green house is just to the left of the white one.
      #  5 The owner of the green house drinks coffee.
      #  6 The Pall Mall smoker keeps birds.
      #  7 The owner of the yellow house smokes Dunhills.
      #  8 The man in the center house drinks milk.
      #  9 The Norwegian lives in the first house.
      # 10 The Blend smoker has a neighbor who keeps cats.
      # 11 The man who smokes Blue Masters drinks bier.
      # 12 The man who keeps horses lives next to the Dunhill smoker.
      # 13 The German smokes Prince.
      # 14 The Norwegian lives next to the blue house.
      # 15 The Blend smoker has a neighbor who drinks water.
      #
      # The question to be answered is: Who keeps fish?

      # constants
      : blue 0
      : green 1
      : red 2
      : white 3
      : yellow 4

      : dane 0
      : english 1
      : german 2
      : swede 3
      : norwegian 4

      : bier 0
      : coffee 1
      : milk 2
      : tea 3
      : water 4

      : blend 0
      : bluemaster 1
      : dunhill 2
      : pallmall 3
      : prince 4

      : birds 0
      : cats 1
      : dogs 2
      : fish 3
      : horses 4

      # which house is assigned which option?
      # C=color, N=nationality, D=drink, S=smokes, P=pet
      : C0, C1, C2, C3, C4 [0 4] # house color of each house
      : N0, N1, N2, N3, N4 [0 4] # nationality of each house
      : D0, D1, D2, D3, D4 [0 4] # drink of each house
      : S0, S1, S2, S3, S4 [0 4] # smoke brand of each house
      : P0, P1, P2, P3, P4 [0 4] # pet of each house

      # distribution must be unique (each color is only applied to one house, etc)
      # this implicitly also ensures every option will be used
      diff(C0 C1 C2 C3 C4)
      diff(N0 N1 N2 N3 N4)
      diff(D0 D1 D2 D3 D4)
      diff(S0 S1 S2 S3 S4)
      diff(P0 P1 P2 P3 P4)

      # now follow the encoding for each condition
      # it's a bit repetitive because most of the time
      # each house must get the same condition ("for all
      # x; if color of house x is red then the pet of
      # house x is cat", which would still apply to only
      # one since the colors (and pets) of all houses
      # are distinct from one another)

      # 1: The Englishman lives in the red house
      # "(Nx == english) <=> (Cx == red)"
      (N0 ==? english) == (C0 ==? red)
      (N1 ==? english) == (C1 ==? red)
      (N2 ==? english) == (C2 ==? red)
      (N3 ==? english) == (C3 ==? red)
      (N4 ==? english) == (C4 ==? red)

      # 2: The Swede keeps dogs
      # similar to above
      (N0 ==? swede) == (P0 ==? dogs)
      (N1 ==? swede) == (P1 ==? dogs)
      (N2 ==? swede) == (P2 ==? dogs)
      (N3 ==? swede) == (P3 ==? dogs)
      (N4 ==? swede) == (P4 ==? dogs)

      # 3: The Dane drinks tea
      (N0 ==? dane) == (D0 ==? tea)
      (N1 ==? dane) == (D1 ==? tea)
      (N2 ==? dane) == (D2 ==? tea)
      (N3 ==? dane) == (D3 ==? tea)
      (N4 ==? dane) == (D4 ==? tea)

      # 4: the green house is just to the left of the white one
      C0 != white
      (C0 ==? green) == (C1 ==? white)
      (C1 ==? green) == (C2 ==? white)
      (C2 ==? green) == (C3 ==? white)
      (C3 ==? green) == (C4 ==? white)
      C4 != green

      # 5: the owner of the green house drinks coffee
      (C0 ==? green) == (D0 ==? coffee)
      (C1 ==? green) == (D1 ==? coffee)
      (C2 ==? green) == (D2 ==? coffee)
      (C3 ==? green) == (D3 ==? coffee)
      (C4 ==? green) == (D4 ==? coffee)

      # 6: the pallmall smoker keeps birds
      (S0 ==? pallmall) == (P0 ==? birds)
      (S1 ==? pallmall) == (P1 ==? birds)
      (S2 ==? pallmall) == (P2 ==? birds)
      (S3 ==? pallmall) == (P3 ==? birds)
      (S4 ==? pallmall) == (P4 ==? birds)

      # 7: the owner of the yellow house smokes dunhills
      (S0 ==? dunhill) == (C0 ==? yellow)
      (S1 ==? dunhill) == (C1 ==? yellow)
      (S2 ==? dunhill) == (C2 ==? yellow)
      (S3 ==? dunhill) == (C3 ==? yellow)
      (S4 ==? dunhill) == (C4 ==? yellow)

      # 8: the man in the center house drinks milk
      D2 == milk

      # 9: the norwegian lives in the first house
      N0 == norwegian

      # 10: the blend smoker has a neighbor who keeps cats
      # for the middle ones; if this house smokes blend, either the left or the right is cats but not both and not neither.
      # that's why the neq works. we'd need an "or" for this case. exactly one of these five cases will force a Px set to cats.
      (S0 ==? blend) == (P1 ==? cats)
      (S1 ==? blend) <= ((P0 ==? cats) !=? (P2 ==? cats))
      (S2 ==? blend) <= ((P1 ==? cats) !=? (P3 ==? cats))
      (S3 ==? blend) <= ((P2 ==? cats) !=? (P4 ==? cats))
      (S4 ==? blend) == (P3 ==? cats)

      # 11: the man who smokes blue masters drinks bier
      (S0 ==? bluemaster) == (D0 ==? bier)
      (S1 ==? bluemaster) == (D1 ==? bier)
      (S2 ==? bluemaster) == (D2 ==? bier)
      (S3 ==? bluemaster) == (D3 ==? bier)
      (S4 ==? bluemaster) == (D4 ==? bier)

      # 12: the man who keeps horses lives next to the dunhill smoker
      # (see 10)
      (P0 ==? horses) == (S1 ==? dunhill)
      (P1 ==? horses) <= ((S0 ==? dunhill) !=? (S2 ==? dunhill))
      (P2 ==? horses) <= ((S1 ==? dunhill) !=? (S3 ==? dunhill))
      (P3 ==? horses) <= ((S2 ==? dunhill) !=? (S4 ==? dunhill))
      (P4 ==? horses) == (S3 ==? dunhill)

      # 13: the german smokes prince
      (N0 ==? german) == (S0 ==? prince)
      (N1 ==? german) == (S1 ==? prince)
      (N2 ==? german) == (S2 ==? prince)
      (N3 ==? german) == (S3 ==? prince)
      (N4 ==? german) == (S4 ==? prince)

      # 14: the norwegian lives next to the blue house
      # (see 10)
      (N0 ==? norwegian) == (C1 ==? blue)
      (N1 ==? norwegian) <= ((C0 ==? blue) !=? (C2 ==? blue))
      (N2 ==? norwegian) <= ((C1 ==? blue) !=? (C3 ==? blue))
      (N3 ==? norwegian) <= ((C2 ==? blue) !=? (C4 ==? blue))
      (N4 ==? norwegian) == (C3 ==? blue)

      # 15: the blend smoker has a neighbor who drinks water
      # note: this is the same pre-condition as 10. we could use "and" for this kind of case. the dupe should be optimized away.
      (S0 ==? blend) == (D1 ==? water)
      (S1 ==? blend) <= ((D0 ==? water) !=? (D2 ==? water))
      (S2 ==? blend) <= ((D1 ==? water) !=? (D3 ==? water))
      (S3 ==? blend) <= ((D2 ==? water) !=? (D4 ==? water))
      (S4 ==? blend) == (D3 ==? water)
    `;

    let actualSolution = {
      // constants
      blue: 0,
      green: 1,
      red: 2,
      white: 3,
      yellow: 4,
      dane: 0,
      english: 1,
      german: 2,
      swede: 3,
      norwegian: 4,
      bier: 0,
      coffee: 1,
      milk: 2,
      tea: 3,
      water: 4,
      blend: 0,
      bluemaster: 1,
      dunhill: 2,
      pallmall: 3,
      prince: 4,
      birds: 0,
      cats: 1,
      dogs: 2,
      fish: 3,
      horses: 4,
      // solution
      C0: 4,
      C1: 0,
      C2: 2,
      C3: 1,
      C4: 3,
      N0: 4,
      N1: 0,
      N2: 1,
      N3: 2,
      N4: 3,
      D0: 4,
      D1: 3,
      D2: 2,
      D3: 1,
      D4: 0,
      S0: 2,
      S1: 0,
      S2: 3,
      S3: 4,
      S4: 1,
      P0: 1,
      P1: 4,
      P2: 0,
      P3: 3,
      P4: 2,
    };

    // look, there is a solution
    expect(stripAnonVarsFromArrays(FDO.solve(dsl).solve()), 'without pre').to.eql([actualSolution]);

    // so find it
    expect(FDP.solve(dsl, {printDslBefore: false, hashNames: false}), 'with pre').to.eql(actualSolution);

    // this is the same problem as above except parsed to ml and reconstructed to dsl by the preparser
    // the advantage is that each line contains only one constraint so we can use verify() on it
    verify(`
      #### <DSL> after parsing before crunching
      # vars:
      : C0 [0,4]
      : C1 [0,4]
      : C2 [0,4]
      : C3 [0,4]
      : C4 [0,4]
      : N0 [0,4]
      : N1 [0,4]
      : N2 [0,4]
      : N3 [0,4]
      : N4 [0,4]
      : D0 [0,4]
      : D1 [0,4]
      : D2 [0,4]
      : D3 [0,4]
      : D4 [0,4]
      : S0 [0,4]
      : S1 [0,4]
      : S2 [0,4]
      : S3 [0,4]
      : S4 [0,4]
      : P0 [0,4]
      : P1 [0,4]
      : P2 [0,4]
      : P3 [0,4]
      : P4 [0,4]
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
      : $$37 [0,1]
      : $$38 [0,1]
      : $$39 [0,1]
      : $$40 [0,1]
      : $$41 [0,1]
      : $$42 [0,1]
      : $$43 [0,1]
      : $$44 [0,1]
      : $$45 [0,1]
      : $$46 [0,1]
      : $$47 [0,1]
      : $$48 [0,1]
      : $$49 [0,1]
      : $$50 [0,1]
      : $$51 [0,1]
      : $$52 [0,1]
      : $$53 [0,1]
      : $$54 [0,1]
      : $$55 [0,1]
      : $$56 [0,1]
      : $$57 [0,1]
      : $$58 [0,1]
      : $$59 [0,1]
      : $$60 [0,1]
      : $$61 [0,1]
      : $$62 [0,1]
      : $$63 [0,1]
      : $$64 [0,1]
      : $$65 [0,1]
      : $$66 [0,1]
      : $$67 [0,1]
      : $$68 [0,1]
      : $$69 [0,1]
      : $$70 [0,1]
      : $$71 [0,1]
      : $$72 [0,1]
      : $$73 [0,1]
      : $$74 [0,1]
      : $$75 [0,1]
      : $$76 [0,1]
      : $$77 [0,1]
      : $$78 [0,1]
      : $$79 [0,1]
      : $$80 [0,1]
      : $$81 [0,1]
      : $$82 [0,1]
      : $$83 [0,1]
      : $$84 [0,1]
      : $$85 [0,1]
      : $$86 [0,1]
      : $$87 [0,1]
      : $$88 [0,1]
      : $$89 [0,1]
      : $$90 [0,1]
      : $$91 [0,1]
      : $$92 [0,1]
      : $$93 [0,1]
      : $$94 [0,1]
      : $$95 [0,1]
      : $$96 [0,1]
      : $$97 [0,1]
      : $$98 [0,1]
      : $$99 [0,1]
      : $$100 [0,1]
      : $$101 [0,1]
      : $$102 [0,1]
      : $$103 [0,1]
      : $$104 [0,1]
      : $$105 [0,1]
      : $$106 [0,1]
      : $$107 [0,1]
      : $$108 [0,1]
      : $$109 [0,1]
      : $$110 [0,1]
      : $$111 [0,1]
      : $$112 [0,1]
      : $$113 [0,1]
      : $$114 [0,1]
      : $$115 [0,1]
      : $$116 [0,1]
      : $$117 [0,1]
      : $$118 [0,1]
      : $$119 [0,1]
      : $$120 [0,1]
      : $$121 [0,1]
      : $$122 [0,1]
      : $$123 [0,1]
      : $$124 [0,1]
      : $$125 [0,1]
      : $$126 [0,1]
      : $$127 [0,1]
      : $$128 [0,1]
      : $$129 [0,1]
      : $$130 [0,1]
      : $$131 [0,1]
      : $$132 [0,1]
      : $$133 [0,1]
      : $$134 [0,1]
      : $$135 [0,1]
      : $$136 [0,1]
      : $$137 [0,1]
      : $$138 [0,1]
      : $$139 [0,1]
      : $$140 [0,1]
      : $$141 [0,1]
      : $$142 [0,1]
      : $$143 [0,1]
      : $$144 [0,1]
      : $$145 [0,1]
      : $$146 [0,1]
      : $$147 [0,1]
      : $$148 [0,1]
      : $$149 [0,1]
      : $$150 [0,1]
      : $$151 [0,1]
      : $$152 [0,1]


      # Constraints:
      diff( C0 C1 C2 C3 C4 )
      diff( N0 N1 N2 N3 N4 )
      diff( D0 D1 D2 D3 D4 )
      diff( S0 S1 S2 S3 S4 )
      diff( P0 P1 P2 P3 P4 )
      $$1 = N0 ==? 1
      $$2 = C0 ==? 2
      $$1 == $$2
      $$3 = N1 ==? 1
      $$4 = C1 ==? 2
      $$3 == $$4
      $$5 = N2 ==? 1
      $$6 = C2 ==? 2
      $$5 == $$6
      $$7 = N3 ==? 1
      $$8 = C3 ==? 2
      $$7 == $$8
      $$9 = N4 ==? 1
      $$10 = C4 ==? 2
      $$9 == $$10
      $$11 = N0 ==? 3
      $$12 = P0 ==? 2
      $$11 == $$12
      $$13 = N1 ==? 3
      $$14 = P1 ==? 2
      $$13 == $$14
      $$15 = N2 ==? 3
      $$16 = P2 ==? 2
      $$15 == $$16
      $$17 = N3 ==? 3
      $$18 = P3 ==? 2
      $$17 == $$18
      $$19 = N4 ==? 3
      $$20 = P4 ==? 2
      $$19 == $$20
      $$21 = N0 ==? 0
      $$22 = D0 ==? 3
      $$21 == $$22
      $$23 = N1 ==? 0
      $$24 = D1 ==? 3
      $$23 == $$24
      $$25 = N2 ==? 0
      $$26 = D2 ==? 3
      $$25 == $$26
      $$27 = N3 ==? 0
      $$28 = D3 ==? 3
      $$27 == $$28
      $$29 = N4 ==? 0
      $$30 = D4 ==? 3
      $$29 == $$30
      C0 != 3
      $$31 = C0 ==? 1
      $$32 = C1 ==? 3
      $$31 == $$32
      $$33 = C1 ==? 1
      $$34 = C2 ==? 3
      $$33 == $$34
      $$35 = C2 ==? 1
      $$36 = C3 ==? 3
      $$35 == $$36
      $$37 = C3 ==? 1
      $$38 = C4 ==? 3
      $$37 == $$38
      C4 != 1
      $$39 = C0 ==? 1
      $$40 = D0 ==? 1
      $$39 == $$40
      $$41 = C1 ==? 1
      $$42 = D1 ==? 1
      $$41 == $$42
      $$43 = C2 ==? 1
      $$44 = D2 ==? 1
      $$43 == $$44
      $$45 = C3 ==? 1
      $$46 = D3 ==? 1
      $$45 == $$46
      $$47 = C4 ==? 1
      $$48 = D4 ==? 1
      $$47 == $$48
      $$49 = S0 ==? 3
      $$50 = P0 ==? 0
      $$49 == $$50
      $$51 = S1 ==? 3
      $$52 = P1 ==? 0
      $$51 == $$52
      $$53 = S2 ==? 3
      $$54 = P2 ==? 0
      $$53 == $$54
      $$55 = S3 ==? 3
      $$56 = P3 ==? 0
      $$55 == $$56
      $$57 = S4 ==? 3
      $$58 = P4 ==? 0
      $$57 == $$58
      $$59 = S0 ==? 2
      $$60 = C0 ==? 4
      $$59 == $$60
      $$61 = S1 ==? 2
      $$62 = C1 ==? 4
      $$61 == $$62
      $$63 = S2 ==? 2
      $$64 = C2 ==? 4
      $$63 == $$64
      $$65 = S3 ==? 2
      $$66 = C3 ==? 4
      $$65 == $$66
      $$67 = S4 ==? 2
      $$68 = C4 ==? 4
      $$67 == $$68
      D2 == 2
      N0 == 4
      $$69 = S0 ==? 0
      $$70 = P1 ==? 1
      $$69 == $$70
      $$71 = S1 ==? 0
      $$72 = P0 ==? 1
      $$73 = P2 ==? 1
      $$74 = $$72 !=? $$73
      $$71 <= $$74
      $$75 = S2 ==? 0
      $$76 = P1 ==? 1
      $$77 = P3 ==? 1
      $$78 = $$76 !=? $$77
      $$75 <= $$78
      $$79 = S3 ==? 0
      $$80 = P2 ==? 1
      $$81 = P4 ==? 1
      $$82 = $$80 !=? $$81
      $$79 <= $$82
      $$83 = S4 ==? 0
      $$84 = P3 ==? 1
      $$83 == $$84
      $$85 = S0 ==? 1
      $$86 = D0 ==? 0
      $$85 == $$86
      $$87 = S1 ==? 1
      $$88 = D1 ==? 0
      $$87 == $$88
      $$89 = S2 ==? 1
      $$90 = D2 ==? 0
      $$89 == $$90
      $$91 = S3 ==? 1
      $$92 = D3 ==? 0
      $$91 == $$92
      $$93 = S4 ==? 1
      $$94 = D4 ==? 0
      $$93 == $$94
      $$95 = P0 ==? 4
      $$96 = S1 ==? 2
      $$95 == $$96
      $$97 = P1 ==? 4
      $$98 = S0 ==? 2
      $$99 = S2 ==? 2
      $$100 = $$98 !=? $$99
      $$97 <= $$100
      $$101 = P2 ==? 4
      $$102 = S1 ==? 2
      $$103 = S3 ==? 2
      $$104 = $$102 !=? $$103
      $$101 <= $$104
      $$105 = P3 ==? 4
      $$106 = S2 ==? 2
      $$107 = S4 ==? 2
      $$108 = $$106 !=? $$107
      $$105 <= $$108
      $$109 = P4 ==? 4
      $$110 = S3 ==? 2
      $$109 == $$110
      $$111 = N0 ==? 2
      $$112 = S0 ==? 4
      $$111 == $$112
      $$113 = N1 ==? 2
      $$114 = S1 ==? 4
      $$113 == $$114
      $$115 = N2 ==? 2
      $$116 = S2 ==? 4
      $$115 == $$116
      $$117 = N3 ==? 2
      $$118 = S3 ==? 4
      $$117 == $$118
      $$119 = N4 ==? 2
      $$120 = S4 ==? 4
      $$119 == $$120
      $$121 = N0 ==? 4
      $$122 = C1 ==? 0
      $$121 == $$122
      $$123 = N1 ==? 4
      $$124 = C0 ==? 0
      $$125 = C2 ==? 0
      $$126 = $$124 !=? $$125
      $$123 <= $$126
      $$127 = N2 ==? 4
      $$128 = C1 ==? 0
      $$129 = C3 ==? 0
      $$130 = $$128 !=? $$129
      $$127 <= $$130
      $$131 = N3 ==? 4
      $$132 = C2 ==? 0
      $$133 = C4 ==? 0
      $$134 = $$132 !=? $$133
      $$131 <= $$134
      $$135 = N4 ==? 4
      $$136 = C3 ==? 0
      $$135 == $$136
      $$137 = S0 ==? 0
      $$138 = D1 ==? 4
      $$137 == $$138
      $$139 = S1 ==? 0
      $$140 = D0 ==? 4
      $$141 = D2 ==? 4
      $$142 = $$140 !=? $$141
      $$139 <= $$142
      $$143 = S2 ==? 0
      $$144 = D1 ==? 4
      $$145 = D3 ==? 4
      $$146 = $$144 !=? $$145
      $$143 <= $$146
      $$147 = S3 ==? 0
      $$148 = D2 ==? 4
      $$149 = D4 ==? 4
      $$150 = $$148 !=? $$149
      $$147 <= $$150
      $$151 = S4 ==? 0
      $$152 = D3 ==? 4
      $$151 == $$152

      # Meta:
      @custom targets all # 25 / 177

      #### </DSL>
    `);
  });
});

