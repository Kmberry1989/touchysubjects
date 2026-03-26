
include <common.scad>

/*
Pill Pendant Clip Carrier
Clip-on carrier variant for bag or key loop.
*/
body_d = 18;
body_h = 36;
inner_d = 12;

module carrier() {
    difference() {
        union() {
            cylinder(h=body_h, d=body_d);
            translate([0,body_d/2+4,body_h-4]) rounded_cube(size=[10,6,14], r=2, center=true);
        }
        translate([0,0,2]) cylinder(h=body_h, d=inner_d);
        translate([0,body_d/2+4,body_h-4]) rotate([90,0,0]) cylinder(h=8, d=5, center=true);
    }
    intersection() {
        cylinder(h=body_h, d=body_d+0.3);
        pebble_texture_band(d=body_d+0.1, h=body_h, pebble_d=2, radial=0.35, rows=7, cols=20);
    }
}
carrier();
