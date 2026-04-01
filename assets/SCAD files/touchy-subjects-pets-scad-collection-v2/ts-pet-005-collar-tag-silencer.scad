// TS-PET-005 - Collar Tag Silencer Sleeve
$fn = 64;
tag_w = 32;
tag_h = 38;
overall_t = 4.2;
wall = 2.0;
slot_gap = 8;
ring_hole_d = 5.0;
corner_d = 8;
module rounded_rect_2d(w, h, d) {
    hull() {
        translate([-w/2 + d/2, -h/2 + d/2]) circle(d = d);
        translate([ w/2 - d/2, -h/2 + d/2]) circle(d = d);
        translate([-w/2 + d/2,  h/2 - d/2]) circle(d = d);
        translate([ w/2 - d/2,  h/2 - d/2]) circle(d = d);
    }
}
difference() {
    linear_extrude(height = overall_t) rounded_rect_2d(tag_w + 2*wall, tag_h + 2*wall, corner_d);
    translate([0,0,wall]) linear_extrude(height = overall_t) rounded_rect_2d(tag_w, tag_h, max(4, corner_d - 2));
    translate([0, -(tag_h/2 + wall), -1]) cube([slot_gap, 14, overall_t + 2], center = true);
    translate([0, tag_h/2 + wall - 5, -1]) cylinder(h = overall_t + 2, d = ring_hole_d);
}
