function setCookie(cookieName, cookieValue, expirationDays) {
  var d = new Date();
  d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(";");
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

function changeTheme(theme) {
  if (theme === "dark") {
    $("html").removeClass("light").addClass("dark");
    $("#switch-mode-icon").removeClass("fa-moon").addClass("fa-sun");
    $("#switch-mode-text").text("light");
  } else {
    $("html").removeClass("dark").addClass("light");
    $("#switch-mode-icon").removeClass("fa-sun").addClass("fa-moon");
    $("#switch-mode-text").text("dark");
  }

  // Set the theme value in the cookie
  setCookie("theme", theme, 7);
}

function showLoader() {
  $(".loader").fadeIn();
  $(".loader__figure").delay(350).fadeIn("slow");
  $(".loader__label").delay(350).fadeIn("slow");
}

function hideLoader() {
  $(".loader").fadeOut();
  $(".loader__figure").delay(350).fadeOut("slow");
  $(".loader__label").delay(350).fadeOut("slow");
}

$(document).ready(function () {
  hideLoader();

  var switchMode = $("#switch-theme");
  var switchModeIcon = $("#switch-mode-icon");
  var scrollbar = $(".scrollbar");

  // Retrieve the theme value from the cookie
  var theme = getCookie("theme");

  if (theme === "dark") {
    changeTheme("dark");
  } else {
    changeTheme("light");
  }

  switchMode.click(function () {
    scrollbar.toggleClass("light dark");

    if (scrollbar.hasClass("light")) {
      changeTheme("light");
    } else {
      changeTheme("dark");
    }
  });
});