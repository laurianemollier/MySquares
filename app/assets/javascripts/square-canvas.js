// squares: Seq[String] : Caracterized by the image produce by the user in base 64, and the user id who produce it
function drawSquares(squares, nbSquaresOneEdge, canvas, canvasWidth){

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
            var x = j%nbSquaresOneEdge * littleSL;
            var y = i%nbSquaresOneEdge * littleSL;

            if(squares[index] == ""){
                context.fillStyle = "#222";
                context.fillRect(x, y, littleSL, littleSL);
            } else {
                drawBase(context, x, y, littleSL, squares[index]);
            }
        }
    }
};

function drawBase(context, x, y, littleSL, img){
    var image = new Image();
    image.onload = function(){
        context.drawImage(image, x, y, littleSL, littleSL);
    }
    image.src = img;
}
