// TS-PET-007 - Waste Bag Dispenser Pod
$fn = 100;
outer_d = 48; body_h = 72; wall = 2.2; cap_h = 12; fit = 0.30; dispense_slot_w = 10; dispense_slot_h = 18; hanger_hole_d = 6; spacing = 65;
module body() {
    difference() {
        union() { cylinder(h = body_h, d = outer_d); translate([0,0,body_h - 6]) cylinder(h = 6, d = outer_d - 2*wall - fit); }
        translate([0,0,wall]) cylinder(h = body_h, d = outer_d - 2*wall);
        translate([outer_d/2 - wall/2, 0, body_h/2]) rotate([0,90,0]) linear_extrude(height = wall + 4, center = true) hull() { translate([0, dispense_slot_h/2 - dispense_slot_w/2]) circle(d = dispense_slot_w); translate([0,-dispense_slot_h/2 + dispense_slot_w/2]) circle(d = dispense_slot_w); }
        translate([0,0,body_h - 10]) rotate([90,0,0]) cylinder(h = outer_d + 4, d = hanger_hole_d, center = true);
    }
}
module cap() { difference() { cylinder(h = cap_h, d = outer_d); translate([0,0,wall]) cylinder(h = cap_h, d = outer_d - 2*wall); } }
body(); translate([spacing,0,0]) cap();
