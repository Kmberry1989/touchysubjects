
include <common_v2.scad>

// Touchy Subjects - Ergonomic Grip Sleeve
// Adds palm swell, thumb saddle, and directional inner ribs.

bottle_d = 74;
clearance = 1.2;
height = 112;
wall = 4.4;
base_t = 9;
palm_swell = 3.0;
thumb_saddle = true;
texture_style = "orbit"; // orbit / topo / pebble

outer_d = bottle_d + 2*clearance + 2*wall;

module outer_shell() {
    union() {
        // base body
        cylinder(h=height, r=outer_d/2);
        // palm swell
        translate([0,-(outer_d/2)-0.4,height*0.52])
            rotate([90,0,0]) scale([1.0,1.35,1.0]) cylinder(h=5.2, r=palm_swell+6, center=true);
        // coaster base
        cylinder(h=base_t, r=outer_d/2 + 2.6);
        // lip
        translate([0,0,height-5]) cylinder(h=5, r1=outer_d/2+0.6, r2=outer_d/2);
    }
}

module outer_texture() {
    if (texture_style == "orbit") {
        for (z=[12:11:height-12])
            rotate_extrude(angle=360)
                translate([outer_d/2 + 0.35,0,z])
                circle(r=0.7,$fn=16);
        for (a=[0:30:330])
            rotate([0,0,a]) translate([outer_d/2+0.35,0,height*0.55])
                sphere(r=1.6,$fn=18);
    }
    if (texture_style == "topo")
        for (i=[0:10]) translate([0,0,8+i*9]) rotate_extrude() translate([outer_d/2+0.4+i*0.12,0,0]) circle(r=0.45,$fn=16);
    if (texture_style == "pebble")
        for (row=[0:8]) {
            z=(row+1)*height/10;
            off=(row%2)*7;
            for (a=[0:18:342])
                rotate([0,0,a+off]) translate([outer_d/2+0.45,0,z]) sphere(r=1.4,$fn=18);
        }
}

difference() {
    union() {
        outer_shell();
        outer_texture();
    }

    // cavity
    translate([0,0,base_t])
    cylinder(h=height-base_t+0.2, r1=bottle_d/2+clearance-0.4, r2=bottle_d/2+clearance+0.6);

    // thumb saddle
    if (thumb_saddle)
        translate([0, outer_d/2-2.8, height*0.58])
            rotate([0,90,0]) scale([1.0,1.2,1.7]) cylinder(h=14, r=7.5, center=true);

    // finger channels
    for (x=[-10,0,10])
        translate([x,-outer_d/2+4,height*0.42]) rotate([90,0,0]) cylinder(h=8,r=4.3,center=true);

    // internal directional ribs
    for (z=[18:18:height-16])
        for (a=[20:40:340])
            rotate([0,0,a]) translate([bottle_d/2+clearance-0.1,0,z])
                cube([1.5,4.8,2.0], center=true);

    translate([0,0,-0.1]) cylinder(h=base_t-2.2, r=outer_d/2 - 8);
}
