
function rgbaToInt(r, g, b, a){
    return r << 8*3 | g << 8*2 | b << 8 | a;
}

function r(i){
    return i >> 8*3 & 255;
}

function g(i){
    return i >> 8*2 & 255;
}

function b(i){
    return i >> 8 & 255;
}

function a(i){
    return i & 255;
}