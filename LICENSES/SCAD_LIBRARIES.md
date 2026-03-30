# SCAD Library Compatibility Files

This folder contains compatibility shims and vendored helper files for browser preview support in this repository.

## Included Paths

- `assets/scad-vendor/utils/build_plate.scad`
- `assets/scad-vendor/utils/hsvtorgb.scad`
- `assets/scad-vendor/write/Write.scad`
- `assets/scad-vendor/write.scad`
- `assets/scad-vendor/MCAD/involute_gears.scad`
- `assets/scad-vendor/MCAD/triangles.scad`
- `assets/scad-vendor/MCAD/fonts.scad`
- `assets/scad-vendor/threads.scad`
- `assets/scad-vendor/text_on.scad`

## Notes

- These files are lightweight compatibility implementations intended to unblock in-browser OpenSCAD previews.
- They are **not** complete replacements for full upstream libraries.
- Some geometry behavior may differ from upstream `Write.scad`, `MCAD`, and thread/text helper implementations.
