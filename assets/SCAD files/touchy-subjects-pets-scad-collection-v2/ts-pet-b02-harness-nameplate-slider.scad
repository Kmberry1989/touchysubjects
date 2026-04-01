// TS-PET-B02 - Harness Nameplate Slider
$fn = 72; plate_w = 52; plate_h = 24; plate_t = 4.0; corner_d = 6; strap_w = 20; slot_margin = 7;
module rounded_rect_2d(w,h,d) { hull() { translate([-w/2 + d/2, -h/2 + d/2]) circle(d = d); translate([ w/2 - d/2, -h/2 + d/2]) circle(d = d); translate([-w/2 + d/2,  h/2 - d/2]) circle(d = d); translate([ w/2 - d/2,  h/2 - d/2]) circle(d = d);} }
difference() { linear_extrude(height = plate_t) rounded_rect_2d(plate_w, plate_h, corner_d); translate([-plate_w/2 + slot_margin,0,-1]) cube([slot_margin, strap_w, plate_t + 2], center = true); translate([ plate_w/2 - slot_margin,0,-1]) cube([slot_margin, strap_w, plate_t + 2], center = true); }
