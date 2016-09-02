

    var lastFlyOverSquareIndex = -1;

// littleSquareIncrease must be even
function eventMS(squareCanvas, previewSquare, jsSquares, nbSquaresOneEdge, idMS){

    var littleSL = squareCanvas.width / nbSquaresOneEdge;
    var cxt = previewSquare.getContext('2d');

     squareCanvas.addEventListener('mouseout', function(e) {
        lastFlyOverSquareIndex = -1;
     }, false);

    // show the preview
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

        // redirect to share on click
        squareCanvas.addEventListener('click', function(e) {
            var coords = coordsIntheCanvas(this.relMouseCoords(e), nbSquaresOneEdge, littleSL, 0);

            if(jsSquares[coords.squareIndexEvent] != ""){ // if the square exist
                // redirect
                window.location.href = window.location.origin + "/share/" + idMS + "-" + coords.squareIndexEvent; // To change
console.log("dd")

            }
            lastFlyOverSquareIndex = coords.squareIndexEvent;
        }, false);

};