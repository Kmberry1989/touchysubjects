
include <common.scad>

/*
Zipper Bloom
Large zipper pull with petal grip and loop.
*/
petals = 6;
petal_len = 12;
center_d = 16;
th = 4;

module petal() {
    hull() {
        translate([0,0,0]) sphere(d=6);
        translate([petal_len,0,0]) sphere(d=4);
    }
}

linear_extrude(height=th)
difference() {
    union() {
        circle(d=center_d);
        for (i=[0:petals-1]) rotate(i*360/petals) translate([center_d/2-2,0,0]) scale([1.05,0.8]) petal();
        translate([0,center_d/2+10,0]) circle(d=10);
    }
    circle(d=5);
    translate([0,center_d/2+10,0]) circle(d=4);
}
