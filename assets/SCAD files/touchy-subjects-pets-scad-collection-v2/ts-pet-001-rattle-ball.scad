// TS-PET-001 - Rattle Ball
$fn = 96;
ball_d = 44;
shell = 2.2;
slot_count = 8;
slot_w = 8;
slot_h = 18;
bead_d = 14;
module rounded_slot_3d(depth, w, h) {
    rotate([90, 0, 0])
        linear_extrude(height = depth, center = true)
            hull() {
                translate([0,  h/2 - w/2]) circle(d = w);
                translate([0, -h/2 + w/2]) circle(d = w);
            }
}
module shell_with_slots() {
    difference() {
        sphere(d = ball_d);
        union() {
            sphere(d = ball_d - 2*shell);
            for (i = [0 : slot_count - 1]) {
                rotate([0, 0, i * 360 / slot_count])
                    translate([ball_d/2 - shell/2, 0, 0])
                        rounded_slot_3d(shell + 4, slot_w, slot_h);
            }
        }
    }
}
shell_with_slots();
sphere(d = bead_d);
