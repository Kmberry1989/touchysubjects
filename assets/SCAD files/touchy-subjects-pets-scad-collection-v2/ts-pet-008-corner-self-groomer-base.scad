// TS-PET-008 - Corner Self-Groomer Base
$fn = 72;
leg_len = 95; body_th = 18; height = 90; corner_r = 10; insert_w = 34; insert_h = 72; insert_depth = 3.0; mount_hole_d = 5; mount_margin = 18;
module l_shape_2d(len, th) { union() { translate([th/2, len/2]) square([th, len], center = true); translate([len/2, th/2]) square([len, th], center = true); } }
module rounded_l_body() { linear_extrude(height = height) offset(r = corner_r) offset(delta = -corner_r) l_shape_2d(leg_len, body_th); }
difference() {
    rounded_l_body();
    translate([body_th/2, leg_len/2, height/2]) rotate([90,0,0]) linear_extrude(height = insert_depth + 0.2, center = false) square([insert_w, insert_h], center = true);
    translate([leg_len/2, body_th/2, height/2]) rotate([90,0,90]) linear_extrude(height = insert_depth + 0.2, center = false) square([insert_w, insert_h], center = true);
    for (z = [mount_margin, height - mount_margin]) {
        translate([body_th/2, body_th/2, z]) rotate([90,0,0]) cylinder(h = body_th + 4, d = mount_hole_d, center = true);
        translate([body_th/2, body_th/2, z]) rotate([90,90,0]) cylinder(h = body_th + 4, d = mount_hole_d, center = true);
    }
}
