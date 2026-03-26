# Touchy Subjects - Concept OpenSCAD Pack

This pack includes parametric OpenSCAD concept models for the product directions discussed:

- Slap-on grip bracelet / utensil wrap
- Water bottle grip sleeve / cozy / coaster
- Emergency pill pendant - threaded
- Emergency pill pendant - bayonet lock
- Emergency pill pendant - hinged latch

## Files

- `common.scad` - shared helpers and texture modules
- `slap_grip_bracelet.scad`
- `water_bottle_sleeve.scad`
- `pill_pendant_threaded.scad`
- `pill_pendant_bayonet.scad`
- `pill_pendant_hinged.scad`

## Install

1. Install OpenSCAD:
   - Windows: https://openscad.org/downloads.html
   - macOS: https://openscad.org/downloads.html
   - Linux: your distro package manager or the official download

## Build / Preview

Open any `.scad` file in OpenSCAD and press:
- `F5` for preview
- `F6` for full render

For CLI export:

```bash
openscad -o slap_grip_bracelet.stl slap_grip_bracelet.scad
openscad -o water_bottle_sleeve.stl water_bottle_sleeve.scad
openscad -o pill_pendant_threaded.stl pill_pendant_threaded.scad
openscad -o pill_pendant_bayonet.stl pill_pendant_bayonet.scad
openscad -o pill_pendant_hinged.stl pill_pendant_hinged.scad
```

## Suggested Print Strategy

### Slap grip bracelet
- Print the outer shell in TPU if printing a flexible concept sleeve
- For a functional slap mechanism, use the printed sleeve as an overmold and add a separate spring-steel insert after printing
- Suggested concept tolerances:
  - insert slot clearance: `0.4 mm`
  - snap core thickness target: `0.20 to 0.35 mm` metal strip

### Water bottle sleeve
- TPU is ideal for the final sleeve
- For rigid concept mockups, PLA/PETG is fine
- Start with:
  - 0.20 mm layer height
  - 3 perimeters
  - 15 to 25 percent gyroid if using a rigid shell concept

### Pill pendants
- PETG, ASA, nylon, resin, or machined metal are better than PLA for final-use development
- Printed threads should be test-fit and tuned per printer
- Start with:
  - 0.12 to 0.20 mm layer height
  - 4 to 5 perimeters
  - 100 percent infill for tiny parts

## Notes

These are concept-forward files aimed at rapid iteration. Before real medical or daily-carry use, validate:
- closure retention
- moisture sealing
- pill compatibility
- skin-contact material safety
- accidental opening resistance
- child-resistance requirements, if relevant
