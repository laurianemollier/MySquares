function coordsIntheCanvas(coordsMouse){
    // index of the little square that have the event
    var xi = Math.floor((coordsMouse.x)/littleSL);
    var yi = Math.floor((coordsMouse.y + 16 - 15)/littleSL); // plus the misplace of the the brush minus the canvas misplace

    // coord in pixel of the little square that have the event
    var x = xi * littleSL;
    var y = yi * littleSL;

    var squareIndexEvent = yi*nbSquaresOneEdge + xi;
    return {xi: xi, yi: yi, x: x, y: y, squareIndexEvent: squareIndexEvent}
};



function selectASquare(coords){
    // if the square can be selected
    if(jsColors[coords.squareIndexEvent][0] < 0){
        selectedSquare[coords.squareIndexEvent] = selectedColor.style.backgroundColor;
        drawSelectedSquare();
    }
};

function unselectASquare(coords){
    // if the square was selected
    if(selectedSquare[coords.squareIndexEvent]){
        selectedSquare[coords.squareIndexEvent] = false;
        drawSelectedSquare();
    }
};

// TODO: May be to slow
function drawSelectedSquare(){
    contextToDraw.clearRect(0, 0, canvasWidth, canvasWidth);
    for(var i=0; i<selectedSquare.length; ++i){
        // if the square was selected
        if(selectedSquare[i]){
            var x = i % nbSquaresOneEdge * littleSL;
            var y = Math.floor(i / nbSquaresOneEdge) * littleSL;

            contextToDraw.fillStyle = selectedSquare[i];
            contextToDraw.fillRect(x, y, littleSL, littleSL);

        }
    }
};






// littleSquareIncrease must be even
function selectSquares(canvasToDraw){
    var lastFlyOverSquareIndex = -1;

    // for select square when mouse down
    var mouseDown = false;

    // the selected color Element
    var selectedColor = document.getElementById('selectedColor');

    // selected tool
    var pipette = document.getElementById("pipetteIcon");
    var eraser = document.getElementById("eraserIcon");

     canvasToDraw.addEventListener('mouseout', function(e) {
        drawSelectedSquare();
        lastFlyOverSquareIndex = -1;
     }, false);

    canvasToDraw.addEventListener('mousemove', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e));

        // if not mode pipette
        if(pipette.className != "selected" && lastFlyOverSquareIndex != coords.squareIndexEvent){ // don't recompute if it is the same square than before
            if(mouseDown && eraser.className != "selected"){
                selectASquare(coords);
            }
            else if(mouseDown){ // eraser mode
                unselectASquare(coords);
            }
            else{
                biggerSquareMouseOver(coords, canvasToDraw, selectedColor);
            }
        }
        lastFlyOverSquareIndex = coords.squareIndexEvent;
    }, false);

    canvasToDraw.addEventListener('mousedown', function(e) {
        var coords = coordsIntheCanvas(this.relMouseCoords(e));
        eventMouseOnTheCanvas(coords);
        mouseDown = true;

    }, false);

    canvasToDraw.addEventListener('mouseup', function(e) {
        mouseDown = false;
    }, false);


    canvasToDraw.addEventListener('click', function(event){
        var coords = coordsIntheCanvas(this.relMouseCoords(event));
        eventMouseOnTheCanvas(coords);
    }, false);

    function eventMouseOnTheCanvas(coords) {


        // if the pipette tool was selected and select color
        if(pipette.className == "selected"){
            var context;

            // if the square can be selected
            if(jsColors[coords.squareIndexEvent][0] < 0) context = canvasToDraw.getContext('2d');
            else context = coloredSquare.getContext('2d');
            var data = context.getImageData(coords.x, coords.y, 1, 1).data; // minus the misplace of the the pipette
            //TODO: Comprendre pourquoi
            var rgba = 'rgba(' + data[4] + ',' + data[5] + ',' + data[6] + ',' + data[7] + ')';

            selectedColor.style.backgroundColor = rgba;

        }
        else if(eraser.className == "selected") unselectASquare(coords);
        else selectASquare(coords);
    }
};


function biggerSquareMouseOver(coords, canvasToDraw, selectedColor){

    var littleSquareIncrease = 4;

    drawSelectedSquare();

    // if the square can be selected
    if(jsColors[coords.squareIndexEvent][0] < 0){
        var contextToDraw = canvasToDraw.getContext('2d');

        // take the color selected on the palette
        contextToDraw.fillStyle = selectedColor.style.backgroundColor;
        contextToDraw.fillRect(coords.x - littleSquareIncrease/2, coords.y - littleSquareIncrease/2, littleSL + littleSquareIncrease, littleSL + littleSquareIncrease);
    }
};











