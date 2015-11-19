var classError = "error" + " ";


function emailCheck(id) {
    var input = document.getElementById(id);

//     work at 99.99%
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (regex.test(input.value)){
        input.className = input.className.replace(classError, "");
        return true;
    }
    else{
        input.className = classError +" "+ input.className;
        input.placeholder = "Write a valid email address"; //TODO
        input.value = "";
        return false;
    }

};


function passwordCheck(idPassword, idVerifyingPassword) {
    var inputPass = document.getElementById(idPassword);

    // password for login
    if(!idVerifyingPassword){
        // if the password does not have been written
        if(inputPass.value.length == 0){
            inputPass.className = classError + " " + inputPass.className;
            inputPass.placeholder = "Write your password"; //TODO
            return false;
        }
        else{
            inputPass.className = inputPass.className.replace(classError, "");
            return true;
        }
    }

    // when it is for register (there is a verifying password)
    else{

        var inputVerify = document.getElementById(idVerifyingPassword);
        var regex = ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/i;

//        if the 2 given passwords are not correct
        if(inputVerify.value != inputPass.value){
            inputPass.className = classError + " " + inputPass.className;
            inputVerify.className = classError + " " + inputVerify.className;
            inputPass.placeholder = "Not the same password"; // TODO
            inputVerify.placeholder = "Not the same password"; // TODO
            inputPass.value = "";
            inputVerify.value = "";

            return false;
        }
//        if the password is correct
        else if (regex.test(inputPass.value)){
            inputPass.className = inputPass.className.replace(classError, "");
            inputVerify.className = inputVerify.className.replace(classError, "");
            return true;
        }
//        if the password do not set to the regex
        else{
            inputPass.className = classError + " " + input.className;
            inputPass.placeholder = "8-30 Characters, 1 upper case, 1 lowercase, 1 number";
            inputPass.value = "";
            inputVerify.value = "";
            return false;
        }
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
        label.className = classError + " " + label.className;
        return false;
    }


}




