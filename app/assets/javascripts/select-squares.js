
    var lastFlyOverSquareIndex = -1;
    var selectedSquareIndex  = -1;

function coordsIntheCanvas(coordsMouse){
    // index of the little square that have the event
    var xi = Math.floor((coordsMouse.x)/littleSL);
    var yi = Math.floor((coordsMouse.y - 15)/littleSL); // plus the misplace of the the brush minus the canvas misplace

    // coord in pixel of the little square that have the event
    var x = xi * littleSL;
    var y = yi * littleSL;

    var squareIndexEvent = yi*nbSquaresOneEdge + xi;
    return {xi: xi, yi: yi, x: x, y: y, squareIndexEvent: squareIndexEvent}
};



function selectDeselectASquare(coords){
    // if the square can be selected
    if(jsSquares[coords.squareIndexEvent] == ""){
        // deselect square
        if(selectedSquareIndex == coords.squareIndexEvent){
            selectedSquareIndex = -1;
        }
        // select new square and deselect the previus one
        else{
            selectedSquareIndex = coords.squareIndexEvent;
        }
        drawSelectedSquare();
    }
};

function drawSelectedSquare(){
    contextToDraw.clearRect(0, 0, canvasWidth, canvasWidth);
    if(selectedSquareIndex > -1){
        var x = selectedSquareIndex % nbSquaresOneEdge * littleSL;
        var y = Math.floor(selectedSquareIndex / nbSquaresOneEdge) * littleSL;
        drawCheck(x, y, littleSL, contextToDraw, "green");
    }
};


// littleSquareIncrease must be even
function selectSquares(canvasToDraw){
    var colorForSelection = "white";
    var idSelectedSquare = document.getElementById("idxSelectedSquare");

     canvasToDraw.addEventListener('mouseout', function(e) {
        drawSelectedSquare();
        lastFlyOverSquareIndex = -1;
     }, false);

    canvasToDraw.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e));

        if(lastFlyOverSquareIndex != coords.squareIndexEvent){ // don't recompute if it is the same square than before
            eventOnMouseOver(coords, canvasToDraw, colorForSelection);
        }
        lastFlyOverSquareIndex = coords.squareIndexEvent;
    }, false);

    canvasToDraw.addEventListener('click', function(e){
        var coords = coordsIntheCanvas(this.relMouseCoords(e));
        selectDeselectASquare(coords);
        if(selectedSquareIndex > -1){
            goToStep2(selectedSquareIndex);

            // add the selected square to the final form
            idSelectedSquare.value = selectedSquareIndex;
            document.getElementById("idMySquare").value = "1"; //TODO: change
        }
    }, false);

};


function eventOnMouseOver(coords, canvasToDraw, colorForSelection){

    var littleSquareIncrease = 4;
    drawSelectedSquare();

    // if the square can be selected
    if(jsSquares[coords.squareIndexEvent] == ""){
        var contextToDraw = canvasToDraw.getContext('2d');

        // take the color selected on the palette
        var x = coords.x - littleSquareIncrease * 0.5;
        var y = coords.y - littleSquareIncrease * 0.5;
        var edgeLength = littleSL + littleSquareIncrease;
        contextToDraw.fillStyle = "#292929";
        contextToDraw.fillRect(x, y, edgeLength, edgeLength);

        drawCheck(x, y, edgeLength, contextToDraw, "darkSlateGray");
    }
};











