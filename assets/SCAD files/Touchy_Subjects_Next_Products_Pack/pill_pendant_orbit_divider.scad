
include <common_v2.scad>

// Touchy Subjects - Orbit Divider Pendant
// Calm rounded silhouette, quarter-turn closure, and two-cell divider.

body_h = 32;
body_r = 9.5;
wall = 1.6;
bail_h = 10;
show_cap_exploded = true;

module body() {
    difference() {
        union() {
            cylinder(h=body_h, r=body_r);
            translate([0,0,body_h-2]) sphere(r=body_r, $fn=56);
            translate([0,bail_h,body_h+7]) rotate([90,0,0]) chain_bail(outer_w=9, inner_w=4.5, thickness=3, height=8);
        }
        translate([0,0,3]) cylinder(h=body_h-4, r=body_r-wall);
        // divider
        translate([-0.8,0,6]) cube([1.6, body_r*1.45, body_h-10], center=true);
        quarter_turn_lug(r=body_r-wall+0.6, lug_w=3.0, lug_t=1.8, z=body_h-3.8);
    }
}

module cap() {
    difference() {
        union() {
            cylinder(h=6.5, r=body_r+0.15);
            translate([0,0,5]) sphere(r=body_r*0.92, $fn=56);
        }
        translate([0,0,-0.1]) cylinder(h=6.8, r=body_r-wall-0.3);
        // receiving channels
        for (a=[0,180])
            rotate([0,0,a]) translate([body_r-wall+0.4,0,1.7])
                cube([2.3,4.0,2.4], center=true);
    }
    // tactile orbit rings
    for (z=[1.6,3.5,5.2]) rotate_extrude() translate([body_r+0.25,0,z]) circle(r=0.38,$fn=16);
}

body();
translate([show_cap_exploded ? 24 : 0,0,show_cap_exploded ? body_h-3 : body_h-3]) rotate([0,180,0]) cap();
