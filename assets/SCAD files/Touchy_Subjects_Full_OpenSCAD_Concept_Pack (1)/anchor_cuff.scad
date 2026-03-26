
include <common.scad>

/*
Anchor Cuff
Rigid/slap-bracelet inspired grip cuff concept.
Open C profile with tactile exterior and thumb ridge.
*/
len = 170;
radius = 32;
band_w = 34;
th = 3;
opening_deg = 70;
thumb_ridge = true;

module curved_band() {
    rotate_extrude(angle=360-opening_deg, convexity=10)
        translate([radius,0,0])
            square([th,band_w], center=false);
}

module anchor_cuff() {
    difference() {
        curved_band();
        rotate_extrude(angle=360-opening_deg, convexity=10)
            translate([radius+0.7,0,-0.1])
                square([th-1.4,band_w+0.2], center=false);
    }
    intersection() {
        curved_band();
        pebble_texture_band(d=2*(radius+th/2), h=band_w, pebble_d=2.2, radial=0.5, rows=6, cols=42);
    }
    if (thumb_ridge)
        rotate([0,0,18])
            translate([radius+th*0.6,0,band_w*0.55])
                rotate([0,90,0]) cylinder(h=8, d=7, center=true);
}

anchor_cuff();
