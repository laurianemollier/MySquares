function selectMonth(month){
    var selected = document.getElementById(month);
    selected.className = "selected";

    var icon = selected.firstChild.lastChild;
    icon.className = "fa fa-angle-double-down";

}




