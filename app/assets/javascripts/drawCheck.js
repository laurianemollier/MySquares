

// x and y: the coordinates the the top-left corner
// edgeLength: the length of the egde of the square
// draw a check in this square
function drawCheck(x, y, edgeLength, context){
    context.strokeStyle = "green";
    context.fillStyle = "green";
    context.beginPath();
    context.moveTo(x, y + edgeLength/2);  // 1er point
    context.lineTo(x + edgeLength/2, y + edgeLength/4*3); // 2e point
    context.lineTo(x + edgeLength, y); // 3e
    context.lineTo(x + edgeLength/2, y + edgeLength);
    context.closePath();     // On relie le 5e au 1er
    context.stroke();
}