
include <common.scad>

/*
Water Bottle Sleeve Snapwrap Hybrid
Bottle sleeve with removable wrap-band concept.
*/
sleeve_od = 78;
sleeve_id = 72;
sleeve_h = 88;
band_w = 28;
split_gap = 16;

module sleeve() {
    difference() {
        cylinder(h=sleeve_h, d=sleeve_od);
        translate([0,0,-0.1]) cylinder(h=sleeve_h+0.2, d=sleeve_id);
        translate([0,-split_gap/2,sleeve_h*0.42]) cube([sleeve_od,split_gap,band_w], center=true);
    }
    intersection() {
        cylinder(h=sleeve_h, d=sleeve_od+0.4);
        pebble_texture_band(d=sleeve_od+0.2, h=sleeve_h, pebble_d=3, radial=0.6, rows=10, cols=34);
    }
    translate([0,0,-5]) coaster_lip(od=sleeve_od+10, id=sleeve_od-4, h=5, lip=1.4);
}

module wrap_band() {
    difference() {
        rotate_extrude(angle=320)
            translate([20,0,0]) square([3.4,band_w], center=false);
        rotate_extrude(angle=320)
            translate([21,0,-0.1]) square([1.6,band_w+0.2], center=false);
    }
}

translate([-55,0,0]) sleeve();
translate([55,0,0]) rotate([90,0,0]) wrap_band();
