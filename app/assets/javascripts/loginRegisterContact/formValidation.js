var classError = "error" + " ";
var nonEmptyRegex = /([^\s])/;

function inputNonEmpty(id){
    var input = document.getElementById(id);
    if(nonEmptyRegex.test(input.value)){
        input.placeholder = ""; //TODO
        input.className = input.className.replace(classError, "");
        return true;
    }
    else{
        input.placeholder = formValidation_fieldRequired; 
        if(input.className.indexOf(classError) == -1){
            input.className = classError + input.className;
        }
        input.value = "";
        return false;
    }

}

function checkRegex(id, regex, placeholder){
    var input = document.getElementById(id);

    if (regex.test(input.value)){
        input.className = input.className.replace(classError, "");
        return true;
    }
    else{
        if(input.className.indexOf(classError) == -1){
            input.className = classError + input.className;
        }
        input.placeholder = placeholder;
        input.value = "";
        return false;
    }
}

function nameCheck(id){
    var regex = /^[a-zA-Z àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/i;
    return checkRegex(id, regex, formValidation_nameComporteJustLetter);
}
function emailCheck(id) {
//     work at 99.99%
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return checkRegex(id, regex, formValidation_writeValideEmail);
};


function passwordCheck(idPassword, idVerifyingPassword) {

    inputNonEmpty(idPassword);
    inputNonEmpty(idVerifyingPassword);

    var inputPass = document.getElementById(idPassword);
    var inputVerify = document.getElementById(idVerifyingPassword);
    var regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/i; //TODO: verifier que la regex sois bien la meme que dan le scala form

    // if the password do not set to the regex
    if(!regexPassword.test(inputPass.value)){
        if(inputPass.className.indexOf(classError) == -1){
            inputPass.className = classError + inputPass.className;
        }
        inputPass.placeholder = formValidation_passwordRegex;
        inputVerify.placeholder = formValidation_confirmPassword;
        inputPass.value = "";
        inputVerify.value = "";

        return false;
    }
    // if the 2 given passwords are not correct
    else if(inputVerify.value != inputPass.value){
        if(inputPass.className.indexOf(classError) == -1){
            inputPass.className = classError + inputPass.className;
        }
        if(inputVerify.className.indexOf(classError) == -1){
            inputVerify.className = classError + inputVerify.className;
        }
        inputPass.placeholder = formValidation_notSamePassword;
        inputVerify.placeholder = formValidation_notSamePassword;
        inputPass.value = "";
        inputVerify.value = "";
        return false;
    }

    // if passwords are perfects
    else{
        inputPass.className = inputPass.className.replace(classError, "");
        inputVerify.className = inputVerify.className.replace(classError, "");
        return true;
    }

};


function checkboxCheck(id, idLabel){
    var input = document.getElementById(id);
    var label = document.getElementById(idLabel);
    if(input.checked){
        input.parentNode.className = input.parentNode.className.replace(classError, "");
        return true;
    }
    else{
        if(label.className.indexOf(classError) == -1){
            label.className = classError + label.className;
        }
        return false;
    }
};