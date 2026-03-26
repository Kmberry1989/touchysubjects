
$fn = 96;

// Shared helpers for Touchy Subjects concept models.

// Lightweight faux texture helpers.
// These are decorative and intentionally computationally modest.

module knurl_band(h=20, r=15, depth=0.8, pitch=5, tooth_w=2) {
    difference() {
        cylinder(h=h, r=r + depth, center=false);
        cylinder(h=h + 0.2, r=r, center=false);
        for (z = [0 : pitch : h])
            for (a = [0 : 15 : 345]) {
                rotate([0,0,a])
                translate([r + depth/2,0,z])
                rotate([45,0,0])
                cube([tooth_w, depth*2, tooth_w], center=true);
            }
    }
}

module pebble_band(h=20, r=15, pebble_r=1.6, rows=5, cols=24, relief=0.7) {
    union() {
        cylinder(h=h, r=r, center=false);
        for (row = [0 : rows-1]) {
            z = (row + 0.5) * h / rows;
            offset = (row % 2) * (180/cols);
            for (i = [0 : cols-1]) {
                a = i * 360 / cols + offset;
                rotate([0,0,a])
                translate([r + relief/2,0,z])
                sphere(r=pebble_r, $fn=18);
            }
        }
    }
}

module hex_dimple_band(h=20, r=15, cell=4.5, depth=1.0, cols=26, rows=8) {
    difference() {
        cylinder(h=h, r=r + 0.2, center=false);
        translate([0,0,-0.1]) cylinder(h=h + 0.2, r=r - depth, center=false);
        for (row = [0 : rows-1]) {
            z = (row + 0.5) * h / rows;
            offset = (row % 2) * (180/cols);
            for (i = [0 : cols-1]) {
                a = i * 360 / cols + offset;
                rotate([0,0,a])
                translate([r + 0.35,0,z])
                rotate([0,90,0])
                cylinder(h=2.2, r=cell/2, $fn=6, center=true);
            }
        }
    }
}

module topographic_rib_band(h=20, r=15, lines=10, amp=1.0) {
    union() {
        cylinder(h=h, r=r, center=false);
        for (i = [0 : lines-1]) {
            rr = r + i * amp / lines;
            translate([0,0,h * i / lines])
            rotate_extrude(angle=360)
                translate([rr,0,0])
                circle(r=0.45, $fn=18);
        }
    }
}

module o_ring_groove(r=8, h=1.2, z=0) {
    translate([0,0,z])
    rotate_extrude(angle=360)
        translate([r,0,0])
        circle(r=h/2, $fn=24);
}

module chain_bail(outer_w=10, inner_w=5, thickness=3, height=12) {
    difference() {
        hull() {
            translate([0,0,0]) cylinder(h=thickness, r=outer_w/2, center=true);
            translate([0,height,0]) cylinder(h=thickness, r=outer_w/2, center=true);
        }
        hull() {
            translate([0,0,0]) cylinder(h=thickness+0.5, r=inner_w/2, center=true);
            translate([0,height,0]) cylinder(h=thickness+0.5, r=inner_w/2, center=true);
        }
    }
}
