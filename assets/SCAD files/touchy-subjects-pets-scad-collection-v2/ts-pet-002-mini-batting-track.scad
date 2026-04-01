// TS-PET-002 - Mini Batting Track
$fn = 120;
outer_d = 120;
base_h = 12;
track_w = 18;
roof_t = 2.4;
floor_t = 2.0;
wall_t = 3.0;
view_gap_w = 16;
view_gap_count = 3;
ball_d = 14;
inner_track_d = outer_d - 2*(wall_t + track_w);
track_center_d = outer_d - 2*wall_t - track_w;
module main_track() {
    difference() {
        cylinder(h = base_h, d = outer_d);
        translate([0,0,-1]) cylinder(h = base_h + 2, d = inner_track_d);
        translate([0,0,floor_t])
            difference() {
                cylinder(h = base_h - floor_t - roof_t, d = outer_d - 2*wall_t);
                cylinder(h = base_h - floor_t - roof_t + 0.2, d = inner_track_d + 2*wall_t);
            }
        for (i = [0 : view_gap_count - 1]) {
            rotate([0,0,i * 360 / view_gap_count])
                translate([track_center_d/2, 0, base_h/2])
                    cube([20, view_gap_w, base_h + 2], center = true);
        }
    }
}
main_track();
translate([track_center_d/2, 0, floor_t + ball_d/2]) sphere(d = ball_d);
