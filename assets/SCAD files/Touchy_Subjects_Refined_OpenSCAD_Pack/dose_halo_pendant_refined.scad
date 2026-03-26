include <common_refined.scad>;

/*
Dose Halo Pendant - threaded body, printable as 3 parts:
body, cap, bail.
Threads are simplified concept threads with clearance.
*/

part = "assembled"; // assembled | body | cap | bail
body_d = 17;
body_h = 42;
wall = 2.0;
cavity_d = 11;
cavity_h = 28;
thread_h = 7;
pitch = 2.2;
bail_inner = 6;

module body(){
    difference(){
        union(){
            cylinder(h=body_h, d=body_d);
            translate([0,0,body_h-8]) knurl_band(h=8, d=body_d, depth=0.45, pitch=8);
        }
        translate([0,0,2]) pill_cavity(h=cavity_h, d=cavity_d);
        translate([0,0,body_h-thread_h]) cylinder(h=thread_h+0.2, d=cavity_d+2.2);
        translate([0,0,body_h-thread_h]) simple_internal_thread(h=thread_h, d=cavity_d+1.7+2*thread_clearance, pitch=pitch, depth=0.55);
    }
}

module cap(){
    difference(){
        union(){
            cylinder(h=10, d=body_d);
            translate([0,0,10]) cylinder(h=3.6, d1=10, d2=6.4);
        }
        translate([0,0,2]) cylinder(h=8.2, d=cavity_d+1.2);
    }
    translate([0,0,1.2]) simple_external_thread(h=thread_h, d=cavity_d+1.2, pitch=pitch, depth=0.55);
}

module bail(){
    difference(){
        union(){
            cylinder(h=4, d=10);
            translate([0,0,4]) rotate_extrude() translate([6,0,0]) circle(r=2);
        }
        translate([0,0,-0.2]) cylinder(h=4.4, d=6.2);
        translate([0,0,4]) rotate_extrude() translate([6,0,0]) circle(r=1.2);
    }
}

if(part=="body") body();
else if(part=="cap") cap();
else if(part=="bail") bail();
else{
    body();
    translate([0,0,body_h-10]) cap();
    translate([0,0,body_h+2]) bail();
}
