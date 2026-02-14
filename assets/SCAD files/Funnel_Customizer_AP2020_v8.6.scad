// This script generates custom funnels
// Alberto Pierobon 
// v5.0 9/2016
// v7.0 7/2017
// v8.0 4/2020 - added handle overhang
// v8.1 4/2020 - added offset spout, angled spout
// v8.2 4/2020 - improved vent in offset spout
// v8.3 4/2020 - fixed a bug with slanted tip
// v8.4 4/2020 - made angled spout not available with non-offset spout
// v8.5 6/2020 - made vent projection customizable
// v8.6 10/2020 - added on option to change the handle angular position

/*[Size and shape]*/
top_diameter    = 120; // [5:1:200]
middle_diameter =  40; // [5:1:200]
bottom_diameter =  18; // [5:1:80]
height          = 160; // [20:1:300]
wall            =   3; // [1:0.05:10]
neck_ratio      =   1.6; // [1:0.05:3]
squish_ratio    =   1;   // [1:0.05:2]
offset_spout    = "no";  // [yes, no]
angled_spout    = "no";   // [no, yes]

/*[Optional features]*/
handle_length   = 1.5;    // [0:0.5:8]
handle_overhang = 1;      // [1:0.5:5]
handle_position_angle = 0;// [0:90:270]
create_vent     = "yes";  // [yes, no]
vent_projection = 10;     // [1:1:20]
high_wall       = "yes";  // [yes, no]
slanted_tip     = "yes";  // [yes, no]

rotate([0,0,180])
funnel();

module funnel()
{
    spout_distortion = angled_spout == "yes" ?  (top_diameter-bottom_diameter)/(2*height) : 0;
    
    spout_offset = ((offset_spout == "yes")||(angled_spout == "yes")) ?  (top_diameter-middle_diameter)/2 : 0;
   
    neck_offset = ((offset_spout == "yes")||(angled_spout == "yes")) ?  (middle_diameter-bottom_diameter)/2 : 0;
    
    echo (neck_offset);
    echo ((offset_spout == "yes")||(angled_spout == "yes"));
    
    mtrans_x = [ [1, 0, spout_distortion,  0],
                 [0, 1, 0,  0],
                 [0, 0, 1,  0],
                 [0, 0, 0,  1]
               ];
    
    mtrans_minusx = [ [1, 0, -spout_distortion,  0],
                 [0, 1, 0,  0],
                 [0, 0, 1,  0],
                 [0, 0, 0,  1]
               ];
    
    scale([1,1/squish_ratio,1])  
    multmatrix(mtrans_x)
    difference()
        {
            union()
            {
                base_funnel(0,height,neck_ratio,spout_offset, neck_offset);   //external shell
                if(create_vent == "yes") vent(spout_offset, neck_offset,vent_projection); //create the vent ribs
                
                if(handle_length > 0)     // add the handle if required
                multmatrix(mtrans_minusx)
                handle(handle_length, handle_overhang);

            }
        
            translate([0,0,-height/5000])
                base_funnel(wall, height+wall/5,neck_ratio,spout_offset,neck_offset); //hollow internal part of the funnel 
            if (slanted_tip=="yes") //cut out slanted tip
            {
                alpha_tip       = min([atan(height/(top_diameter-bottom_diameter)),35]);
                translate([spout_offset+neck_offset-bottom_diameter/2,0,height+0.5*height/cos(alpha_tip)]) rotate([0,alpha_tip,0])
                cube([5*top_diameter,5*top_diameter,height],center=true); 
            }

    }
}

module base_funnel(wall=0, height=100, neck_ratio=1, spout_offset=0, neck_offset=0)
// Solid funnel

{
    if(high_wall == "no") 
    {   
        $fn=max([top_diameter,100]); 
        hull(){
         cylinder(d1=top_diameter-2*wall, d2=top_diameter-2*wall,h=height/10000);
            translate([spout_offset,0,height/(2*neck_ratio)])         cylinder(d1=middle_diameter-2*wall, d2=middle_diameter-2*wall, h=height/10000) ;
        }
        
        
        translate([spout_offset,0,height/(2*neck_ratio)-wall/50]) {
            $fn=max([top_diameter,100]);
        hull(){
         cylinder(d1=middle_diameter-2*wall, d2=middle_diameter-2*wall, height/1000);
         translate([neck_offset,0,height*(1-1/(2*neck_ratio))+wall/20])         cylinder(d1=bottom_diameter-2*wall, d2=bottom_diameter-2*wall, height/1000) ;
         } 
     }
        
        
    }
    else
    {   
        cylinder(d=top_diameter-2*wall, height*1/(3*neck_ratio)-wall/100, $fn=max([top_diameter,100]));
        translate([0,0,height*1/(3*neck_ratio)-wall/50]) 
            
            
            {   
        $fn=max([top_diameter,100]); 
        hull(){
         cylinder(d1=top_diameter-2*wall, d2=top_diameter-2*wall,h=height/10000);
            translate([spout_offset,0,height*1/(3*neck_ratio)+wall/50])         cylinder(d1=middle_diameter-2*wall, d2=middle_diameter-2*wall, h=height/10000) ;
                }

            
            }
        translate([spout_offset,0,height*2/(3*neck_ratio)-wall/100]) {
            $fn=max([top_diameter,100]);
            hull(){
         cylinder(d1=middle_diameter-2*wall, d2=middle_diameter-2*wall, height/1000);
         translate([neck_offset,0,height*(1-2/(3*neck_ratio))+wall/5])         cylinder(d1=bottom_diameter-2*wall, d2=bottom_diameter-2*wall, height/1000) ;
         };
            
     }  
            
            
            
//            cylinder(d1=middle_diameter-2*wall, d2=bottom_diameter-2*wall, height*(1-2/(3*neck_ratio))+wall/5, $fn=max([top_diameter,100]));
   }
}


