
include <common_v2.scad>

// Touchy Subjects - Snap-Wrap Sleeve Hybrid
// Bottle sleeve with removable grip band / bracelet insert.

bottle_d = 74;
height = 104;
wall = 4.0;
clearance = 1.4;
band_h = 34;
band_t = 3.4;
base_t = 8;

outer_d = bottle_d + 2*clearance + 2*wall;

module sleeve_core() {
    difference() {
        union() {
            cylinder(h=height, r=outer_d/2);
            cylinder(h=base_t, r=outer_d/2 + 2.4);
        }
        translate([0,0,base_t])
            cylinder(h=height-base_t+0.2, r=bottle_d/2 + clearance);
        translate([0,0,height*0.45])
            cylinder(h=band_h, r=outer_d/2 - 0.9);
        translate([0,-outer_d, height*0.45 + band_h/2])
            cube([outer_d*2, 2.8, band_h+0.8], center=true);  // insertion slot
        translate([0,0,-0.1]) cylinder(h=base_t-2.2, r=outer_d/2 - 8);
    }
    for (z=[14:12:height-10])
        rotate_extrude() translate([outer_d/2+0.3,0,z]) circle(r=0.45,$fn=14);
}

module removable_band_flat() {
    translate([0,0,0])
    difference() {
        rounded_strip_3d(150, band_h, band_t, r=8);
        translate([0,0,band_t-1.25]) rounded_strip_3d(120, 13.5, 0.9, r=5);
    }
    texture_pebble_panel(len=138, wid=band_h-8, z=band_t, step_x=10, step_y=8, rr=1.15);
}

sleeve_core();
translate([100,0,0]) removable_band_flat();
