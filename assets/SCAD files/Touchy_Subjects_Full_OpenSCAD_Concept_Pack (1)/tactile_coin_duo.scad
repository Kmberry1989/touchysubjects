
include <common.scad>

/*
Tactile Coin Duo
Two magnetic concept discs with distinct surface language.
*/
disc_d = 34;
disc_h = 5;
magnet_pocket_d = 8.2;
magnet_pocket_h = 2.2;
gap = 7;

module coin(style="pebble") {
    difference() {
        tactile_disc(d=disc_d, h=disc_h, style=style);
        translate([0,0,disc_h-magnet_pocket_h+0.01])
            cylinder(h=magnet_pocket_h, d=magnet_pocket_d);
        translate([0,0,-0.01])
            cylinder(h=magnet_pocket_h, d=magnet_pocket_d);
    }
}

translate([-disc_d/2-gap/2,0,0]) coin("pebble");
translate([ disc_d/2+gap/2,0,0]) coin("ripple");
