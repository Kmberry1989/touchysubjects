include <common_refined.scad>;

/*
Zipper Bloom - two-piece shell around keyring eye.
*/

part = "assembled"; // assembled | petal_front | petal_back | ring_adapter
w = 28;
h = 24;
t = 8;
eye_d = 8;

module petal(side=1){
    difference(){
        intersection(){
            scale([1,0.85,0.55]) sphere(d=w);
            translate([side<0?-100:0,-100,-100]) cube([100,200,200]);
        }
        translate([0,0,-2]) cylinder(h=20, d=eye_d+0.6);
        for(x=[-7,0,7]) translate([x,0,0]) sphere(d=3.6);
    }
}

module ring_adapter(){
    difference(){
        union(){
            cylinder(h=4, d=12);
            translate([0,0,4]) rotate_extrude() translate([7,0,0]) circle(r=1.8);
        }
        cylinder(h=4.2, d=eye_d);
        translate([0,0,4]) rotate_extrude() translate([7,0,0]) circle(r=0.9);
    }
}

if(part=="petal_front") difference(){ petal(1); split_cut_x(); }
else if(part=="petal_back") difference(){ petal(-1); split_cut_x(); }
else if(part=="ring_adapter") ring_adapter();
else{
    difference(){ petal(1); split_cut_x(); }
    difference(){ petal(-1); split_cut_x(); }
    ring_adapter();
}
