/* KOKOMO ART ASSOCIATION - GENERATIVE OBJECTS
   Generated: 2026-02-13
   Design ID: 19
   
   INSTRUCTIONS:
   1. Save as "kaa_design.scad"
   2. Ensure "logo.svg" is in the same folder (if using logo)
   3. Open in OpenSCAD -> F6 -> Export STL
*/

// --- USER CONFIGURATION ---
design_id = 19;
top_text = "KOKOMO ART ASSOCIATION";
bottom_text = "kaaonline.org";
use_logo = false;
logo_file = "logo.svg";

// [POCKET ORBIT CONFIG]
// 0 = River-Stone Minimal | 1 = Art Deco Notchwork | 2 = Bloom Drift
design_style = 1; 
render_mode = "assembled"; // "assembled" or "knolled"

// --- GLOBAL PARAMETERS ---
card_width = 85;
card_length = 55;
corner_radius = 3;
tol = 0.4; // Tolerance
$fn = 60;  // Resolution

// --- SHARED MODULES ---

module card_base(thickness) {
    hull() {
        translate([corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=thickness);
        translate([card_width-corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=thickness);
        translate([card_width-corner_radius, card_length-corner_radius, 0]) cylinder(r=corner_radius, h=thickness);
        translate([corner_radius, card_length-corner_radius, 0]) cylinder(r=corner_radius, h=thickness);
    }
}

module rounded_square(w, l, r) {
    hull() {
        translate([r, r]) circle(r=r);
        translate([w-r, r]) circle(r=r);
        translate([w-r, l-r]) circle(r=r);
        translate([r, l-r]) circle(r=r);
    }
}

module branding_text(thickness) {
    if (top_text != "") {
        translate([card_width/2, card_length - 8, thickness - 0.4])
            linear_extrude(0.8) text(top_text, size=4, halign="center", valign="center", font="Arial:style=Bold");
    }
    if (bottom_text != "") {
        translate([card_width/2, 8, thickness - 0.4])
            linear_extrude(0.8) text(bottom_text, size=3, halign="center", valign="center", font="Arial");
    }
}

module place_logo(thickness) {
    if (use_logo) {
        translate([card_width/2, card_length/2, thickness - 0.6])
            linear_extrude(1.0)
            scale([0.3, 0.3, 1]) 
            import(logo_file, center=true);
    }
}

module v_track_cutout(x_start, y_center, x_len, y_width, z_thick) {
    translate([x_start, y_center, 0])
    hull() {
        translate([0, -y_width/2, -0.1]) cube([x_len, y_width, 0.1]);
        translate([0, -(y_width + 2)/2, z_thick/2 - 0.1]) cube([x_len, y_width + 2, 0.2]);
        translate([0, -y_width/2, z_thick]) cube([x_len, y_width, 0.1]);
    }
}

module v_track_slider(x_start, y_center, x_len, y_width, z_thick) {
    w1 = y_width - (2 * tol);
    w2 = (y_width + 2) - (2 * tol);
    translate([x_start, y_center, 0])
    hull() {
        translate([0, -w1/2, 0]) cube([x_len, w1, 0.1]);
        translate([0, -w2/2, z_thick/2 - 0.1]) cube([x_len, w2, 0.2]);
        translate([0, -w1/2, z_thick - 0.1]) cube([x_len, w1, 0.1]);
    }
}

// --- CARD DESIGNS (1-14) ---

module pulse_dots() {
    th = 0.8;
    difference() {
        card_base(th);
        if (top_text != "") translate([10, card_length-12, -1]) cube([65, 10, th+2]);
        if (bottom_text != "") translate([10, 2, -1]) cube([65, 10, th+2]);
    }
    branding_text(th);
    place_logo(th);
    for (x = [4 : 3.5 : card_width-4]) {
        for (y = [12 : 3.5 : card_length-12]) {
            h_add = 0.6 + (0.4 * sin(x*25)) + (0.3 * cos(y*30));
            translate([x, y, th - 0.2]) scale([1, 1, h_add/1.5]) sphere(r=1.5, $fn=20);
        }
    }
}

module breathe_lines() {
    th = 0.8;
    card_base(th);
    branding_text(th);
    intersection() {
        translate([0,0,th]) linear_extrude(2) rounded_square(card_width, card_length, corner_radius);
        union() {
            for (x = [6 : 4 : card_width-4]) {
                translate([x, 0, th]) rotate([-90, 0, 0]) scale([1, 0.6, 1]) cylinder(r=2, h=card_length);
            }
        }
    }
}

module micro_labyrinth() {
    th = 0.8;
    card_base(th);
    branding_text(th);
    path_width = 1.5; wall_thick = 1.5;
    intersection() {
        translate([0,0,th]) linear_extrude(2) rounded_square(card_width, card_length, corner_radius);
        union() {
            for (i = [0 : 4]) {
                w = card_width - 12 - (i * (path_width + wall_thick)*2);
                l = card_length - 12 - (i * (path_width + wall_thick)*2);
                if (w > 10 && l > 10) {
                    difference() {
                        translate([card_width/2, card_length/2, th])
                            linear_extrude(1.2)
                            difference() {
                                rounded_square(w, l, 3);
                                translate([wall_thick, wall_thick, 0]) rounded_square(w-wall_thick*2, l-wall_thick*2, 1.5);
                            }
                        translate([card_width/2 + (i%2==0 ? w/3 : -w/3), card_length/2 + (i%2==0 ? l/2 : -l/2), th])
                            cube([6, 6, 5], center=true);
                    }
                }
            }
        }
    }
}

module quiet_tile() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([card_width*0.75 - 13, card_length/2 - 13, -1]) linear_extrude(4) rounded_square(26, 26, 3);
    }
    branding_text(th);
    translate([card_width*0.75, card_length + 20, 0]) {
        difference() {
            translate([-12.5, -12.5, 0]) linear_extrude(2.5) rounded_square(25, 25, 2.5);
            translate([0, 0, 11]) sphere(r=9.5, $fn=100);
        }
    }
}

