

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
    var INTERVAL = 50;  // how often, in milliseconds, we check to see if a redraw is needed

    var isDrag = false;
    var isResizeDrag = false;
    var expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.
    var resizingByBottom = false;

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
    var offsetx, offsety;

    // Padding and border style widths for mouse offsets
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;




    // Box object to hold data
    function Box() {
      this.fill = 'rgba(235, 235, 235, 0)';

      this.writeDefaultText = true;
      this.defaultText = 'Type your text here';
      this.defaultTextFontColor = 'gray';

      this.text = "";
      this.font = "Calibri,Geneva,Arial";
      this.fontSize = 30;
      this.fontColor = colorText.style.color;
      this.fontOpacity = 1;
      this.padding = 0;
      this.paddingInterLine = 10;
      this.lineH = this.fontSize + this.paddingInterLine;

      this.w = 300; // default width and height?
      this.h = this.fontSize*1.4 + this.padding*2;
      this.x = canvas.width/2 - this.w/2;
      this.y = canvas.height/3;

      this.minH = this.h;
      this.minW = this.w;
      this.minFontSize = 15;

      this.cursorLine = 0;
      this.cursorX = this.padding;
      this.cursorY = this.padding + this.cursorLine;
      this.cursorH = this.lineH;
      this.cursorIdx = this.text.length;   // couc|ou => this.cursorIdx == 4

      this.txtDim = [];

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
          ctx.font = this.fontSize + "px " + this.font;
          this.measureText(ctx);

          // redimension the square
          if(resizingByBottom){
            this.y += this.h - this.txtDim.height;
          }
          this.h = this.txtDim.height;
          this.drawBox(ctx);

          console.log(this.text)


          this.minW = this.txtDim.maxWidthWold;
          this.minH = this.fontSize*1.4 + this.padding*2;

          // set position cursor
          this.lineH = this.fontSize + this.paddingInterLine;
          this.cursorH = this.lineH;

          var infoLines = this.txtDim.infoLines;
          var nbKeys = 0;
          var i = 0;
          while((i < (infoLines.length)) && (this.cursorIdx >= nbKeys)){
             nbKeys += infoLines[i].nbKey;
             ++i;
          }

          this.cursorLine = i - 1;
          nbKeys -= infoLines[this.cursorLine].nbKey;
          this.cursorY = this.cursorLine * this.lineH + this.y ;
          var line = infoLines[this.cursorLine].txt;
          var txt = line.substring(0, this.cursorIdx - nbKeys);
          this.cursorX = ctx.measureText(txt).width + this.x;

          // write text
          this.drawText(ctx);

          if(mySel === this){
            this.drawCursor(ctx);
            this.drawHandles(ctx);
          }
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
      isInBox: function(mx, my){
        return this.x <= mx && mx <= (this.x + this.w) && this.y <= my && my <= (this.y + this.h);
      },
      selectText: function(ctx){
        var color = "LightBlue";
        for(var i=0; i< this.txtDim.infoLines.length; ++i){
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y + this.lineH * i, this.txtDim.infoLines[i].width, this.lineH);
        }

      },
      drawCursor: function(ctx){
        ctx.beginPath();
        ctx.moveTo(this.cursorX, this.cursorY);
        ctx.lineTo(this.cursorX, this.cursorY + this.cursorH);
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.fontColor;
        ctx.stroke();
      },
      drawText: function(ctx, historic){
          if(historic) ctx.fillStyle = this.fontColor;
          this.fontColor = colorText.style.color;
          ctx.fillStyle = this.getFontColor();
          for(var i=0; i< this.txtDim.infoLines.length; ++i){
            var line = this.txtDim.infoLines[i];
            ctx.fillText(line.txt, line.x, line.y);
          }
      },
      measureText: function(ctx){
        this.txtDim = wrapText(ctx, this.getText(), this.x + this.padding,
                                          this.y + this.padding + this.fontSize,
                                          this.w - 2*this.padding,
                                          this.lineH);
      },
      getText: function(){
        if(this.writeDefaultText) return this.defaultText;
        else return this.text;
      },
      getFontColor: function(){
        if(this.writeDefaultText) return this.defaultTextFontColor;
        else return this.fontColor;
      },
      drawBox: function(ctx){
        if (ctx === gctx) ctx.fillStyle = 'black';
        else ctx.fillStyle = this.fill;
        ctx.fillRect(this.x,this.y,this.w,this.h);
      },

      // draw selection
      // this is a stroke along the box and also 8 new selection handles
      drawHandles: function(ctx){

        ctx.strokeStyle = mySelColor;
        ctx.lineWidth = mySelWidth;
        ctx.strokeRect(this.x,this.y,this.w,this.h);

        // draw the boxes

        var half = mySelBoxSize / 2;

        // 0  1  2
        // 3     4
        // 5  6  7

        // top left, middle, right
        selectionHandles[0].x = this.x-half;
        selectionHandles[0].y = this.y-half;

        selectionHandles[1].x = this.x+this.w/2-half;
        selectionHandles[1].y = this.y-half;

        selectionHandles[2].x = this.x+this.w-half;
        selectionHandles[2].y = this.y-half;

        //middle left
        selectionHandles[3].x = this.x-half;
        selectionHandles[3].y = this.y+this.h/2-half;

        //middle right
        selectionHandles[4].x = this.x+this.w-half;
        selectionHandles[4].y = this.y+this.h/2-half;

        //bottom left, middle, right
        selectionHandles[6].x = this.x+this.w/2-half;
        selectionHandles[6].y = this.y+this.h-half;

        selectionHandles[5].x = this.x-half;
        selectionHandles[5].y = this.y+this.h-half;

        selectionHandles[7].x = this.x+this.w-half;
        selectionHandles[7].y = this.y+this.h-half;


        ctx.fillStyle = mySelBoxColor;
        for (var i = 0; i < 8; i ++) {
          var cur = selectionHandles[i];
          ctx.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
        }


      }


    }

    //Initialize a new Box, add it, and invalidate the canvas
    function addRect() {
      var nbBoxes = boxes.length;
      if(nbBoxes < maxText){
        var rect = new Box;
        boxes.push(rect);
        invalidate();
        document.getElementById(manageTextClass + nbBoxes).style.display = "block";
        addHistoric();
      }
    }
    function deleteRect(i){
        document.getElementById(manageTextClass + (boxes.length - 1)).style.display = "none";
        boxes.splice(i, 1);
        invalidate();
    }

    // initialize our canvas, add a ghost canvas, set draw loop
    // then add everything we want to intially exist on the canvas
    function init() {
      canvas = document.getElementById('square-where-we-draw');
      HEIGHT = canvas.height;
      WIDTH = canvas.width;
      ctx = canvas.getContext('2d');
      ghostcanvas = document.createElement('canvas');
      ghostcanvas.height = HEIGHT;
      ghostcanvas.width = WIDTH;
      gctx = ghostcanvas.getContext('2d');

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
      // double click is for making new boxes
      canvas.onmousedown = myDown;
      canvas.onmouseup = myUp;
//      canvas.ondblclick = myDblClick;
      canvas.onmousemove = myMove;

      canvas.tabIndex = 1000;
      canvas.style.outline = "none";
      canvas.onkeypress = keyPress;
      canvas.onkeydown = keyDown;
      canvas.focusout = focusOut;

      // set up the selection handle boxes
      for (var i = 0; i < 8; i ++) {
        var rect = new Box;
        selectionHandles.push(rect);
      }

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
    function myMove(e){
      getMouse(e);

      if (isDrag) {
        mySel.x = mx - offsetx;
        mySel.y = my - offsety;

        // something is changing position so we better invalidate the canvas!
        invalidate();
      }
      else if (isResizeDrag) {
        // time ro resize!
        var oldx = mySel.x;
        var oldy = mySel.y;

        var oldw = mySel.w;
        var oldh = mySel.h;


        var coefFontResizing = 0.4;
        // 0  1  2
        // 3     4
        // 5  6  7
        switch (expectResize) {
          case 0:
            mySel.x = mx;
            mySel.y = my;
            mySel.w += oldx - mx;
            mySel.h += oldy - my;
            mySel.fontSize += (oldy - my) * coefFontResizing;
            break;
          case 1:
            mySel.y = my;
            mySel.h += oldy - my;
            mySel.fontSize += (oldy - my) * coefFontResizing;
            break;
          case 2:
            mySel.y = my;
            mySel.w = mx - oldx;
            mySel.h += oldy - my;
            mySel.fontSize += (oldy - my) * coefFontResizing;
            break;
          case 3:
            mySel.x = mx;
            mySel.w += oldx - mx;
            break;
          case 4:
            mySel.w = mx - oldx;
            break;
          case 5:
            resizingByBottom = true;
            mySel.x = mx;
            mySel.w += oldx - mx;
            mySel.h = my - oldy;
            mySel.fontSize += (oldx - mx) * coefFontResizing * 0.8;
            break;
          case 6:
            resizingByBottom = true;
            mySel.h = my - oldy;
            mySel.fontSize += (my - oldy - oldh) * coefFontResizing * 0.8;
            break;
          case 7:
            resizingByBottom = true;
            mySel.w = mx - oldx;
            mySel.h = my - oldy;
            mySel.fontSize += (mySel.w - oldw) * coefFontResizing * 0.8;
            break;
        }

        if(mySel.fontSize <= mySel.minFontSize){
            mySel.fontSize = mySel.minFontSize;
            mySel.y = oldy;
            mySel.h = oldh;
        }
        if(mySel.w < mySel.minW){
            mySel.w = mySel.minW;
            mySel.x = oldx;
        }

        invalidate();
      }
      else{
        // set the cursor to pointer if hover inputText
        if(isInsideBox(mx, my)){
           this.style.cursor = "pointer";
        }
        else{
           this.style.cursor = "default";
        }
      }

      // if there's a selection see if we grabbed one of the selection handles
      if (mySel !== null && !isResizeDrag) {
        for (var i = 0; i < 8; i++) {
          // 0  1  2
          // 3     4
          // 5  6  7

          var cur = selectionHandles[i];

          // we dont need to use the ghost ctx because
          // selection handles will always be rectangles
          if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
              my >= cur.y && my <= cur.y + mySelBoxSize) {
            // we found one!
            expectResize = i;
            invalidate();

            switch (i) {
              case 0:
                this.style.cursor='nw-resize';
                break;
              case 1:
                this.style.cursor='n-resize';
                break;
              case 2:
                this.style.cursor='ne-resize';
                break;
              case 3:
                this.style.cursor='w-resize';
                break;
              case 4:
                this.style.cursor='e-resize';
                break;
              case 5:
                this.style.cursor='sw-resize';
                break;
              case 6:
                this.style.cursor='s-resize';
                break;
              case 7:
                this.style.cursor='se-resize';
                break;
            }
            return;
          }

        }
        // not over a selection box, return to normal
        isResizeDrag = false;
        expectResize = -1;
      }

    }

    // Happens when the mouse is clicked in the canvas
    function myDown(e){

      getMouse(e);

      //we are over a selection box
      if (expectResize !== -1) {
        isResizeDrag = true;
        return;
      }

      clear(gctx);
      var l = boxes.length;
      for (var i = l-1; i >= 0; i--) {
        // draw shape onto ghost ctx
        boxes[i].draw(gctx);

        // get image data at the mouse x,y pixel
        var imageData = gctx.getImageData(mx, my, 1, 1);
        var index = (mx + my * imageData.width) * 4;
        // if the mouse pixel exists, select and break
        if (imageData.data[3] > 0) {
          mySel = boxes[i];
          offsetx = mx - mySel.x;
          offsety = my - mySel.y;
          mySel.x = mx - offsetx;
          mySel.y = my - offsety;
          isDrag = true;

          invalidate();
          clear(gctx);
          return;
        }

      }
      // havent returned means we have selected nothing
      mySel = null;
      // clear the ghost canvas for next time
      clear(gctx);
      // invalidate because we might need the selection border to disappear
      invalidate();
    }

    function myUp(e){

      if(this.text == this.defaultText){

      }

      if(isDrag || expectResize != -1) addHistoric(); // TODO: When we click => Add Historic: For change color also
      isDrag = false;
      isResizeDrag = false;
      resizingByBottom = false;


      expectResize = -1;
      invalidate();
    }

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

    // get key code
    function keyDown(e){

       if(mySel){
          var key =  e.which || e.keyCode;

          // arrow left
          if(key == 37){
            e.preventDefault();
            if(mySel.cursorIdx > 0){
               mySel.cursorIdx += -1;
            }
          }
          // arrow top
          else if(key == 38){
            e.preventDefault();
            var ifLs = mySel.txtDim.infoLines;
            if(mySel.cursorLine > 0){
                mySel.cursorIdx -= mySel.txtDim.infoLines[mySel.cursorLine - 1].nbKey;

                // be sure that the cursor have jump to the line
                var totalLine = 0;
                for(var i=0; i < mySel.cursorLine; ++i){
                    totalLine += ifLs[i].nbKey;
                }
                if(mySel.cursorIdx > totalLine) mySel.cursorIdx = totalLine;
            }
          }
          // arrow right
          else if(key == 39){
            e.preventDefault();
            if(mySel.cursorIdx < mySel.text.length){
               mySel.cursorIdx += 1;
            }
          }
          // arrow dow
          else if(key == 40){
            e.preventDefault();
            var ifLs = mySel.txtDim.infoLines;
            if(mySel.cursorLine < ifLs.length - 1){
                mySel.cursorIdx += ifLs[mySel.cursorLine].nbKey;

                // see if the cursor do not jump to line
                var totalLine = 0;
                for(var i=0; i <= mySel.cursorLine + 1; ++i){
                    totalLine += ifLs[i].nbKey;
                }
                if(mySel.cursorIdx > totalLine) mySel.cursorIdx = totalLine;
            }
          }
          // delete
          else if(key == 8){
            // prevent default behaviour
            e.preventDefault();
            if(mySel.cursorIdx > 0){
               mySel.cursorIdx += -1;
               mySel.text = mySel.text.substring(0, mySel.cursorIdx) + mySel.text.substring(mySel.cursorIdx + 1, mySel.text.length);
               invalidate();
               addHistoric();
            }
          }
       }
       // clear the ghost canvas for next time
       clear(gctx);
       // invalidate because we might need the selection border to disappear
       invalidate();
    }
    // get char code
    function keyPress(e){
       if(mySel){
            var char = e.which || e.keyCode;

            // prevent default behaviour
            e.preventDefault();
            var c;
            if(char == 13) c = '\n'; // enter
            else c = String.fromCharCode(char);
            mySel.text = mySel.text.substring(0, mySel.cursorIdx) + c + mySel.text.substring(mySel.cursorIdx, mySel.text.length);
            mySel.cursorIdx += 1;

            // clear the ghost canvas for next time
            clear(gctx);
            // invalidate because we might need the selection border to disappear
            invalidate();
            addHistoric();
       }
    }

    function invalidate() {
      canvasValid = false;
      if(mySel){
        if(mySel.text.length > 0) mySel.writeDefaultText = false;
        else mySel.writeDefaultText = true;
      }
    }

    function isInsideBox(mx, my){
        var l = boxes.length;
        for (var i = 0; i < l; i++) {
           if(boxes[i].isInBox(mx, my)) return boxes[i];
        }
        return false;
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
          my = e.pageY - offsetY
    }

    function reDraw(){
        invalidate();
        mainDraw();
    }
    function focusOut(){
        mySel = null;
        reDraw();
    }

    function wrapWord(ctx, word, maxWidth){

        var line = '';
        var wrap = [];
        for(var n = 0; n < word.length; n++){

          var testLine = line + word[n];
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            wrap.push(line);
            line = word[n];
          }
          else line = testLine;
        }
        wrap.push(line);

        return wrap;
    }

    function wrapSentence(ctx, text, x, y, maxWidth, lineH) {
        var words = text.split(' ');
        var line = '';

        var maxTextWidth = 0;
        var maxTextHeight = 0;
        var maxWidthWold = 0;
        var infoLines = [];
        var infoLn;

        for(var n = 0; n < words.length; n++) {
          // if one word is to big, split it
          if(ctx.measureText(words[n]).width > maxWidth){
            var worldArray = wrapWord(ctx, words[n], maxWidth);
            words = words.slice(0, n).concat( worldArray ).concat( words.slice(n+1));
          }

          console.log(words);

          maxWidthWold = Math.max(maxWidthWold, ctx.measureText(words[n]).width);


          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;


          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
//            if(line.slice(-1) == ' ') line = line.substring(0, line.length - 1);
            infoLn = {x: x, y: y, width: ctx.measureText(line).width, height: lineH, nbKey: line.length, txt: line};
            infoLines.push(infoLn);
            line = words[n] + ' ';
            y += lineH;
            maxTextHeight += lineH;
          }
          else {
            line = testLine;
            var metrics = ctx.measureText(testLine);
            maxTextWidth = Math.max(metrics.width, maxTextWidth);

          }
        }
