
include <common_v2.scad>

// Touchy Subjects - Modular Slap Grip Bracelet
// Adds ergonomic zoning and swappable texture cartridges.

show_flat = true;
length = 242;
width = 44;
body_t = 4.2;
corner_r = 10;
insert_slot = true;
thumb_pocket = true;
cartridge_count = 3;          // 1..3
cartridge_gap = 4;
texture_a = "pebble";         // pebble / hex / ridge
texture_b = "hex";
texture_c = "ridge";

module panel_texture(kind, len, wid, z) {
    if (kind == "pebble") texture_pebble_panel(len=len, wid=wid, z=z, step_x=10, step_y=8, rr=1.2);
    if (kind == "hex") texture_hex_panel(len=len, wid=wid, z=z, step=10, rr=2.2, h=0.9);
    if (kind == "ridge") texture_ridge_panel(len=len, wid=wid, z=z, count=8);
}

module body() {
    difference() {
        union() {
            rounded_strip_3d(length, width, body_t, r=corner_r);

            panel_len = (length - 30 - (cartridge_count-1)*cartridge_gap) / cartridge_count;
            start_x = -((cartridge_count*panel_len + (cartridge_count-1)*cartridge_gap)/2) + panel_len/2;
            for (i=[0:cartridge_count-1]) {
                x = start_x + i*(panel_len + cartridge_gap);
                translate([x,0,body_t])
                intersection() {
                    linear_extrude(height=1.0)
                    offset(delta=-5)
                    rounded_strip_2d(panel_len, width-8, r=6);
                    translate([0,0,0]) cube([panel_len+2, width+2, 10], center=true);
                }
                if (i==0) translate([x,0,0]) panel_texture(texture_a, panel_len-4, width-10, body_t);
                if (i==1) translate([x,0,0]) panel_texture(texture_b, panel_len-4, width-10, body_t);
                if (i==2) translate([x,0,0]) panel_texture(texture_c, panel_len-4, width-10, body_t);
            }

            // finger guide ribs
            for (x=[-length/2+26, length/2-26])
                translate([x,0,body_t*0.55]) rounded_strip_3d(12,width-14,1.2,r=4);
        }

        if (insert_slot)
            translate([0,0,body_t-1.65])
                rounded_strip_3d(length-28, 14.5, 0.95, r=6);

        if (thumb_pocket)
            translate([0, width*0.18, body_t-1.25])
                scale([2.5, 1.1, 1])
                sphere(r=6.6, $fn=42);

        // soft underside relief
        translate([0,0,-0.01])
        linear_extrude(height=0.9)
        offset(delta=-2.0)
        rounded_strip_2d(length-4, width-4, r=corner_r-1);
    }
}

body();
