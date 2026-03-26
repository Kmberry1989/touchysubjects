
include <common_v2.scad>

// Touchy Subjects - Clip Carrier Capsule
// Alternate bag / keyclip carrier with magnetic-assist style chamfered mouth.

body_r = 8.5;
body_h = 30;
wall = 1.6;
show_cap_off = true;

module clip_tab() {
    difference() {
        hull() {
            translate([0,0,0]) cube([6,3,10], center=true);
            translate([0,10,0]) cube([12,3,14], center=true);
        }
        translate([0,7,0]) cube([6.2,5,8], center=true);
    }
}

module body() {
    difference() {
        union() {
            cylinder(h=body_h, r=body_r);
            translate([0,0,body_h]) sphere(r=body_r*0.78,$fn=48);
            translate([0,body_r+4,body_h*0.72]) rotate([90,0,0]) clip_tab();
        }
        translate([0,0,2.8]) cylinder(h=body_h-3, r=body_r-wall);
        // inner magnetic-assist chamfer proxy
        translate([0,0,body_h-4.2]) cylinder(h=2.8, r1=body_r-wall+0.6, r2=body_r-wall-0.2);
    }
    texture_hex_panel(len=body_r*5.3, wid=body_r*4.0, z=body_h*0.35, step=8, rr=1.6, h=0.6);
}

module cap() {
    difference() {
        cylinder(h=5.5, r=body_r+0.1);
        translate([0,0,-0.1]) cylinder(h=5.2, r=body_r-wall-0.25);
    }
    for (a=[0:24:336]) rotate([0,0,a]) translate([body_r+0.2,0,2.2]) sphere(r=0.45,$fn=14);
}

body();
translate([show_cap_off ? 20 : 0,0,show_cap_off ? body_h-2 : body_h-2]) rotate([0,180,0]) cap();
