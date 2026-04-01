// TS-PET-C12 - Wobble Topper Ball
$fn=96; ball_d=26; stem_d=8; stem_h=14; difference(){ union(){ sphere(d=ball_d); translate([0,0,-ball_d/2]) cylinder(h=stem_h,d=stem_d); } translate([0,0,-ball_d]) cube([200,200,200], center=true); }
