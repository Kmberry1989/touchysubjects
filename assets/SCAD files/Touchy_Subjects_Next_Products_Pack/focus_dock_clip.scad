
include <common_v2.scad>

// Touchy Subjects - Focus Dock Clip
// Desk dock for bracelet / grip band when not on bottle or wrist.

dock_w = 84;
dock_d = 56;
dock_h = 18;
slot_w = 38;
slot_d = 4.6;
post_h = 28;

difference() {
    union() {
        rounded_strip_3d(dock_w, dock_d, dock_h, r=12);
        // central post
        translate([0,0,dock_h]) cylinder(h=post_h, r=8);
        translate([0,0,dock_h+post_h-2]) sphere(r=10,$fn=48);
        // cable / key tray lip
        translate([0,-dock_d/2+8,dock_h*0.72]) rounded_strip_3d(dock_w-18,12,4,r=5);
    }
    // band parking slot
    translate([0,0,dock_h-6]) rounded_strip_3d(slot_w, dock_d-18, slot_d, r=8);
    // coaster pocket
    translate([0, 10, dock_h-3]) cylinder(h=4.5, r=18);
}

// surface texture
for (x=[-dock_w/2+14:14:dock_w/2-14])
    translate([x,dock_d/2-10,dock_h]) sphere(r=1.2,$fn=18);
