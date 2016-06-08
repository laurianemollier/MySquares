function coordsIntheCanvas(coordsMouse, nbSquaresOneEdge, littleSL, misplace){
    // index of the little square that have the event
    var xi = Math.floor((coordsMouse.x)/littleSL);
    var yi = Math.floor((coordsMouse.y + misplace)/littleSL); // plus the misplace of the the brush minus the canvas misplace

    // coord in pixel of the little square that have the event
    var x = xi * littleSL;
    var y = yi * littleSL;

    var squareIndexEvent = yi*nbSquaresOneEdge + xi;
    return {xi: xi, yi: yi, x: x, y: y, squareIndexEvent: squareIndexEvent}
};


function coordTopLeft(idx, nbSquaresOneEdge, littleSL){
    var x = idx % nbSquaresOneEdge * littleSL;
    var y = Math.floor(idx / nbSquaresOneEdge) * littleSL;

    return {x: x, y: y}
}