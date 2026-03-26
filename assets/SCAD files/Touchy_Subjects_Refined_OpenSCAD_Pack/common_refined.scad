/*
Touchy Subjects - common_refined.scad
Refined helper library for tolerance-aware concept models.
All dimensions in mm.
*/

$fn = $preview ? 48 : 96;

// ---------- Core print tuning ----------
clearance_loose  = 0.35;   // easy FDM slip fit
clearance_medium = 0.25;   // tuned fit
clearance_tight  = 0.15;   // press fit after calibration
thread_clearance = 0.25;

wall_default = 2.0;
floor_default = 2.0;
split_gap = 0.20;

// ---------- Small utilities ----------
module rounded_box(size=[20,20,10], r=2, center=false){
    x=size[0]; y=size[1]; z=size[2];
    translate(center ? [-x/2,-y/2,-z/2] : [0,0,0])
    hull(){
        for(ix=[r, x-r], iy=[r, y-r], iz=[r, z-r])
            translate([ix,iy,iz]) sphere(r=r);
    }
}

module rounded_cylinder(h=10, d=20, r=1){
    minkowski(){
        cylinder(h=h-2*r, d=d-2*r);
        sphere(r=r);
    }
}

module torus(R=12, r=3){
    rotate_extrude()
        translate([R,0,0]) circle(r=r);
}

module split_cut_x(gap=split_gap, extra=200){
    translate([-gap/2,-extra/2,-extra/2]) cube([gap,extra,extra]);
}

module split_cut_y(gap=split_gap, extra=200){
    translate([-extra/2,-gap/2,-extra/2]) cube([extra,gap,extra]);
}

module split_cut_z(gap=split_gap, extra=200){
    translate([-extra/2,-extra/2,-gap/2]) cube([extra,extra,gap]);
}

module alignment_pin(d=4, h=6, chamfer=0.6){
    union(){
        cylinder(h=h-chamfer, d=d);
        translate([0,0,h-chamfer]) cylinder(h=chamfer, d1=d, d2=d-1.2);
    }
}

module alignment_socket(d=4, h=6, clearance=clearance_medium){
    cylinder(h=h+0.4, d=d+2*clearance);
}

module knurl_band(h=8, d=20, depth=0.7, pitch=5){
    difference(){
        cylinder(h=h, d=d);
        for(a=[0:pitch:359]){
            rotate([0,0,a]) translate([d/2-depth,0,-0.2])
                rotate([0,45,0]) cube([depth*2, 1.4, h+0.4], center=true);
        }
    }
}

// Textures are intentionally shallow to remain printable on FDM.
module orbit_texture_plate(x=30, y=20, z=2, pitch=5, amp=0.5){
    difference(){
        cube([x,y,z]);
        for(i=[0:pitch:x+pitch]){
            translate([i,-1,z-amp]) rotate([0,90,0]) cylinder(h=y+2, r=1.25, center=false);
        }
    }
}

module hex_texture_band(h=20, d=30, cell=5, depth=0.6){
    // subtract dimples from a cylinder
    difference(){
        cylinder(h=h, d=d);
        for(z=[cell/2:cell*0.86:h-cell/2])
            for(a=[0:360/(max(6,floor(PI*d/cell))):359]){
                rotate([0,0,a + (floor(z/cell)%2)*180/(max(6,floor(PI*d/cell)))])
                    translate([d/2-depth,0,z])
                        sphere(d=cell*0.55);
            }
    }
}

module grip_ribs_band(h=20, d=30, rib_w=1.5, rib_h=0.8, count=10){
    union(){
        cylinder(h=h, d=d);
        for(a=[0:360/count:359]){
            rotate([0,0,a]) translate([d/2, -rib_w/2, 0])
                cube([rib_h, rib_w, h]);
        }
    }
}

// Simple preview threads; use with care. Good enough for concept export.
module simple_external_thread(h=8, d=18, pitch=2, depth=0.6){
    linear_extrude(height=h, twist=360*h/pitch, slices=max(16, floor(h*12)))
        translate([d/2-depth/2,0,0]) square([depth,0.9], center=true);
}

module simple_internal_thread(h=8, d=18, pitch=2, depth=0.6){
    linear_extrude(height=h, twist=360*h/pitch, slices=max(16, floor(h*12)))
        translate([d/2+depth/2,0,0]) square([depth,1.0], center=true);
}

module bayonet_lugs(d=20, lug_w=3, lug_h=2, lug_l=4, count=3){
    for(a=[0:360/count:359])
        rotate([0,0,a]) translate([d/2-lug_h, -lug_w/2, 0]) cube([lug_h,lug_w,lug_l]);
}

module bayonet_channels(d=20, lug_w=3, lug_h=2, lug_l=4, count=3, clearance=clearance_medium){
    for(a=[0:360/count:359])
        rotate([0,0,a]) translate([d/2-lug_h-clearance, -(lug_w+2*clearance)/2, -0.2])
            cube([lug_h+clearance, lug_w+2*clearance, lug_l+0.4]);
}

module pill_cavity(h=18, d=10){
    cylinder(h=h, d=d);
}
