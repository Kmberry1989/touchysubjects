
include <common.scad>

/*
Universal Grip Sleeve System
Three concentric grip sleeves for bottles, utensils, and tools.
*/
module grip_sleeve(od=34, id=24, h=70, coaster=false) {
    difference() {
        cylinder(h=h, d=od);
        translate([0,0,-0.1]) cylinder(h=h+0.2, d=id);
    }
    intersection() {
        cylinder(h=h, d=od+0.6);
        pebble_texture_band(d=od+0.3, h=h, pebble_d=2.6, radial=0.45, rows=9, cols=26);
    }
    if (coaster)
        translate([0,0,-5]) coaster_lip(od=od+8, id=od-4, h=5, lip=1.2);
}

translate([-38,0,0]) grip_sleeve(od=26, id=12, h=68, coaster=false);
translate([0,0,0]) grip_sleeve(od=36, id=22, h=72, coaster=false);
translate([44,0,0]) grip_sleeve(od=42, id=28, h=82, coaster=true);
