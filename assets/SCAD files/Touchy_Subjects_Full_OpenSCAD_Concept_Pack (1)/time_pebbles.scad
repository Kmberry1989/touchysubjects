
include <common.scad>

/*
Time Pebbles
A set of three tactile task markers.
*/
gap = 18;

module pebble_marker(txt="15", style="pebble") {
    difference() {
        scale([1.2,1,0.75]) sphere(d=30);
        translate([0,0,-20]) cube([60,60,40], center=true);
    }
    intersection() {
        scale([1.2,1,0.75]) sphere(d=30);
        translate([0,0,-2]) (style=="pebble" ? pebble_texture_band(d=27, h=20, pebble_d=2.2, radial=0.4, rows=5, cols=18)
                                             : ripple_band(d=27, h=20, waves=9, amp=0.7, thickness=1));
    }
}

translate([-36-gap,0,0]) pebble_marker("15","pebble");
translate([0,0,0]) pebble_marker("30","ripple");
translate([36+gap,0,0]) pebble_marker("60","pebble");
