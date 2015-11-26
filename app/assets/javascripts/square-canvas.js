// colors : Array[Array[]], gray: Boolean
function drawSquares(colors, nbSquaresOneEdge, canvas, canvasWidth, gray){

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

            if(colors[index][0] < 0) context.fillStyle = "#222";
            else if(gray) context.fillStyle = "gray";
            else {
                var rgba = "rgba("+ colors[index][0] +", "+ colors[index][1] +", "+ colors[index][2] +", 255)";
                context.fillStyle = rgba;
            }
            var x = j%nbSquaresOneEdge * littleSL;
            var y = i%nbSquaresOneEdge * littleSL;
            context.fillRect(x, y, littleSL, littleSL);
        }
    }
};
