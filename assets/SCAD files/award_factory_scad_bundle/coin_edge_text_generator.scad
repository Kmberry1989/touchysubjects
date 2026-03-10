
text_string = "KOKOMO ART ASSOCIATION";
coin_radius = 30;
text_size = 3;
text_depth = 1;
text_arc = 180;
flip_text = false;

module curved_text(str, radius, arc=180, flip=false){
chars=len(str);
angle_step = arc / max(chars-1,1);

for(i=[0:chars-1]){
angle = -arc/2 + i*angle_step;
rotate([0,0,angle])
translate([0,radius,0])
rotate([0,0, flip?180:0])
linear_extrude(height=text_depth)
text(str[i], size=text_size, halign="center", valign="center");
}
}

curved_text(text_string, coin_radius, text_arc, flip_text);