module orbit_slider() {
    th = 1.6;
    center_x = card_width * 0.75; center_y = card_length / 2; radius = 16; track_w = 4.5;
    difference() {
        card_base(th);
        translate([center_x, center_y, th/2])
            rotate_extrude()
                polygon(points=[[radius - track_w, -th/2 - 0.1], [radius, -th/2 - 0.1], [radius + 1.2, 0], [radius, th/2 + 0.1], [radius - track_w, th/2 + 0.1]]);
    }
    branding_text(th);
    translate([center_x, center_y, th/2])
        rotate_extrude()
            polygon(points=[[radius - track_w + tol, -th/2 + tol], [radius - tol, -th/2 + tol], [radius + 1.2 - tol*1.5, 0], [radius - tol, th/2 - tol], [radius - track_w + tol, th/2 - tol]]);
}

module viewfinder() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([(card_width - 50)/2, (card_length - 31)/2, -1])
            hull() { r=2; translate([r,r,0]) cylinder(r=r,h=th+2); translate([50-r,r,0]) cylinder(r=r,h=th+2); translate([50-r,31-r,0]) cylinder(r=r,h=th+2); translate([r,31-r,0]) cylinder(r=r,h=th+2); }
        translate([card_width - 6, card_length - 6, -1]) cylinder(r=2, h=th+2);
    }
    branding_text(th);
}

module curator_gauge() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([10, -1, -1]) cube([5, 12, th+2]);
        translate([25, -1, -1]) cube([10, 15, th+2]);
        translate([45, -1, -1]) cube([15, 18, th+2]);
        translate([70, -1, -1]) cube([20, 20, th+2]);
        for (i = [0 : 80]) {
            tl = (i % 10 == 0) ? 4 : ((i % 5 == 0) ? 2.5 : 1.5);
            tw = (i % 10 == 0) ? 0.6 : 0.4;
            translate([2.5 + i, card_length - tl, th - 0.4]) cube([tw, tl + 1, 1]);
        }
    }
    branding_text(th);
}

