// TS-PET-C13 - Track Bridge Support
$fn=72; width=34; arch_span=80; leg_w=8; leg_h=34; top_t=6;
union(){ translate([-arch_span/2+leg_w/2,0,leg_h/2]) cube([leg_w,width,leg_h],center=true); translate([ arch_span/2-leg_w/2,0,leg_h/2]) cube([leg_w,width,leg_h],center=true); translate([0,0,leg_h+top_t/2]) cube([arch_span,width,top_t],center=true); }
