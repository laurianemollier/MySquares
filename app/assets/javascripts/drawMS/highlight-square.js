
// x and y: the coordinates the the top-left corner
// edgeLength: the length of the egde of the square
// highlight the square
function highlight(x, y, littleSL, ctx){

    var lineWidth = 3;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "red";
    ctx.rect(x, y, littleSL, littleSL);
    ctx.stroke();

}

    var lastFlyOverSquareIndex = -1;

// littleSquareIncrease must be even
function highlightSquares(canvasToDraw, idxSquares, nbSquaresOneEdge, littleSL){

    var cxt = canvasToDraw.getContext('2d');

    for(var i=0; i<idxSquares.length; ++i){
        var coord = coordTopLeft(idxSquares[i], nbSquaresOneEdge, littleSL);
        highlight(coord.x, coord.y, littleSL, cxt);

    }


};












