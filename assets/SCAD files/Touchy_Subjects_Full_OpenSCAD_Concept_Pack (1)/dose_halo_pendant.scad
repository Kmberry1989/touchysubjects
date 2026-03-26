
include <common.scad>

/*
Dose Halo
Pendant storage container with screw-cap and tactile shell.
Concept fit only; thread shown as stylized grip band.
*/
body_d = 16;
inner_d = 10.5;
body_h = 34;
cap_h = 8;
loop_outer = 10;
loop_inner = 5;
tactile = "pebble"; // ["pebble","ripple","smooth"]

module body() {
    union() {
        difference() {
            cylinder(h=body_h, d=body_d);
            translate([0,0,2]) cylinder(h=body_h, d=inner_d);
        }
        translate([0,0,body_h]) cylinder(h=2.6, d=body_d-0.8);
    }
    if (tactile != "smooth")
        intersection() {
            cylinder(h=body_h-4, d=body_d+0.8);
            if (tactile == "pebble")
                pebble_texture_band(d=body_d+0.5, h=body_h-4, pebble_d=1.7, radial=0.3, rows=7, cols=18);
            else
                ripple_band(d=body_d+0.4, h=body_h-4, waves=9, amp=0.55, thickness=0.8);
        }
}

module cap() {
    union() {
        cylinder(h=cap_h, d=body_d);
        translate([0,0,cap_h]) keyring_loop(outer=loop_outer, inner=loop_inner, thickness=3);
    }
    translate([0,0,1.5]) knurl_band(d=body_d+0.8, h=3.2, depth=0.8, count=20, twist=20);
}

translate([-12,0,0]) body();
translate([12,0,0]) cap();
