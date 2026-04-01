// TS-PET-B05 - Stackable Accessory Valet Tray
$fn = 72; tray_w = 120; tray_h = 90; tray_d = 18; wall = 2.4; corner_r = 10; stack_lip_h = 3.0;
module rounded_rect_2d(w,h,r) { hull() { translate([-w/2 + r, -h/2 + r]) circle(r = r); translate([ w/2 - r, -h/2 + r]) circle(r = r); translate([-w/2 + r,  h/2 - r]) circle(r = r); translate([ w/2 - r,  h/2 - r]) circle(r = r);} }
difference() {
    union() { linear_extrude(height = tray_d) rounded_rect_2d(tray_w, tray_h, corner_r); translate([0,0,tray_d]) linear_extrude(height = stack_lip_h) difference() { rounded_rect_2d(tray_w, tray_h, corner_r); rounded_rect_2d(tray_w - 2*wall, tray_h - 2*wall, corner_r - 2); } }
    translate([0,0,wall]) linear_extrude(height = tray_d) rounded_rect_2d(tray_w - 2*wall, tray_h - 2*wall, corner_r - 2);
}
