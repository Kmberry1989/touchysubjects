// TS-PET-004 - Vented Catnip Capsule
$fn = 96;
outer_d = 36;
half_h = 18;
wall = 2.0;
fit = 0.30;
lip_h = 4.0;
vent_d = 3.0;
vent_count = 12;
spacing = 50;
module vents(zoff, phase = 0) {
    for (i = [0 : vent_count - 1]) {
        ang = i * 360 / vent_count + phase;
        rotate([0,0,ang])
            translate([outer_d/2 - wall - 2.5, 0, zoff])
                rotate([90,0,0]) cylinder(h = 10, d = vent_d, center = true);
    }
}
module bottom_half() {
    difference() {
        union() {
            cylinder(h = half_h, d = outer_d);
            translate([0,0,half_h - lip_h]) cylinder(h = lip_h, d = outer_d - 2*wall - fit);
        }
        translate([0,0,wall]) cylinder(h = half_h, d = outer_d - 2*wall);
        vents(half_h/2, 0);
    }
}
module top_half() {
    difference() {
        union() {
            cylinder(h = half_h, d = outer_d);
            cylinder(h = lip_h, d = outer_d - 2*wall + fit + 0.8);
        }
        translate([0,0,wall]) cylinder(h = half_h, d = outer_d - 2*wall);
        vents(half_h/2, 15);
    }
}
bottom_half();
translate([spacing,0,0]) top_half();
