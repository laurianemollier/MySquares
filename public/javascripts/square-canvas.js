// colors : Array[Array[]], gray: Boolean
// freeSquares: Array[Boolean] if true this square is free
function drawSquares(colors, freeSquares, nbSquaresOneEdge, canvas, canvasWidth, gray){

    var littleSL = canvasWidth / nbSquaresOneEdge;
    //littleSL = Math.ceil(littleSL)
    canvas.width = canvasWidth;
    canvas.height = canvasWidth;

// nbSquaresOneEdge, littleSL


    // row i, column j
    var context = canvas.getContext('2d');
    for(var i=0; i<nbSquaresOneEdge; ++i){
        for(var j=0; j<nbSquaresOneEdge; ++j){

            var index = i*nbSquaresOneEdge + j;

            if(freeSquares[index]) context.fillStyle = "white";
            else if(gray) context.fillStyle = "gray";
            else {
                context.fillStyle = "rgba("+ colors[index][0] +", "+ colors[index][1] +", "+ colors[index][2] +", 1)";
            }
            var x = j%nbSquaresOneEdge * littleSL;
            var y = i%nbSquaresOneEdge * littleSL;
            context.fillRect(x, y, littleSL, littleSL);
        }
    }
};
