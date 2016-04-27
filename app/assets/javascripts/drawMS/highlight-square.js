
// x and y: the coordinates the the top-left corner
// edgeLength: the length of the egde of the square
// highlight the square
function highlight(x, y, edgeLength, context, color){

}

    var lastFlyOverSquareIndex = -1;

// littleSquareIncrease must be even
function highlightSquare(squareCanvas, previewSquare, jsSquares, nbSquaresOneEdge){

    var littleSL = squareCanvas.width / nbSquaresOneEdge;
    var cxt = previewSquare.getContext('2d');

     squareCanvas.addEventListener('mouseout', function(e) {
        lastFlyOverSquareIndex = -1;
     }, false);

    squareCanvas.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e), nbSquaresOneEdge, littleSL, 0);

        if(lastFlyOverSquareIndex != coords.squareIndexEvent // don't recompute if it is the same square than before
            && jsSquares[coords.squareIndexEvent] != ""){
            // display the square on the side
            var image = new Image();
            image.onload = function(){
                cxt.drawImage(image, 0, 0, previewSquare.width, previewSquare.width);
            }
            image.src = jsSquares[coords.squareIndexEvent];
        }
        lastFlyOverSquareIndex = coords.squareIndexEvent;
    }, false);
};












