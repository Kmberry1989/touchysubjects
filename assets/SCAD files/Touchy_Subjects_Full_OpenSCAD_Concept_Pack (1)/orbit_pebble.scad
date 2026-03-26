
include <common.scad>

/*
Orbit Pebble
Weighted tactile palm tool with thumb track.
Change preview_mode between "solid" and "cutaway".
*/
preview_mode = "solid"; // ["solid","cutaway"]
length = 52;
width = 38;
height = 18;
shell = 2.2;
core_d = 18;
core_h = 10;
texture = "pebble"; // ["pebble","ripple","smooth"]

module orbit_shell() {
    scale([length/50, width/36, height/16])
        minkowski() {
            sphere(d=12);
            cube([26,16,4], center=true);
        }
}

module orbit_pebble() {
    difference() {
        orbit_shell();
        scale([(length-2*shell)/50, (width-2*shell)/36, (height-2*shell)/16])
            minkowski() {
                sphere(d=12);
                cube([26,16,4], center=true);
            }
        translate([0,0,height*0.15])
            rotate([0,90,0])
                cylinder(h=length+4, d=18, center=true);
    }
    if (texture != "smooth")
        intersection() {
            orbit_shell();
            if (texture == "pebble")
                translate([0,0,-height/2]) pebble_texture_band(d=width, h=height+2, pebble_d=2.6, radial=0.5, rows=5, cols=20);
            else
                translate([0,0,-height/2]) ripple_band(d=width, h=height+2, waves=10, amp=0.9, thickness=1.0);
        }
}

if (preview_mode == "solid")
    orbit_pebble();
else
    difference() {
        orbit_pebble();
        translate([0,-width,0]) cube([length*2,width*2,height*2], center=true);
    }
