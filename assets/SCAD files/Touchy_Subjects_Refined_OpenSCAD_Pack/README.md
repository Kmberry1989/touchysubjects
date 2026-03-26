# Touchy Subjects Refined OpenSCAD Pack

This pack contains tolerance-aware, print-split concept models for a first production pass.

## Included models
- common_refined.scad
- orbit_pebble_refined.scad
- reset_dial_refined.scad
- silent_flex_bar_refined.scad
- universal_grip_sleeve_refined.scad
- anchor_cuff_refined.scad
- dose_halo_pendant_refined.scad
- dock_pebble_system_refined.scad
- zipper_bloom_refined.scad
- cap_commander_refined.scad

## Install
1. Install OpenSCAD.
2. Open any `.scad` file in OpenSCAD.
3. Keep `common_refined.scad` in the same folder.

## Export workflow
1. Set the `part` or `mode` variable at the top of the file.
2. Render with F6.
3. Export STL.

## Recommended starting tolerances
- PLA to PLA moving/slip fit: 0.25 to 0.35 mm radial clearance
- PLA press fit: 0.10 to 0.18 mm radial clearance
- PLA thread clearance: 0.20 to 0.30 mm
- TPU captured parts: add 0.35 to 0.50 mm

## AD5X first-pass print guidance
- Layer height: 0.20 mm for general parts, 0.16 mm for pendant threads/dial details
- Walls: 4
- Top/bottom: 5 to 6
- Infill: 15 to 25 percent gyroid
- PETG or PLA for rigid shells; TPU 95A for liners/grip shells where relevant
- Print small threaded caps vertically
- Print split shells flat on their cut face
- Use elephant-foot compensation for fitted parts

## Notes
- These are refined concept models, not medically validated devices.
- Threads are simplified and should be test-printed and tuned on your machine.
- For captured metal weights or magnets, pause the print or split the part and glue closed after insertion.
