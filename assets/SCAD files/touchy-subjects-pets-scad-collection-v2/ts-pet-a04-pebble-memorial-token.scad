// TS-PET-A04 - Pebble Memorial Token
$fn = 96; w = 48; h = 62; t = 12; paw_d = 9; toe_d = 5.5;
module pebble() { scale([w/2, h/2, t/2]) sphere(2); }
difference() {
    pebble();
    translate([0,0,-t]) cube([200,200,200], center = true);
    translate([0,5,t/2 - 1.0]) linear_extrude(height = 1.2) union() { translate([0,-4]) circle(d = paw_d); translate([-7,4]) circle(d = toe_d); translate([-2,9]) circle(d = toe_d); translate([2,9]) circle(d = toe_d); translate([7,4]) circle(d = toe_d); }
}
