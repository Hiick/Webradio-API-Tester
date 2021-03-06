// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"scss/main.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

require("./scss/main.scss");

var firebaseConfig = {
  apiKey: "AIzaSyAhoKFp3X1BremGeZ_aeNoFXd715vhQS4U",
  authDomain: "webradio-stream.firebaseapp.com",
  databaseURL: "https://webradio-stream.firebaseio.com",
  projectId: "webradio-stream",
  storageBucket: "webradio-stream.appspot.com"
};
firebase.initializeApp(firebaseConfig);
$(document).ready(function () {
  $(".show_token").hide();
  $(".image-upload").hide();
  $(".image-upload-channel").hide();
  $(".show_login_token").hide();
  $("#forgot_pass_form").hide();
  $("#sub_form").hide();
  $('#payment').hide();
  $('.confirm_pay').hide();
  $('.confirm_password').hide();
  var user = {};
  var channel = {};
  var downloadURL;
  var downloadURLChannel;
  var downloadURLRadio;

  var reset = function reset() {
    $("#btn_submit").attr("disabled", false);
    $("#btn_submit").css("background-color", "#EF0051");
    $("#btn_submit").hover(function () {
      $(".btn_submit").css("background-color", "#D31052");
    });
    $(".btn_submit").attr("disabled", false);
    $(".btn_submit").css("background-color", "#EF0051");
    $(".btn_submit").hover(function () {
      $(".btn_submit").css("background-color", "#D31052");
    });
  };

  var disable = function disable() {
    $("#btn_submit").attr("disabled", true);
    $("#btn_submit").css("background-color", "gray");
    $(".btn_submit").attr("disabled", true);
    $(".btn_submit").css("background-color", "gray");
  };

  $("#register_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var data = {
      email: $("#register_email").val(),
      username: $("#register_username").val(),
      password: $("#register_password").val()
    };
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/auth/register',
      data: data,
      success: function success(response) {
        reset();

        if (response.message.token) {
          localStorage.setItem("token", response.message.token);
          $('#register_response').html("");
          $('#register_json_response').html(JSON.stringify(response, undefined, 4));
          $(".show_token").show();
          $("#new_token").html(response.message.token);
        } else {
          $('#register_response').html("");
          $('#register_json_response').html(JSON.stringify(response, undefined, 4));
        }
      },
      error: function error(err) {
        reset();
        $('#register_response').html("");
        $('#register_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
      }
    });
  });
  $("#login_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var data = {
      email: $("#login_email").val(),
      password: $("#login_password").val()
    };
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/auth/login',
      data: data,
      success: function success(response) {
        reset();

        if (response.message.token) {
          localStorage.setItem("token", response.message.token);
          $('#login_response').html("");
          $('#login_json_response').html(JSON.stringify(response, undefined, 4));
          $(".show_login_token").show();
          $("#new_login_token").html(response.message.token);
        } else {
          $('#login_response').html("");
          $('#login_json_response').html(JSON.stringify(response, undefined, 4));
        }
      },
      error: function error(err) {
        reset();
        $('#login_response').html("");
        $('#login_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
      }
    });
  });
  $("#forgot_pass_email_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var data = {
      email: $("#forgot_pass_email_email").val()
    };
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/auth/forgot/password',
      data: data,
      success: function success(response) {
        reset();
        $('#forgot_response').html("");
        $('#forgot_json_response').html(JSON.stringify(response, undefined, 4));
        $("#forgot_pass_email_form").hide();
        $("#forgot_pass_form").show();
      },
      error: function error(err) {
        reset();
        $('#forgot_response').html("");
        $('#forgot_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
      }
    });
  });
  $("#forgot_pass_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var url = $("#forgot_pass_url").val();
    var data = {
      password: $("#forgot_pass_password").val()
    };
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function success(response) {
        reset();
        $('#forgot_response').html("");
        $('#forgot_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();
        $('#forgot_response').html("");
        $('#forgot_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
      }
    });
  });
  $("#get_user_connected_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/logged',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_user_connected_response').html("");
        $('#get_user_connected_json_response').html(JSON.stringify(response, undefined, 4));
        user = response;
        setTimeout(function () {
          $('#update_user_connected_username').val(user.user[0].username);
          $('#profil').attr('src', user.user[0].avatar);
          $(".image-upload").show();
        }, 2000);
      },
      error: function error() {
        reset();
        $('#get_user_connected_response').html("");
        $('#get_user_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
      }
    });
  });
  $('#cameraInput').on('change', function () {
    var selectedFile = event.target.files[0];
    var filename = $('#cameraInput').val().replace(/C:\\fakepath\\/i, '');
    var storageRef = firebase.storage().ref('/API_Tester/' + filename);
    var upload = storageRef.put(selectedFile);
    upload.on('state_changed', function (snapshot) {}, function (error) {
      console.log(error);
    }, function () {
      downloadURL = upload.snapshot.downloadURL;
      $('#profil').attr('src', downloadURL);
    });
  });
  $("#update_user_connected_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var data = {
      avatar: $("#profil").attr('src'),
      username: $("#update_user_connected_username").val()
    };
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/' + user.user[0].user_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: data,
      success: function success(response) {
        reset();
        $('#update_user_connected_response').html("");
        $('#update_user_connected_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#update_user_connected_response').html("");
          $('#update_user_connected_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#update_user_connected_response').html("");
          $('#update_user_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#update_user_password_connected_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem('token');
    var data = {
      password: $("#update_user_password_connected_password").val()
    };
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/password/' + user.user[0].user_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: data,
      success: function success(response) {
        reset();
        $('#update_user_password_connected_response').html("");
        $('#update_user_password_connected_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#update_user_password_connected_response').html("");
          $('#update_user_password_connected_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#update_user_password_connected_response').html("");
          $('#update_user_password_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_user_channel").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/' + user.user[0].channel_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_user_channel_response').html("");
        $('#get_user_channel_json_response').html(JSON.stringify(response, undefined, 4));
        channel = response;
        setTimeout(function () {
          $('#update_user_channel_name').val(channel.channel.channel_name);
          $('#profil_channel').attr('src', channel.channel.avatar);
          $(".image-upload-channel").show();
        }, 2000);
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_user_channel_response').html("");
          $('#get_user_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_user_channel_response').html("");
          $('#get_user_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $('#cameraInputChannel').on('change', function () {
    var selectedFileChannel = event.target.files[0];
    var filenameChannel = $('#cameraInputChannel').val().replace(/C:\\fakepath\\/i, '');
    var storageRefChannel = firebase.storage().ref('/API_Tester/' + filenameChannel);
    var upload = storageRefChannel.put(selectedFileChannel);
    upload.on('state_changed', function (snapshot) {}, function (error) {
      console.log(error);
    }, function () {
      downloadURLChannel = upload.snapshot.downloadURL;
      $('#profil_channel').attr('src', downloadURLChannel);
    });
  });
  $("#update_user_channel_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var data = {
      avatar: $("#profil_channel").attr('src'),
      name: $("#update_user_channel_name").val()
    };
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/update/' + channel.channel._id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: data,
      success: function success(response) {
        reset();
        $('#update_user_channel_response').html("");
        $('#update_user_channel_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#update_user_channel_response').html("");
          $('#update_user_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#update_user_channel_response').html("");
          $('#update_user_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#create_signalement_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var channel_id = $("#create_signalement_channel_id").val();
    var data = {
      motif: $("#format").val()
    };
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/authorized/signalements/channel/' + channel_id,
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#create_signalement_response').html("");
        $('#create_signalement_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#create_signalement_response').html("");
          $('#create_signalement_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#create_signalement_response').html("");
          $('#create_signalement_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_radios_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/auth/radios/all',
      success: function success(response) {
        reset();
        $('#get_all_radios_response').html("");
        $('#get_all_radios_json_response').html(JSON.stringify(response, undefined, 4));
        channel = response;
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_radios_response').html("");
          $('#get_all_radios_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_radios_response').html("");
          $('#get_all_radios_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_one_radio_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var radio_id = $("#get_one_radio_id").val();
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/radios/' + radio_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_one_radio_response').html("");
        $('#get_one_radio_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_one_radio_response').html("");
          $('#get_one_radio_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_one_radio_response').html("");
          $('#get_one_radio_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_channel_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/all',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_channel_response').html("");
        $('#get_all_channel_json_response').html(JSON.stringify(response, undefined, 4));
        channel = response;
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_channel_response').html("");
          $('#get_all_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_channel_response').html("");
          $('#get_all_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_channel_in_live_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/stream/all',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_channel_in_live_response').html("");
        $('#get_all_channel_in_live_json_response').html(JSON.stringify(response, undefined, 4));
        channel = response;
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_channel_in_live_response').html("");
          $('#get_all_channel_in_live_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_channel_in_live_response').html("");
          $('#get_all_channel_in_live_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_one_channel_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var channel_id = $("#get_one_channel_id").val();
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/' + channel_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_one_channel_response').html("");
        $('#get_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_one_channel_response').html("");
          $('#get_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_one_channel_response').html("");
          $('#get_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/users',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_users_response').html("");
        $('#get_all_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_users_response').html("");
          $('#get_all_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_users_response').html("");
          $('#get_all_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_active_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/active',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_active_users_response').html("");
        $('#get_all_active_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_active_users_response').html("");
          $('#get_all_active_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_active_users_response').html("");
          $('#get_all_active_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_inactive_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/inactive',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_inactive_users_response').html("");
        $('#get_all_inactive_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          reset();
          $('#get_all_inactive_users_response').html("");
          $('#get_all_inactive_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          reset();
          $('#get_all_inactive_users_response').html("");
          $('#get_all_inactive_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_one_user_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var user_id = $("#get_one_user_id").val();
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/user/' + user_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_one_user_response').html("");
        $('#get_one_user_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_one_user_response').html("");
          $('#get_one_user_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_one_user_response').html("");
          $('#get_one_user_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_banish_channels_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/banish/all',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_banish_channels_response').html("");
        $('#get_all_banish_channels_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_banish_channels_response').html("");
          $('#get_all_banish_channels_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_banish_channels_response').html("");
          $('#get_all_banish_channels_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#banish_one_channel_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var channel_id = $("#banish_one_channel_id").val();
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/banish/' + channel_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#banish_one_channel_response').html("");
        $('#banish_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#banish_one_channel_response').html("");
          $('#banish_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#banish_one_channel_response').html("");
          $('#banish_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#unbanish_one_channel_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var channel_id = $("#unbanish_one_channel_id").val();
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/unbanish/' + channel_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#unbanish_one_channel_response').html("");
        $('#unbanish_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#unbanish_one_channel_response').html("");
          $('#unbanish_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#unbanish_one_channel_response').html("");
          $('#unbanish_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $('#cameraInputRadio').on('change', function () {
    var selectedFileRadio = event.target.files[0];
    var filenameRadio = $('#cameraInputRadio').val().replace(/C:\\fakepath\\/i, '');
    var storageRefChannel = firebase.storage().ref('/API_Tester/' + filenameRadio);
    var upload = storageRefChannel.put(selectedFileRadio);
    upload.on('state_changed', function (snapshot) {}, function (error) {
      console.log(error);
    }, function () {
      downloadURLRadio = upload.snapshot.downloadURL;
      console.log(downloadURLRadio);
      $('#radio').attr('src', downloadURLRadio);
    });
  });
  $("#create_radio_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var data;

    if ($("#radio").attr('src') === '/image_1.5309ecb3.png') {
      data = {
        logo: '',
        radio_name: $("#create_radio_name").val(),
        direct_url: $("#create_radio_url").val()
      };
    } else {
      data = {
        logo: $("#radio").attr('src'),
        radio_name: $("#create_radio_name").val(),
        direct_url: $("#create_radio_url").val()
      };
    }

    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/authorized/radios',
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#create_radio_response').html("");
        $('#create_radio_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#create_radio_response').html("");
          $('#create_radio_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#create_radio_response').html("");
          $('#create_radio_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#delete_one_radio_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var radio_id = $("#delete_one_radio_id").val();
    $.ajax({
      type: "DELETE",
      url: 'https://webradio-stream.herokuapp.com/authorized/radios/delete/' + radio_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#delete_one_radio_response').html("");
        $('#delete_one_radio_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#delete_one_radio_response').html("");
          $('#delete_one_radio_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#delete_one_radio_response').html("");
          $('#delete_one_radio_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_all_signalements_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/signalements/all',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_all_signalements_response').html("");
        $('#get_all_signalements_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_all_signalements_response').html("");
          $('#get_all_signalements_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_signalements_response').html("");
          $('#get_all_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_channel_signalements").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var channel_id = $("#get_channel_signalements_id").val();
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/signalements/channel/' + channel_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_channel_signalements_response').html("");
        $('#get_channel_signalements_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#get_channel_signalements_response').html("");
          $('#get_channel_signalements_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_channel_signalements_response').html("");
          $('#get_channel_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#update_channel_signalements_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var signalement_id = $("#update_channel_signalements_id").val();
    var data = {
      motif: $("#format-update").val()
    };
    $.ajax({
      type: "PUT",
      url: 'https://webradio-stream.herokuapp.com/authorized/signalement/update/' + signalement_id,
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#update_channel_signalements_response').html("");
        $('#update_channel_signalements_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#update_channel_signalements_response').html("");
          $('#update_channel_signalements_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#update_channel_signalements_response').html("");
          $('#update_channel_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#delete_signalements_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    var signalement_id = $("#delete_signalements_id").val();
    $.ajax({
      type: "DELETE",
      url: 'https://webradio-stream.herokuapp.com/authorized/signalements/' + signalement_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#delete_signalements_response').html("");
        $('#delete_signalements_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#delete_signalements_response').html("");
          $('#delete_signalements_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#delete_signalements_response').html("");
          $('#delete_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_signalements_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/signalements',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_signalements_response').html("");
        $('#stats_all_signalements_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_signalements_response').html("");
          $('#stats_all_signalements_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_signalements_response').html("");
          $('#stats_all_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/users',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_users_response').html("");
        $('#stats_all_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_users_response').html("");
          $('#stats_all_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_users_response').html("");
          $('#stats_all_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_subs_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/subscribers',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_subs_response').html("");
        $('#stats_all_subs_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_subs_response').html("");
          $('#stats_all_subs_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_all_signalements_response').html("");
          $('#get_all_signalements_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_active_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/users/active',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_active_users_response').html("");
        $('#stats_all_active_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_active_users_response').html("");
          $('#stats_all_active_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_active_users_response').html("");
          $('#stats_all_active_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_inactive_users_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/users/inactive',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_inactive_users_response').html("");
        $('#stats_all_inactive_users_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_inactive_users_response').html("");
          $('#stats_all_inactive_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_inactive_users_response').html("");
          $('#stats_all_inactive_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_listen_streams_radios_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/listen',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_listen_streams_radios_response').html("");
        $('#stats_all_listen_streams_radios_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_listen_streams_radios_response').html("");
          $('#stats_all_listen_streams_radios_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_listen_streams_radios_response').html("");
          $('#stats_all_listen_streams_radios_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_listen_streams_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/all/listen/streams',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_listen_streams_response').html("");
        $('#stats_all_listen_streams_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_listen_streams_response').html("");
          $('#stats_all_listen_streams_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_listen_streams_response').html("");
          $('#stats_all_listen_streams_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_listen_radios_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/all/listen/radios',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_listen_radios_response').html("");
        $('#stats_all_listen_radios_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_listen_radios_response').html("");
          $('#stats_all_listen_radios_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_listen_radios_response').html("");
          $('#stats_all_listen_radios_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_radios_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/radios',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_radios_response').html("");
        $('#stats_all_radios_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_radios_response').html("");
          $('#stats_all_radios_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_radios_response').html("");
          $('#stats_all_radios_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#stats_all_created_stream_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/stats/stream',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#stats_all_created_stream_response').html("");
        $('#stats_all_created_stream_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#stats_all_created_stream_response').html("");
          $('#stats_all_created_stream_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#stats_all_created_stream_response').html("");
          $('#stats_all_created_stream_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#sub_to_stream_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    $("#sub_to_stream_form").hide();
    $("#payment").show();
  });
  $("#number_pay").on('keypress change', function () {
    $("#number_pay").val(function (index, value) {
      return value.replace(/[^0-9]/g, "").replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
    });
  });
  $("#payment").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var data = {
      card_number: $("#number_pay").val(),
      card_exp_month: $("#month_pay").val(),
      card_exp_year: $("#year_pay").val(),
      card_cvc: $("#ccv_pay").val(),
      email: $("#email_pay").val(),
      plan: $("#plan_pay").val()
    };
    var token = localStorage.getItem("token");
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/authorized/subscribe/payment',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: data,
      success: function success(response) {
        reset();
        $('#sub_to_stream_response').html("");
        $('#sub_to_stream_json_response').html(JSON.stringify(response, undefined, 4));
        $('.confirm_pay').show();
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#sub_to_stream_response').html("");
          $('#sub_to_stream_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#sub_to_stream_response').html("");
          $('#sub_to_stream_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#create_new_user_form").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    $('.confirm_password').hide();
    disable();
    var data = {
      email: $("#create_new_user_email").val(),
      username: $("#create_new_user_username").val()
    };
    var token = localStorage.getItem("token");
    $.ajax({
      type: "POST",
      url: 'https://webradio-stream.herokuapp.com/authorized/users/create',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: data,
      success: function success(response) {
        reset();
        $('#create_new_user_response').html("");
        $('#create_new_user_json_response').html(JSON.stringify(response, undefined, 4));
        $('.confirm_password').show();
      },
      error: function error(err) {
        reset();

        if (err.responseJSON) {
          $('#create_new_user_response').html("");
          $('#create_new_user_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#create_new_user_response').html("");
          $('#create_new_user_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  var radio_id;
  var channel_id;
  $("#show_radios_channels").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/auth/radios/all',
      success: function success(response) {
        reset();
        radio_id = response.radios[0]._id;
        $(".radio_logo").css("display", 'block');
        $(".radio_name").css("display", 'block');
        $(".fa-heart").css("display", 'block');
        $(".radio_logo").attr("src", response.radios[0].logo);
        $(".radio_name").html(response.radios[0].radio_name);
      },
      error: function error(err) {
        console.log(err);
      }
    });
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channels/all',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        channel_id = response.channels[0]._id;
        $(".channel_logo").css("display", 'block');
        $(".channel_name").css("display", 'block');
        $(".channel_logo").attr("src", response.channels[0].avatar);
        $(".channel_name").html(response.channels[0].channel_name);
      },
      error: function error(err) {
        console.log(err);
      }
    });
  });
  var clicked_radio = false;
  var clicked_channel = false;
  $('.radio_heart').on('click', function (e) {
    e.preventDefault();

    if (clicked_radio === false) {
      $('.radio_heart').removeClass('far').addClass('fas');
      $('.fas').css('color', 'red');

      if (Object.entries(user).length === 0) {
        clicked_radio = false;
        console.log('Merci de récupérer les informations utilisateur pour continuer');
        $('.radio_heart').removeClass('fas').addClass('far');
      } else {
        clicked_radio = true;
        $.ajax({
          type: "POST",
          url: 'https://webradio-stream.herokuapp.com/authorized/radio/favorite/' + user.user[0].user_id + '?radio_id=' + radio_id,
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          success: function success(response) {
            reset();
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html(JSON.stringify(response, undefined, 4));
          },
          error: function error(err) {
            if (err.responseJSON) {
              $('#add_remove_fav_response').html("");
              $('#add_remove_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            } else {
              $('#add_remove_fav_response').html("");
              $('#add_remove_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
            }
          }
        });
      }
    } else {
      clicked_radio = false;
      $('.radio_heart').removeClass('fas').addClass('far');
      $.ajax({
        type: "DELETE",
        url: 'https://webradio-stream.herokuapp.com/authorized/radio/favorite/' + user.user[0].user_id + '?radio_id=' + radio_id,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function success(response) {
          reset();
          $('#add_remove_fav_response').html("");
          $('#add_remove_fav_json_response').html(JSON.stringify(response, undefined, 4));
        },
        error: function error(err) {
          if (err.responseJSON) {
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
          } else {
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
          }
        }
      });
    }
  });
  $('.channel_heart').on('click', function (e) {
    e.preventDefault();

    if (clicked_channel === false) {
      clicked_channel = true;
      $('.channel_heart').removeClass('far').addClass('fas');
      $('.fas').css('color', 'red');

      if (Object.entries(user).length === 0) {
        clicked_channel = false;
        console.log('Merci de récupérer les informations utilisateur pour continuer');
        $('.channel_heart').removeClass('fas').addClass('far');
      } else {
        $.ajax({
          type: "POST",
          url: 'https://webradio-stream.herokuapp.com/authorized/channel/favorite/' + user.user[0].user_id + '?channel_id=' + channel_id,
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          success: function success(response) {
            reset();
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html(JSON.stringify(response, undefined, 4));
          },
          error: function error(err) {
            if (err.responseJSON) {
              $('#add_remove_fav_response').html("");
              $('#add_remove_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            } else {
              $('#add_remove_fav_response').html("");
              $('#add_remove_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
            }
          }
        });
      }
    } else {
      clicked_channel = false;
      $('.channel_heart').removeClass('fas').addClass('far');
      $.ajax({
        type: "DELETE",
        url: 'https://webradio-stream.herokuapp.com/authorized/channel/favorite/' + user.user[0].user_id + '?channel_id=' + channel_id,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function success(response) {
          reset();
          $('#add_remove_fav_response').html("");
          $('#add_remove_fav_json_response').html(JSON.stringify(response, undefined, 4));
        },
        error: function error(err) {
          if (err.responseJSON) {
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
          } else {
            $('#add_remove_fav_response').html("");
            $('#add_remove_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
          }
        }
      });
    }
  });
  $("#get_fav_radio").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/radio/favorite/' + user.user[0].user_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_fav_response').html("");
        $('#get_fav_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        if (err.responseJSON) {
          $('#get_fav_response').html("");
          $('#get_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_fav_response').html("");
          $('#get_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
  $("#get_fav_channel").on('submit', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    disable();
    var token = localStorage.getItem("token");
    $.ajax({
      type: "GET",
      url: 'https://webradio-stream.herokuapp.com/authorized/channel/favorite/' + user.user[0].user_id,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function success(response) {
        reset();
        $('#get_fav_response').html("");
        $('#get_fav_json_response').html(JSON.stringify(response, undefined, 4));
      },
      error: function error(err) {
        if (err.responseJSON) {
          $('#get_fav_response').html("");
          $('#get_fav_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
        } else {
          $('#get_fav_response').html("");
          $('#get_fav_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
        }
      }
    });
  });
});
},{"./scss/main.scss":"scss/main.scss"}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60529" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/API_Tester.e31bb0bc.js.map