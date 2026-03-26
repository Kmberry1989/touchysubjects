
include <common_v2.scad>

// Touchy Subjects - Sensory Variant Bracelet Line
// Render one at a time by selecting variant.

variant = "focus"; // calm / focus / stim
length = 232;
width = 40;
body_t = 3.8;

module calm_texture() {
    for (x=[-length/2+16:16:length/2-16])
        translate([x,0,body_t]) rotate([90,0,0]) cylinder(h=width-10, r=1.0, center=true);
}

module focus_texture() {
    texture_pebble_panel(len=length-22, wid=width-10, z=body_t, step_x=8, step_y=7, rr=1.0);
}

module stim_texture() {
    texture_hex_panel(len=length-24, wid=width-12, z=body_t, step=11, rr=2.0, h=0.8);
    for (x=[-length/2+22:32:length/2-22])
        translate([x,0,body_t+0.6]) sphere(r=2.0, $fn=20);
}

difference() {
    union() {
        rounded_strip_3d(length,width,body_t,r=9);
        if (variant=="calm") calm_texture();
        if (variant=="focus") focus_texture();
        if (variant=="stim") stim_texture();
    }
    translate([0,0,body_t-1.45]) rounded_strip_3d(length-30, 13.5, 0.85, r=6);
}