module handle(handle_length=1,handle_overhang=1)
// add a handle to hang the funnel on a rim, or by a hole
{
    handle_size = max([top_diameter/5,3*wall]);
    rotate([0,0,handle_position_angle])
    translate([-top_diameter/2-handle_overhang*handle_size/2,handle_size/2,2*wall]) rotate([90,0,0])
        difference()
        {
            union()
            {
                difference()
                {
                    translate([wall,wall,0]) cylinder(h=handle_size, r=3*wall,$fn=20);
                    translate([-2*wall,wall,-0.5*wall]) cube([2*handle_size,handle_length*handle_size,handle_size+wall]);
                    
                }
                translate([-2*wall,wall,0]) cube([handle_size,handle_length*handle_size/(1.72),handle_size]);
                translate([wall,-2*wall,0]) cube([handle_size/2+2*wall+handle_overhang*handle_size,handle_size,handle_size]);
               hull()
                {
                    translate([-2*wall,handle_length*handle_size/(1.72)+wall,handle_size-handle_size/8]) rotate([90,0,90]) cylinder(h=2*wall+wall/10,d=handle_size/4,$fn=20);
                    translate([-2*wall,handle_length*handle_size/(1.72)+wall,handle_size/8]) rotate([90,0,90]) cylinder(h=2*wall+wall/10,d=handle_size/4,$fn=20);
                }
            }
            translate([-wall/20,0,-wall/20]) 
            union()
            {
                translate([wall,wall,0]) cylinder(h=handle_size+wall/10, r=wall,$fn=20);
                translate([0,wall,0]) cube([handle_size,handle_length*handle_size+wall/2,handle_size+wall/10]);
                
                translate([-2*wall,handle_length*handle_size+wall/2,0]) cube([2*handle_size,handle_length*handle_size+wall/2,handle_size+wall/10]);
                
                translate([wall,0,0]) cube([handle_size+wall/10+handle_overhang*handle_size,handle_size,handle_size+wall/10]);

                translate([handle_size/3.5,-wall/10+0.5*wall,handle_size/2]) rotate([90,0,0]) cylinder(h=2.5*wall,d=handle_size/3);
                translate([-wall/10+0.5*wall,handle_length*handle_size/3,handle_size/2]) rotate([90,0,-90]) cylinder(h=2.5*wall,d=handle_size/3);
            }
        }

}

module vent(spout_offset=0, neck_offset=0, vent_projection = max([wall,middle_diameter/6]) )
// generate vent buttresses
{
    vent_size = min([wall,bottom_diameter]);
    //vent_projection = max([wall,middle_diameter/6]);
    alpha_rep = spout_offset == 0 ? [0,60,120,180,240,300] : [120,180,240];
    mtrans_x = [ [1, 0, neck_offset/height,  0],
                 [0, 1, 0,  0],
                 [0, 0, 1,  0],
                 [0, 0, 0,  1]
               ];
    translate([spout_offset,0,0]) 
    
    for(alpha=alpha_rep)
    {   
        multmatrix(mtrans_x)
        rotate([0,0,alpha])
        if (high_wall == "yes")
        {
               
              hull()
                {
                    // bottom of funnel high walls
                    translate([0,-vent_size/2,height-wall/4]) cube([bottom_diameter/2,vent_size,wall/20]);
                    // middle of funnel
                    translate([0,-vent_size/2,2*height/(3*neck_ratio)]) cube([middle_diameter/2+vent_projection,vent_size,wall/20]);
                }
                hull()
                {
                    // middle of funnel high walls
                    translate([0,-vent_size/2,2*height/(3*neck_ratio)]) cube([middle_diameter/2+vent_projection,vent_size,wall/20]);
                    // top of funnel high walls
                    translate([0,-vent_size/2,height/(3*neck_ratio)]) cube([top_diameter/2-1.5*wall,vent_size,wall/20]);
                }
        }
        else  
        {
            hull()
            {
                // bottom of funnel 
                translate([0,-vent_size/2,height-wall/4]) cube([bottom_diameter/2,vent_size,wall/20]);
                // middle of funnel
                translate([0,-vent_size/2,height/(2*neck_ratio)]) cube([middle_diameter/2+vent_projection,vent_size,wall/20]);
            }
            hull()
            {
                // middle of funnel
                translate([0,-vent_size/2,height/(2*neck_ratio)]) cube([middle_diameter/2+vent_projection,vent_size,wall/20]);
                // top of funnel
                translate([0,-vent_size/2,0]) cube([top_diameter/2-1.5*wall,vent_size,wall/20]);
            }

        }
     }
 }         
    