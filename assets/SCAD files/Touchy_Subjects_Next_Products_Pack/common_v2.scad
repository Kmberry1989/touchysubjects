
$fn = 96;

// Touchy Subjects shared helpers v2

module rounded_strip_2d(len, wid, r=8) {
    hull() {
        translate([-(len/2-r),-(wid/2-r)]) circle(r=r);
        translate([ (len/2-r),-(wid/2-r)]) circle(r=r);
        translate([-(len/2-r),( wid/2-r)]) circle(r=r);
        translate([ (len/2-r),( wid/2-r)]) circle(r=r);
    }
}

module rounded_strip_3d(len, wid, t, r=8) {
    linear_extrude(height=t) rounded_strip_2d(len,wid,r);
}

module texture_pebble_panel(len=100, wid=30, z=0, step_x=10, step_y=8, rr=1.2) {
    for (x=[-len/2+10:step_x:len/2-10], y=[-wid/2+6:step_y:wid/2-6])
        translate([x,y,z]) sphere(r=rr, $fn=16);
}

module texture_hex_panel(len=100, wid=30, z=0, step=10, rr=2.2, h=0.8) {
    for (y=[-wid/2+8:8:wid/2-8])
        for (x=[-len/2+10:step:len/2-10])
            translate([x + (((floor((y+100)/8)) % 2) * (step/2)), y, z])
                cylinder(h=h, r=rr, $fn=6);
}

module texture_ridge_panel(len=100, wid=30, z=0, count=7) {
    for (i=[0:count-1]) {
        xx = -len/2 + 12 + i * (len-24)/(count-1);
        translate([xx,0,z]) rotate([90,0,0]) cylinder(h=wid-10, r=0.9, center=true);
    }
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

module quarter_turn_lug(r=8, lug_w=3.5, lug_t=1.6, z=0) {
    translate([0,0,z])
    for (a=[0,180])
        rotate([0,0,a])
        translate([r-lug_t/2,0,0])
        cube([lug_t,lug_w,1.6], center=true);
}
