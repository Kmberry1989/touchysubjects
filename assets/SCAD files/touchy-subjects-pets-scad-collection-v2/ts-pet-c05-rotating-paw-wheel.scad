// TS-PET-C05 - Rotating Paw Wheel
$fn = 96; wheel_d = 56; wheel_t = 8; hub_d = 18; axle_d = 5.5; axle_len = 18; lobe_d = 20; lobe_count = 4; spacing = 80;
module wheel() { difference() { union() { cylinder(h = wheel_t, d = hub_d); for (i = [0:lobe_count-1]) rotate([0,0,i*360/lobe_count]) translate([wheel_d/2 - lobe_d/2, 0, 0]) cylinder(h = wheel_t, d = lobe_d); cylinder(h = wheel_t, d = wheel_d * 0.42); } translate([0,0,-1]) cylinder(h = wheel_t + 2, d = axle_d); } }
module axle() { union() { cylinder(h = axle_len, d = axle_d - 0.3); translate([0,0,0]) cylinder(h = 2, d = axle_d + 4); translate([0,0,axle_len - 2]) cylinder(h = 2, d = axle_d + 4); } }
wheel(); translate([spacing,0,0]) axle();
