
include <common.scad>

/*
Cap Commander
Ergonomic twist aid for bottle caps and small jars.
*/
outer_d = 58;
inner_d = 34;
h = 22;

difference() {
    union() {
        cylinder(h=h, d=outer_d);
        translate([0,0,h]) keyring_loop(outer=16, inner=8, thickness=4);
    }
    translate([0,0,2]) cylinder(h=h+0.2, d=inner_d);
    for (i=[0:5]) {
        rotate([0,0,i*60])
            translate([inner_d/2+3,0,8])
                cube([10,6,12], center=true);
    }
}
intersection() {
    cylinder(h=h, d=outer_d+0.5);
    pebble_texture_band(d=outer_d+0.2, h=h, pebble_d=3, radial=0.6, rows=6, cols=30);
}
