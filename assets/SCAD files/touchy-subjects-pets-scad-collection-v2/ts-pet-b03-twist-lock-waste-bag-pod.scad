// TS-PET-B03 - Twist-Lock Waste Bag Pod
$fn = 96; outer_d = 50; body_h = 74; wall = 2.2; lid_h = 13; tab_w = 8; tab_t = 2.0; tab_h = 4.0; fit = 0.35; slot_w = 10; slot_h = 18; spacing = 70;
module bayonet_tabs() { for (a = [0,120,240]) rotate([0,0,a]) translate([outer_d/2 - wall - 2,0,body_h - lid_h]) cube([tab_t, tab_w, tab_h], center = true); }
module body() { difference() { union() { cylinder(h = body_h, d = outer_d); bayonet_tabs(); } translate([0,0,wall]) cylinder(h = body_h, d = outer_d - 2*wall); translate([outer_d/2 - wall/2, 0, body_h/2]) rotate([0,90,0]) linear_extrude(height = wall + 4, center = true) hull() { translate([0, slot_h/2 - slot_w/2]) circle(d = slot_w); translate([0,-slot_h/2 + slot_w/2]) circle(d = slot_w); } } }
module lid() { difference() { cylinder(h = lid_h, d = outer_d); translate([0,0,wall]) cylinder(h = lid_h, d = outer_d - 2*wall + fit); for (a = [0,120,240]) rotate([0,0,a]) translate([outer_d/2 - wall - 2,0,lid_h/2]) cube([tab_t + 1.2, tab_w + 1.2, lid_h + 2], center = true); } }
body(); translate([spacing,0,0]) lid();
