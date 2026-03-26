
include <common.scad>

/*
Memory Orbit
Pendant locket with tactile shell and inner photo/note cavity.
*/
outer_d = 34;
inner_d = 26;
half_h = 8;
hinge_pin_d = 2;

module half(style="pebble") {
    difference() {
        cylinder(h=half_h, d=outer_d);
        translate([0,0,1.8]) cylinder(h=half_h, d=inner_d);
    }
    intersection() {
        cylinder(h=half_h, d=outer_d+0.4);
        if (style=="pebble")
            pebble_texture_band(d=outer_d+0.1, h=half_h, pebble_d=2.2, radial=0.35, rows=4, cols=24);
        else
            ripple_band(d=outer_d+0.1, h=half_h, waves=10, amp=0.8, thickness=1.1);
    }
}

translate([-22,0,0]) half("pebble");
translate([22,0,0]) half("ripple");
translate([-22 + outer_d/2 + 4,0,half_h/2]) rotate([90,0,0]) cylinder(h=8, d=hinge_pin_d, center=true);
translate([22 - outer_d/2 - 4,0,half_h/2]) rotate([90,0,0]) cylinder(h=8, d=hinge_pin_d, center=true);
