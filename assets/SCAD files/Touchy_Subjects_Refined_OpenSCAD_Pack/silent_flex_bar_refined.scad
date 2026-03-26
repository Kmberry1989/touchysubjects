include <common_refined.scad>;

/*
Silent Flex Bar - 3-piece concept
Print left_shell, right_shell, and center_spine separately.
The spine can be TPU or spring steel surrogate.
*/

part = "assembled"; // assembled | left_shell | right_shell | center_spine
length = 105;
width = 22;
thickness = 12;
shell = 2.0;
spine_t = 2.2;
spine_w = 10.5;

module shell_half(side=1){
    difference(){
        intersection(){
            rounded_box([length,width,thickness], r=4, center=true);
            translate([side<0?-100:0,-100,-100]) cube([100,200,200], center=false);
        }
        // spine channel
        translate([0,0,0]) rounded_box([length-14, spine_w+0.6, spine_t+0.5], r=1.2, center=true);
        // alignment sockets
        for(x=[-30,0,30], y=[-5,5])
            translate([x,y,0]) rotate([90,0,0]) alignment_socket(d=3.2, h=4.5, clearance=clearance_medium);
    }
}

module spine(){
    difference(){
        rounded_box([length-16, spine_w, spine_t], r=1.1, center=true);
        // center flex zones
        for(x=[-12,-6,0,6,12])
            translate([x,0,0]) cube([1.5, spine_w+2, spine_t+2], center=true);
    }
}

module right_shell(){
    difference(){ shell_half(1); split_cut_x(); }
}

module left_shell(){
    difference(){ shell_half(-1); split_cut_x(); }
}

if(part=="left_shell") left_shell();
else if(part=="right_shell") right_shell();
else if(part=="center_spine") spine();
else{
    left_shell();
    right_shell();
    spine();
}
