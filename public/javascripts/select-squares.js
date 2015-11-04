function coordsIntheCanvas(coordsMouse){


    // index of the little square that have the event
    var xi = Math.floor((coordsMouse.x)/littleSL);
    var yi = Math.floor((coordsMouse.y + 16)/littleSL); // minus the misplace of the the brush

    // coord in pixel of the little square that have the event
    var x = xi * littleSL;
    var y = yi * littleSL;

    var squareIndexEvent = yi*nbSquaresOneEdge + xi;
    return {xi: xi, yi: yi, x: x, y: y, squareIndexEvent: squareIndexEvent}
};

function drawSelectedSquareOnContext(contextToDraw){
    for(var i=0; i<selectedSquare.length; ++i){

        var x = selectedSquare[i] % nbSquaresOneEdge * littleSL;
        var y = Math.floor(selectedSquare[i] / nbSquaresOneEdge) * littleSL;

        drawCrossInCheck(x, y, littleSL, contextToDraw);
    }
};

// x and y: the coordinates the the top-left corner
// edgeLength: the length of the egde of the square
// draw a check in this square
function drawCrossInCheck(x, y, edgeLength, context){
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

function selectASquare(event){
    var coords = coordsIntheCanvas(this.relMouseCoords(event));
    selectASquareCoords(coords);
}

function selectASquareCoords(coords){

        // if the square can be selected
        if(freeSquares[coords.squareIndexEvent]){
            freeSquares[coords.squareIndexEvent] = false;
            selectedSquare.push(coords.squareIndexEvent);

            drawSelectedSquare();
        }
        else{
            var squareIndexArraySelected = selectedSquare.indexOf(coords.squareIndexEvent);
            // if the square was selected
            if(squareIndexArraySelected != -1){
                selectedSquare.splice(squareIndexArraySelected, 1);
                freeSquares[coords.squareIndexEvent] = true;
                drawSelectedSquare();
            }
        }


};

function drawSelectedSquare(){
    contextToDraw.clearRect(0, 0, canvasWidth, canvasWidth);
    drawSelectedSquareOnContext(contextToDraw);
}




// littleSquareIncrease must be even
function selectSquares(canvasToDraw){
    var lastFlyOverSquareIndex = -1;

    // for select square when mouse down
    var mouseDown = false;


    canvasToDraw.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e));
        if(lastFlyOverSquareIndex != coords.squareIndexEvent){ // don't recompute if it is the same square than before
            if(mouseDown){
                selectASquareCoords(coords);
            }
            else{
                biggerSquareMouseOver(coords, canvasToDraw);
            }
        }
        lastFlyOverSquareIndex = coords.squareIndexEvent;
    }, false);

    canvasToDraw.addEventListener('mousedown', function(e) {
        mouseDown = true;
        drawSelectedSquare();
    }, false);

    canvasToDraw.addEventListener('mouseup', function(e) {
        mouseDown = false;
    }, false);


    canvasToDraw.addEventListener('click', selectASquare, false);
};


function biggerSquareMouseOver(coords, canvasToDraw){

    var littleSquareIncrease = 4;

    drawSelectedSquare();

    // if the square can be selected
    if(freeSquares[coords.squareIndexEvent]){
        var contextToDraw = canvasToDraw.getContext('2d');
        contextToDraw.fillStyle = "white";
        contextToDraw.fillRect(coords.x - littleSquareIncrease/2, coords.y - littleSquareIncrease/2, littleSL + littleSquareIncrease, littleSL + littleSquareIncrease);
    }
}






