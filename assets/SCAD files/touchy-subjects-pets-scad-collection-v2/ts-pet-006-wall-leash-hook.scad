// TS-PET-006 - Wall Leash Hook
$fn = 72;
plate_w = 60; plate_h = 90; plate_t = 6; corner_r = 8;
hook_proj = 40; hook_w = 18; hook_t = 12; hook_lip = 10;
screw_d = 5; head_d = 10; hole_y = 24;
module rounded_plate_2d(w, h, r) { hull() { translate([-w/2 + r, -h/2 + r]) circle(r = r); translate([ w/2 - r, -h/2 + r]) circle(r = r); translate([-w/2 + r,  h/2 - r]) circle(r = r); translate([ w/2 - r,  h/2 - r]) circle(r = r);} }
module plate() { linear_extrude(height = plate_t) rounded_plate_2d(plate_w, plate_h, corner_r); }
module hook_profile() { polygon(points = [[0,0],[hook_proj,0],[hook_proj,hook_t],[16,hook_t],[12,hook_t + hook_lip],[0,hook_t + hook_lip]]); }
difference() { union() { plate(); translate([0, plate_h/2 - 24, plate_t]) rotate([90,0,0]) linear_extrude(height = hook_w, center = true) hook_profile(); }
for (y = [-hole_y, hole_y]) { translate([0,y,-1]) cylinder(h = plate_t + 2, d = screw_d); translate([0,y,plate_t - 2.5]) cylinder(h = 3.0, d1 = head_d, d2 = screw_d); } }
