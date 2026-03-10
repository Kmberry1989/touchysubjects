
ribbon_width = 25;
ribbon_thickness = 2;
ribbon_length = 60;
loop_diameter = 14;
fold_depth = 6;

module ribbon_loop(){
difference(){
cylinder(d=loop_diameter+6,h=ribbon_thickness);
translate([0,0,-1])
cylinder(d=loop_diameter,h=ribbon_thickness+2);
}
}

module ribbon_strap(){
translate([0,-ribbon_width/2,0])
cube([ribbon_length,ribbon_width,ribbon_thickness]);
}

module ribbon_fold(){
translate([ribbon_length/2,0,-fold_depth])
rotate([90,0,0])
cylinder(d=ribbon_width,h=ribbon_thickness);
}

module ribbon(){
union(){
ribbon_loop();
translate([loop_diameter/2,0,0]) ribbon_strap();
translate([ribbon_length/2,0,0]) ribbon_fold();
}
}

ribbon();
