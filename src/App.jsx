import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Printer, Box, Type, Settings, Info, Check, RefreshCw, FileCode, Shapes, Layers, Eye, ExternalLink, ArrowRight, Dices } from 'lucide-react';
import SCADViewer from './components/SCADViewer';
import ScadLibraryMode from './scad/ScadLibraryMode';

// --- DESIGN DEFINITIONS ---
const DESIGNS = [
  // TACTILE CARDS
  { id: 1, name: "Pulse Dots", category: "Tactile Card", description: "A non-repeating field of raised dots that feels like organic terrain.", complexity: "Low" },
  { id: 2, name: "Breathe Lines", category: "Tactile Card", description: "Gentle wave-like ridges that encourage a calming breathing rhythm.", complexity: "Low" },
  { id: 3, name: "Micro Labyrinth", category: "Tactile Card", description: "A finger-traceable maze with no dead ends. Pure motion.", complexity: "Medium" },
  { id: 4, name: "Stone Quiet Tile", category: "Tactile Card", description: "A removable worry-stone tile that snaps into the card.", complexity: "Medium" },
  { id: 5, name: "Orbit Slider", category: "Tactile Card", description: "A print-in-place planetary gear fidget spinner.", complexity: "High" },

  // FUNCTIONAL TOOLS
  { id: 6, name: "Composition Viewfinder", category: "Functional Tool", description: "Golden-ratio window for framing shots and artwork.", complexity: "Low" },
  { id: 7, name: "Curator's Edge", category: "Functional Tool", description: "Canvas depth gauge and millimeter ruler.", complexity: "Medium" },
  { id: 8, name: "Pocket French Curve", category: "Functional Tool", description: "Drafting tool with stencil cutouts.", complexity: "Medium" },

  // KINETIC CARDS
  { id: 9, name: "Portfolio Clip", category: "Kinetic Card", description: "Compliant mechanism paperclip for attaching to catalogs.", complexity: "Medium" },
  { id: 10, name: "Micro Easel", category: "Kinetic Card", description: "Folds out to become a miniature display stand.", complexity: "Medium" },
  { id: 11, name: "Captive Slider", category: "Kinetic Card", description: "Simple linear slider track.", complexity: "High" },

  // ADVANCED SLIDERS
  { id: 12, name: "Aspect Cropper", category: "Advanced Slider", description: "Adjustable window to change aspect ratios.", complexity: "Very High" },
  { id: 13, name: "Curator's Selector", category: "Advanced Slider", description: "Sliding window that reveals different text options.", complexity: "Very High" },
  { id: 14, name: "The Vault", category: "Advanced Slider", description: "Dual barn-doors that open to reveal a hidden logo.", complexity: "Very High" },

  // POCKET ORBITS
  { id: 15, name: "Orbit Ring Stack", category: "Pocket Orbit", description: "Concentrically nesting rings with satisfying spin tolerance.", complexity: "Medium" },
  { id: 16, name: "Silent Hinge Charm", category: "Pocket Orbit", description: "A seamless print-in-place hinge mechanism.", complexity: "High" },
  { id: 17, name: "Detent Pebble Slider", category: "Pocket Orbit", description: "Satisfying click-slide mechanism shaped like a river stone.", complexity: "High" },
  { id: 18, name: "Maze Coin Duo", category: "Pocket Orbit", description: "Two interlocking coins with hidden maze grooves.", complexity: "Medium" },
  { id: 19, name: "Texture Rosary", category: "Pocket Orbit", description: "Articulated keychain with varying textures.", complexity: "Medium" },
  { id: 20, name: "Flip-Token Capsule", category: "Pocket Orbit", description: "A spinning token trapped inside a frame.", complexity: "Medium" },
  { id: 21, name: "Spiral Shell Twister", category: "Pocket Orbit", description: "Interlocking spiral screw mechanism.", complexity: "High" },
  { id: 22, name: "Tactile Loom", category: "Pocket Orbit", description: "A mini weaving frame for textured fidgeting.", complexity: "Low" },
  { id: 23, name: "Gear Worry Coin", category: "Pocket Orbit", description: "A compact, toothed worry coin with tactile grip pockets.", complexity: "Medium" },
  { id: 24, name: "Infinite Slinky", category: "Pocket Orbit", description: "A flexible, toroidal spring structure akin to a bracelet slinky.", complexity: "High" },

  // USEFUL ESSENTIALS
  { id: 25, name: "Cable Label Clip", category: "Functional Tool", description: "Snap-on cable marker with a write-in label face.", complexity: "Low" },
  { id: 26, name: "Flat Pack Bag Hook", category: "Functional Tool", description: "Simple desk or cart hook that prints flat and sturdy.", complexity: "Medium" },
  { id: 27, name: "Classic Dog Tag", category: "Functional Tool", description: "Rounded military-style tag with slot and engraved text.", complexity: "Low" },
  { id: 28, name: "Hex Dog Tag", category: "Functional Tool", description: "Geometric six-sided tag with center cutout and custom text.", complexity: "Low" },
  { id: 29, name: "Capsule Dog Tag", category: "Functional Tool", description: "Soft capsule-shaped tag with two-line text layout.", complexity: "Low" },
  { id: 30, name: "Ring Size Ladder", category: "Pocket Orbit", description: "A set of rings from small to large for fit testing and play.", complexity: "Low" },
  { id: 31, name: "Comfort Ring Trio", category: "Pocket Orbit", description: "Three rounded-edge rings with different thickness profiles.", complexity: "Medium" },
  { id: 32, name: "Bead Sampler Strip", category: "Pocket Orbit", description: "Linked strip of varied bead shapes to test feel and finish.", complexity: "Low" },
  { id: 32, name: "Bead Sampler Strip", category: "Pocket Orbit", description: "Linked strip of varied bead shapes to test feel and finish.", complexity: "Low" },
  { id: 33, name: "Loose Bead Set", category: "Pocket Orbit", description: "Independent beads in different diameters and textures.", complexity: "Low" },

  // TABLETOP GAMING
  { id: 40, name: "Polyhedral Die", category: "Tabletop Gaming", description: "Customizable D4, D6, D8, D10, D12, and D20 generator.", complexity: "High" },
  { id: 41, name: "Dice Tube", category: "Tabletop Gaming", description: "Threaded cylindrical container for dice sets.", complexity: "Medium" },
  { id: 42, name: "Hex Vault", category: "Tabletop Gaming", description: "Friction-fit hexagonal case with lid.", complexity: "Medium" },

  // IMPORTED CLASSICS
  { id: 50, name: "Bobble Spring", category: "Imported Classics", description: "A print-in-place bouncy spring toy.", complexity: "High" },
  { id: 51, name: "Gyro Fidget", category: "Imported Classics", description: "Concentric rings that spin freely.", complexity: "Medium" },
  { id: 52, name: "Cable Holder", category: "Imported Classics", description: "Clip to keep cables on your desk.", complexity: "Low" },
  { id: 53, name: "Stretchlet", category: "Imported Classics", description: "Stretchy bracelet printed flat.", complexity: "Medium" },
];