module french_curve() {
    th = 1.2;
    difference() {
        hull() {
            translate([corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=th);
            translate([card_width-corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=th);
            translate([corner_radius, card_length - 15, 0]) cylinder(r=corner_radius, h=th);
            translate([card_width*0.3, card_length - 5, 0]) cylinder(r=15, h=th);
            translate([card_width*0.7, card_length - 25, 0]) cylinder(r=8, h=th);
            translate([card_width-corner_radius, corner_radius*3, 0]) cylinder(r=corner_radius, h=th);
        }
        translate([20, 20, -1]) cylinder(r=7.5, h=th+2);
        translate([38, 14, -1]) hull() { r=1; translate([r,r,0]) cylinder(r=r,h=th+2); translate([12-r,12-r,0]) cylinder(r=r,h=th+2); } 
    }
    branding_text(th);
}

module portfolio_clip() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([15, 15, -1]) linear_extrude(th + 2) {
             hull() { translate([0, 0, 0]) circle(d=3); translate([55, 0, 0]) circle(d=3); }
             hull() { translate([55, 0, 0]) circle(d=3); translate([55, 25, 0]) circle(d=3); }
             hull() { translate([55, 25, 0]) circle(d=3); translate([5, 25, 0]) circle(d=3); }
             // Simplified loop for brevity
        }
    }
    branding_text(th);
}

module micro_easel() {
    th = 1.2; hinge = 0.4;
    difference() {
        card_base(th);
        translate([20, 10, -1]) linear_extrude(th + 2) polygon(points=[[0,0], [45,0], [45,30], [0,30]]);
        translate([20, 40, hinge]) cube([45, 1.5, th]);
    }
    branding_text(th);
}

module captive_slider() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([15, 25, -1]) cube([55, 5, th + 2]);
        translate([12, 22.5, th/2 - 0.3]) cube([61, 10, 0.6]);
    }
    branding_text(th);
    translate([25, 25 + tol, 0]) cube([10, 5 - (tol*2), th]);
    translate([23, 23.5 + tol, th/2 - 0.15]) cube([14, 8 - (tol*2), 0.3]);
}

module aspect_cropper() {
    th = 2.0;
    difference() {
        card_base(th);
        translate([15, 18, -1]) cube([50, 30, th + 2]);
        v_track_cutout(12, 11, 56, 10, th);
    }
    branding_text(th);
    v_track_slider(14, 11, 12, 10, th);
    translate([20, 16, 0]) cube([6, 32, th]);
    translate([20, 42, 0]) cube([15, 6, th]);
}

module curator_selector() {
    th = 2.0;
    difference() {
        card_base(th);
        v_track_cutout(10, 27.5, 65, 18, th);
        translate([20, 27.5, th - 0.6]) linear_extrude(1) text("CREATE", size=4, halign="center", valign="center");
        translate([65, 27.5, th - 0.6]) linear_extrude(1) text("CONNECT", size=4, halign="center", valign="center");
    }
    branding_text(th);
    difference() {
        v_track_slider(12, 27.5, 22, 18, th);
        translate([20, 27.5, -1]) cylinder(r=5, h=th+2);
    }
}

module vault_doors() {
    th = 2.0;
    difference() {
        card_base(th);
        v_track_cutout(8, 27.5, 69, 25, th);
        translate([27.5, 15, 0.6]) cube([30, 25, th]);
    }
    branding_text(th);
    place_logo(th);
    difference() {
        v_track_slider(8, 27.5, 28, 25, th);
        translate([35, 27.5, -1]) cube([5, 10, th+2], center=true);
    }
    translate([12, 27.5, th/2]) scale([0.5, 1, 1]) sphere(r=5);
    union() {
        v_track_slider(49, 27.5, 28, 25, th);
        translate([47, 22.5, 0]) cube([3, 10, th - 0.2]); 
    }
    translate([73, 27.5, th/2]) scale([0.5, 1, 1]) sphere(r=5);
}

// --- POCKET ORBITS MODULES ---

