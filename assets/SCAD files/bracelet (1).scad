// --- Parameters ---
h = 16;
r_out = 36;
r_in = 34.5;
b = 0.5; 
$fn = 150;

// --- Text & Typography Parameters ---
label_1 = "I love BOOBIES";
label_2 = "<3";
font_name = "Cooper Black:style=Regular"; 
text_sz = 10;
spacing = 0.9;         

// Updated to 1/3 of the wall thickness
wall_thickness = r_out - r_in;
engrave_depth = wall_thickness / 3;

module bracelet_body() {
    rotate_extrude() {
        polygon(points=[
            [r_in + b, 0], [r_out - b, 0], [r_out, b],
            [r_out, h - b], [r_out - b, h], [r_in + b, h],
            [r_in, h - b], [r_in, b]
        ]);
    }
}

module wrapped_text(txt, angle_offset) {
    step_angle = (text_sz * spacing) / r_out * (180 / PI);
    total_angle = step_angle * (len(txt) - 1);
    
    rotate([0, 0, angle_offset - (total_angle / 2)])
    for (i = [0 : len(txt) - 1]) {
        rotate([0, 0, i * step_angle])
        // We move to r_out and then "sink" in by the engrave_depth
        translate([r_out - engrave_depth, 0, h/2])
        rotate([90, 0, 90])
        // Extrude slightly past the surface (adding 0.1) for a clean cut
        linear_extrude(height = engrave_depth + 0.1)
            text(txt[i], size = text_sz, halign = "center", valign = "center", font = font_name);
    }
}

// --- Final Render ---
difference() {
    bracelet_body();
    wrapped_text(label_1, 0);   
    wrapped_text(label_2, 180); 
}
