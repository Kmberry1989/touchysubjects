// Configurable values

Coil_Count = 8; // [4:1:20]
Weight = 0.8; // [0.6:0.2:1.6]
Thickness = 5; // [5:1:10]
Width = 13; // [10:1:30]

Top_Width = 1.6; // [0:0.2:3]
Top_Height = 1.6; // [0:0.2:20]

Bottom_Width = 0; // [0:0.2:3]
Bottom_Height = 1.6; // [0:0.2:20]

Peg_Width = 5; // [0:0.2:5]
Peg_Length = 4; // [0:0.2:6]

Parts = "Spring"; //["Spring", "Assembly Tool", "All Parts"]
Tool_Height = 120; //[120:1.0:240]

// Fixed values
$fn = 30 + 0;
Assembly_Tool_Clearance = 0.25 + 0;

// Calculated values
Inner_Width = Width - Weight * 3;
Coil_Runs = Coil_Count * 2 + 1;

// Assembly tool values
Spring_Coil_Height = Coil_Runs * Weight * 2 + Weight;
Spring_Total_Height = Spring_Coil_Height + Top_Height + Bottom_Height;

Assembly_Tool_Offset_X = 0 + 0;
Assembly_Tool_Offset_Y = Spring_Coil_Height + 0;
Assembly_Tool_Offset_Z = 0 + 0;
Assembly_Tool_Wall_Thickness = 4 + 0;

if (Parts == "Spring" || Parts == "All Parts") {

  union() {

    // Generate both ends of spring.
    for (index = [0:Coil_Runs + 1]) {
      translate([0, index * Weight * 2, 0]) {
        if (index == 0) {
          cube([Width, Weight, Thickness], true);
          // Smooth out the transition between the first coil and the bottom cap.
          translate([Width/2 - Weight/2, Weight/2, 0]) {
            cube([Weight, Weight, Thickness], true);
          }
        }
        else if(index == Coil_Runs + 1) {
          cube([Width, Weight, Thickness], true);
          // Smooth out the transition between the last coil and the top cap.
          translate([-Width/2 + Weight/2, -Weight/2, 0]) {
            cube([Weight, Weight, Thickness], true);
          }
        } else {
          cube([Inner_Width, Weight, Thickness], true);
        }
      }
    }
   
    // Generate middle of spring.
    for (index = [0:Coil_Runs]) {
      translate([0, index * Weight * 2, 0]) {
        if (index % 2) {
          translate([-Inner_Width/2, Weight, 0]) {
            difference() {
              cylinder(Thickness, Weight*3/2, Weight*3/2, true);
              cylinder(Thickness + 1, Weight/2, Weight/2, true);
              translate([Weight, 0, 0]) {
                cube([Weight*2, Weight, Thickness + 1], true);
              }
            }
          }
        } else {
          translate([Inner_Width/2, Weight, 0]) {
            difference() {
              cylinder(Thickness, Weight * 3/2, Weight*3/2, true);
              cylinder(Thickness + 1, Weight/2, Weight/2, true);
              translate([-Weight, 0, 0]) {
                cube([Weight * 2, Weight, Thickness + 1], true);
              }
            }
          }
        }
      }
    }
  
    // Generate top peg.
    translate([0, (Coil_Runs + 1) * Weight * 2 + Top_Height + Peg_Length/2 - Weight/2 - 0.01, 0]) {
      difference() {
        cube([Peg_Width, Peg_Length, Peg_Width], true);
        translate([-Peg_Width/2, Peg_Length/2, 0]) {
          rotate(45) {
            cube([2, 2, Peg_Width + 1], true);
          }
        }
        translate([Peg_Width/2, Peg_Length/2, 0]) {
          rotate(45) {
            cube([2, 2, Peg_Width + 1], true);
          }
        }
      }
    }

    // Generate top of spring.
    translate([0, (Coil_Runs + 1) * Weight * 2 + Top_Height/2 - Weight/2, 0]) {
      cube([Width + Top_Width * 2, Top_Height, Thickness], true);
    }

    // Generate bottom of spring.
    translate([0, - Bottom_Height/2 + Weight/2, 0]) {
      cube([Width + Bottom_Width * 2, Bottom_Height, Thickness], true);
    }

    // Generate bottom peg.
    translate([0, - Bottom_Height - Peg_Length/2 + Weight/2 + 0.01, 0]) {
      difference() {
        cube([Peg_Width, Peg_Length, Peg_Width], true);
        translate([-Peg_Width/2, -Peg_Length/2, 0]) {
          rotate(45) {
            cube([2, 2, Peg_Width + 1], true);
          }
        }
        translate([Peg_Width/2, -Peg_Length/2, 0]) {
          rotate(45) {
            cube([2, 2, Peg_Width + 1], true);
          }
        }
      }
    }

  }

}

if (Parts == "Assembly Tool" || Parts == "All Parts") {

  translate([Assembly_Tool_Offset_X, Assembly_Tool_Offset_Y - Weight, Assembly_Tool_Offset_Z]) {

    difference() {
      
      Tool_Width = Width + Assembly_Tool_Wall_Thickness*2;
      Tool_Thickness = Thickness + Assembly_Tool_Wall_Thickness*2;

      // Form main tool case.
      translate([0, 0, 0]) {
        cube([Tool_Width, Tool_Height, Tool_Thickness], true);
      }

      // Chamfer main tool case.
      translate([Tool_Width/2, 0, Tool_Thickness/2]) {
        rotate([0, 45, 0]) {
          cube([Assembly_Tool_Wall_Thickness, Tool_Height, Assembly_Tool_Wall_Thickness], true);
        }
      }
      translate([Tool_Width/2, 0, -Tool_Thickness/2]) {
        rotate([0, 45, 0]) {
          cube([Assembly_Tool_Wall_Thickness, Tool_Height, Assembly_Tool_Wall_Thickness], true);
        }
      }
      translate([-Tool_Width/2, 0, -Tool_Thickness/2]) {
        rotate([0, 45, 0]) {
          cube([Assembly_Tool_Wall_Thickness, Tool_Height, Assembly_Tool_Wall_Thickness], true);
        }
      }
      translate([-Tool_Width/2, 0, Tool_Thickness/2]) {
        rotate([0, 45, 0]) {
          cube([Assembly_Tool_Wall_Thickness, Tool_Height, Assembly_Tool_Wall_Thickness], true);
        }
      }
      
      // Remove Top of tool case.
      translate([0, Tool_Height/2, 0]) {
        cube([Width + Assembly_Tool_Wall_Thickness*2 + 1, Tool_Height, Thickness + Assembly_Tool_Wall_Thickness*2 + 1], true);
      }

      union() {

        // Create void for spring body in assembly tool.
        cube([Width + Assembly_Tool_Clearance*2, Spring_Coil_Height*2 + Bottom_Height*2 + Assembly_Tool_Clearance*2, Thickness + Assembly_Tool_Clearance*2], true);

        // Create void for spring peg in assembly tool.
        cube([Peg_Width + Assembly_Tool_Clearance*2, Tool_Height + 1, Peg_Width + Assembly_Tool_Clearance*2], true);

      }
 
    }
  }
}

