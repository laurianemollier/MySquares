
// add the class name selected on the selected icon
// change the selected square cursor to the selected icon
(function(){
    var selected = "selected";
    var pipette = document.getElementById("pipetteIcon");
    var eraser = document.getElementById("eraserIcon");
    var selectedSquare = document.getElementById("selectedSquare");

    //   display the color in the square for the color colected -> background black when eraser
    var selectedColor = document.getElementById('selectedColor');
    selectedSquare.style.cursor = "url(\"/assets/images/brush.png\"), copy";

    pipette.onclick = function(){
        // if the pipette was selected
        if(this.className == selected){
            this.className = "";
            selectedSquare.style.cursor = "url(\"/assets/images/brush.png\"), copy";
        }
        else{
            this.className = selected;
            eraser.className = "";
            selectedSquare.style.cursor = "url(\"/assets/images/pipette.png\"), auto";
        }
    }

    eraser.onclick = function(){
        // if the eraser was selected
        if(this.className == selected){
            this.className = "";
            selectedSquare.style.cursor = "url(\"/assets/images/brush.png\"), copy";
        }
        // if the eraser was not yet selected
        else{
            selectedColor.style.backgroundColor = "#222";
            this.className = selected;
            pipette.className = "";
            selectedSquare.style.cursor = "url(\"/assets/images/eraser.png\"), copy";
        }
    }

})();