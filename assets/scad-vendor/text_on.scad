// Minimal text_on compatibility shim.
module text_extrude(txt="", size=4, extrusion_height=1, center=true, font="") {
  linear_extrude(height=extrusion_height)
    text(text=txt, size=size, halign=center ? "center" : "left", valign="center", font=font);
}
