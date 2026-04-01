// TS-PET-C04 - Under-Chair Teaser Mount Clip
$fn = 72; panel_t = 18; clip_len = 42; wall = 4; clip_depth = 26; clip_gap = panel_t + 0.8; eye_outer_d = 16; eye_inner_d = 7;
module clip_body() { difference() { cube([clip_len, clip_depth, clip_gap + 2*wall], center = false); translate([wall, wall, wall]) cube([clip_len + 1, clip_depth - 2*wall, clip_gap], center = false); } }
union() { clip_body(); translate([clip_len/2, clip_depth + eye_outer_d/2 - 2, wall + clip_gap/2]) rotate([90,0,0]) difference() { cylinder(h = 8, d = eye_outer_d, center = true); cylinder(h = 10, d = eye_inner_d, center = true); } }
