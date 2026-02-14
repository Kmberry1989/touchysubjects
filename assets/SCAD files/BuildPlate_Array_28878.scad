
include <ContourHandshake_28878.scad>;
cols = 2;
rows = 3;
gap = 4;

module array_layout() {
  start_x = -((cols - 1) * (card_w + gap)) / 2;
  start_y = -((rows - 1) * (card_h + gap)) / 2;

  for (r = [0:rows-1])
    for (c = [0:cols-1])
      translate([start_x + c*(card_w+gap), start_y + r*(card_h+gap), 0])
        contour_handshake_card();
}

array_layout();
