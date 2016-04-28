
    var lastFlyOverSquareIndex = -1;
    var selectedSquareIndex  = -1;



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
    var idSelectedSquare = document.getElementById("idxSelectedSquare");

     canvasToDraw.addEventListener('mouseout', function(e) {
        drawSelectedSquare();
        lastFlyOverSquareIndex = -1;
     }, false);

    canvasToDraw.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e), nbSquaresOneEdge, littleSL, - 15);

        if(lastFlyOverSquareIndex != coords.squareIndexEvent){ // don't recompute if it is the same square than before
            eventOnMouseOver(coords, canvasToDraw);
        }
        lastFlyOverSquareIndex = coords.squareIndexEvent;
    }, false);

    canvasToDraw.addEventListener('click', function(e){
        var coords = coordsIntheCanvas(this.relMouseCoords(e), nbSquaresOneEdge, littleSL, - 15);
        selectDeselectASquare(coords);
        if(selectedSquareIndex > -1){
            goToStep2(selectedSquareIndex);

            // add the selected square to the final form
            idSelectedSquare.value = selectedSquareIndex;
            document.getElementById("idMySquare").value = "1"; //TODO: change
        }
    }, false);
};


function eventOnMouseOver(coords, canvasToDraw){

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