module OrbitRingStack() {
    core_radius = 8; ring_thickness = 4; height = 12; tolerance = 0.4;
    module ring_shape(radius, w, h, style) {
        if (style == 0) { rotate_extrude() translate([radius + w/2, 0, 0]) resize([w, h]) circle(d=h); } 
        else if (style == 1) { 
            difference() {
                union() { cylinder(r=radius + w, h=h, center=true, $fn=80); for(i=[0:1]) translate([0,0,(i==0?1:-1)*(h/4)]) cylinder(r=radius + w + 0.5, h=1, center=true, $fn=80); }
                cylinder(r=radius, h=h+2, center=true, $fn=80);
                translate([0,0,h/2]) cylinder(r1=radius+w-1, r2=radius+w, h=1, center=false);
                rotate([180,0,0]) translate([0,0,h/2]) cylinder(r1=radius+w-1, r2=radius+w, h=1, center=false);
            }
        } else {
            difference() { cylinder(r=radius+w, h=h, center=true); cylinder(r=radius, h=h+2, center=true); }
            for(i=[0:30:360]) rotate([0,0,i]) translate([radius+w, 0, 0]) scale([1, 0.5, 1]) sphere(r=h/2.5);
        }
    }
    module core(style) {
        if (style == 0) hull() { translate([0,0,height/2 - 2]) sphere(r=core_radius); translate([0,0,-(height/2 - 2)]) sphere(r=core_radius); }
        else if (style == 1) cylinder(r=core_radius, h=height, center=true, $fn=6);
        else { cylinder(r=core_radius, h=height, center=true); translate([0,0,height/2]) sphere(r=core_radius); translate([0,0,-height/2]) sphere(r=core_radius); }
    }
    translate([0, 0, 0]) core(design_style);
    translate([(render_mode=="knolled"? core_radius*3.5 : 0), 0, 0]) ring_shape(core_radius + tolerance, ring_thickness, height*0.8, design_style);
    translate([(render_mode=="knolled"? core_radius*7 : 0), 0, 0]) ring_shape(core_radius + ring_thickness + (tolerance*2), ring_thickness, height*0.6, design_style);
    translate([(render_mode=="knolled"? core_radius*10.5 : 0), 0, 0]) ring_shape(core_radius + (ring_thickness*2) + (tolerance*3), ring_thickness, height*0.4, design_style);
}

module SilentHinge() {
    width = 30; length = 40; height = 12;
    module shell_half(style, is_top) {
        difference() {
            if (style == 0) hull() { translate([0, 10, 0]) sphere(d=width); translate([0, -10, 0]) sphere(d=width); }
            else if (style == 1) union() { cube([width, length, height/2], center=true); translate([0,0,1]) cube([width-4, length-4, height/2], center=true); }
            else intersection() { translate([0, -10, 0]) scale([1, 1.5, 1]) sphere(d=width*1.2); translate([0, 10, 0]) scale([1, 1.5, 1]) sphere(d=width*1.2); }
            translate([0,0, (is_top?-2:2)]) scale([0.8, 0.8, 0.8]) 
                if(style==0) hull() { translate([0,10,0]) sphere(d=width); translate([0,-10,0]) sphere(d=width); }
                else if(style==1) cube([width, length, height/2], center=true);
                else intersection() { translate([0,-10,0]) scale([1,1.5,1]) sphere(d=width*1.2); translate([0,10,0]) scale([1,1.5,1]) sphere(d=width*1.2); }
            translate([0, -length/2, 0]) cube([10, 2, 4], center=true); 
            translate([width/3, length/3, 0]) cylinder(r=1, h=10, center=true);
            translate([-width/3, length/3, 0]) cylinder(r=1, h=10, center=true);
        }
    }
    if (render_mode == "assembled") {
        translate([0,0,height/4]) shell_half(design_style, true);
        translate([0,0,-height/4]) rotate([180,0,0]) shell_half(design_style, false);
    } else {
        translate([-width, 0, 0]) rotate([0,180,0]) shell_half(design_style, true);
        translate([width, 0, 0]) shell_half(design_style, false);
        translate([0, -length, 0]) color("black") cube([8, 10, 0.8], center=true);
    }
}

