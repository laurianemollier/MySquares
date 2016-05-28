

// Last updated November 2010 by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// This is a self-executing function that I added only to stop this
// new script from interfering with the old one. It's a good idea in general, but not
// something I wanted to go over during this tutorial
(function(window) {


    // for the colors
    var colorText = document.getElementById('iconText');
    var colorBackground = document.getElementById('iconBackground');

    // holds all our boxes
    var boxes = [];


    // New, holds the 8 tiny boxes that will be our selection handles
    // the selection handles will be in this order:
    // 0  1  2
    // 3     4
    // 5  6  7
    var selectionHandles = [];

    // Hold canvas information
    var canvas;
    var ctx;
    var WIDTH;
    var HEIGHT;
    var INTERVAL = 1;  // how often, in milliseconds, we check to see if a redraw is needed

    var isDrag = false;
    var isResizeDrag = false;
    var expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.

    var mx, my; // mouse coordinates

     // when set to true, the canvas will redraw everything
     // invalidate() just sets this to false right now
     // we want to call invalidate() whenever we make a change
    var canvasValid = false;

    // The node (if any) being selected.
    // If in the future we want to select multiple objects, this will get turned into an array
    var mySel = null;

    // The selection color and width. Right now we have a red selection with a small width
    var mySelColor = 'black';
    var mySelWidth = 2;
    var mySelBoxColor = 'black'; // New for selection boxes
    var mySelBoxSize = 6;

    // we use a fake canvas to draw individual shapes for selection testing
    var ghostcanvas;
    var gctx; // fake canvas ctx

    // The number of text we can add
    var maxText = 8;
    var historic = {cursor: 0, step: []};
    var nbMaxHistoric = 20;
    var manageTextClass = "manageText";



    // since we can drag from anywhere in a node
    // instead of just its x/y corner, we need to save
    // the offset of the mouse when we start dragging.
    var offsetx, offsetx;

    // Padding and border style widths for mouse offsets
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

    var defaultText = 'Type your text here';
    var classNameTextarea = "boxTextarea";
    var contentCanvas = document.getElementById("divCanvas");

    var defaultFontSize = 30;

    // Box object to hold data
    function Box() {
      this.fill = 'rgba(235, 235, 235, 0)';

      this.text = "";
      this.font = "Calibri,Geneva,Arial";
      this.fontSize = defaultFontSize;
      this.fontColor = colorText.style.color;
      this.fontOpacity = 1;

      this.w = 300 + 10; // default width and height?
      this.h = this.fontSize*3;
//      this.h = 90;
      this.x = WIDTH/2 - this.w/2;
      this.y = HEIGHT/3;

      this.minFontSize = 15;
      this.textarea

      this.zIndex;
    }

    // New methods on the Box class
    Box.prototype = {

      draw: function(ctx, historic){
          // We can skip the drawing of elements that have moved off the screen:
          if (this.x > WIDTH || this.y > HEIGHT) return;
          if (this.x + this.w < 0 || this.y + this.h < 0) return;
          // draw historic
          if(historic){
            this.drawHistoric(ctx);
          }
          else{
            this.drawNewImage(ctx);
          }
      },

      // we used to have a solo draw function
      // but now each box is responsible for its own drawing
      // mainDraw() will call this with the normal canvas
      // myDown will call this with the ghost canvas with 'black'
      drawNewImage: function(ctx) {
          // measure the text
          this.textarea.style.font = this.fontSize + "px " + this.font;
          this.textarea.style.color = colorText.style.color;
          this.textarea.style.backgroundColor = colorBackground.style.color;

          this.textarea.style.left = this.x;
          this.textarea.style.top = this.y;

          this.textarea.style.zIndex = this.zIndex;

      },
      drawHistoric: function(ctx, htc){
        var hist = historic.step[historic.cursor];
        this.measureText(ctx);
        this.drawBox(ctx);
        if(mySel === this){
          this.drawCursor(ctx);
          this.drawHandles(ctx);
        }
        this.drawText(ctx, htc);
      },
      isInBox: function(){
        return this.x <= mx && mx <= (this.x + this.w) && this.y <= my && my <= (this.y + this.h);
      },
      isInResizeButton: function(){
        var dimR = 15;
        var x = this.x + this.w;
        var y = this.y + this.h;
        return (x - dimR) <= mx  && mx <= x && (y - dimR) <= my && my <= y;
      }
    }

    //Initialize a new Box, add it, and invalidate the canvas
    function addRect() {
      var nbBoxes = boxes.length;
      if(nbBoxes < maxText){
        var rect = new Box;
        rect.textarea = document.createElement('textarea');
        rect.textarea.placeholder = defaultText;
        rect.textarea.className = classNameTextarea;
        rect.textarea.id = "textareaInCanvas" + nbBoxes;


        rect.textarea.style.display = "block";
        rect.textarea.style.position = "absolute";

        rect.textarea.style.zIndex = nbBoxes;
        this.zIndex = nbBoxes;

        rect.textarea.style.left = rect.x;
        rect.textarea.style.top = rect.y;
        rect.textarea.style.width = rect.w;
        rect.textarea.style.height = rect.h;

        rect.textarea.onmousedown = mouseDown;
        rect.textarea.onmouseup = mouseUp;
        rect.textarea.onmousemove = mouseMove;
        rect.textarea.onmouseout = mouseOut;
        rect.textarea.onkeyup = keyUp;


        contentCanvas.appendChild(rect.textarea);
        boxes.push(rect);

        invalidate();
        document.getElementById(manageTextClass + nbBoxes).style.display = "block";
        addHistoric();
      }
    }
    function deleteRect(i){
        contentCanvas.removeChild(boxes[i].textarea)
        document.getElementById(manageTextClass + (boxes.length - 1)).style.display = "none";
        boxes.splice(i, 1);
        invalidate();
    }

    function changeFontSize(i, fontSize){
        boxes[i].fontSize = fontSize;
        mySel = boxes[i];
        resizeTextarea();
        invalidate();
    }

    // initialize our canvas, add a ghost canvas, set draw loop
    // then add everything we want to intially exist on the canvas
    function init() {
      canvas = document.getElementById('square-where-we-draw');
      HEIGHT = canvas.height;
      WIDTH = canvas.width;
      ctx = canvas.getContext('2d');



      //fixes a problem where double clicking causes text to get selected on the canvas
      canvas.onselectstart = function () { return false; }

      // fixes mouse co-ordinate problems when there's a border or padding
      // see getMouse for more detail
      if (document.defaultView && document.defaultView.getComputedStyle) {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
      }

      // make mainDraw() fire every INTERVAL milliseconds
      setInterval(mainDraw, INTERVAL);

      // set our events. Up and down are for dragging,
//      canvas.focusout = focusOut;

      // add a large green rectangle
      addRect();
    }


    //wipes the canvas ctx
    function clear(c){
        c.clearRect(0, 0, WIDTH, HEIGHT);
    }

    // Main draw loop.
    // While draw is called as often as the INTERVAL variable demands,
    // It only ever does something if the canvas gets invalidated by our code
    function mainDraw() {
      if (canvasValid == false) {

        var hist = historic.step.length != historic.cursor;

        if(hist) {
            var h = historic.step[historic.cursor];
            ctx.fillStyle = h.colorBackground;
            colorBackground.style.color = h.colorBackground;
            boxes = h.boxes;
            if(boxes.length > 0) colorText.style.color = h.boxes[0].fontColor;
            displayManageTextOnHistoric();

        }
        else ctx.fillStyle = colorBackground.style.color;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Add stuff you want drawn in the background all the time here

        // draw all boxes

        var l = boxes.length;
        for (var i = 0; i < l; i++) {
          boxes[i].draw(ctx, hist); // we used to call drawshape, but now each box draws itself
        }

        // Add stuff you want drawn on top all the time here

        canvasValid = true;
      }
    }

    // Happens when the mouse is moving inside the canvas

    // Happens when the mouse is clicked in the canvas
    function addHistoric(){

        // if to much historic, delete the latest step
        if(historic.step.length > nbMaxHistoric){
            historic.step.splice(0, 1);
            historic.cursor -= 1;
        }
        var saveBoxes = [];
        for(var i=0; i<boxes.length; ++i){
            // Save new step
            var rect = new Box;
            rect.x = boxes[i].x;
            rect.y = boxes[i].y;
            rect.w = boxes[i].w;
            rect.h = boxes[i].h;
            rect.padding = boxes[i].padding;
            rect.fill = boxes[i].fill;
            rect.text = boxes[i].text;
            rect.font = boxes[i].font;
            rect.fontSize = boxes[i].fontSize;
            rect.fontColor = colorText.style.color;
            rect.lineH = boxes[i].lineH;
            rect.cursorX = boxes[i].cursorX;
            rect.cursorY = boxes[i].cursorY;
            rect.cursorH = boxes[i].cursorH;
            rect.cursorIdx = boxes[i].cursorIdx;
            rect.writeDefaultText = boxes[i].writeDefaultText;

            saveBoxes.push(rect);

        }
        var current = {boxes: saveBoxes, colorBackground: colorBackground.style.color};


        historic.cursor += 1;
        if(historic.cursor == historic.step.length + 1){
            historic.step.push(current);
        }
        else{
            historic.step = historic.step.slice(0, historic.cursor);
            historic.step.push(current);
            historic.cursor = historic.step.length;
        }

    };

    function previewHistoric(){
        if(historic.cursor == historic.step.length && historic.cursor > 0) historic.cursor -= 2;
        else if(historic.cursor > 0) historic.cursor -= 1;
         reDraw();
    }
    function nextHistoric(){
        if(historic.cursor < historic.step.length) historic.cursor += 1;
        reDraw();
    }


    function invalidate() {
      canvasValid = false;
    }

    function isInsideBox(mx, my){
        var l = boxes.length;
        for (var i = 0; i < l; i++) {
           if(boxes[i].isInBox(mx, my)) return boxes[i];
        }
        return false;
    }


    function mouseDown(e){
      var id = parseInt(this.id[this.id.length - 1]);
      mySel = boxes[id];
      setZIndex();
      getMouse(e);
      if(mySel.isInResizeButton()){
        isResizeDrag = true;
      }
      else {
        isDrag = true;
        getMouse(e);
        offsetx = mx - mySel.x;
        offsety = my - mySel.y;
      }
      invalidate();
    }
    function mouseUp(e){
      if(isDrag) isDrag = false;
      else{
        mySel.w = parseInt(mySel.textarea.style.width, 10);
        mySel.h = parseInt(mySel.textarea.style.height, 10);
        console.log(mySel.w)
      }
    }
    function mouseMove(e){
      if(isDrag) {
        getMouse(e);
        mySel.x = mx - offsetx;
        mySel.y = my - offsety;

        // something is changing position so we better invalidate the canvas!
        invalidate();
      }
    }
    // Sets mx,my to the mouse position relative to the canvas
    // unfortunately this can be tricky, we have to worry about padding and borders
    function getMouse(e) {
          var element = canvas, offsetX = 0, offsetY = 0;

          if (element.offsetParent) {
            do {
              offsetX += element.offsetLeft;
              offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
          }

          // Add padding and border style widths to offset
          offsetX += stylePaddingLeft;
          offsetY += stylePaddingTop;

          offsetX += styleBorderLeft;
          offsetY += styleBorderTop;

          mx = e.pageX - offsetX;
          my = e.pageY - offsetY;
    }

    function mouseOut(e){
        mouseMove(e);
    }
//    function reDraw(){
//        invalidate();
//        mainDraw();
//    }
//    function focusOut(){
//        mySel = null;
//        reDraw();
//    }

    function setZIndex(){
      if(mySel){
        var current = mySel.textarea.style.zIndex;
        for(var i=0; i<boxes.length; ++i){
          if(boxes[i].textarea.style.zIndex > current) boxes[i].textarea.style.zIndex -=1;
        }
        mySel.textarea.style.zIndex = boxes.length - 1;
      }
    }

    function keyUp(){
        if(!mySel){
          var id = parseInt(this.id[this.id.length - 1]);
          mySel = boxes[id];
        }
        resizeTextarea();
    }
    function resizeTextarea(){
      mySel.textarea.style.height = 'auto';
      mySel.h = mySel.textarea.scrollHeight;
      mySel.textarea.style.height = mySel.textarea.scrollHeight+'px';
    }



    function displayManageTextOnHistoric(){
        for(var i=0; i<maxText; ++i){
            var display = "none";
            if(i<boxes.length) display = "block";
            document.getElementById(manageTextClass + i).style.display = display;
        }
    }

    // If you dont want to use <body onLoad='init()'>
    // You could uncomment this init() reference and place the script reference inside the body tag
    init();
    window.init = init;



    // add text when clicking on the addButton
    var addText = document.getElementById('addTextButton');
    addText.onclick = function(){
       addRect();
    };

    // set the delete text button
    var className = 'deleteText';
    for(var i=0; i<maxText; ++i){
        document.getElementById(className + i).onclick = function(){
            var idx = this.id[this.id.length - 1];
            deleteRect(parseInt(idx));
            canvas.focusout();
        }
    }

    var fontSizeClassName = 'fontSize';
    for(var i=0; i<maxText; ++i){
        var f = document.getElementById(fontSizeClassName + i);
        f.value = defaultFontSize;
        f.onmouseup = function(){
            var idx = this.id[this.id.length - 1];
            changeFontSize(parseInt(idx), this.value);
        }
        f.onkeyup = f.onmouseup;

    }

    // set the historic button
    document.getElementById('previewHistoric').onclick = function(){
        previewHistoric();
    }
    document.getElementById('nextHistoric').onclick = function(){
        nextHistoric();
    }

 })(window);





