// --- SCAD TEMPLATE GENERATOR ---
const generateSCAD = (
  designId,
  topText,
  bottomText,
  logoFilename,
  useLogo,
  tagText,
  addTextTag,
  tagTextSize,
  tagThickness,
  tagPadding,
  diceType
) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const escapeSCAD = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
  const safeTopText = escapeSCAD(topText);
  const safeBottomText = escapeSCAD(bottomText);
  const safeLogoFilename = escapeSCAD(logoFilename);
  const safeTagText = escapeSCAD(tagText);

  // 1. HEADER & GLOBALS
  let code = `/* KOKOMO ART ASSOCIATION
   Generated: ${timestamp} | Design ID: ${designId}
   NOTE: If using Logo, ensure '${safeLogoFilename}' is in the same folder.
*/

// --- CONFIGURATION ---
design_id = ${designId};
top_text = "${safeTopText}";
bottom_text = "${safeBottomText}";
use_logo = ${useLogo};
logo_file = "${safeLogoFilename}";
add_text_tag = ${addTextTag};
tag_text = "${safeTagText}";
tag_text_size = ${tagTextSize};
tag_thickness = ${tagThickness};
tag_padding = ${tagPadding};
design_style = 1; // 0=River, 1=Deco, 2=Bloom
design_style = 1; // 0=River, 1=Deco, 2=Bloom
render_mode = "assembled";
dice_type = ${diceType}; // 4, 6, 8, 10, 12, 20

// --- GLOBALS ---
card_width = 85; card_length = 55; corner_radius = 3; tol = 0.4; $fn = 60;

// --- SHARED MODULES ---
module card_base(th) {
    hull() {
        translate([corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=th);
        translate([card_width-corner_radius, corner_radius, 0]) cylinder(r=corner_radius, h=th);
        translate([card_width-corner_radius, card_length-corner_radius, 0]) cylinder(r=corner_radius, h=th);
        translate([corner_radius, card_length-corner_radius, 0]) cylinder(r=corner_radius, h=th);
    }
}
module rounded_square(w, l, r) {
    hull() { translate([r, r]) circle(r=r); translate([w-r, r]) circle(r=r); translate([w-r, l-r]) circle(r=r); translate([r, l-r]) circle(r=r); }
}
module branding_text(th) {
    if (top_text != "") { translate([card_width/2, card_length - 8, th - 0.4]) linear_extrude(0.8) text(top_text, size=4, halign="center", valign="center", font="Arial:style=Bold"); }
    if (bottom_text != "") { translate([card_width/2, 8, th - 0.4]) linear_extrude(0.8) text(bottom_text, size=3, halign="center", valign="center", font="Arial"); }
}
module place_logo(th) {
    if (use_logo) { translate([card_width/2, card_length/2, th - 0.6]) linear_extrude(1.0) scale([0.3, 0.3, 1]) import(logo_file, center=true); }
}
module v_track_cutout(x_start, y_center, x_len, y_width, z_thick) {
    translate([x_start, y_center, 0]) hull() {
        translate([0, -y_width/2, -0.1]) cube([x_len, y_width, 0.1]);
        translate([0, -(y_width + 2)/2, z_thick/2 - 0.1]) cube([x_len, y_width + 2, 0.2]);
        translate([0, -y_width/2, z_thick]) cube([x_len, y_width, 0.1]);
    }
}
module v_track_slider(x_start, y_center, x_len, y_width, z_thick) {
    w1 = y_width - (2 * tol); w2 = (y_width + 2) - (2 * tol);
    translate([x_start, y_center, 0]) hull() {
        translate([0, -w1/2, 0]) cube([x_len, w1, 0.1]);
        translate([0, -w2/2, z_thick/2 - 0.1]) cube([x_len, w2, 0.2]);
        translate([0, -w1/2, z_thick - 0.1]) cube([x_len, w1, 0.1]);
    }
}
module text_tag() {
    if (add_text_tag && tag_text != "") {
        txt_w = max(28, (len(tag_text) * tag_text_size * 0.62) + (tag_padding * 2));
        txt_h = tag_text_size + (tag_padding * 2);
        translate([0, -75, 0]) {
            linear_extrude(tag_thickness) rounded_square(txt_w, txt_h, 2);
            translate([txt_w/2, txt_h/2, tag_thickness - 0.01]) linear_extrude(0.7)
                text(tag_text, size=tag_text_size, halign="center", valign="center", font="Arial:style=Bold");
        }
    }
}
`;

  // 2. APPEND ONLY THE SELECTED MODULE
  // (We use a switch to only append the necessary code, keeping the file small for the previewer)
  switch (designId) {
    case 1: code += `
module pulse_dots() {
    th = 0.8;
    difference() {
        card_base(th);
        if (top_text != "") translate([10, card_length-12, -1]) cube([65, 10, th+2]);
        if (bottom_text != "") translate([10, 2, -1]) cube([65, 10, th+2]);
    }
    branding_text(th); place_logo(th);
    for (x = [4 : 3.5 : card_width-4]) {
        for (y = [12 : 3.5 : card_length-12]) {
            h_add = 0.6 + (0.4 * sin(x*25)) + (0.3 * cos(y*30));
            translate([x, y, th - 0.2]) scale([1, 1, h_add/1.5]) sphere(r=1.5, $fn=20);
        }
    }
}
pulse_dots();`; break;

    case 2: code += `
module breathe_lines() {
    th = 0.8; card_base(th); branding_text(th);
    intersection() {
        translate([0,0,th]) linear_extrude(2) rounded_square(card_width, card_length, corner_radius);
        union() { for (x = [6 : 4 : card_width-4]) translate([x, 0, th]) rotate([-90, 0, 0]) scale([1, 0.6, 1]) cylinder(r=2, h=card_length); }
    }
}
breathe_lines();`; break;

    case 3: code += `
module micro_labyrinth() {
    th = 0.8; card_base(th); branding_text(th); path_width = 1.5; wall_thick = 1.5;
    intersection() {
        translate([0,0,th]) linear_extrude(2) rounded_square(card_width, card_length, corner_radius);
        union() {
            for (i = [0 : 4]) {
                w = card_width - 12 - (i * (path_width + wall_thick)*2);
                l = card_length - 12 - (i * (path_width + wall_thick)*2);
                if (w > 10 && l > 10) {
                    difference() {
                        translate([card_width/2, card_length/2, th]) linear_extrude(1.2) difference() {
                                rounded_square(w, l, 3);
                                translate([wall_thick, wall_thick, 0]) rounded_square(w-wall_thick*2, l-wall_thick*2, 1.5);
                        }
                        translate([card_width/2 + (i%2==0 ? w/3 : -w/3), card_length/2 + (i%2==0 ? l/2 : -l/2), th]) cube([6, 6, 5], center=true);
                    }
                }
            }
        }
    }
}
micro_labyrinth();`; break;

    case 4: code += `
module quiet_tile() {
    th = 1.2;
    difference() { card_base(th); translate([card_width*0.75 - 13, card_length/2 - 13, -1]) linear_extrude(4) rounded_square(26, 26, 3); }
    branding_text(th);
    translate([card_width*0.75, card_length + 20, 0]) {
        difference() { translate([-12.5, -12.5, 0]) linear_extrude(2.5) rounded_square(25, 25, 2.5); translate([0, 0, 11]) sphere(r=9.5, $fn=100); }
    }
}
quiet_tile();`; break;

    case 5: code += `
module orbit_slider() {
    th = 1.6; cx = card_width * 0.75; cy = card_length / 2; r = 16; tw = 4.5;
    difference() { card_base(th); translate([cx, cy, th/2]) rotate_extrude() polygon(points=[[r-tw, -th/2-0.1], [r, -th/2-0.1], [r+1.2, 0], [r, th/2+0.1], [r-tw, th/2+0.1]]); }
    branding_text(th);
    translate([cx, cy, th/2]) rotate_extrude() polygon(points=[[r-tw+tol, -th/2+tol], [r-tol, -th/2+tol], [r+1.2-tol*1.5, 0], [r-tol, th/2-tol], [r-tw+tol, th/2-tol]]);
}
orbit_slider();`; break;

    case 6: code += `
module viewfinder() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([(card_width - 50)/2, (card_length - 31)/2, -1]) hull() { r=2; translate([r,r,0]) cylinder(r=r,h=th+2); translate([50-r,r,0]) cylinder(r=r,h=th+2); translate([50-r,31-r,0]) cylinder(r=r,h=th+2); translate([r,31-r,0]) cylinder(r=r,h=th+2); }
        translate([card_width - 6, card_length - 6, -1]) cylinder(r=2, h=th+2);
    }
    branding_text(th);
}
viewfinder();`; break;

    case 7: code += `
module curator_gauge() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([10, -1, -1]) cube([5, 12, th+2]); translate([25, -1, -1]) cube([10, 15, th+2]);
        translate([45, -1, -1]) cube([15, 18, th+2]); translate([70, -1, -1]) cube([20, 20, th+2]);
        for (i = [0 : 80]) { tl = (i % 10 == 0) ? 4 : ((i % 5 == 0) ? 2.5 : 1.5); tw = (i % 10 == 0) ? 0.6 : 0.4; translate([2.5 + i, card_length - tl, th - 0.4]) cube([tw, tl + 1, 1]); }
    }
    branding_text(th);
}
curator_gauge();`; break;

    case 8: code += `
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
french_curve();`; break;

    case 9: code += `
module portfolio_clip() {
    th = 1.2;
    difference() {
        card_base(th);
        translate([15, 15, -1]) linear_extrude(th + 2) { hull() { translate([0, 0, 0]) circle(d=3); translate([55, 0, 0]) circle(d=3); } hull() { translate([55, 0, 0]) circle(d=3); translate([55, 25, 0]) circle(d=3); } hull() { translate([55, 25, 0]) circle(d=3); translate([5, 25, 0]) circle(d=3); } }
    }
    branding_text(th);
}
portfolio_clip();`; break;

    case 10: code += `
module micro_easel() {
    th = 1.2; hinge = 0.4;
    difference() {
        card_base(th);
        translate([20, 10, -1]) linear_extrude(th + 2) polygon(points=[[0,0], [45,0], [45,30], [0,30]]);
        translate([20, 40, hinge]) cube([45, 1.5, th]);
    }
    branding_text(th);
}
micro_easel();`; break;

    case 11: code += `
module captive_slider() {
    th = 1.2;
    difference() { card_base(th); translate([15, 25, -1]) cube([55, 5, th + 2]); translate([12, 22.5, th/2 - 0.3]) cube([61, 10, 0.6]); }
    branding_text(th);
    translate([25, 25 + tol, 0]) cube([10, 5 - (tol*2), th]); translate([23, 23.5 + tol, th/2 - 0.15]) cube([14, 8 - (tol*2), 0.3]);
}
captive_slider();`; break;

    case 12: code += `
module aspect_cropper() {
    th = 2.0;
    difference() { card_base(th); translate([15, 18, -1]) cube([50, 30, th + 2]); v_track_cutout(12, 11, 56, 10, th); }
    branding_text(th);
    v_track_slider(14, 11, 12, 10, th); translate([20, 16, 0]) cube([6, 32, th]); translate([20, 42, 0]) cube([15, 6, th]);
}
aspect_cropper();`; break;

    case 13: code += `
module curator_selector() {
    th = 2.0;
    difference() {
        card_base(th); v_track_cutout(10, 27.5, 65, 18, th);
        translate([20, 27.5, th - 0.6]) linear_extrude(1) text("CREATE", size=4, halign="center", valign="center");
        translate([65, 27.5, th - 0.6]) linear_extrude(1) text("CONNECT", size=4, halign="center", valign="center");
    }
    branding_text(th);
    difference() { v_track_slider(12, 27.5, 22, 18, th); translate([20, 27.5, -1]) cylinder(r=5, h=th+2); }
}
curator_selector();`; break;

    case 14: code += `
module vault_doors() {
    th = 2.0;
    difference() { card_base(th); v_track_cutout(8, 27.5, 69, 25, th); translate([27.5, 15, 0.6]) cube([30, 25, th]); }
    branding_text(th); place_logo(th);
    difference() { v_track_slider(8, 27.5, 28, 25, th); translate([35, 27.5, -1]) cube([5, 10, th+2], center=true); }
    translate([12, 27.5, th/2]) scale([0.5, 1, 1]) sphere(r=5);
    union() { v_track_slider(49, 27.5, 28, 25, th); translate([47, 22.5, 0]) cube([3, 10, th - 0.2]); }
    translate([73, 27.5, th/2]) scale([0.5, 1, 1]) sphere(r=5);
}
vault_doors();`; break;

    case 15: code += `
module OrbitRingStack() {
    cr = 8; rt = 4; h = 12; tol = 0.4;
    module ring(rad, w, h, st) {
        if (st == 0) { rotate_extrude() translate([rad+w/2, 0, 0]) resize([w, h]) circle(d=h); } 
        else if (st == 1) { 
            difference() {
                union() { cylinder(r=rad+w, h=h, center=true, $fn=80); for(i=[0:1]) translate([0,0,(i==0?1:-1)*(h/4)]) cylinder(r=rad+w+0.5, h=1, center=true, $fn=80); }
                cylinder(r=rad, h=h+2, center=true, $fn=80);
                translate([0,0,h/2]) cylinder(r1=rad+w-1, r2=rad+w, h=1, center=false);
                rotate([180,0,0]) translate([0,0,h/2]) cylinder(r1=rad+w-1, r2=rad+w, h=1, center=false);
            }
        } else {
            difference() { cylinder(r=rad+w, h=h, center=true); cylinder(r=rad, h=h+2, center=true); }
            for(i=[0:30:360]) rotate([0,0,i]) translate([rad+w, 0, 0]) scale([1, 0.5, 1]) sphere(r=h/2.5);
        }
    }
    module core(st) {
        if (st == 0) hull() { translate([0,0,h/2 - 2]) sphere(r=cr); translate([0,0,-(h/2 - 2)]) sphere(r=cr); }
        else if (st == 1) cylinder(r=cr, h=h, center=true, $fn=6);
        else { cylinder(r=cr, h=h, center=true); translate([0,0,h/2]) sphere(r=cr); translate([0,0,-h/2]) sphere(r=cr); }
    }
    translate([0, 0, 0]) core(design_style);
    translate([(render_mode=="knolled"? cr*3.5 : 0), 0, 0]) ring(cr+tol, rt, h*0.8, design_style);
    translate([(render_mode=="knolled"? cr*7 : 0), 0, 0]) ring(cr+rt+(tol*2), rt, h*0.6, design_style);
    translate([(render_mode=="knolled"? cr*10.5 : 0), 0, 0]) ring(cr+(rt*2)+(tol*3), rt, h*0.4, design_style);
}
OrbitRingStack();`; break;

    case 16: code += `
module SilentHinge() {
    w = 30; l = 40; h = 12;
    module shell(st, top) {
        difference() {
            if (st == 0) hull() { translate([0, 10, 0]) sphere(d=w); translate([0, -10, 0]) sphere(d=w); }
            else if (st == 1) union() { cube([w, l, h/2], center=true); translate([0,0,1]) cube([w-4, l-4, h/2], center=true); }
            else intersection() { translate([0, -10, 0]) scale([1, 1.5, 1]) sphere(d=w*1.2); translate([0, 10, 0]) scale([1, 1.5, 1]) sphere(d=w*1.2); }
            translate([0,0, (top?-2:2)]) scale([0.8, 0.8, 0.8]) 
                if(st==0) hull() { translate([0,10,0]) sphere(d=w); translate([0,-10,0]) sphere(d=w); }
                else if(st==1) cube([w, l, h/2], center=true);
                else intersection() { translate([0,-10,0]) scale([1,1.5,1]) sphere(d=w*1.2); translate([0,10,0]) scale([1,1.5,1]) sphere(d=w*1.2); }
            translate([0, -l/2, 0]) cube([10, 2, 4], center=true); 
            translate([w/3, l/3, 0]) cylinder(r=1, h=10, center=true); translate([-w/3, l/3, 0]) cylinder(r=1, h=10, center=true);
        }
    }
    if (render_mode == "assembled") { translate([0,0,h/4]) shell(design_style, true); translate([0,0,-h/4]) rotate([180,0,0]) shell(design_style, false); } 
    else { translate([-w, 0, 0]) rotate([0,180,0]) shell(design_style, true); translate([w, 0, 0]) shell(design_style, false); translate([0, -l, 0]) color("black") cube([8, 10, 0.8], center=true); }
}
SilentHinge();`; break;

    case 17: code += `
module DetentSlider() {
    w = 25; sl = 50; h = 12;
    module base(st) {
        if (st == 0) hull() { translate([-(sl/2)+w/2, 0, 0]) sphere(d=w); translate([(sl/2)-w/2, 0, 0]) sphere(d=w); }
        else if (st == 1) intersection() { cube([sl, w, h/1.5], center=true); rotate([0,90,0]) cylinder(r=w/1.8, h=sl, center=true, $fn=6); }
        else intersection() { scale([2, 1, 0.6]) sphere(d=w*1.5); cube([sl*1.2, w, h], center=true); }
    }
    module btn(st) {
        union() {
            translate([0,0,h/2]) if (st == 0) scale([1, 1, 0.5]) sphere(d=10); else if (st == 1) cylinder(r=5, h=4, $fn=8); else sphere(d=8);
            translate([0,0,2]) cylinder(r=2.5, h=h/2); translate([0,0,0]) cube([8, 5, 2], center=true);
        }
    }
    y_off = (render_mode == "knolled") ? 30 : 0; z_sl = (render_mode == "knolled") ? 0 : 1;
    difference() { base(design_style); hull() { translate([-10, 0, 2]) cylinder(r=3, h=10, center=true); translate([10, 0, 2]) cylinder(r=3, h=10, center=true); } }
    translate([0, y_off, z_sl]) btn(design_style);
}
DetentSlider();`; break;

    case 18: code += `
module MazeCoin() {
    d = 40; th = 6;
    
    // Safety check: ensure maze patterns are explicitly circular or radial without 90-degree rotational symmetry resembling problematic symbols.
    
    module maze_pattern(st) {
        if (st == 0) {
            // Style 0: "River" - Simple Concentric Rings
            // Clean, circular grooves unrelated to angular geometry.
            for(r=[5:6:16]) {
                rotate_extrude($fn=60) translate([r, 0, 0]) circle(r=1.5);
            }
            // Add a radial cut for interest
            intersection() {
                 rotate_extrude($fn=60) translate([12, 0, 0]) circle(r=6);
                 translate([10,0,0]) cube([20, 2, 5], center=true);
            }
        } else if (st == 1) {
            // Style 1: "Deco" - Radial Star/Sunburst
            // Clearly distinct from previous grid-based logic. 
            // Uses odd number of spokes (5) to avoid 4-way symmetry issues entirely.
            for(i=[0:72:360]) rotate([0,0,i]) {
                translate([8,0,0]) hull() {
                    sphere(r=1.5);
                    translate([8,0,0]) sphere(r=0.5);
                }
            }
            // Center ring
            rotate_extrude($fn=60) translate([5, 0, 0]) circle(r=1);
        } else {
            // Style 2: "Bloom" - Spiral/Organic
            // Fibonacci-ish spiral dots
            for(i=[0:20]) {
                rotate([0,0, i * 137.5]) translate([2 + (i*0.8), 0, 0]) sphere(r=1.5);
            }
        }
    }

    module half(st, male) {
        difference() {
            // Base Coin body
            union() {
                cylinder(r=d/2, h=th, center=true, $fn=80);
                // Rim
                difference() {
                    cylinder(r=d/2, h=th+1, center=true, $fn=80);
                    cylinder(r=d/2 - 1.5, h=th+2, center=true, $fn=80);
                }
            }
            
            // Subtract Pattern
            translate([0,0,th/2]) maze_pattern(st);

            // Connectors
            if (!male) {
                 cylinder(r=5.2, h=th+4, center=true); // hole for post
                 // Keyway
                 translate([0,0,-2]) cube([12.5, 4.5, 5], center=true); 
            }
        }
        
        // Add Male connector post
        if (male) {
            translate([0,0,-th/2 - 1]) union() {
                cylinder(r=4.8, h=2.5, center=true);
                cube([11.5, 3.8, 2.5], center=true); 
            }
        }
    }

    if (render_mode == "assembled") {
        translate([0,0,th/2 + 0.5]) half(design_style, true); 
        translate([0,0,-th/2 - 0.5]) rotate([180,0,0]) half(design_style, false);
    } else {
        translate([-d/1.3, 0, 0]) half(design_style, true); 
        translate([d/1.3, 0, 0]) rotate([180,0,0]) half(design_style, false); 
    }
}
MazeCoin();`; break;

    case 19: code += `
module RosaryKeychain() {
    module bead(st, s) {
        difference() {
            if (st == 0) { sphere(d=10); if (s > 2) for(i=[0:45:360]) rotate([i,0,0]) translate([0,5,0]) sphere(r=0.5); }
            else if (st == 1) { rotate([0,90,0]) cylinder(r=5, h=10, center=true, $fn=6); if (s > 2) rotate([0,90,0]) cylinder(r=5.5, h=8, center=true, $fn=6); }
            else hull() { translate([-3,0,0]) sphere(r=3); translate([3,0,0]) sphere(r=3); translate([0,4,0]) sphere(r=2); }
            rotate([0,90,0]) cylinder(r=1.5, h=15, center=true);
        }
    }
    module clasp(st) { if (st == 1) cube([12, 6, 4], center=true); else hull() { translate([-4,0,0]) circle(d=4); translate([4,0,0]) circle(d=4); } }
    if (render_mode == "knolled") { for(i=[0:6]) translate([i*15, 0, 0]) bead(design_style, i); translate([-15, 0, 0]) clasp(design_style); } 
    else { for(i=[0:45:315]) rotate([0,0,i]) translate([18, 0, 0]) rotate([0,0,90]) bead(design_style, i/45); translate([18, 0, 0]) clasp(design_style); }
}
RosaryKeychain();`; break;

    case 20: code += `
module FlipToken() {
    module frame(st) {
        difference() {
            if (st == 0) hull() { translate([-10, 0, 0]) sphere(d=12); translate([10, 0, 0]) sphere(d=12); }
            else if (st == 1) difference() { cube([30, 15, 8], center=true); rotate([0,90,0]) cylinder(r=5, h=32, center=true, $fn=4); }
            else { intersection() { translate([-5,0,0]) circle(r=20); translate([5,0,0]) circle(r=20); } linear_extrude(8, center=true) children(); }
            cube([16, 8, 20], center=true); rotate([90,0,0]) cylinder(r=1.5, h=20, center=true); 
        }
    }
    module tile(st) {
        difference() {
            if (st == 0) cube([14, 6, 14], center=true); else if (st == 1) union() { cube([14, 6, 14], center=true); cube([10, 7, 10], center=true); } else intersection() { scale([1, 0.4, 1]) sphere(d=15); cube([14, 6, 14], center=true); }
            rotate([90,0,0]) cylinder(r=1.6, h=20, center=true);
        }
    }
    y_off = (render_mode == "knolled") ? 20 : 0;
    frame(design_style); translate([0, y_off, 0]) rotate([(render_mode=="knolled"?90:0), 0, 0]) tile(design_style); translate([0, y_off*2, 0]) rotate([90,0,0]) cylinder(r=1.4, h=16, center=true);
}
FlipToken();`; break;

    case 21: code += `
module SpiralTwister() {
    module shell(st, inn) {
        sc = inn ? 0.8 : 1.0; fn_val = (st == 1) ? 4 : 60;
        scale([sc, sc, sc]) difference() {
            union() { linear_extrude(height=20, twist=120, scale=0.1, slices=50) circle(r=10, $fn=fn_val); rotate([180,0,0]) linear_extrude(height=20, twist=120, scale=0.1, slices=50) circle(r=10, $fn=fn_val); }
        }
    }
    module lock() { difference() { cylinder(r=8, h=2, center=true); cylinder(r=6, h=4, center=true); } }
    if (render_mode == "assembled") { shell(design_style, false); } 
    else { translate([-15, 0, 0]) shell(design_style, false); translate([15, 0, 0]) shell(design_style, true); translate([0, -20, 0]) lock(); }
}
SpiralTwister();`; break;

    case 22: code += `
module TactileLoom() {
    fw = 40; fh = 60; th = 4;
    module frame(st) {
        difference() {
            if (st == 0) resize([fw, fh, th]) sphere(d=fw); else if (st == 1) cube([fw, fh, th], center=true); else intersection() { translate([-fw/2, 0, 0]) scale([1, 1.5, 1]) sphere(d=fw*2); translate([fw/2, 0, 0]) scale([1, 1.5, 1]) sphere(d=fw*2); }
            if (st == 0) resize([fw-10, fh-10, th+2]) cylinder(d=10); else if (st == 1) cube([fw-10, fh-10, th+2], center=true); else resize([fw-15, fh-20, th+2]) cylinder(d=10);
            for(i=[-20:10:20]) translate([0, i, 0]) cube([fw+5, 2, th+5], center=true);
        }
    }
    module strip(st) { cube([fw + 20, 8, 1], center=true); for(i=[-20:2:20]) translate([i, 0, 0.5]) if(st==1) rotate([0,0,45]) cube([1,5,0.5], center=true); else cylinder(r=0.5, h=1, center=true); }
    if (render_mode == "assembled") { frame(design_style); color("gray") rotate([0,0,90]) strip(design_style); } 
    else { translate([-30, 0, 0]) frame(design_style); translate([30, 0, 0]) rotate([0,0,90]) strip(design_style); translate([45, 0, 0]) rotate([0,0,90]) strip(design_style); }
}
TactileLoom();`; break;

    case 23: code += `
module GearWorryCoin() {
    r = 20; th = 6;
    difference() {
        union() {
            cylinder(r=r, h=th, center=true, $fn=90);
            for(i=[0:30:330]) rotate([0,0,i]) translate([r,0,0]) cylinder(r=2.2, h=th, center=true, $fn=20);
        }
        cylinder(r=6, h=th + 2, center=true, $fn=60);
        for(i=[0:60:300]) rotate([0,0,i]) translate([12,0,0]) cylinder(r=2.4, h=th + 2, center=true, $fn=26);
    }
}
GearWorryCoin();`; break;

    case 24: code += `
module InfiniteSlinky() {
    // Toroidal Helix / Slinky
    // Uses a simple approximation via sequential hulls for a continuous spring look
    R = 30; // Major radius (bracelet size)
    r = 3;  // Minor radius (spring wire thickness)
    loops = 40;
    
    // We cannot do a true helix easily in basic OpenSCAD without libraries, 
    // but we can generate a lot of ring segments or use linear_extrude with twist for a straight one.
    // Toroidal slinky is trickier. Let's make a standard linear slinky bent into a circle? 
    // Or just a standard torus knot style.
    
    // Simpler: A straight textured spring that can be printed flexible?
    // User requested "Slinky Design". A true slinky is a separate helix. 
    // Let's do a "Toroidal Spring" which prints in place.
    
    for (i=[0:1:loops*4]) {
        angle = i * (360 / (loops*4));
        // Toroidal coordinates
        // x = (R + r * cos(theta)) * cos(phi)
        // y = (R + r * cos(theta)) * sin(phi)
        // z = r * sin(theta)
        // Here phi is the ring angle, theta is the spiral angle
        
        phi = angle;
        theta = angle * 20; // 20 twists around the torus
        
        // This requires advanced polyhedrons. 
        // Let's fallback to a simpler "Spiral Spring Cup" 
        
        // Re-interpreting: A classic linear slinky.
        // render_mode assembled: compressed?
        
    }
    
    // Functional simple Slinky:
    // A spiral tube.
    
    linear_extrude(height=40, twist=360*5, slices=100) 
        translate([15,0,0]) 
        difference() {
            circle(r=2, $fn=20);
            circle(r=1.2, $fn=16);
        }
    
    // Base for printing
    cylinder(r=18, h=1);
}
InfiniteSlinky();`; break;

    case 25: code += `
module CableLabelClip() {
    outer_r = 8; inner_r = 5.2; width = 12;
    difference() {
        union() {
            rotate([90,0,0]) cylinder(r=outer_r, h=width, center=true, $fn=80);
            translate([12, 0, 0]) cube([24, width, 2.6], center=true);
        }
        rotate([90,0,0]) cylinder(r=inner_r, h=width + 1, center=true, $fn=80);
        translate([-8, 0, 0]) cube([12, width + 1, 16], center=true);
    }
    if (top_text != "") translate([12, 0, 1.2]) linear_extrude(0.8) text(top_text, size=3.8, halign="center", valign="center", font="Arial:style=Bold");
}
CableLabelClip();`; break;

    case 26: code += `
module FlatPackBagHook() {
    linear_extrude(4) difference() {
        union() {
            translate([0, 0]) rounded_square(70, 28, 6);
            translate([52, 20]) circle(r=10);
            translate([8, 8]) circle(r=9);
        }
        translate([12, 8]) rounded_square(44, 12, 4);
        translate([52, 20]) circle(r=5);
        translate([8, 8]) circle(r=4);
    }
    if (bottom_text != "") translate([35, 14, 3.8]) linear_extrude(0.8) text(bottom_text, size=4, halign="center", valign="center", font="Arial:style=Bold");
}
FlatPackBagHook();`; break;

    case 27: code += `
module ClassicDogTag() {
    w = 30; h = 52; r = 8; th = 3;
    difference() {
        linear_extrude(th) rounded_square(w, h, r);
        translate([w/2, h - 6.5, -0.1]) cylinder(r=3, h=th + 0.2, $fn=48);
    }
    if (top_text != "") translate([w/2, h*0.62, th - 0.01]) linear_extrude(0.8) text(top_text, size=3.6, halign="center", valign="center", font="Arial:style=Bold");
    if (bottom_text != "") translate([w/2, h*0.40, th - 0.01]) linear_extrude(0.8) text(bottom_text, size=3.0, halign="center", valign="center", font="Arial");
}
ClassicDogTag();`; break;

    case 28: code += `
module HexDogTag() {
    th = 3;
    module hex2d(r) { polygon(points=[for(i=[0:5]) [cos(i*60)*r, sin(i*60)*r]]); }
    difference() {
        translate([28, 30, 0]) linear_extrude(th) hex2d(24);
        translate([28, 52, -0.1]) cylinder(r=3, h=th + 0.2, $fn=40);
        translate([28, 30, -0.1]) linear_extrude(th + 0.2) hex2d(8);
    }
    if (top_text != "") translate([28, 34, th - 0.01]) linear_extrude(0.8) text(top_text, size=3.4, halign="center", valign="center", font="Arial:style=Bold");
    if (bottom_text != "") translate([28, 25, th - 0.01]) linear_extrude(0.8) text(bottom_text, size=2.8, halign="center", valign="center", font="Arial");
}
HexDogTag();`; break;

    case 29: code += `
module CapsuleDogTag() {
    w = 54; h = 28; th = 3;
    difference() {
        hull() {
            translate([h/2, h/2, 0]) cylinder(r=h/2, h=th, $fn=64);
            translate([w - h/2, h/2, 0]) cylinder(r=h/2, h=th, $fn=64);
        }
        translate([8, h/2, -0.1]) cylinder(r=3, h=th + 0.2, $fn=40);
    }
    if (top_text != "") translate([w*0.58, h*0.62, th - 0.01]) linear_extrude(0.8) text(top_text, size=3.2, halign="center", valign="center", font="Arial:style=Bold");
    if (bottom_text != "") translate([w*0.58, h*0.40, th - 0.01]) linear_extrude(0.8) text(bottom_text, size=2.6, halign="center", valign="center", font="Arial");
}
CapsuleDogTag();`; break;

    case 30: code += `
module RingSizeLadder() {
    module ring(orad, irad, h) {
        difference() {
            cylinder(r=orad, h=h, center=true, $fn=80);
            cylinder(r=irad, h=h + 0.3, center=true, $fn=80);
        }
    }
    sizes = [8, 9.5, 11, 12.5, 14];
    for (i = [0:len(sizes)-1]) {
        translate([i*24, 0, 0]) ring(sizes[i], sizes[i]-2.2, 5);
    }
}
RingSizeLadder();`; break;

    case 31: code += `
module ComfortRingTrio() {
    module comfort_ring(orad, wall, h) {
        difference() {
            union() {
                cylinder(r=orad, h=h, center=true, $fn=90);
                translate([0,0,h/2 - 0.5]) rotate_extrude($fn=90) translate([orad-0.7, 0, 0]) circle(r=0.7);
                translate([0,0,-h/2 + 0.5]) rotate_extrude($fn=90) translate([orad-0.7, 0, 0]) circle(r=0.7);
            }
            cylinder(r=orad-wall, h=h + 1, center=true, $fn=90);
        }
    }
    translate([0, 0, 0]) comfort_ring(10, 2.0, 6);
    translate([24, 0, 0]) comfort_ring(12, 2.4, 5);
    translate([50, 0, 0]) comfort_ring(14, 2.8, 4.5);
}
ComfortRingTrio();`; break;

    case 32: code += `
module BeadSamplerStrip() {
    module bead(style, d) {
        if (style == 0) sphere(d=d, $fn=60);
        if (style == 1) rotate([0,90,0]) cylinder(r=d/2, h=d, center=true, $fn=6);
        if (style == 2) hull() { translate([-d/4,0,0]) sphere(r=d/3); translate([d/4,0,0]) sphere(r=d/3); translate([0,d/4,0]) sphere(r=d/4); }
    }
    for (i=[0:4]) {
        translate([i*16, 0, 0]) {
            difference() {
                bead(i % 3, 10 + i);
                rotate([0,90,0]) cylinder(r=1.8, h=18, center=true, $fn=30);
            }
            translate([0,0,-1.2]) cube([3, 2, 1], center=true);
        }
    }
    for (i=[0:3]) translate([i*16 + 8, 0, 0]) cylinder(r=1.4, h=2.2, center=true, $fn=20);
}
BeadSamplerStrip();`; break;

    case 33: code += `
module LooseBeadSet() {
    module bead(x, y, d, fn_val) {
        translate([x, y, 0]) difference() {
            sphere(d=d, $fn=fn_val);
            rotate([0,90,0]) cylinder(r=1.6, h=d+2, center=true, $fn=24);
        }
    }
    bead(0, 0, 10, 50);
    bead(14, 0, 12, 60);
    bead(30, 0, 14, 70);
    bead(48, 0, 16, 80);
    bead(68, 0, 18, 90);
}
LooseBeadSet();`; break;

    case 50: code += `
module BobbleSpring() {
    Coil_Count = 8; Weight = 0.8; Thickness = 5; Width = 13;
    Top_Width = 1.6; Top_Height = 1.6; Bottom_Width = 0; Bottom_Height = 1.6;
    Peg_Width = 5; Peg_Length = 4;
    Inner_Width = Width - Weight * 3;
    Coil_Runs = Coil_Count * 2 + 1;
    Spring_Coil_Height = Coil_Runs * Weight * 2 + Weight;
    
    union() {
        for (index = [0:Coil_Runs + 1]) {
            translate([0, index * Weight * 2, 0]) {
                if (index == 0) {
                    cube([Width, Weight, Thickness], true);
                    translate([Width/2 - Weight/2, Weight/2, 0]) cube([Weight, Weight, Thickness], true);
                } else if(index == Coil_Runs + 1) {
                    cube([Width, Weight, Thickness], true);
                    translate([-Width/2 + Weight/2, -Weight/2, 0]) cube([Weight, Weight, Thickness], true);
                } else {
                    cube([Inner_Width, Weight, Thickness], true);
                }
            }
        }
        for (index = [0:Coil_Runs]) {
            translate([0, index * Weight * 2, 0]) {
                if (index % 2) {
                    translate([-Inner_Width/2, Weight, 0]) difference() {
                        cylinder(Thickness, Weight*3/2, Weight*3/2, true, $fn=30);
                        cylinder(Thickness + 1, Weight/2, Weight/2, true, $fn=30);
                        translate([Weight, 0, 0]) cube([Weight*2, Weight, Thickness + 1], true);
                    }
                } else {
                    translate([Inner_Width/2, Weight, 0]) difference() {
                        cylinder(Thickness, Weight * 3/2, Weight*3/2, true, $fn=30);
                        cylinder(Thickness + 1, Weight/2, Weight/2, true, $fn=30);
                        translate([-Weight, 0, 0]) cube([Weight * 2, Weight, Thickness + 1], true);
                    }
                }
            }
        }
    }
}
BobbleSpring();`; break;

    case 51: code += `
module GyroFidget() {
    Rings=5; RingWidth=2.4; MINRadius=10; Separation=0.8; Facets=60;
    Height=(MINRadius*2)-RingWidth;
    MaxRadius=MINRadius+(Rings*RingWidth)+(Rings*Separation);
    
    module Ring(Radius,Width) {
        difference() {
            sphere(r=Radius+Width,center=true,$fn=Facets);
            sphere(r=Radius,center=true,$fn=Facets);
        }
    }
    
    intersection() {
        union() {
            for(i=[0:Rings-1]) {
                Ring(MINRadius+(i*RingWidth)+(i*Separation),RingWidth);
            }
        }
        cylinder(r=MaxRadius*2,h=Height,$fn=Facets,center=true);
    }
}
GyroFidget();`; break;

    case 52: code += `
module CableHolder() {
    TABLE_HEIGHT = 24.7; DEPTH = 30; CABLE = 6; CYLINDER_HEIGHT = 12; WALL = 3; 
    CABLEWSPACE = CABLE+1.5;
    ADDSPACE = 1.5; // Simplified
    OUTER_RADIUS = CABLEWSPACE*1.8;
    WIDTH = OUTER_RADIUS*2.3;

    rotate([0,180,0]) difference() {
        union() {
            translate([TABLE_HEIGHT/2+2*WALL+CYLINDER_HEIGHT/2,0,DEPTH/2+WALL+ADDSPACE])
            rotate([0,90,0]) cylinder(h=CYLINDER_HEIGHT, r=OUTER_RADIUS, center=true, $fn=60);

            difference() {
                translate([WALL,0,WALL+ADDSPACE/2]) cube([TABLE_HEIGHT+2*WALL, WIDTH, DEPTH+ADDSPACE ], center=true);
                translate([WALL, WALL,0]) cube([TABLE_HEIGHT, WIDTH*2, DEPTH], center=true);
            }
        }
        translate([0,0,DEPTH/2+WALL+OUTER_RADIUS+ADDSPACE]) cube([(TABLE_HEIGHT+2*WALL+CYLINDER_HEIGHT)*2, WIDTH, 2*OUTER_RADIUS], center=true);
        translate([0,0,DEPTH/2+WALL+ADDSPACE]) cube([(TABLE_HEIGHT+2*WALL+CYLINDER_HEIGHT)*2, CABLEWSPACE, CABLEWSPACE*2], center=true);
    }
}
CableHolder();`; break;

    case 53: code += `
module Stretchlet() {
    r2=30; h=8; w=15; t=0.4; n=20; m=27;
    pi=3.14159;
    rr=pi*r2/n; r1=rr*1.5; ro=r2+(r1+rr)*0.5; ri=ro-h; a=pi*2*ri/m-t;
    
    module base(r1,w){
        union(){    
            cylinder(r=r2+rr*0.5,h=w, $fn=100);
            for(i=[1:n]){
                rotate([0,0,i*360/n])translate([0,-r2,0])
                scale([1,0.5,1])linear_extrude(height=w,twist=180,slices=10)
                translate([rr,0,0])circle(r=r1,$fn=20);
            }
        }
    }
    
    difference(){
        cylinder(r=ro,h=w,$fn=m);
        for(i=[1:m])rotate([0,0,i*360/m])
        translate([0,0,-0.03])linear_extrude(height=w+0.06)
        polygon(points=[[ri+t,a/2-t],[ri+t,t-a/2],[ro+t*h/a,0]],paths=[[0,1,2]]);
    }
}
Stretchlet();`; break;

    case 40: code += `
module PolyDie() {
    s = 25; 
    difference() {
        if (dice_type == 4) {
             intersection() {
                sphere(r=s*0.8, $fn=4); 
             }
        } else if (dice_type == 6) {
             cube([s, s, s], center=true);
        } else if (dice_type == 8) {
             polyhedron(
               points=[ [s,0,0], [-s,0,0], [0,s,0], [0,-s,0], [0,0,s], [0,0,-s] ],
               faces=[ [0,2,4], [0,4,3], [0,3,5], [0,5,2], [1,4,2], [1,3,4], [1,5,3], [1,2,5] ]
             );
        } else if (dice_type == 12) {
             intersection() {
                cube([s,s,s], center=true);
                rotate([45, 45, 0]) cube([s,s,s], center=true); 
                sphere(r=s/1.6, $fn=18); 
             }
        } else if (dice_type == 20) {
             p = 1.618;
             hull() {
                cube([8, s*p, s], center=true);
                rotate([90,90,0]) cube([8, s*p, s], center=true);
                rotate([90,0,90]) cube([8, s*p, s], center=true);
             }
        }
        if (top_text != "") translate([0, 0, s/2 - 0.5]) linear_extrude(1) text(top_text, size=s*0.15, halign="center", valign="center");
    }
}
PolyDie();`; break;

    case 41: code += `
module DiceTube() {
    h = 80; r = 20; wall = 3;
    if (render_mode == "assembled") {
        translate([0,0,0]) difference() {
            cylinder(r=r, h=h, $fn=60);
            translate([0,0,wall]) cylinder(r=r-wall, h=h, $fn=60);
        }
        translate([0,0,h+5]) difference() {
            cylinder(r=r+wall, h=15, $fn=60);
            translate([0,0,-1]) cylinder(r=r+0.2, h=17, $fn=60);
        }
    } else {
        difference() {
            cylinder(r=r, h=h, $fn=60);
            translate([0,0,wall]) cylinder(r=r-wall, h=h, $fn=60);
            translate([0,0,h-10]) difference() { cylinder(r=r+1, h=11); cylinder(r=r-wall, h=12); } 
        }
        translate([r*2.5, 0, 0]) difference() {
            union() { cylinder(r=r, h=5); translate([0,0,5]) cylinder(r=r-wall/2, h=10); } 
            translate([0,0,-1]) cylinder(r=r-wall-2, h=15);
        }
    }
    branding_text(wall);
}
DiceTube();`; break;

    case 42: code += `
module HexVault() {
    h = 35; r = 40;
    module hex(rad, ht) { linear_extrude(ht) circle(r=rad, $fn=6); }
    difference() {
        hex(r, h);
        translate([0,0,3]) hex(r-4, h+1);
        translate([r-2, 0, h]) cube([10, 20, 10], center=true);
        translate([-(r-2), 0, h]) cube([10, 20, 10], center=true);
    }
    translate([render_mode=="knolled"? r*2.5 : 0, 0, render_mode=="knolled"? 0 : h + 5]) difference() {
        union() { hex(r, 6); translate([0,0,-4]) hex(r-4.4, 4); }
        if (top_text != "") translate([0, 0, 5]) linear_extrude(1.2) text(top_text, size=5, halign="center", valign="center", font="Arial:style=Bold");
    }
}
HexVault();`; break;
  }
  code += `
text_tag();`;
  return code;
};

