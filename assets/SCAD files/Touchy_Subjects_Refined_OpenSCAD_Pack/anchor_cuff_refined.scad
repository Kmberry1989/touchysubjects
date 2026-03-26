include <common_refined.scad>;

/*
Anchor Cuff - split core + overmold shell concept.
Print cuff_core and grip_shell separately.
*/

part = "assembled"; // assembled | cuff_core | grip_shell | insert_shim
strap_r = 34;
strap_w = 34;
strap_t = 1.2;
grip_len = 70;
grip_w = 34;
grip_t = 11;

module cuff_core(){
    difference(){
        union(){
            rotate([90,0,0]) torus(R=strap_r, r=strap_t);
            translate([-grip_len/2,-grip_w/2,-grip_t/2]) rounded_box([grip_len, grip_w, grip_t], r=4);
        }
        translate([0,0,0]) rounded_box([grip_len-10, grip_w-10, grip_t-3], r=3, center=true);
    }
}

module grip_shell(){
    difference(){
        grip_ribs_band(h=grip_len, d=grip_w+8, rib_w=2, rib_h=1.0, count=14);
        translate([0,0,-1]) cylinder(h=grip_len+2, d=grip_w+0.8);
        translate([-100,-100,-2]) cube([200,200,grip_len+4]);
    }
}

module insert_shim(){
    rounded_box([52,18,6], r=2, center=true);
}

if(part=="cuff_core") cuff_core();
else if(part=="grip_shell") rotate([90,0,0]) grip_shell();
else if(part=="insert_shim") insert_shim();
else{
    color("silver") cuff_core();
    translate([0,0,6]) rotate([90,0,0]) grip_shell();
}
