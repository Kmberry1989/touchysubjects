// TS-PET-A01 - Faceted Rattle Ball
$fn = 64; ball_d = 46; shell = 2.2; bead_d = 14; cut_count = 6; facet_depth = 3.0; slot_count = 6; slot_w = 7; slot_h = 16;
module rounded_slot(depth, w, h) { rotate([90,0,0]) linear_extrude(height = depth, center = true) hull() { translate([0, h/2 - w/2]) circle(d = w); translate([0,-h/2 + w/2]) circle(d = w); } }
module faceted_shell() { difference() { sphere(d = ball_d); union() { sphere(d = ball_d - 2*shell); for (a = [0 : 360/cut_count : 359]) rotate([0,a,0]) translate([0,0,ball_d/2 - facet_depth/2]) cube([ball_d, ball_d, facet_depth], center = true); for (i = [0 : slot_count - 1]) rotate([0,0,i * 360 / slot_count]) translate([ball_d/2 - shell/2, 0, 0]) rounded_slot(shell + 4, slot_w, slot_h); } } }
faceted_shell(); sphere(d = bead_d);
