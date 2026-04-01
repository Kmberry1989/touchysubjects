// TS-PET-C03 - Hanging Corner Toy Anchor
$fn = 72; plate_w = 36; plate_h = 60; plate_t = 6; corner_r = 8; loop_outer_d = 18; loop_inner_d = 8; loop_offset = 12; screw_d = 5; head_d = 10; hole_y = 16;
module rounded_plate_2d(w,h,r) { hull() { translate([-w/2 + r, -h/2 + r]) circle(r = r); translate([ w/2 - r, -h/2 + r]) circle(r = r); translate([-w/2 + r,  h/2 - r]) circle(r = r); translate([ w/2 - r,  h/2 - r]) circle(r = r);} }
difference() { union() { linear_extrude(height = plate_t) rounded_plate_2d(plate_w, plate_h, corner_r); translate([0, plate_h/2 + loop_offset, plate_t/2]) rotate([90,0,0]) difference() { cylinder(h = 10, d = loop_outer_d, center = true); cylinder(h = 12, d = loop_inner_d, center = true); } }
for (y = [-hole_y,hole_y]) { translate([0,y,-1]) cylinder(h = plate_t + 2, d = screw_d); translate([0,y,plate_t - 2.5]) cylinder(h = 3, d1 = head_d, d2 = screw_d); } }