// --- MAIN COMPONENT ---
export default function TactileGenerator() {
  const [selectedDesign, setSelectedDesign] = useState(15);
  const [topText, setTopText] = useState("Rochelle Berry");
  const [bottomText, setBottomText] = useState("rochelleberry731@gmail.com");
  const [useLogo, setUseLogo] = useState(false);
  const [logoFilename, setLogoFilename] = useState("logo.svg");
  const [tagText, setTagText] = useState("574.601.5652");
  const [addTextTag, setAddTextTag] = useState(true);
  const [tagTextSize, setTagTextSize] = useState(5);
  const [tagThickness, setTagThickness] = useState(1.4);
  const [tagPadding, setTagPadding] = useState(4);
  const [diceType, setDiceType] = useState(6); // 6 Sided default
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'library' ? 'library' : 'design';
  });
  const shaderCanvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const lastHoverToneRef = useRef(0);

  // Separate designs
  const businessCards = DESIGNS.filter(d => d.category !== "Pocket Orbit" && d.category !== "Tabletop Gaming" && d.category !== "Imported Classics");
  const pocketOrbits = DESIGNS.filter(d => d.category === "Pocket Orbit");
  const tabletopItems = DESIGNS.filter(d => d.category === "Tabletop Gaming");
  const importedClassics = DESIGNS.filter(d => d.category === "Imported Classics");

  useEffect(() => {
    setGeneratedCode(
      generateSCAD(
        selectedDesign,
        topText,
        bottomText,
        logoFilename,
        useLogo,
        tagText,
        addTextTag,
        tagTextSize,
        tagThickness,
        tagPadding,
        diceType
      )
    );
  }, [selectedDesign, topText, bottomText, logoFilename, useLogo, tagText, addTextTag, tagTextSize, tagThickness, tagPadding, diceType]);

  const downloadSCAD = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "kokomo_tactile_object.scad";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied to clipboard!");
  };

  const currentDesignInfo = DESIGNS.find(d => d.id === selectedDesign);

  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return undefined;

    const vertexSrc = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSrc = `
      precision mediump float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;

      float n2(vec2 p) {
        return fract(sin(dot(p, vec2(123.4, 345.6))) * 43758.5453);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 5; i++) {
          v += a * n2(p);
          p = m * p * 1.1;
          a *= 0.5;
        }
        return v;
      }

      vec3 sceneA(vec2 uv, float t) {
        vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
        float wave = sin((p.x * 3.5) + t * 0.25) * 0.25 + cos((p.y * 4.2) - t * 0.2) * 0.2;
        float grain = fbm(p * 2.8 + t * 0.04);
        vec3 c1 = vec3(0.1, 0.4, 0.9);
        vec3 c2 = vec3(0.9, 0.1, 0.4);
        vec3 c3 = vec3(0.1, 0.9, 0.5);
        return mix(mix(c1, c2, smoothstep(-0.4, 0.5, wave + grain)), c3, smoothstep(0.55, 1.0, grain));
      }

      vec3 sceneB(vec2 uv, float t) {
        vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0) * 1.25;
        float a = atan(p.y, p.x);
        float r = length(p);
        float ring = sin(r * 12.0 - t * 0.4 + sin(a * 4.0 + t * 0.2) * 1.5);
        float haze = fbm(p * 3.6 - t * 0.03);
        vec3 c1 = vec3(0.9, 0.2, 0.8);
        vec3 c2 = vec3(0.2, 0.9, 0.9);
        vec3 c3 = vec3(0.9, 0.8, 0.1);
        return mix(mix(c1, c2, smoothstep(-1.0, 0.8, ring)), c3, smoothstep(0.45, 1.0, haze));
      }

      vec3 sceneC(vec2 uv, float t) {
        vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
        float lines = sin((p.x + p.y) * 10.0 + t * 0.2) * 0.5 + 0.5;
        float cloud = fbm(p * 4.0 + vec2(0.0, t * 0.05));
        vec3 c1 = vec3(0.1, 0.8, 0.9);
        vec3 c2 = vec3(0.5, 0.1, 0.9);
        vec3 c3 = vec3(0.9, 0.5, 0.2);
        return mix(mix(c1, c2, lines), c3, smoothstep(0.6, 1.0, cloud));
      }

      void main() {
        float t = u_time * 1.5;
        float cycle = mod(t / 12.0, 3.0);
        float k = smoothstep(0.15, 0.85, fract(cycle));
        vec3 cA = sceneA(v_uv, t);
        vec3 cB = sceneB(v_uv, t);
        vec3 cC = sceneC(v_uv, t);
        vec3 col = mix(cA, cB, k);
        if (cycle > 1.0) col = mix(cB, cC, k);
        if (cycle > 2.0) col = mix(cC, cA, k);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vShader = compile(gl.VERTEX_SHADER, vertexSrc);
    const fShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    let rafId = null;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      gl.viewport(0, 0, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (now) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    };
  }, []);

  useEffect(() => {
    const getAudioContext = () => {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtxRef.current = new Ctx();
      }
      return audioCtxRef.current;
    };

    const playTone = (freq, duration, volume, type = 'sine') => {
      const ctx = getAudioContext();
      if (!ctx || !audioUnlockedRef.current) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    };

    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state !== 'running') ctx.resume();
      audioUnlockedRef.current = true;
    };

    const onPointerOver = (event) => {
      const el = event.target instanceof Element ? event.target.closest('button, a, input[type="range"]') : null;
      if (!el) return;
      const now = performance.now();
      if (now - lastHoverToneRef.current < 70) return;
      lastHoverToneRef.current = now;
      playTone(320, 0.03, 0.005, 'sine');
    };

    const onClick = (event) => {
      const el = event.target instanceof Element ? event.target.closest('button, a') : null;
      if (!el) return;
      unlockAudio();
      playTone(760, 0.06, 0.015, 'sine');
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('pointerover', onPointerOver, true);
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('pointerover', onPointerOver, true);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  return (
    <div className="min-h-screen relative text-gray-900 text-lg font-sans selection:bg-blue-100 overflow-hidden">
      <style>{`
        .ui-surface {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
        button, a {
          transition: transform 180ms ease, box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease;
        }
        button:hover, a:hover {
          transform: translateY(-1px);
        }
        button:active, a:active {
          transform: translateY(0px) scale(0.995);
        }
      `}</style>
      <canvas ref={shaderCanvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-white/15 via-transparent to-black/10" />

      {/* Header */}
      <div className="bg-white/60 border-b border-white/50 sticky top-0 z-10 shadow-sm backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">K</div>
            <div>
              <h1 className="text-2xl font-bold text-black tracking-tight drop-shadow-sm">Tactile Object Generator</h1>
              <p className="text-sm text-gray-700 font-medium">Kokomo Art Association • Toolset</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-full text-base font-bold transition-all ${activeTab === 'library' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>SCAD Library</button>
            <button onClick={() => setActiveTab('design')} className={`px-4 py-2 rounded-full text-base font-bold transition-all ${activeTab === 'design' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>1. Design</button>
            <button onClick={() => setActiveTab('customize')} className={`px-4 py-2 rounded-full text-base font-bold transition-all ${activeTab === 'customize' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>2. Customize</button>
            <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-full text-base font-bold transition-all ${activeTab === 'preview' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>3. Live Preview</button>
            <button onClick={() => setActiveTab('export')} className={`px-4 py-2 rounded-full text-base font-bold transition-all ${activeTab === 'export' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>4. Export</button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'library' && <ScadLibraryMode />}

        {/* VIEW: DESIGN SELECTION */}
        {activeTab === 'design' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black drop-shadow-sm mb-2">Select a Concept</h2>
              <p className="text-gray-800 text-lg">Choose a functional tool or kinetic object.</p>
            </div>

            {/* Business Cards */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <Layers className="text-blue-600" size={24} />
                <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Business Cards & Tools</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessCards.map((design) => (
                  <div key={design.id} onClick={() => setSelectedDesign(design.id)} className={`cursor-pointer relative group text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-xl ${selectedDesign === design.id ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${selectedDesign === design.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                        {design.category.includes("Tactile") && <Box size={24} />} {design.category.includes("Functional") && <Settings size={24} />}
                        {design.category.includes("Kinetic") && <RefreshCw size={24} />} {design.category.includes("Slider") && <Settings size={24} />}
                      </div>
                      {selectedDesign === design.id && <div className="absolute top-4 right-4 text-blue-600"><Check size={24} /></div>}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-1">{design.name}</h3>
                    <div className="flex gap-2 mb-3"><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.category}</span><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.complexity}</span></div>
                    <p className="text-base text-gray-700 leading-relaxed font-medium">{design.description}</p>
                    {selectedDesign === design.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('customize');
                        }}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pocket Orbits */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <Shapes className="text-purple-600" size={24} />
                <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Pocket Orbits & Fidgets</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pocketOrbits.map((design) => (
                  <div key={design.id} onClick={() => setSelectedDesign(design.id)} className={`cursor-pointer relative group text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-xl ${selectedDesign === design.id ? 'border-purple-600 bg-white ring-4 ring-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${selectedDesign === design.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-purple-100 group-hover:text-purple-600'}`}><Shapes size={24} /></div>
                      {selectedDesign === design.id && <div className="absolute top-4 right-4 text-purple-600"><Check size={24} /></div>}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-1">{design.name}</h3>
                    <div className="flex gap-2 mb-3"><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.category}</span><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.complexity}</span></div>
                    <p className="text-base text-gray-700 leading-relaxed font-medium">{design.description}</p>
                    {selectedDesign === design.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('customize');
                        }}
                        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabletop Gaming */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <Dices className="text-red-600" size={24} />
                <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Tabletop Gaming</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tabletopItems.map((design) => (
                  <div key={design.id} onClick={() => setSelectedDesign(design.id)} className={`cursor-pointer relative group text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-xl ${selectedDesign === design.id ? 'border-red-600 bg-white ring-4 ring-red-50' : 'border-gray-200 bg-white hover:border-red-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${selectedDesign === design.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-red-100 group-hover:text-red-600'}`}><Dices size={24} /></div>
                      {selectedDesign === design.id && <div className="absolute top-4 right-4 text-red-600"><Check size={24} /></div>}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-1">{design.name}</h3>
                    <div className="flex gap-2 mb-3"><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.category}</span><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.complexity}</span></div>
                    <p className="text-base text-gray-700 leading-relaxed font-medium">{design.description}</p>
                    {selectedDesign === design.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('customize');
                        }}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Imported Classics */}
            <div className="mt-10 mb-20">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <ExternalLink className="text-orange-600" size={24} />
                <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Imported Classics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {importedClassics.map((design) => (
                  <div key={design.id} onClick={() => setSelectedDesign(design.id)} className={`cursor-pointer relative group text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-xl ${selectedDesign === design.id ? 'border-orange-600 bg-white ring-4 ring-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${selectedDesign === design.id ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-orange-100 group-hover:text-orange-600'}`}><ExternalLink size={24} /></div>
                      {selectedDesign === design.id && <div className="absolute top-4 right-4 text-orange-600"><Check size={24} /></div>}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-1">{design.name}</h3>
                    <div className="flex gap-2 mb-3"><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.category}</span><span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-800 font-bold">{design.complexity}</span></div>
                    <p className="text-base text-gray-700 leading-relaxed font-medium">{design.description}</p>
                    {selectedDesign === design.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('customize');
                        }}
                        className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300"
                      >
                        Next Step <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CUSTOMIZATION */}
        {activeTab === 'customize' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2"><Type className="text-blue-600" /> Customize Your Item</h2>
              </div>
              <div className="p-8 space-y-8">
                {/* Dice Specific Controls */}
                {selectedDesign === 40 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2"><Dices size={20} /> Die Configuration</h3>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-base font-bold text-red-900 block mb-2">Die Type (D{diceType})</span>
                        <div className="flex gap-2 flex-wrap">
                          {[4, 6, 8, 10, 12, 20].map((val) => (
                            <button
                              key={val}
                              onClick={() => setDiceType(val)}
                              className={`px-4 py-2 rounded-lg font-bold border transition-colors ${diceType === val ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'}`}
                            >
                              D{val}
                            </button>
                          ))}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-base text-blue-900">
                      <p className="font-bold mb-1">Text Controls Across All Objects</p>
                      <p>Top and bottom text apply directly on compatible models. The text tag add-on works with every design and prints as a separate piece in the same SCAD file.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block"><span className="text-lg font-bold text-gray-900 block mb-2">Top Edge Text</span><input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="E.g., Rochelle Berry" /></label>
                  <label className="block"><span className="text-lg font-bold text-gray-900 block mb-2">Bottom Edge Text</span><input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" placeholder="E.g., rochelleberry731@gmail.com" /></label>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-lg font-bold text-gray-900">Use SVG Logo?</span><button onClick={() => setUseLogo(!useLogo)} className={`w-12 h-6 rounded-full transition-colors relative ${useLogo ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${useLogo ? 'translate-x-6' : 'translate-x-0'}`} /></button></div>
                  {useLogo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-3"><Info className="text-blue-600 shrink-0 mt-0.5" size={18} /><div className="text-base text-blue-900"><p className="font-bold mb-1">How Logo Import Works:</p><p className="mb-3">OpenSCAD cannot read images directly from the web. You must have the SVG file saved on your computer.</p><label className="block mb-2 font-bold text-blue-900">Enter your SVG Filename:</label><input type="text" value={logoFilename} onChange={(e) => setLogoFilename(e.target.value)} className="w-full px-3 py-2 rounded border border-blue-300 bg-white text-gray-800 text-sm mb-2" placeholder="logo.svg" /><p className="text-sm text-blue-800">Ensure this file is in the same folder as the downloaded .scad file.</p></div></div>
                    </div>
                  )}
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-lg font-bold text-gray-900">Add Printable Text Tag</span><button onClick={() => setAddTextTag(!addTextTag)} className={`w-12 h-6 rounded-full transition-colors relative ${addTextTag ? 'bg-green-600' : 'bg-gray-300'}`}><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${addTextTag ? 'translate-x-6' : 'translate-x-0'}`} /></button></div>
                  {addTextTag && (
                    <div className="grid grid-cols-1 gap-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <label className="block"><span className="text-lg font-bold text-green-950 block mb-2">Tag Text</span><input type="text" value={tagText} onChange={(e) => setTagText(e.target.value.toUpperCase())} className="w-full px-4 py-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none bg-white" placeholder="574.601.5652" /></label>
                      <label className="block"><span className="text-lg font-bold text-green-950 block mb-2">Text Size ({tagTextSize} mm)</span><input type="range" min="3" max="10" step="0.5" value={tagTextSize} onChange={(e) => setTagTextSize(Number(e.target.value))} className="w-full" /></label>
                      <label className="block"><span className="text-lg font-bold text-green-950 block mb-2">Tag Thickness ({tagThickness} mm)</span><input type="range" min="1" max="3" step="0.2" value={tagThickness} onChange={(e) => setTagThickness(Number(e.target.value))} className="w-full" /></label>
                      <label className="block"><span className="text-lg font-bold text-green-950 block mb-2">Tag Padding ({tagPadding} mm)</span><input type="range" min="2" max="8" step="1" value={tagPadding} onChange={(e) => setTagPadding(Number(e.target.value))} className="w-full" /></label>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
                <button onClick={() => setActiveTab('preview')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-all flex items-center gap-2">Next: Live Preview <Eye size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-200px)] min-h-[600px] flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-black flex items-center gap-2"><Eye className="text-purple-600" size={20} /> Live 3D Preview</h3>
                <p className="text-gray-600 text-sm">Real-time local rendering via WebAssembly.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 flex flex-col items-end">
                  <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">Current Design</span>
                  <span className="text-sm font-bold text-purple-900">{currentDesignInfo.name}</span>
                </div>
                <button onClick={() => setActiveTab('export')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2">
                  Looks Good! Export <Check size={18} />
                </button>
              </div>
            </div>

            <div className="flex-grow rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
              <SCADViewer code={generatedCode} />
            </div>
          </div>
        )}

        {/* VIEW: EXPORT */}
        {activeTab === 'export' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-black mb-4 flex items-center gap-2"><Printer className="text-green-600" size={20} /> Printing Instructions</h3>
                <ol className="space-y-4 text-base text-gray-800 list-decimal list-outside pl-4">
                  <li><strong>Download</strong> the .scad file using the button below.</li>
                  <li><strong>Download OpenSCAD</strong> (free) from openscad.org if you do not have it.</li>
                  <li><strong>Move</strong> your <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">{logoFilename}</code> into the same folder (if using a logo).</li>
                  <li><strong>Open</strong> the .scad file.</li>
                  <li>Press <strong>F6</strong> to Render.</li>
                  <li>Go to <strong>File &gt; Export &gt; Export as STL</strong>.</li>
                  <li>Slice & Print! (0.2mm layer height recommended).</li>
                </ol>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-950 mb-2">Selected Design</h4>
                <p className="text-blue-900 text-xl font-bold mb-1">{currentDesignInfo.name}</p>
                <p className="text-base text-blue-800 mb-4">{currentDesignInfo.description}</p>
                <button onClick={downloadSCAD} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"><Download size={18} /> Download .SCAD</button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                  <span className="text-gray-400 text-sm font-mono flex items-center gap-2"><FileCode size={14} /> kaa_object.scad</span>
                  <button onClick={copyToClipboard} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"><Copy size={14} /> Copy Code</button>
                </div>
                <div className="p-4 overflow-auto flex-1"><pre className="font-mono text-sm text-green-400 leading-relaxed whitespace-pre-wrap">{generatedCode}</pre></div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
