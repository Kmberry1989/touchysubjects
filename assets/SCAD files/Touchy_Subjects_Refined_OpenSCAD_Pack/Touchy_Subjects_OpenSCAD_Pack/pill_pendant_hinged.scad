
include <common.scad>

// Touchy Subjects - Pill Pendant - Hinged Latch Capsule
// Conceptual quick-access pendant with side latch and living-hinge-ready geometry.

texture_style = "smooth"; // "smooth", "pebble"
show_open = true;

body_d = 20;
body_h = 36;
wall = 2.0;
lid_h = 10;
cavity_d = 13.2;
hinge_barrel_d = 2.4;
hinge_gap = 0.45;
latch_w = 5.5;
latch_t = 2.0;

module lower_body() {
    difference() {
        union() {
            cylinder(h=body_h, r=body_d/2);
            // hinge barrels
            for (z=[body_h-8, body_h-4])
                translate([-body_d/2-0.8,0,z])
                rotate([0,90,0]) cylinder(h=3.2, r=hinge_barrel_d/2, center=true);
            // latch seat
            translate([body_d/2-1.2,-latch_w/2,body_h-7])
                cube([2.4,latch_w,6]);
            translate([0,0,body_h-1.5])
            linear_extrude(height=5)
            projection(cut=false)
            chain_bail(outer_w=10, inner_w=5.5, thickness=3.6, height=10);
            if (texture_style == "pebble")
                translate([0,0,4]) pebble_band(h=body_h-12, r=body_d/2+0.05, pebble_r=0.85, rows=6, cols=20, relief=0.45);
        }
        translate([0,0,3]) cylinder(h=body_h, r=cavity_d/2);
        o_ring_groove(r=cavity_d/2 + 1.1, h=1.0, z=body_h-lid_h+0.9);
    }
}

module lid_part() {
    difference() {
        union() {
            translate([0,0,body_h-lid_h]) cylinder(h=lid_h, r=body_d/2);
            // center hinge barrel
            translate([-body_d/2-0.8,0,body_h-6])
                rotate([0,90,0]) cylinder(h=3.0, r=hinge_barrel_d/2, center=true);
            // latch tongue
            translate([body_d/2-0.7,-latch_w/2+0.5,body_h-6.2])
                cube([2.0,latch_w-1,4.5]);
        }
        translate([0,0,body_h-lid_h+1.2]) cylinder(h=lid_h, r=cavity_d/2 + 0.9);
        // thumb scoop
        translate([0,body_d/2-1.0,body_h-5.2])
            rotate([0,90,0]) cylinder(h=8, r=4, center=true);
    }
}

module hinge_pin() {
    translate([-body_d/2-0.8,0,body_h-6])
    rotate([0,90,0]) cylinder(h=3.9, r=0.75, center=true);
}

lower_body();
if (show_open)
    translate([0,0,0]) rotate([0,-95,0]) translate([0,0,0]) lid_part();
else
    lid_part();
hinge_pin();
