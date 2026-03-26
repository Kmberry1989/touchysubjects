
include <common.scad>

// Touchy Subjects - Slap Grip Bracelet / Wrap
// Concept model:
// - outer tactile shell
// - internal spring insert channel
// - tapered comfort edges
// - optional thumb pocket cue

show_flat = true;        // true = bracelet in flat state, false = wrapped preview
show_wrapped_preview = false;
insert_slot = true;
texture_style = "pebble"; // "pebble", "topo", "hex"

length = 240;
width = 42;
body_thickness = 4.0;
edge_taper = 1.0;
corner_r = 10;

insert_channel_w = 14;
insert_channel_t = 0.9;
insert_cover_t = 0.9;

thumb_pocket = true;
thumb_pocket_depth = 1.2;
thumb_pocket_len = 34;

module rounded_strip(len, wid, t, r=8) {
    linear_extrude(height=t)
    hull() {
        translate([-(len/2-r),-(wid/2-r)]) circle(r=r);
        translate([ (len/2-r),-(wid/2-r)]) circle(r=r);
        translate([-(len/2-r),( wid/2-r)]) circle(r=r);
        translate([ (len/2-r),( wid/2-r)]) circle(r=r);
    }
}

module flat_body() {
    difference() {
        union() {
            // base shell
            rounded_strip(length, width, body_thickness, r=corner_r);

            // texture zone
            translate([0,0,body_thickness*0.45])
            linear_extrude(height=body_thickness*0.55)
            difference() {
                hull() {
                    translate([-(length/2-corner_r-4),-(width/2-corner_r-4)]) circle(r=corner_r-3);
                    translate([ (length/2-corner_r-4),-(width/2-corner_r-4)]) circle(r=corner_r-3);
                    translate([-(length/2-corner_r-4),( width/2-corner_r-4)]) circle(r=corner_r-3);
                    translate([ (length/2-corner_r-4),( width/2-corner_r-4)]) circle(r=corner_r-3);
                }
                // nothing - just a slightly inset texture pad
            }

            if (texture_style == "pebble")
                for (x=[-length/2+16:10:length/2-16], y=[-width/2+8:8:width/2-8])
                    translate([x,y,body_thickness]) sphere(r=1.2, $fn=18);
            if (texture_style == "topo")
                for (x=[-length/2+20:16:length/2-20])
                    translate([x,0,body_thickness])
                    rotate([90,0,0]) cylinder(h=width-12, r=0.8, center=true);
            if (texture_style == "hex")
                for (x=[-length/2+16:11:length/2-16], y=[-width/2+9:9:width/2-9])
                    translate([x + (((floor((y+100)/9)) % 2) * 5.5),y,body_thickness])
                    cylinder(h=0.9, r=2.4, $fn=6);
        }

        // comfort taper underside
        translate([0,0,-0.01])
        linear_extrude(height=edge_taper)
        offset(delta=-2.0)
        square([length-4,width-4], center=true);

        // spring insert channel
        if (insert_slot)
            translate([0,0,body_thickness-insert_cover_t-insert_channel_t])
                rounded_strip(length-30, insert_channel_w, insert_channel_t+0.2, r=6);

        // thumb cue
        if (thumb_pocket)
            translate([0, width*0.16, body_thickness-thumb_pocket_depth])
                scale([thumb_pocket_len/14, 1.3, 1])
                sphere(r=7, $fn=36);
    }
}

module wrapped_preview() {
    rotate_extrude(angle=260)
        translate([40,0,0])
            square([body_thickness,width], center=true);
}

if (show_flat)
    flat_body();

if (show_wrapped_preview)
    translate([0,0,0]) wrapped_preview();
