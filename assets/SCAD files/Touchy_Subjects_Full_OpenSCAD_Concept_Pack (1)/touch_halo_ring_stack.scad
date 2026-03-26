
include <common.scad>

/*
Touch Halo Ring Stack
Three ring variants for sensory stacking.
Sizing is approximate; tune inner_d for wearer.
*/
inner_d = 18.5;
band_w = 4.2;
gap = 8;

module ring_plain() {
    tube(h=band_w, od=inner_d+5, id=inner_d, center=true);
}

module ring_pebble() {
    union() {
        tube(h=band_w, od=inner_d+5.8, id=inner_d, center=true);
        intersection() {
            tube(h=band_w, od=inner_d+6.6, id=inner_d+2.4, center=true);
            pebble_texture_band(d=inner_d+6.1, h=band_w, pebble_d=1.6, radial=0.35, rows=2, cols=18);
        }
    }
}

module ring_rotator() {
    ring_plain();
    translate([0,0,0]) difference() {
        tube(h=2.4, od=inner_d+9.2, id=inner_d+6.6, center=true);
    }
}

translate([-inner_d-gap,0,0]) ring_plain();
translate([0,0,0]) ring_pebble();
translate([inner_d+gap,0,0]) ring_rotator();
