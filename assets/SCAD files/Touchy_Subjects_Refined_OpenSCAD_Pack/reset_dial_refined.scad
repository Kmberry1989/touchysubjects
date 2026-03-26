include <common_refined.scad>;

/*
Reset Dial - 2-part print with center axle and optional detent ring.
Print body and dial separately.
*/

part = "assembled"; // assembled | body | dial | detent_ring
body_d = 44;
body_h = 15;
dial_d = 34;
dial_h = 9;
axle_d = 8;
axle_clear = clearance_medium;
detent_count = 12;
detent_ball_d = 3.2;
texture = "hex"; // hex | orbit | ribs

module body(){
    difference(){
        rounded_cylinder(h=body_h, d=body_d, r=1.2);
        translate([0,0,2]) cylinder(h=body_h, d=axle_d+2*axle_clear);
        translate([0,0,body_h-4]) cylinder(h=5, d=dial_d+0.8);
        // detent recesses
        for(a=[0:360/detent_count:359]){
            rotate([0,0,a]) translate([(dial_d*0.42),0,body_h-3.0])
                sphere(d=detent_ball_d+0.25);
        }
    }
}

module dial(){
    union(){
        difference(){
            rounded_cylinder(h=dial_h, d=dial_d, r=1.0);
            translate([0,0,-0.2]) cylinder(h=dial_h+0.4, d=axle_d);
            if(texture=="hex")
                translate([0,0,1.2]) hex_texture_band(h=dial_h, d=dial_d-1.5, cell=5, depth=0.45);
        }
        translate([0,0,0]) cylinder(h=dial_h+1.5, d=axle_d-0.2); // captive axle
        // soft detent bumps
        for(a=[0:360/detent_count:359]){
            rotate([0,0,a]) translate([(dial_d*0.42),0,1.4])
                sphere(d=detent_ball_d);
        }
    }
}

module detent_ring(){
    difference(){
        cylinder(h=2.4, d=body_d-2);
        cylinder(h=2.5, d=dial_d-6);
    }
}

if(part=="body") body();
else if(part=="dial") dial();
else if(part=="detent_ring") detent_ring();
else{
    body();
    translate([0,0,body_h-4.2]) dial();
}
