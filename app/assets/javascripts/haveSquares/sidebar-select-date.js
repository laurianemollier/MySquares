function selectMonth(id){
    var selected = document.getElementById(id + "MS");
    selected.className = "selected";

    var icon = selected.firstChild.lastChild;
    icon.className = "fa fa-angle-double-down";

    var palette = document.getElementById("palette");
    selected.appendChild(palette);
}




