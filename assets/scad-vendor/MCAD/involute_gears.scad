// Minimal bevel_gear compatibility shim.
module bevel_gear(number_of_teeth=16, outside_circular_pitch=8, cone_distance=20, face_width=10, bore_diameter=0, backlash=0, finish=0) {
  r1 = max(1, cone_distance * 0.35);
  r2 = max(0.5, r1 * 0.8);
  difference() {
    cylinder(h=face_width, r1=r1, r2=r2, $fn=max(24, number_of_teeth * 2));
    if (bore_diameter > 0) {
      translate([0,0,-0.1]) cylinder(h=face_width + 0.2, r=bore_diameter/2, $fn=36);
    }
  }
}
