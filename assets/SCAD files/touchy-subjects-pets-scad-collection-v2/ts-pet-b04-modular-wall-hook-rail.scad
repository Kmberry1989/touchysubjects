// TS-PET-B04 - Modular Wall Hook Rail Segment
$fn = 72; rail_w = 120; rail_h = 40; rail_t = 6; tab_w = 12; tab_t = 3; tab_h = 14; hook_proj = 28; hook_w = 16; hook_t = 10; screw_d = 5; head_d = 10;
module base_2d() { hull() { translate([-rail_w/2 + 8, -rail_h/2 + 8]) circle(r = 8); translate([ rail_w/2 - 8, -rail_h/2 + 8]) circle(r = 8); translate([-rail_w/2 + 8,  rail_h/2 - 8]) circle(r = 8); translate([ rail_w/2 - 8,  rail_h/2 - 8]) circle(r = 8); } }
module hook_profile() { polygon(points = [[0,0],[hook_proj,0],[hook_proj,hook_t],[10,hook_t],[7,hook_t + 7],[0,hook_t + 7]]); }
difference() { union() { linear_extrude(height = rail_t) base_2d(); translate([0, rail_h/2 - 10, rail_t]) rotate([90,0,0]) linear_extrude(height = hook_w, center = true) hook_profile(); translate([rail_w/2 + tab_t/2, 0, rail_t/2]) cube([tab_t, tab_w, tab_h], center = true); }
translate([-rail_w/2 + tab_t/2, 0, rail_t/2]) cube([tab_t + 0.5, tab_w + 0.5, tab_h + 0.5], center = true);
for (x = [-35,35]) { translate([x,0,-1]) cylinder(h = rail_t + 2, d = screw_d); translate([x,0,rail_t - 2.5]) cylinder(h = 3, d1 = head_d, d2 = screw_d); } }
