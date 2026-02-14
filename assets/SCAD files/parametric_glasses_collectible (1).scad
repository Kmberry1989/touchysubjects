
/*
Parametric Glasses – Collectible Figure Scale
Tuned for PLA on Flashforge AD5X

Print intent:
- Thin but printable with 0.4mm nozzle
- Designed as a separate accessory
- Can be glued or pinned to head

Units: millimeters
*/

$fn = 96;

// =====================
// Global Parameters
// =====================

// Overall scale
glasses_width = 42;   // temple tip to tip
lens_width    = 16;
lens_height   = 10;
bridge_width  = 6;

// Thicknesses (PLA-safe)
frame_thickness = 2.0;   // do NOT go thinner with 0.4 nozzle
frame_depth    = 3.0;    // Z thickness

// Nose pad / pin
nose_pin_d = 1.6;
nose_pin_L = 2.5;

// Temple arms
temple_L = 14;
temple_d = 2.2;

// =====================
// Modules
// =====================

module rounded_rect(w, h, r, d) {
    minkowski() {
        cube([w - 2*r, h - 2*r, d], center=true);
        cylinder(r=r, h=0.01);
    }
}

module lens_frame() {
    difference() {
        rounded_rect(lens_width, lens_height, 2.5, frame_depth);
        rounded_rect(lens_width - 3, lens_height - 3, 2.0, frame_depth + 0.1);
    }
}

module bridge() {
    cube([bridge_width, 3, frame_depth], center=true);
}

module nose_pin() {
    translate([0, -2.2, -nose_pin_L])
        cylinder(d=nose_pin_d, h=nose_pin_L);
}

module temple_arm(side=1) {
    translate([side*(glasses_width/2 - 1), 0, 0])
        rotate([0,0,side*12])
            cylinder(d=temple_d, h=temple_L);
}

// =====================
// Assembly
// =====================

module glasses_complete() {
    union() {
        // Left lens
        translate([-lens_width/2 - bridge_width/2, 0, 0])
            lens_frame();

        // Right lens
        translate([ lens_width/2 + bridge_width/2, 0, 0])
            lens_frame();

        // Bridge
        bridge();

        // Nose pin
        nose_pin();

        // Temples
        temple_arm(-1);
        temple_arm(1);
    }
}

// =====================
// Render
// =====================

glasses_complete();
