(function(){
    var formRegister = document.getElementById("formRegister");
    document.getElementById("buttonReg").onclick = function(){
        var result = emailCheck("emailReg");
        result = passwordCheck("passwordReg", "confirmPassword") && result;
        result = nameCheck("lastNameReg") && result;
        result = nameCheck("firstNameReg") && result;
        if(result){
           formRegister.submit();
        }
    }
})();