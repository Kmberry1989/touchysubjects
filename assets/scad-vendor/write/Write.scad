// Minimal Write.scad compatibility shim.
module write(text="", t=1, h=10, font="", space=1, center=false) {
  linear_extrude(height=t)
    text(
      text=text,
      size=h,
      spacing=space,
      halign=center ? "center" : "left",
      valign="center"
    );
}
