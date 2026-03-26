
include <common.scad>

/*
Texture Rosary Keychain
A sequence of tactile beads on a central cord channel.
*/
bead_count = 7;
spacing = 18;

module textured_bead(style="pebble") {
    difference() {
        sphere(d=14);
        rotate([90,0,0]) cylinder(h=18, d=3.2, center=true);
    }
    intersection() {
        sphere(d=14.2);
        if (style=="pebble")
            pebble_texture_band(d=13.8, h=14, pebble_d=1.8, radial=0.35, rows=4, cols=14);
        else
            ripple_band(d=13.8, h=14, waves=9, amp=0.6, thickness=0.9);
    }
}

for (i=[0:bead_count-1]) {
    translate([i*spacing,0,0])
        textured_bead(i % 2 == 0 ? "pebble" : "ripple");
}
translate([-spacing*0.8,0,0]) keyring_loop(outer=14, inner=8, thickness=4);
