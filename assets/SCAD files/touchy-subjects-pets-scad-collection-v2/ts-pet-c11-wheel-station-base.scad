// TS-PET-C11 - Wheel Station Base
$fn = 72; base_w=72; base_d=42; base_h=10; upright_h=48; upright_t=8; axle_d=5.8;
difference(){ union(){ cube([base_w,base_d,base_h], center=true); translate([0,0,base_h/2+upright_h/2]) cube([upright_t,base_d, upright_h], center=true);} translate([0,0,base_h/2+upright_h-10]) rotate([90,0,0]) cylinder(h=base_d+2,d=axle_d,center=true); }
