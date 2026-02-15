// Minimal metric_thread compatibility shim.
module metric_thread(diameter=8, pitch=1, length=10, internal=false) {
  cylinder(h=length, r=diameter/2, $fn=48);
}
