(function(){
    var formLogin = document.getElementById('loginForm');
    document.getElementById("loginButton").onclick = function(){
        var result = emailCheck("emailLogin");
        result = inputNonEmpty("passwordLogin") && result;
        if(result){
           formLogin.submit();
        }
    }
})();