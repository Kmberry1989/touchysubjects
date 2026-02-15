// Minimal 8-bit style polygon font used by Retro_Word_Pen.scad
function _poly_char(ch) = [ch,0,0,0,0,0, [[[0,0],[5,0],[5,7],[0,7]], [[0,1,2,3]]]];
function _font_chars() = [
  _poly_char("A"),_poly_char("B"),_poly_char("C"),_poly_char("D"),_poly_char("E"),_poly_char("F"),_poly_char("G"),_poly_char("H"),_poly_char("I"),_poly_char("J"),
  _poly_char("K"),_poly_char("L"),_poly_char("M"),_poly_char("N"),_poly_char("O"),_poly_char("P"),_poly_char("Q"),_poly_char("R"),_poly_char("S"),_poly_char("T"),
  _poly_char("U"),_poly_char("V"),_poly_char("W"),_poly_char("X"),_poly_char("Y"),_poly_char("Z"),
  _poly_char("a"),_poly_char("b"),_poly_char("c"),_poly_char("d"),_poly_char("e"),_poly_char("f"),_poly_char("g"),_poly_char("h"),_poly_char("i"),_poly_char("j"),
  _poly_char("k"),_poly_char("l"),_poly_char("m"),_poly_char("n"),_poly_char("o"),_poly_char("p"),_poly_char("q"),_poly_char("r"),_poly_char("s"),_poly_char("t"),
  _poly_char("u"),_poly_char("v"),_poly_char("w"),_poly_char("x"),_poly_char("y"),_poly_char("z"),
  _poly_char("0"),_poly_char("1"),_poly_char("2"),_poly_char("3"),_poly_char("4"),_poly_char("5"),_poly_char("6"),_poly_char("7"),_poly_char("8"),_poly_char("9"),
  _poly_char(" "),_poly_char("-"),_poly_char("_"),_poly_char(".")
];
function 8bit_polyfont() = [[6,8], [], _font_chars()];
