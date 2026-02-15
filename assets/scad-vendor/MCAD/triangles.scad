// Minimal MCAD triangles shim.
module Right_Angled_Triangle(a=10, b=10, h=1) {
  linear_extrude(height=h)
    polygon(points=[[0,0],[a,0],[0,b]]);
}
