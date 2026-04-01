// TS-PET-C06 - Straight Track Segment
$fn = 72; seg_len = 110; outer_w = 34; track_h = 14; floor_t = 2; roof_t = 2.2; wall_t = 3; join_w = 14; join_t = 3; join_h = 10;
difference(){ cube([seg_len, outer_w, track_h], center=true); translate([0,0,floor_t]) cube([seg_len-2*wall_t, outer_w-2*wall_t, track_h-floor_t-roof_t+0.1], center=true); translate([-seg_len/2+join_t/2,0,0]) cube([join_t+0.5, join_w+0.5, join_h+0.5], center=true);} translate([seg_len/2-join_t/2,0,0]) cube([join_t, join_w, join_h], center=true);
