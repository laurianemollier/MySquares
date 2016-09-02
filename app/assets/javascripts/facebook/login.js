
  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1454825051201753',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });


  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
       connect();
    }
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


  function connect() {
    FB.api('/me', function(response) {
       var name = response.name;
       console.log(response);
    });
  }