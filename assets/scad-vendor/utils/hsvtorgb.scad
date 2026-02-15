// Basic HSV->RGB helper used by customizable_tree_v1.0.scad
function _hsvc(n, h, s, v) = v - v*s*max(min(min((n + h/60) % 6, 4 - (n + h/60) % 6), 1), 0);
function hsvToRGB(h, s, v, a=1) = [_hsvc(5, h, s, v), _hsvc(3, h, s, v), _hsvc(1, h, s, v), a];
