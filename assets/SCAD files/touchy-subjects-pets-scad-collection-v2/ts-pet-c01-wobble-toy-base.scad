// TS-PET-C01 - Wobble Toy Base
$fn = 96; base_d = 60; height = 48; wall = 2.4; weight_cavity_d = 28; weight_cavity_h = 3.0; weight_z = 8;
module outer_shape() { hull() { translate([0,0,0]) cylinder(h = 1, d = base_d); translate([0,0,height]) sphere(d = 16); } }
difference() {
    outer_shape();
    translate([0,0,wall]) scale([(base_d - 2*wall)/base_d, (base_d - 2*wall)/base_d, (height - wall)/height]) outer_shape();
    translate([0,0,-100]) cube([200,200,200], center = true);
    translate([0,0,weight_z]) cylinder(h = weight_cavity_h, d = weight_cavity_d);
}
