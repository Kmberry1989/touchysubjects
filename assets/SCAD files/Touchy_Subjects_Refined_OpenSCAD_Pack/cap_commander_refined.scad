include <common_refined.scad>;

/*
Cap Commander - two-part jar opener cap with TPU liner cavity.
*/

part = "assembled"; // assembled | shell | top_grip | liner
inner_d = 58;
wall = 3.2;
outer_d = inner_d + 2*wall;
h = 24;

module shell(){
    difference(){
        hex_texture_band(h=h, d=outer_d, cell=6, depth=0.6);
        translate([0,0,2]) cylinder(h=h+0.4, d=inner_d+0.6);
        // liner recess
        translate([0,0,2]) cylinder(h=10, d=inner_d+3.2);
    }
}

module top_grip(){
    difference(){
        rounded_cylinder(h=8, d=outer_d+4, r=1.2);
        translate([0,0,-0.2]) cylinder(h=8.4, d=inner_d+4);
    }
}

module liner(){
    difference(){
        cylinder(h=10, d=inner_d+3.0);
        cylinder(h=10.2, d=inner_d-0.8);
    }
}

if(part=="shell") shell();
else if(part=="top_grip") top_grip();
else if(part=="liner") liner();
else{
    shell();
    translate([0,0,h-6]) top_grip();
}
