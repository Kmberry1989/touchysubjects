// TS-PET-A03 - Decorative Leash Hook
$fn = 72; plate_w = 70; plate_h = 100; plate_t = 6; corner_r = 10; hook_proj = 42; hook_w = 20; hook_t = 12; hook_lip = 10; screw_d = 5; head_d = 10; hole_y = 28; groove_depth = 0.5; groove_count = 3; groove_spacing = 4;
module rounded_plate_2d(w, h, r) { hull() { translate([-w/2 + r, -h/2 + r]) circle(r = r); translate([ w/2 - r, -h/2 + r]) circle(r = r); translate([-w/2 + r,  h/2 - r]) circle(r = r); translate([ w/2 - r,  h/2 - r]) circle(r = r);} }
module hook_profile() { polygon(points = [[0,0],[hook_proj,0],[hook_proj,hook_t],[18,hook_t],[13,hook_t + hook_lip],[0,hook_t + hook_lip]]); }
difference() {
    union() { linear_extrude(height = plate_t) rounded_plate_2d(plate_w, plate_h, corner_r); translate([0, plate_h/2 - 24, plate_t]) rotate([90,0,0]) linear_extrude(height = hook_w, center = true) hook_profile(); }
    for (y = [-hole_y, hole_y]) { translate([0,y,-1]) cylinder(h = plate_t + 2, d = screw_d); translate([0,y,plate_t - 2.5]) cylinder(h = 3.0, d1 = head_d, d2 = screw_d); }
    for (i = [1:groove_count]) translate([0,0,plate_t - groove_depth]) linear_extrude(height = groove_depth + 0.1) offset(delta = -i * groove_spacing) rounded_plate_2d(plate_w - 8, plate_h - 8, corner_r - 1);
}
