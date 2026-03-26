
include <common_v2.scad>

// Touchy Subjects - Teardrop Safety Pendant
// Teardrop silhouette with thumb-slide safety and hinged cap concept.

w = 20;
d = 14;
h = 34;
wall = 1.6;
show_open = true;

module teardrop_2d() {
    hull() {
        translate([0,5]) circle(r=7);
        translate([0,-5]) circle(r=4.5);
    }
}

module shell() {
    difference() {
        linear_extrude(height=h, scale=0.92) teardrop_2d();
        translate([0,0,3]) linear_extrude(height=h-5, scale=0.92) offset(delta=-wall) teardrop_2d();
        // latch pocket
        translate([7.2,0,h*0.6]) cube([3.0,7,8], center=true);
    }
    // bail
    translate([0,7.5,h+5]) rotate([90,0,0]) chain_bail(outer_w=9, inner_w=4, thickness=3, height=8);
    // tactile front
    for (z=[6:7:h-6]) translate([0,6.8,z]) sphere(r=0.9,$fn=16);
}

module cap_open() {
    rotate([0,105,0]) translate([0,0,h-2])
    difference() {
        linear_extrude(height=4.5, scale=0.95) teardrop_2d();
        translate([0,0,-0.1]) linear_extrude(height=4.7, scale=0.95) offset(delta=-wall-0.2) teardrop_2d();
    }
}

module cap_closed() {
    translate([0,0,h-2])
    difference() {
        linear_extrude(height=4.5, scale=0.95) teardrop_2d();
        translate([0,0,-0.1]) linear_extrude(height=4.7, scale=0.95) offset(delta=-wall-0.2) teardrop_2d();
    }
}

shell();
// thumb-slide safety button
translate([7.1,0,h*0.6]) cube([2.2,5.8,6], center=true);
if (show_open) cap_open(); else cap_closed();