module DetentSlider() {
    width = 25; slider_len = 50; height = 12;
    module base_shape(style) {
        if (style == 0) hull() { translate([-(slider_len/2)+width/2, 0, 0]) sphere(d=width); translate([(slider_len/2)-width/2, 0, 0]) sphere(d=width); }
        else if (style == 1) intersection() { cube([slider_len, width, height/1.5], center=true); rotate([0,90,0]) cylinder(r=width/1.8, h=slider_len, center=true, $fn=6); }
        else intersection() { scale([2, 1, 0.6]) sphere(d=width*1.5); cube([slider_len*1.2, width, height], center=true); }
    }
    module slider_button(style) {
        union() {
            translate([0,0,height/2]) 
                if (style == 0) scale([1, 1, 0.5]) sphere(d=10);
                else if (style == 1) cylinder(r=5, h=4, $fn=8);
                else sphere(d=8);
            translate([0,0,2]) cylinder(r=2.5, h=height/2);
            translate([0,0,0]) cube([8, 5, 2], center=true);
        }
    }
    y_off = (render_mode == "knolled") ? 30 : 0;
    z_slider = (render_mode == "knolled") ? 0 : 1;
    difference() {
        base_shape(design_style);
        hull() { translate([-10, 0, 2]) cylinder(r=3, h=10, center=true); translate([10, 0, 2]) cylinder(r=3, h=10, center=true); }
    }
    translate([0, y_off, z_slider]) slider_button(design_style);
}

module MazeCoin() {
    diameter = 40; thickness = 6;
    module groove_pattern(style) {
        if (style == 0) rotate_extrude() translate([diameter/2 - 8, 0, 0]) circle(r=2);
        else if (style == 1) for(i=[0:90:360]) rotate([0,0,i]) { translate([10,0,0]) cube([15, 2, 2], center=true); translate([15,5,0]) rotate([0,0,90]) cube([10, 2, 2], center=true); }
        else linear_extrude(height=2, twist=300, scale=0) translate([5,0,0]) circle(r=2);
    }
    module coin_half(style, is_male) {
        difference() {
            cylinder(r=diameter/2, h=thickness, center=true);
            translate([0,0,thickness/2]) groove_pattern(style);
            if (!is_male) { cylinder(r=5, h=thickness+2, center=true); translate([0,0,-2]) cube([12, 4, 4], center=true); }
        }
        if (is_male) translate([0,0,-thickness/2 - 1]) union() { cylinder(r=4.8, h=2, center=true); cube([11, 3.8, 2], center=true); }
    }
    if (render_mode == "assembled") {
        translate([0,0,thickness/2]) coin_half(design_style, true);
        translate([0,0,-thickness/2]) rotate([180,0,0]) coin_half(design_style, false);
    } else {
        translate([-diameter/1.2, 0, 0]) coin_half(design_style, true);
        translate([diameter/1.2, 0, 0]) rotate([180,0,0]) coin_half(design_style, false);
    }
}

module RosaryKeychain() {
    module bead(style, seed) {
        difference() {
            if (style == 0) { sphere(d=10); if (seed > 2) for(i=[0:45:360]) rotate([i,0,0]) translate([0,5,0]) sphere(r=0.5); }
            else if (style == 1) { rotate([0,90,0]) cylinder(r=5, h=10, center=true, $fn=6); if (seed > 2) rotate([0,90,0]) cylinder(r=5.5, h=8, center=true, $fn=6); }
            else hull() { translate([-3,0,0]) sphere(r=3); translate([3,0,0]) sphere(r=3); translate([0,4,0]) sphere(r=2); }
            rotate([0,90,0]) cylinder(r=1.5, h=15, center=true);
        }
    }
    module clasp(style) { if (style == 1) cube([12, 6, 4], center=true); else hull() { translate([-4,0,0]) circle(d=4); translate([4,0,0]) circle(d=4); } }
    if (render_mode == "knolled") {
        for(i=[0:6]) translate([i*15, 0, 0]) bead(design_style, i);
        translate([-15, 0, 0]) clasp(design_style);
    } else {
        for(i=[0:45:315]) rotate([0,0,i]) translate([18, 0, 0]) rotate([0,0,90]) bead(design_style, i/45);
        translate([18, 0, 0]) clasp(design_style);
    }
}

