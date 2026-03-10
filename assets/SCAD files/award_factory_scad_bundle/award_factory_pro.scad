
mode="coin"; // coin | medal | plaque | topper | trophy
svg_file="design.svg";
award_type="first";

coin_diameter=60;
coin_thickness=4;
rim_width=3;
rim_height=1.2;

svg_height=1.5;
svg_mode="emboss";
svg_target_size=coin_diameter*0.55;

enable_top_text=true;
enable_bottom_text=true;

top_text="FIRST PLACE";
bottom_text="2026";

text_size=6;
text_depth=1;
text_radius=coin_diameter/2-6;

enable_wreath=true;
enable_stars=false;

star_count=18;

$fn=120;

module svg_logo(h){
scale(svg_target_size/100)
linear_extrude(height=h)
import(svg_file,center=true);
}

module laurel_leaf(){
scale([1,.5]) circle(2);
}

module wreath(){
leaf_count=32;
for(i=[0:leaf_count-1])
rotate(i*360/leaf_count)
translate([coin_diameter/2-8,0,coin_thickness])
linear_extrude(1) laurel_leaf();
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

module curved_text(txt,radius,flip=false){
chars=len(txt);
for(i=[0:chars-1]){
angle=(i-(chars-1)/2)*7;
rotate(angle)
translate([0,radius,coin_thickness-text_depth])
rotate(flip?180:0)
linear_extrude(text_depth)
text(txt[i],size=text_size,halign="center",valign="center");
}
}

module coin_blank(){
cylinder(d=coin_diameter,h=coin_thickness);
}

module coin(){
union(){
coin_blank();
translate([0,0,coin_thickness])
cylinder(d=coin_diameter,h=rim_height);

if(enable_wreath) wreath();
if(enable_stars) star_ring();

if(svg_mode=="emboss")
translate([0,0,coin_thickness])
svg_logo(svg_height);

if(enable_top_text)
curved_text(top_text,text_radius,false);

if(enable_bottom_text)
curved_text(bottom_text,text_radius,true);
}

if(svg_mode=="engrave")
difference(){
coin_blank();
translate([0,0,coin_thickness-svg_height])
svg_logo(svg_height);
}
}

if(mode=="coin") coin();
