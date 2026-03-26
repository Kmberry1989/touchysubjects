include <common_refined.scad>;

/*
Dock Pebble System - base with swappable modules.
Print base + chosen inserts.
*/

part = "assembled"; // assembled | base | insert_phone | insert_pebble | insert_tool | insert_blank
base_l = 180;
base_w = 68;
base_h = 16;
slot_w = 26;
slot_l = 32;
slot_d = 6.2;

module slot(x){
    translate([x,-slot_w/2,base_h-slot_d]) rounded_box([slot_l, slot_w, slot_d+1], r=2);
}

module base(){
    difference(){
        rounded_box([base_l, base_w, base_h], r=6, center=true);
        slot(-60);
        slot(-20);
        slot(20);
        slot(60);
        // phone ramp
        translate([-86,-18,0]) rotate([0,-14,0]) cube([24,36,30]);
    }
}

module insert_blank(x=0){
    translate([x,0,base_h-slot_d+0.2])
        rounded_box([slot_l-0.4, slot_w-0.4, slot_d], r=1.6, center=true);
}

module insert_phone(){
    union(){
        insert_blank();
        translate([0,0,base_h-slot_d+5]) rotate([0,-15,0]) rounded_box([24,24,16], r=2, center=true);
    }
}
module insert_pebble(){
    union(){
        insert_blank();
        translate([0,0,base_h-slot_d+7]) scale([1.2,1,0.7]) sphere(d=28);
    }
}
module insert_tool(){
    union(){
        insert_blank();
        translate([0,0,base_h-slot_d+10]) rounded_box([16,20,20], r=3, center=true);
    }
}

if(part=="base") base();
else if(part=="insert_phone") insert_phone();
else if(part=="insert_pebble") insert_pebble();
else if(part=="insert_tool") insert_tool();
else if(part=="insert_blank") insert_blank();
else{
    base();
    translate([-60,0,0]) insert_phone();
    translate([-20,0,0]) insert_pebble();
    translate([20,0,0]) insert_tool();
    translate([60,0,0]) insert_blank();
}
