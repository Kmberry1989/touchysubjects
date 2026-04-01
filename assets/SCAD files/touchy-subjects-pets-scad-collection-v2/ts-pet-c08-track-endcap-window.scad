// TS-PET-C08 - Track Endcap Window
$fn = 72; cap_len = 24; outer_w = 34; track_h = 14; wall_t = 3; join_w=14; join_t=3; join_h=10;
difference(){ cube([cap_len, outer_w, track_h], center=true); translate([0,0,wall_t]) cube([cap_len-2*wall_t, outer_w-2*wall_t, track_h], center=true); translate([-cap_len/2+join_t/2,0,0]) cube([join_t+0.5, join_w+0.5, join_h+0.5], center=true);} translate([cap_len/2-join_t/2,0,0]) cube([join_t, join_w, join_h], center=true);
