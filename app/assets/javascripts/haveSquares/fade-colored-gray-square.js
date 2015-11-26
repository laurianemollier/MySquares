(function(){

    var coloredSquare = document.getElementById("coloredSquare");

    var coloredSquareButton = document.getElementById("coloredSquareButton");
    coloredSquareButton.onclick = function(){
        unfade(coloredSquare)
    };

    var graySquareButton = document.getElementById("graySquareButton");
    graySquareButton.onclick = function(){
        fade(coloredSquare)
    };




})();