
include <common.scad>

/*
Focus Dock System
Desk base with slots for phone, pen, pebble, and modular tactile insert.
*/
base_size = [160,90,16];
phone_slot_w = 14;
pen_well_d = 18;
pebble_tray = [54,42,4];
insert_slot = [36,24,6];

difference() {
    rounded_cube(size=base_size, r=8, center=true);
    translate([30,0,6])
        cube([phone_slot_w,72,10], center=true);
    translate([-48,22,0]) cylinder(h=18, d=pen_well_d, center=true);
    translate([-48,-22,0]) cylinder(h=18, d=pen_well_d, center=true);
    translate([0,-18,5]) rounded_cube(size=[pebble_tray[0], pebble_tray[1], pebble_tray[2]+1], r=5, center=true);
    translate([48,0,4]) rounded_cube(size=[insert_slot[0], insert_slot[1], insert_slot[2]+1], r=3, center=true);
}
translate([48,0,8]) tactile_disc(d=24, h=3, style="ripple");
