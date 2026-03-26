include <common_refined.scad>;

/*
Universal Grip Sleeve v2
Split clamshell with internal taper ribs and latch channel.
Use as a family by adjusting inner_d.
*/

part = "assembled"; // assembled | left | right | latch
inner_d = 33;       // bottle / utensil OD
length = 85;
wall = 4.0;
outer_d = inner_d + 2*wall;
base_d = outer_d + 5;
taper = 1.5;
hinge_style = "living"; // concept only

module half_shell(side=1){
    difference(){
        intersection(){
            union(){
                hex_texture_band(h=length, d=outer_d, cell=5.5, depth=0.65);
                cylinder(h=8, d=base_d);
            }
            translate([side<0?-100:0,-80,-10]) cube([100,160,length+20]);
        }
        // main bore with taper
        translate([0,0,2]) cylinder(h=length+1, d1=inner_d+taper, d2=inner_d-taper);
        // internal micro ribs
        for(a=[0:45:315]){
            rotate([0,0,a]) translate([inner_d/2-0.3,-0.6,10]) cube([0.9,1.2,length-20]);
        }
        if(side>0)
            translate([outer_d/2-1.6,-5,length/2-12]) cube([3.4,10,24]); // latch void
    }
}

module left(){ difference(){ half_shell(-1); split_cut_x(); } }
module right(){ difference(){ half_shell(1); split_cut_x(); } }

module latch(){
    difference(){
        rounded_box([18,9,26], r=1.2, center=true);
        translate([4.5,0,0]) cube([4,10,20], center=true);
    }
}

if(part=="left") left();
else if(part=="right") right();
else if(part=="latch") latch();
else{
    left();
    right();
    translate([outer_d*0.7,0,length/2]) latch();
}
