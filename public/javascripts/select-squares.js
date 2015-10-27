function coordsIntheCanvas(coordsMouse){

    // index of the little square that have the event
    var xi = Math.floor(coordsMouse.x/littleSL);
    var yi = Math.floor(coordsMouse.y/littleSL);

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
    selectASquareCoords(coords, false);
}

function selectASquareCoords(coords, justSelect){

        // if the square can be selected
        if(freeSquares[coords.squareIndexEvent]){
            freeSquares[coords.squareIndexEvent] = false;
            selectedSquare.push(coords.squareIndexEvent);

            drawSelectedSquare();
        }
        else if(!justSelect){
            var squareIndexArraySelected = selectedSquare.indexOf(coords.squareIndexEvent);
            // if the square was selected
            if(squareIndexArraySelected != -1){
                selectedSquare.splice(squareIndexArraySelected, 1);
                freeSquares[coords.squareIndexEvent] = false;
                drawSelectedSquare();
            }
        }


};

function drawSelectedSquare(){
    grayContextToDraw.clearRect(0, 0, canvasWidth, canvasWidth);
    coloredContextToDraw.clearRect(0, 0, canvasWidth, canvasWidth);
    drawSelectedSquareOnContext(grayContextToDraw);
    drawSelectedSquareOnContext(coloredContextToDraw);
}




// littleSquareIncrease must be even
function selectSquares(canvasColored, canvasToDraw){


    var lastFlyOverSquareIndex = -1;


    // for select square when mouse down
    var mouseDown = false;


    canvasToDraw.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e));
        if(lastFlyOverSquareIndex != coords.squareIndexEvent){ // don't recompute if it is the same square than before
            if(mouseDown){
                selectASquareCoords(coords, true);
            }
            else{
                biggerSquareMouseOver(coords, canvasColored, canvasToDraw);
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


function biggerSquareMouseOver(coords, canvasColored, canvasToDraw){

    var littleSquareIncrease = 4;

    drawSelectedSquare();

    // if the square can be selected
    if(freeSquares[coords.squareIndexEvent]){
        var contextColored = canvasColored.getContext('2d');
        var p = contextColored.getImageData(coords.x + littleSL/2, coords.y + littleSL/2, 1, 1).data;
        var color = "rgba("+ p[0]+ ", "+ p[1]+ ", "+ p[2]+ ", 1)";

        var contextToDraw = canvasToDraw.getContext('2d');
        contextToDraw.fillStyle = color;
        contextToDraw.fillRect(coords.x - littleSquareIncrease/2, coords.y - littleSquareIncrease/2, littleSL + littleSquareIncrease, littleSL + littleSquareIncrease);
    }
}






