
/*
Touchy Subjects common.scad
Shared helpers for tactile, ergonomic concept models.
Units: millimeters.
*/

$fn = 96;

// ---------- BASIC HELPERS ----------
module rounded_cube(size=[10,10,10], r=1, center=false) {
    sx=size[0]; sy=size[1]; sz=size[2];
    translate(center ? [0,0,0] : [sx/2, sy/2, sz/2])
    minkowski() {
        cube([max(0.01,sx-2*r), max(0.01,sy-2*r), max(0.01,sz-2*r)], center=true);
        sphere(r=r);
    }
}

module tube(h=20, od=20, id=16, center=false) {
    difference() {
        cylinder(h=h, d=od, center=center);
        translate([0,0,center ? 0 : -0.1]) cylinder(h=h+0.2, d=id, center=center);
    }
}

module chamfer_ring(h=10, od=30, id=22, chamfer=1) {
    difference() {
        union() {
            cylinder(h=h, d=od);
            translate([0,0,chamfer]) cylinder(h=max(0.01,h-2*chamfer), d1=od, d2=od, center=false);
        }
        translate([0,0,-0.1]) cylinder(h=h+0.2, d=id);
    }
}

module knurl_band(d=20, h=10, depth=0.8, count=24, twist=30) {
    intersection() {
        cylinder(d=d, h=h);
        union() {
            for (i=[0:count-1]) {
                rotate([0,0,i*360/count])
                    translate([d/2-depth,0,h/2])
                        rotate([0,45,twist])
                            cube([depth*2, depth*2, h*1.8], center=true);
            }
        }
    }
}

module pebble_texture_band(d=30, h=20, pebble_d=3.2, radial=0.8, rows=8, cols=24) {
    for (r=[0:rows-1]) {
        z = (r+0.5) * h/rows;
        offs = (r % 2) * (180/cols);
        for (c=[0:cols-1]) {
            a = offs + c * 360/cols;
            rotate([0,0,a])
                translate([d/2-radial,0,z])
                    sphere(d=pebble_d);
        }
    }
}

module ripple_band(d=30, h=20, waves=9, amp=0.9, thickness=1.4) {
    for (i=[0:360/waves:359]) {
        rotate([0,0,i])
            linear_extrude(height=h)
                translate([d/2,0,0])
                    offset(r=thickness/2)
                        square([amp, thickness], center=true);
    }
}

module thumb_groove_block(size=[25,18,10], groove_r=7, groove_depth=2.5) {
    difference() {
        rounded_cube(size=size, r=2, center=true);
        translate([0,0,size[2]/2-groove_depth+0.01])
            rotate([90,0,0])
                cylinder(h=size[1]+1, r=groove_r, center=true);
    }
}

module torus_like_ring(major=15, minor=3) {
    rotate_extrude()
        translate([major,0,0])
            circle(r=minor);
}

module bead(d=12, hole=3) {
    difference() {
        sphere(d=d);
        rotate([90,0,0]) cylinder(h=d+2, d=hole, center=true);
    }
}

module coaster_lip(od=78, id=72, h=5, lip=1.5) {
    difference() {
        union() {
            cylinder(h=h, d=od);
            cylinder(h=lip, d=od+2);
        }
        translate([0,0,-0.1]) cylinder(h=h+0.2, d=id);
    }
}

module simple_bayonet_lugs(d=18, lug_w=4, lug_t=1.5, z=0, count=3) {
    for (i=[0:count-1]) {
        rotate([0,0,i*360/count])
            translate([d/2,0,z])
                cube([lug_t, lug_w, 2], center=true);
    }
}

module tactile_disc(d=34, h=5, style="pebble") {
    difference() {
        cylinder(h=h, d=d);
        if (style == "thumb") {
            translate([0,0,h-1.5]) sphere(d=d*0.72);
        }
    }
    if (style == "pebble")
        intersection() {
            cylinder(h=h, d=d+1);
            pebble_texture_band(d=d+0.5, h=h, pebble_d=2.8, radial=0.6, rows=4, cols=22);
        }
    else if (style == "ripple")
        intersection() {
            cylinder(h=h, d=d+1);
            ripple_band(d=d+0.4, h=h, waves=12, amp=0.8, thickness=1.2);
        }
    else if (style == "grid")
        for (a=[0,90]) rotate([0,0,a]) translate([0,0,h/2]) cube([d*0.84,1.2,h], center=true);
}

module keyring_loop(outer=12, inner=6, thickness=3) {
    difference() {
        cylinder(h=thickness, d=outer, center=true);
        cylinder(h=thickness+1, d=inner, center=true);
    }
}
