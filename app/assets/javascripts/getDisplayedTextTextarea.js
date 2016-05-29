
$(function(){
    var textarea = document.getElementById("truc");

    textarea.style.width = 400;
     var p = $('#p')

    function resizeTextarea(){
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    textarea.onkeyup = function(){
        resizeTextarea();
        var t = getDisplayedTextTextarea(textarea);
        p.text(t);
    }



    function getDisplayedTextTextarea(textarea){
        var test = textarea.cloneNode();
        test.value = "";
        document.body.appendChild(test);

        var text = "";
        if(textarea.value.length > 0){
            var paragraphs = textarea.value.split('\n');
            var words;
            for(var i=0; i< paragraphs.length; ++i){
                words = paragraphs[i].split(' ');
                for(var j=0; j<words.length; ++j){
                    text += a(textarea, test, words[j]);
                    text += ' ';
                }
                text += '\n';
            }
        }
        document.body.removeChild(test);
        return text;
    }

    function a(textarea, test, word){
        var newWord = "";
        var oldH;
        var newH;

        for(var i=0; i<word.length; ++i){
            oldH = test.scrollHeight;

            test.value += word[i];
            test.style.height = 'auto';
            test.style.height = test.scrollHeight + 'px';
            newH = test.scrollHeight;
            if(newH > oldH){
                newWord += '\n';
            }
            newWord += word[i];
        }
        return newWord;
    }







});
