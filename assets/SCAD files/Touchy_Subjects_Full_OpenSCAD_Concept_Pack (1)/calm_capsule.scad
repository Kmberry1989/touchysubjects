
include <common.scad>

/*
Calm Capsule
Non-medical carry capsule for scent bead or grounding insert.
Bayonet-lug concept shown separated.
*/
body_d = 18;
inner_d = 12;
body_h = 30;
cap_h = 7;

module body() {
    difference() {
        cylinder(h=body_h, d=body_d);
        translate([0,0,2]) cylinder(h=body_h, d=inner_d);
    }
    simple_bayonet_lugs(d=inner_d+2, lug_w=4, lug_t=1.5, z=body_h-2.2, count=3);
    intersection() {
        cylinder(h=body_h-4, d=body_d+0.4);
        ripple_band(d=body_d+0.2, h=body_h-4, waves=11, amp=0.65, thickness=0.95);
    }
}

module cap() {
    difference() {
        cylinder(h=cap_h, d=body_d);
        translate([0,0,1.2]) cylinder(h=cap_h, d=inner_d+1);
    }
    simple_bayonet_lugs(d=inner_d+0.6, lug_w=4.4, lug_t=1.4, z=1.6, count=3);
    translate([0,0,cap_h]) keyring_loop(outer=10, inner=5, thickness=3);
}

translate([-14,0,0]) body();
translate([14,0,0]) cap();
