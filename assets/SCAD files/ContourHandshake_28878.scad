
// Contour Handshake™ Business Card
card_w = 88.9;
card_h = 50.8;
corner_radius = 3;
base_thickness = 1.6;
ridge_height = 0.8;
line_width = 2.2;
line_spacing = 2.8;
curve_amplitude = 6;
curve_bias = 4;
swirl_strength = 0.25;

module rounded_rect_2d(w, h, r) {
  offset(r=r) offset(delta=-r) square([w, h], center=true);
}

module card_base() {
  linear_extrude(height=base_thickness)
    rounded_rect_2d(card_w, card_h, corner_radius);
}

module ridge_field(height=ridge_height) {
  for (i = [-18:18]) {
    x = i * line_spacing;
    phase = (x / (card_w / 2)) * swirl_strength;
    translate([x, 0, base_thickness])
      linear_extrude(height=height)
        offset(r=0.6) offset(delta=-0.6)
          polygon([
            [-card_h, sin(i*0.55 + phase)*curve_amplitude + curve_bias],
            [ card_h, cos(i*0.55 - phase)*curve_amplitude - curve_bias],
            [ card_h, cos(i*0.55 - phase)*curve_amplitude - curve_bias + line_width],
            [-card_h, sin(i*0.55 + phase)*curve_amplitude + curve_bias + line_width]
          ]);
  }
}

module contour_handshake_card() {
  union() {
    card_base();
    ridge_field();
  }
}

contour_handshake_card();
