(function(){

// login area

    // hide the login div for the beginning
    var loginDiv = document.getElementById("loginDiv");
    loginDiv.style.display = "none";

    // display login div when click on the login button
    var loginButton = document.getElementById("loginButton");
    loginButton.onclick = function(){
        this.style.display = "none";
        loginDiv.style.display = "block";
    }



// register area

    // hide the register div for the beginning
    var registerDiv = document.getElementById("registerDiv");
    registerDiv.style.display = "none";

    // display register div when click on the register button
    var registerButton = document.getElementById("registerButton");
    registerButton.onclick = function(){
        this.style.display = "none";
        registerDiv.style.display = "block";
    }

})();