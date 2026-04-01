// TS-PET-B01 - AirTag Collar Holder
$fn = 96; airtag_d = 31.9; wall = 2.2; overall_t = 10.5; strap_w = 20; loop_wall = 2.2; loop_gap = 4.5;
module ring_shell() { difference() { cylinder(h = overall_t, d = airtag_d + 2*wall + 4); translate([0,0,wall]) cylinder(h = overall_t, d = airtag_d + 0.8); } }
module strap_loop(xoff) { difference() { translate([xoff,0,0]) cube([loop_wall*2 + loop_gap, strap_w + 2*loop_wall, overall_t], center = true); translate([xoff,0,-1]) cube([loop_gap, strap_w, overall_t + 2], center = true); } }
union() { ring_shell(); strap_loop(-(airtag_d/2 + wall + loop_gap/2 + 2)); strap_loop( (airtag_d/2 + wall + loop_gap/2 + 2)); }
