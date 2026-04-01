// TS-PET-C10 - Teaser Arm Rod
$fn = 48; rod_d=9.6; rod_len=160; eye_d=18; eye_hole_d=7;
union(){ cylinder(h=rod_len,d=rod_d); translate([0,0,rod_len]) rotate([90,0,0]) difference(){ cylinder(h=8,d=eye_d,center=true); cylinder(h=10,d=eye_hole_d,center=true); } }
