
include <common.scad>

// Touchy Subjects - Pill Pendant - Quarter-turn Bayonet Lock
// Faster access than threading, with two lock pins and entry ramps.

texture_style = "topo"; // "smooth", "topo", "pebble"
show_open = true;

body_d = 19;
body_h = 40;
wall = 2.0;
cap_h = 9;
cavity_d = 12.5;
lock_pin_d = 2.0;
lock_pin_z = body_h - cap_h + 2.8;
lock_travel_deg = 28;

module body_part() {
    difference() {
        union() {
            cylinder(h=body_h, r=body_d/2);
            translate([0,0,body_h-1.8])
            linear_extrude(height=5)
            projection(cut=false)
            chain_bail(outer_w=10, inner_w=5.2, thickness=3.4, height=11);
            if (texture_style == "topo")
                translate([0,0,5]) topographic_rib_band(h=body_h-12, r=body_d/2+0.1, lines=9, amp=1.4);
            if (texture_style == "pebble")
                translate([0,0,5]) pebble_band(h=body_h-12, r=body_d/2+0.1, pebble_r=0.8, rows=6, cols=18, relief=0.4);

            // two bayonet pins
            for (a=[0,180])
                rotate([0,0,a]) translate([cavity_d/2 + 1.3,0,lock_pin_z])
                    rotate([90,0,0]) cylinder(h=3.0, r=lock_pin_d/2, center=true);
        }
        translate([0,0,3]) cylinder(h=body_h, r=cavity_d/2);
        // entry slots and lock tracks
        for (a=[0,180]) {
            rotate([0,0,a])
            translate([0,0,lock_pin_z-lock_pin_d/2])
            rotate_extrude(angle=lock_travel_deg+12, convexity=10)
                translate([cavity_d/2 + 1.3,0,0])
                square([2.6,lock_pin_d+0.6]);
        }
        // straight entry windows
        for (a=[0,180]) {
            rotate([0,0,a])
            translate([cavity_d/2+0.7,-1.8,body_h-cap_h-0.2])
                cube([3.4,3.6,6.2]);
        }
        o_ring_groove(r=cavity_d/2 + 1.0, h=1.0, z=body_h-cap_h+1.0);
    }
}

module cap_part() {
    difference() {
        union() {
            cylinder(h=cap_h, r=body_d/2);
            for (a=[0,180])
                rotate([0,0,a]) translate([cavity_d/2 + 1.4,0,2.5])
                    rotate([90,0,0]) cylinder(h=3.4, r=lock_pin_d/2, center=true);
        }
        translate([0,0,1.1]) cylinder(h=cap_h, r=cavity_d/2 + 1.0);
    }
}

body_part();
if (show_open)
    translate([body_d*1.7,0,body_h-cap_h]) rotate([0,180,lock_travel_deg]) cap_part();
else
    translate([0,0,body_h-cap_h]) cap_part();