//        if(line.slice(-1) == ' ') line = line.substring(0, line.length - 1);
//        ctx.fillText(line, x, y);
        infoLn = {x: x, y: y, width: ctx.measureText(line).width, height: lineH, nbKey: line.length, txt: line};
        infoLines.push(infoLn);

        return {width: maxTextWidth - 9, infoLines: infoLines, height: maxTextHeight + lineH, maxWidthWold: maxWidthWold};
    }

    // x,y coord corner top-left
    function wrapText(ctx, text, x, y, maxWidth, lineH){
        var lines = text.split('\n');
        var maxTextWidth = 0;
        var maxTextHeight = 0;
        var maxWidthWold = 0;
        var infoLines = [];

        for (var i = 0; i < lines.length; i++) {
            var textDimension = wrapSentence(ctx, lines[i], x, y, maxWidth, lineH);
            maxTextWidth = Math.max(textDimension.width, maxTextWidth);

            for(var j=0; j < textDimension.infoLines.length; ++j){
               infoLines.push(textDimension.infoLines[j]);
            }
            y += textDimension.height;
            maxTextHeight += textDimension.height;
//            maxWidthWold = Math.max(maxWidthWold, textDimension.maxWidthWold);
        }
        maxWidthWold = Math.max(ctx.measureText("TT").width, 10);
        return {widthText: maxTextWidth, infoLines: infoLines, height: maxTextHeight, maxWidthWold: 10};
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

    // set the historic button
    document.getElementById('previewHistoric').onclick = function(){
        previewHistoric();
    }
    document.getElementById('nextHistoric').onclick = function(){
        nextHistoric();
    }

 })(window);





































