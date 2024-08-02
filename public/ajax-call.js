var resetPasswordClickEvt = document.getElementById("resetPasswordClickEvt");

resetPasswordClickEvt.addEventListener("click", resetPasswordClicked);

function resetPasswordClicked(event) {
  event.preventDefault();
  var token = document.location.href.split("token=")[1];
  var data =
    "newPassword=" +
    document.getElementById("newPassword").value +
    "&verifyPassword=" +
    document.getElementById("verifyPassword").value +
    "&token=" +
    token;
  ajaxCall(
    data,
    "http://localhost:8000/api/users/auth/reset_password",
    function (status, response) {
      if (status < 400) {
        alert(
          "If the email address you provided is found in our system, an email will arrive within ten minutes. If no email arrives, please try a different email address that you might have used when you registered.\n\nIf you can not find the correct email address, contact us at general@glassinteractive.com and we will work with you to get your password changed.",
        );
      } else {
        alert("Error", status);
      }
    },
  );
}

function ajaxCall(data, url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url, true);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      console.log("xhttp.response", xhttp.response);
      return callback(this.status, xhttp.response);
    }
  };
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(data);
}
