
include <common.scad>

// Touchy Subjects - Pill Pendant - Threaded Capsule
// Jewelry-first, utility-second concept with tactile body options.

texture_style = "pebble"; // "smooth", "pebble", "knurl"
show_open = true;
show_cutaway = false;

body_d = 18;
body_h = 42;
wall = 2.0;
cap_h = 8;
thread_pitch = 2.0;
thread_depth = 0.8;
cavity_d = 12.2;
cavity_h = 31;
bail_gap = 5.2;

module thread_profile() {
    polygon(points=[[0,0],[thread_pitch/2,thread_depth],[thread_pitch,0]]);
}

module simple_external_thread(d=14, h=7, pitch=2, depth=0.8) {
    linear_extrude(height=h, twist=360*h/pitch, convexity=10)
    translate([d/2,0,0])
    thread_profile();
}

module body_base() {
    difference() {
        union() {
            cylinder(h=body_h, r=body_d/2);
            translate([0,0,body_h-2])
            linear_extrude(height=5)
            projection(cut=false)
            chain_bail(outer_w=9, inner_w=bail_gap, thickness=3.4, height=10);
            if (texture_style == "pebble")
                translate([0,0,6]) pebble_band(h=body_h-14, r=body_d/2+0.1, pebble_r=0.8, rows=6, cols=18, relief=0.45);
            if (texture_style == "knurl")
                translate([0,0,6]) knurl_band(h=body_h-14, r=body_d/2, depth=0.6, pitch=3.5, tooth_w=1.5);
            if (texture_style == "smooth")
                ;
            translate([0,0,body_h-cap_h])
                simple_external_thread(d=cavity_d+wall*2-1.1, h=cap_h-2.1, pitch=thread_pitch, depth=thread_depth);
        }
        translate([0,0,3])
            cylinder(h=cavity_h, r=cavity_d/2);
        translate([0,0,body_h-cap_h])
            cylinder(h=cap_h+0.2, r=cavity_d/2 + 0.6);
        o_ring_groove(r=cavity_d/2 + 1.2, h=1.1, z=body_h-cap_h+1.3);
        if (show_cutaway)
            translate([0,-body_d,0]) cube([body_d*2, body_d*2, body_h+12], center=false);
    }
}

module cap_part() {
    difference() {
        union() {
            cylinder(h=cap_h, r=body_d/2);
            translate([0,0,cap_h-1.2]) cylinder(h=1.2, r=body_d/2-0.6);
        }
        translate([0,0,1.2]) cylinder(h=cap_h, r=cavity_d/2 + 1.2);
        // coarse internal thread approximation
        translate([0,0,1.1])
            linear_extrude(height=cap_h-1.8, twist=-360*(cap_h-1.8)/thread_pitch, convexity=10)
            translate([(cavity_d/2 + 1.0),0,0])
            thread_profile();
    }
}

body_base();
if (show_open)
    translate([body_d*1.6,0,body_h-cap_h]) rotate([0,180,0]) cap_part();
else
    translate([0,0,body_h-cap_h]) cap_part();
