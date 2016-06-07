(function(){
    var formRegister = document.getElementById("formRegister");
    document.getElementById("buttonReg").onclick = function(){
        var result = emailCheck("emailReg");
        result = passwordCheck("passwordReg", "confirmPassword") && result;
        result = checkboxCheck("checkboxReg", "labelTermCondition") && result;
        if(result){
           formRegister.submit();
        }
    }
})();