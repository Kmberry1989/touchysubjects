bus_card_height = 52;
bus_card_width = 90;
bus_card_thickness = .5;
slop = 2;
top_exposure = 10;
num_cards = 100;
wall_thickness = 5;
slot_width = 20;
$fn = 50;

holder_width = bus_card_width + slop + 2*wall_thickness;
holder_depth = num_cards * bus_card_thickness + 2*wall_thickness;
holder_height = wall_thickness + bus_card_height - top_exposure;
cutout_width = bus_card_width + slop;
cutout_depth = num_cards * bus_card_thickness;
cutout_height = bus_card_height;

filler_width = bus_card_width;
filler_depth = (num_cards / 2) * bus_card_thickness;
filler_height = holder_height - wall_thickness;
filler_protrude_height = wall_thickness;
filler_protrude_width = holder_width;

%difference(){
difference() {
translate([-holder_width/2,-holder_depth/2,0])
minkowski(){
cube([holder_width, holder_depth, holder_height]);
    cylinder(h=2,r=2);
}
translate([-cutout_width/2,-cutout_depth/2,wall_thickness])
cube([cutout_width,cutout_depth,cutout_height]);
}

union(){
translate([0,0,wall_thickness+slot_width/2])
rotate([90,0,0])
cylinder(holder_depth, d=slot_width, false);
translate([-slot_width/2,-holder_depth,wall_thickness+slot_width/2])
cube([slot_width,holder_depth,holder_height]);
}
}

union(){
translate([-filler_width/2,0,wall_thickness+slop])
cube([filler_width,filler_depth,filler_height]);
translate([-filler_protrude_width/2,2,filler_height+wall_thickness+slop])
minkowski(){
cube([filler_protrude_width,filler_depth-4,filler_protrude_height]);
    cylinder(h=2,r=2);
}
}