
include <common.scad>

/*
Pocket Tactile Loom
Small frame with flexible-band slots.
Print frame rigid; add TPU bands or elastic cord separately.
*/
outer = [72,48,8];
inner = [54,30,8];
slot_w = 2.8;
slot_count = 6;
corner_r = 5;

difference() {
    rounded_cube(size=outer, r=corner_r, center=true);
    rounded_cube(size=[inner[0], inner[1], inner[2]+1], r=3, center=true);
    for (i=[0:slot_count-1]) {
        y = -outer[1]/2 + 6 + i*(outer[1]-12)/(slot_count-1);
        for (sx=[-1,1]) {
            translate([sx*(outer[0]/2-3), y, 0])
                cube([5,slot_w,outer[2]+2], center=true);
        }
    }
}
