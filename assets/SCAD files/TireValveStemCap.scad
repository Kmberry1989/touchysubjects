// Tire valve stem caps with text labels

// See https://github.com/brodykenrick/text_on_OpenSCAD/
use <text_on.scad>
// See https://dkprojects.net/openscad-threads
use <threads.scad>

// Internal diameter
int_dia=4.1;
// Outer diameter
out_dia=5.1;
// Cap height
cap_height=11;
// Threadless gap height
threadless_height=2.0;
// Cap chamfer height
cap_chamfer_height=0.4;
// Number of handle bars
n_handles=24;
// Handle width
handle_width=.5;
// Handle outer diameter
handle_out_dia=5.4;
// Text extrusion depth
text_depth=1.0;
// Text size
text_size=4.7;
// Cap label texts
texts = ["RL", "FL", "RR", "FR"];

for ( cap_idx = [0 : len(texts)-1] )
{
    translate([floor(cap_idx / 2) * 3 * out_dia,
               (cap_idx % 2) * 3 * out_dia,
               0])
    difference()
    {
        union()
        {
            // Main body
            cylinder(cap_height, out_dia, out_dia, $fs=.25);
            // Chamfet at top
            translate([0,0,cap_height])
                cylinder(cap_chamfer_height,
                         out_dia,
                         out_dia - cap_chamfer_height, 
                         $fs=.25);
            // Handles
            for ( i = [0 : n_handles-1] )
            {
                 translate([0,0,1])
                    rotate( i * 360 / n_handles, [0, 0, 1])
                    cube([handle_out_dia, handle_width, cap_height - 2]);
            }
        }
        
        
        translate([0,0,cap_height+cap_chamfer_height])
            text_extrude(texts[cap_idx],
                        size=text_size,
                        extrusion_height=text_depth,
                        center=true,
                        font="RobotoCondensedBold");
        
        union()
        {
            // Threadless internals
            translate([0,0,-0.1])
                cylinder(threadless_height, int_dia, int_dia);
            // Internal thread
            translate([0,0,threadless_height-0.2])
                metric_thread(diameter=int_dia*2,
                              pitch=0.794,
                              length=cap_height-3,
                              internal=true);
        }
    }
}