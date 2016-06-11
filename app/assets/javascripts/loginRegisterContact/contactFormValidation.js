(function(){
    var formContact = document.getElementById('contactForm');
    document.getElementById("contactButton").onclick = function(){
        var result = emailCheck("emailContact");
        result = inputNonEmpty("textContact") && result;
        if(result){
           formContact.submit();
        }
    }
})();