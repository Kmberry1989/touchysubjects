
include <common.scad>

// Touchy Subjects - Water Bottle Grip Sleeve / Cozy / Coaster
// Features:
// - compression-fit inner ribs
// - tactile outer band
// - thick shock-absorbing coaster base
// - optional thumb pocket and finger-loop ridge

texture_style = "hex"; // "hex", "pebble", "topo"
show_cutaway = false;
show_bottle_placeholder = true;

bottle_d = 74;          // nominal bottle diameter
clearance = 1.5;
height = 108;
wall = 4.2;
base_thickness = 9;
lip_height = 4;
inner_rib_h = 1.0;
inner_rib_count = 5;
taper = 1.2;            // mm total diameter taper top-to-bottom
thumb_pocket = true;
finger_ridge = true;

outer_d = bottle_d + clearance*2 + wall*2;

module sleeve_shell() {
    difference() {
        union() {
            // main body
            if (texture_style == "hex")
                hex_dimple_band(h=height, r=outer_d/2, cell=4.8, depth=1.1, cols=32, rows=10);
            if (texture_style == "pebble")
                pebble_band(h=height, r=outer_d/2, pebble_r=1.5, rows=9, cols=30, relief=0.6);
            if (texture_style == "topo")
                topographic_rib_band(h=height, r=outer_d/2, lines=11, amp=1.8);

            // coaster base
            cylinder(h=base_thickness, r=outer_d/2 + 2.8);

            // top comfort lip
            translate([0,0,height-lip_height])
            cylinder(h=lip_height, r1=outer_d/2+0.8, r2=outer_d/2);

            // optional finger loop ridge
            if (finger_ridge)
                translate([0,-outer_d/2-2,height*0.62])
                rotate([90,0,0])
                hull() {
                    translate([-8,0,0]) cylinder(h=4,r=3,center=true);
                    translate([ 8,0,0]) cylinder(h=4,r=3,center=true);
                }
        }

        // bottle cavity with light taper
        translate([0,0,base_thickness])
        cylinder(h=height-base_thickness+0.2,
                 r1=bottle_d/2 + clearance - taper/2,
                 r2=bottle_d/2 + clearance + taper/2);

        // base anti-slip recess
        translate([0,0,-0.1])
            cylinder(h=base_thickness-2.2, r=outer_d/2 - 8);

        // thumb pocket
        if (thumb_pocket)
            translate([0, outer_d/2-3, height*0.58])
            rotate([0,90,0])
            scale([1.0, 1.2, 1.8])
            cylinder(h=12, r=7.5, center=true);

        // inner grip ribs
        for (i=[0:inner_rib_count-1]) {
            z = base_thickness + 12 + i*(height-base_thickness-24)/(inner_rib_count-1);
            difference() {
                translate([0,0,z])
                cylinder(h=2.0, r=bottle_d/2 + clearance + 0.2);
                translate([0,0,z-0.1])
                cylinder(h=2.2, r=bottle_d/2 + clearance - inner_rib_h);
            }
        }

        // optional cutaway for presentation
        if (show_cutaway)
            translate([0,-outer_d,0])
            cube([outer_d*2, outer_d*2, height+12], center=false);
    }
}

module bottle_placeholder() {
    color("silver")
    translate([0,0,base_thickness])
    cylinder(h=150, r=bottle_d/2, center=false);
}

sleeve_shell();
if (show_bottle_placeholder)
    %bottle_placeholder();
