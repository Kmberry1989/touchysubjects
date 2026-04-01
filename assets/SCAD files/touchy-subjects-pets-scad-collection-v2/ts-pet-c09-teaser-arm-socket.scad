// TS-PET-C09 - Teaser Arm Socket
$fn = 72; base_d=36; base_h=8; socket_d=10; socket_h=24; mount_hole_d=5;
difference(){ union(){ cylinder(h=base_h,d=base_d); translate([0,0,base_h]) cylinder(h=socket_h,d=socket_d+6); } translate([0,0,base_h]) cylinder(h=socket_h+1,d=socket_d); translate([0,0,-1]) cylinder(h=base_h+2,d=mount_hole_d); }
