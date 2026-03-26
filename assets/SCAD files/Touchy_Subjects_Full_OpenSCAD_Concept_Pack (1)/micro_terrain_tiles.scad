
include <common.scad>

/*
Micro Terrain Tiles
Three interlocking desk tiles with varied textures.
*/
tile = 34;
th = 5;
gap = 8;

module tile_blank() {
    difference() {
        rounded_cube(size=[tile,tile,th], r=4, center=true);
        for (sx=[-1,1]) translate([sx*tile/2,0,0]) cylinder(h=th+1, d=6, center=true);
        for (sy=[-1,1]) translate([0,sy*tile/2,0]) cylinder(h=th+1, d=6, center=true);
    }
}

module terrain(style="pebble") {
    tile_blank();
    intersection() {
        rounded_cube(size=[tile,tile,th], r=4, center=true);
        if (style=="pebble")
            translate([0,0,-th/2]) pebble_texture_band(d=tile*0.9, h=th+1, pebble_d=2.4, radial=0.5, rows=3, cols=16);
        else if (style=="ripple")
            translate([0,0,-th/2]) ripple_band(d=tile*0.92, h=th+1, waves=8, amp=1.2, thickness=1.2);
        else
            for (i=[-3:3]) translate([i*4,0,0]) cube([1.3,tile*0.8,th], center=true);
    }
}

translate([-(tile+gap),0,0]) terrain("pebble");
translate([0,0,0]) terrain("ripple");
translate([tile+gap,0,0]) terrain("grid");