module FlipToken() {
    module frame(style) {
        difference() {
            if (style == 0) hull() { translate([-10, 0, 0]) sphere(d=12); translate([10, 0, 0]) sphere(d=12); }
            else if (style == 1) difference() { cube([30, 15, 8], center=true); rotate([0,90,0]) cylinder(r=5, h=32, center=true, $fn=4); }
            else { intersection() { translate([-5,0,0]) circle(r=20); translate([5,0,0]) circle(r=20); } linear_extrude(8, center=true) children(); }
            cube([16, 8, 20], center=true); 
            rotate([90,0,0]) cylinder(r=1.5, h=20, center=true); 
        }
    }
    module tile(style) {
        difference() {
            if (style == 0) cube([14, 6, 14], center=true);
            else if (style == 1) union() { cube([14, 6, 14], center=true); cube([10, 7, 10], center=true); }
            else intersection() { scale([1, 0.4, 1]) sphere(d=15); cube([14, 6, 14], center=true); }
            rotate([90,0,0]) cylinder(r=1.6, h=20, center=true);
        }
    }
    y_off = (render_mode == "knolled") ? 20 : 0;
    frame(design_style);
    translate([0, y_off, 0]) rotate([(render_mode=="knolled"?90:0), 0, 0]) tile(design_style);
    translate([0, y_off*2, 0]) rotate([90,0,0]) cylinder(r=1.4, h=16, center=true);
}

module SpiralTwister() {
    module shell(style, is_inner) {
        sc = is_inner ? 0.8 : 1.0;
        fn_val = (style == 1) ? 4 : 60;
        scale([sc, sc, sc]) difference() {
            union() {
                linear_extrude(height=20, twist=120, scale=0.1, slices=50) circle(r=10, $fn=fn_val);
                rotate([180,0,0]) linear_extrude(height=20, twist=120, scale=0.1, slices=50) circle(r=10, $fn=fn_val);
            }
        }
    }
    module lock() { difference() { cylinder(r=8, h=2, center=true); cylinder(r=6, h=4, center=true); } }
    if (render_mode == "assembled") {
        shell(design_style, false);
    } else {
        translate([-15, 0, 0]) shell(design_style, false);
        translate([15, 0, 0]) shell(design_style, true);
        translate([0, -20, 0]) lock();
    }
}

module TactileLoom() {
    fw = 40; fh = 60; th = 4;
    module frame_shape(style) {
        difference() {
            if (style == 0) resize([fw, fh, th]) sphere(d=fw);
            else if (style == 1) cube([fw, fh, th], center=true);
            else intersection() { translate([-fw/2, 0, 0]) scale([1, 1.5, 1]) sphere(d=fw*2); translate([fw/2, 0, 0]) scale([1, 1.5, 1]) sphere(d=fw*2); }
            if (style == 0) resize([fw-10, fh-10, th+2]) cylinder(d=10);
            else if (style == 1) cube([fw-10, fh-10, th+2], center=true);
            else resize([fw-15, fh-20, th+2]) cylinder(d=10);
            for(i=[-20:10:20]) translate([0, i, 0]) cube([fw+5, 2, th+5], center=true);
        }
    }
    module strip(style) {
        cube([fw + 20, 8, 1], center=true);
        for(i=[-20:2:20]) translate([i, 0, 0.5]) if(style==1) rotate([0,0,45]) cube([1,5,0.5], center=true); else cylinder(r=0.5, h=1, center=true);
    }
    if (render_mode == "assembled") {
        frame_shape(design_style);
        color("gray") rotate([0,0,90]) strip(design_style);
    } else {
        translate([-30, 0, 0]) frame_shape(design_style);
        translate([30, 0, 0]) rotate([0,0,90]) strip(design_style);
        translate([45, 0, 0]) rotate([0,0,90]) strip(design_style);
    }
}

// --- RENDER LOGIC ---
if (design_id == 1) pulse_dots();
if (design_id == 2) breathe_lines();
if (design_id == 3) micro_labyrinth();
if (design_id == 4) quiet_tile();
if (design_id == 5) orbit_slider();
if (design_id == 6) viewfinder();
if (design_id == 7) curator_gauge();
if (design_id == 8) french_curve();
if (design_id == 9) portfolio_clip();
if (design_id == 10) micro_easel();
if (design_id == 11) captive_slider();
if (design_id == 12) aspect_cropper();
if (design_id == 13) curator_selector();
if (design_id == 14) vault_doors();

if (design_id == 15) OrbitRingStack();
if (design_id == 16) SilentHinge();
if (design_id == 17) DetentSlider();
if (design_id == 18) MazeCoin();
if (design_id == 19) RosaryKeychain();
if (design_id == 20) FlipToken();
if (design_id == 21) SpiralTwister();
if (design_id == 22) TactileLoom();
