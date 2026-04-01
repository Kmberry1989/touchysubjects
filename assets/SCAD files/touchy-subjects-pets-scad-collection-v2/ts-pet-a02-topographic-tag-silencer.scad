// TS-PET-A02 - Topographic Tag Silencer
$fn = 72; tag_w = 32; tag_h = 38; wall = 2.0; thickness = 4.2; slot_gap = 8; ring_hole_d = 5.0; corner_d = 8; groove_count = 4; groove_depth = 0.45; groove_offset = 2.2;
module rounded_rect_2d(w, h, d) { hull() { translate([-w/2 + d/2, -h/2 + d/2]) circle(d = d); translate([ w/2 - d/2, -h/2 + d/2]) circle(d = d); translate([-w/2 + d/2,  h/2 - d/2]) circle(d = d); translate([ w/2 - d/2,  h/2 - d/2]) circle(d = d);} }
difference() {
    linear_extrude(height = thickness) rounded_rect_2d(tag_w + 2*wall, tag_h + 2*wall, corner_d);
    translate([0,0,wall]) linear_extrude(height = thickness) rounded_rect_2d(tag_w, tag_h, max(4, corner_d - 2));
    translate([0, -(tag_h/2 + wall), -1]) cube([slot_gap, 14, thickness + 2], center = true);
    translate([0, tag_h/2 + wall - 5, -1]) cylinder(h = thickness + 2, d = ring_hole_d);
    for (i = [1:groove_count]) translate([0,0,thickness - groove_depth]) linear_extrude(height = groove_depth + 0.1) offset(delta = -i * groove_offset) rounded_rect_2d(tag_w + 2*wall - 2, tag_h + 2*wall - 2, corner_d - 1);
}
