
//$(function(){
    var li1 = $("#septMenuLi1");
    var li2 = $("#septMenuLi2");
    var li3 = $("#septMenuLi3");


    var div1 = document.getElementById("select-square");
    var div2 = document.getElementById("draw-square");
    var div3 = document.getElementById("share-with-friend");


    // in the side bare
    var palette = $("#palette");
    var preview = $("#previewSquareArea");


    var classFirstDone = "fdone";
    var classLastDone = "ldone";
    var classDone = "done";
    var classProgress = "inprogress";
    var classLastProgress = "lastinprogress";

    var clickableClass = "clickable";

    var canGoBackTo2 = false;

    li1.click(function(){
        if($(this).hasClass(classFirstDone)){
            goToStep1();
        }
    });

    li2.click(function(){
        if($(this).hasClass(classDone) || $(this).hasClass(clickableClass)){
            goToStep2();
        }
    });
//});

function goToStep1(){
    div2.style.display = "none";
    div3.style.display = "none";
    unfade(div1);

    li1.addClass(classProgress).removeClass(classFirstDone);
    li2.removeClass(classProgress).removeClass(classDone);
    li3.removeClass(classLastProgress).removeClass(classLastDone);

    // side bare displayed
    palette.hide();
    preview.hide();
}

function goToStep2(indexSelectedSquare){
    li1.removeClass(classProgress).addClass(classFirstDone);
    li2.addClass(classProgress).removeClass(classDone);
    li3.removeClass(classLastProgress).removeClass(classLastDone);

    div1.style.display = "none";
    div3.style.display = "none";
    unfade(div2);

    // side bare displayed
    palette.show();
    preview.hide();

    // we can come back to this step just by clicking in it
    li2.addClass(clickableClass);
}

function goToStep3(){
    li2.addClass(classDone).removeClass(classProgress);
    li3.addClass(classLastProgress);

    div2.style.display = "none";
    unfade(div3);

    // side bare displayed
    palette.hide();
    preview.show();

}







