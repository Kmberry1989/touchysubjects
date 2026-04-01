// TS-PET-003 - Wand Handle
$fn = 72;
handle_len = 150;
base_d = 24;
tip_d = 12;
string_hole_d = 3.5;
strap_hole_d = 6.0;
module tapered_handle() {
    hull() {
        translate([0,0,0]) sphere(d = base_d);
        translate([0,0,handle_len]) sphere(d = tip_d);
    }
}
difference() {
    tapered_handle();
    translate([0,0,handle_len - 12]) rotate([90,0,0]) cylinder(h = tip_d + 6, d = string_hole_d, center = true);
    translate([0,0,12]) rotate([90,0,0]) cylinder(h = base_d + 6, d = strap_hole_d, center = true);
}
