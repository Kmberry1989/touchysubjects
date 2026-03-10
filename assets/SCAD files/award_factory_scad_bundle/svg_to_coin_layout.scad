
svg_file="design.svg";
coin_diameter=60;
coin_thickness=4;
svg_height=1.5;

enable_border=true;
enable_wreath=true;
enable_stars=false;

star_count=16;

$fn=120;

module svg_logo(h){
linear_extrude(height=h)
import(svg_file,center=true);
}

module star(size=2){
polygon([[0,size],[size*.4,size*.3],[size,0],[size*.4,-size*.3],
[0,-size],[-size*.4,-size*.3],[-size,0],[-size*.4,size*.3]]);
}

module star_ring(){
for(i=[0:star_count-1])
rotate(i*360/star_count)
translate([coin_diameter/2-4,0,coin_thickness])
linear_extrude(1) star();
}

module wreath(){
for(i=[0:28])
rotate(i*360/28)
translate([coin_diameter/2-8,0,coin_thickness])
linear_extrude(1)
scale([1,.5])
circle(1.2);
}

module coin(){
cylinder(d=coin_diameter,h=coin_thickness);

translate([0,0,coin_thickness])
if(enable_wreath) wreath();

if(enable_stars) star_ring();

translate([0,0,coin_thickness])
svg_logo(svg_height);
}

coin();
