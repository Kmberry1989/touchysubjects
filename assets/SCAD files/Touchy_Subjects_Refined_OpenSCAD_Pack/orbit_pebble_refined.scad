include <common_refined.scad>;

/*
Orbit Pebble - refined, split body with captured steel-washer pocket.
Use mode = "assembled", "top", or "bottom".
*/

mode = "assembled";        // assembled | top | bottom
length = 68;
width  = 48;
height = 22;
shell  = 2.0;
split_z = height/2;
washer_d = 24.2;          // e.g. 24 mm washer + fit
washer_t = 2.2;           // 2 mm washer + fit
pin_d = 4;
pin_h = 5;
texture = "orbit";        // orbit | smooth

module outer_body(){
    scale([length/width,1,height/width])
        sphere(d=width);
}

module top_half(){
    difference(){
        intersection(){
            outer_body();
            translate([-200,-200,split_z]) cube([400,400,400]);
        }
        // hollow
        translate([0,0,shell]) scale([(length-2*shell)/(width), (width-2*shell)/(width), (height-2*shell)/(width)])
            sphere(d=width);
        // pin sockets
        for(x=[-14,14], y=[-10,10])
            translate([x,y,split_z-0.2]) alignment_socket(d=pin_d, h=pin_h, clearance=clearance_medium);
    }
}

module bottom_half(){
    difference(){
        intersection(){
            outer_body();
            translate([-200,-200,-200]) cube([400,400,split_z]);
        }
        translate([0,0,shell]) scale([(length-2*shell)/(width), (width-2*shell)/(width), (height-2*shell)/(width)])
            sphere(d=width);
        // washer pocket
        translate([0,0,split_z/2 - washer_t/2]) cylinder(h=washer_t, d=washer_d);
        // pin holes punched through slightly
        for(x=[-14,14], y=[-10,10])
            translate([x,y,split_z-pin_h]) alignment_pin(d=pin_d, h=pin_h);
    }
}

module orbit_lines(){
    intersection(){
        outer_body();
        union(){
            for(s=[0.75,0.88,1.0])
                scale([s,s,1]) linear_extrude(height=height+2, center=true)
                    offset(r=0.8) offset(delta=-0.8)
                        square([length*0.55, width*0.18], center=true);
        }
    }
}

if(mode=="top")
    top_half();
else if(mode=="bottom")
    bottom_half();
else {
    if(texture=="smooth"){
        union(){ bottom_half(); top_half(); }
    } else {
        difference(){
            union(){ bottom_half(); top_half(); }
            translate([0,0,height/2]) rotate([0,0,18]) scale([1,0.92,1]) orbit_lines();
        }
    }
}
