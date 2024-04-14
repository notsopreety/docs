$(document).ready(function () {
  $("#registrationForm").submit(function (e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "api/signup.php",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.status === true) {
          $.createToast({
            title: "",
            message: response.message,
            type: "info",
          });
          setTimeout(function () {
            window.location.href = "verify.php";
          }, 1500);
        } else if (response.status === false) {
          $.createToast({
            title: "Error",
            message: response.message,
            type: "error",
          });
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      },
    });
  });
});

$(document).ready(function () {
  $("#otpForm").submit(function (e) {
    e.preventDefault();
    var otp = $("#otpcode").val();
    $.ajax({
      url: "api/otp_verify.php",
      type: "POST",
      dataType: "json",
      data: { otp: otp },
      success: function (response) {
        if (response.status) {
          $.createToast({
            title: "",
            message: response.message,
            type: "success",
          });
          setTimeout(function () {
            window.location.href = "signin.php";
          }, 1500);
        } else {
          $.createToast({
            title: "Error",
            message: response.message,
            type: "error",
          });
        }
      },
      error: function () {
        $.createToast({
          title: "Error",
          message: "An error occurred during OTP verification",
          type: "error",
        });
      },
    });
  });
});
$(document).ready(function () {
  $("#login-form").submit(function (event) {
    event.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      url: "api/signin.php",
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.status) {
          $.createToast({
            title: "",
            message: response.message,
            type: "success",
          });
          setTimeout(function () {
            window.location.href = "index.php";
          }, 1500);
        } else if (response.verified == 0) {
          $.createToast({
            title: "",
            message: response.message,
            type: "error",
          });
          setTimeout(function () {
            window.location.href = "verify.php";
          }, 1500);
        } else {
          $.createToast({
            title: "Error",
            message: response.message,
            type: "error",
          });
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
        $.createToast({
          title: "Error",
          message:
            "An error occurred while processing the login request. Please try again later.",
          type: "error",
        });
      },
    });
  });
});

$(document).ready(function () {
  function enableResendOTP() {
    $("#resend-otp-button").prop("disabled", false);
  }
  setTimeout(enableResendOTP, 60000);

  $("#resend-otp-form").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "api/resend_otp.php",
      data: $(this).serialize(),
      success: function (response) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse.status) {
          $.createToast({
            title: "",
            message: parsedResponse.message,
            type: "info",
          });
        } else {
          $.createToast({
            title: "Error",
            message: parsedResponse.message,
            type: "error",
          });
        }
      },
      error: function () {
        $.createToast({
          title: "Error",
          message: "An error occurred while resending OTP.",
          type: "error",
        });
      },
    });
  });
});

$(document).ready(function () {
  $(".edit-user-btn").click(function () {
    var userId = $(this).data("user-id");
    $.ajax({
      url: "admin/api/fetch_user.php",
      method: "POST",
      data: {
        user_id: userId,
      },
      dataType: "json",
      success: function (response) {
        $('#edit-user-form [name="user_id"]').val(response.id);
        $('#edit-user-form [name="name"]').val(response.name);
        $('#edit-user-form [name="email"]').val(response.email);
        $('#edit-user-form [name="is_verified"]').val(response.is_verified);
        $('#edit-user-form [name="token"]').val(response.token);
        $('#edit-user-form [name="account_type"]').val(response.account_type);
        $('#edit-user-form [name="api_key"]').val(response.api_key);
        $('#edit-user-form [name="apikey_active"]').val(response.apikey_active);

        $("#edit-user-modal").modal("show");
      },
      error: function (xhr, status, error) {
        console.log(error);
        $.createToast({
          title: "Error",
          message: "An error occurred while fetching user data.",
          type: "error",
        });
      },
    });
  });

  $("#edit-user-form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: "admin/api/update_user.php",
      method: "POST",
      data: $(this).serialize(),
      dataType: "json",
      success: function (response) {
        console.log(response);
        $("#edit-user-modal").modal("hide");
        $.createToast({
          title: "Success",
          message: "User data updated successfully.",
          type: "success",
        });
        reloadUserTable();
      },
      error: function (xhr, status, error) {
        console.log(error);
        $.createToast({
          title: "Error",
          message: "An error occurred while updating user data.",
          type: "error",
        });
      },
    });
  });
});

$(document).ready(function () {
  $(".delete-user-btn").click(function () {
    var userId = $(this).data("user-id");
    if (confirm("Are you sure you want to delete this user?")) {
      $.ajax({
        url: "admin/api/delete_user.php",
        method: "POST",
        data: {
          user_id: userId,
        },
        dataType: "json",
        success: function (response) {
          if (response.status === true) {
            $.createToast({
              title: "Success",
              message: response.message,
              type: "success",
            });

            reloadUserTable();
          } else {
            $.createToast({
              title: "Error",
              message: response.message,
              type: "error",
            });
          }
        },
        error: function (xhr, status, error) {
          console.log(error);
        },
      });
    }
  });
});

$(document).ready(function () {
  $(".add-balance-btn").click(function () {
    var userId = $(this).data("user-id");
    $("#add-balance-user-id").val(userId);
    $("#add-balance-modal").modal("show");
  });
  $("#add-balance-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: "admin/api/deposite_balance.php",
      method: "POST",
      data: $(this).serialize(),
      dataType: "json",
      success: function (response) {
        if (response.status === true) {
          $.createToast({
            title: "Success",
            message: response.message,
            type: "success",
          });
          reloadUserTable();
        } else {
          $.createToast({
            title: "Error",
            message: response.message,
            type: "error",
          });
        }
        $("#add-balance-modal").modal("hide");
      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
  });
});

function reloadUserTable() {
  $.ajax({
    url: "admin/api/fetch_users.php",
    method: "GET",
    dataType: "html",
    success: function (response) {
      $("#members-table-body").html(response);
      var userCount = $("#members-table-body tr").length;
      $("#user-count").text(userCount);
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

// api part

$(document).ready(function () {
  $(".edit-api-btn").click(function () {
    var apiId = $(this).data("api-id");

    // Clear the form before populating with new data
    $('#edit-api-form input[type="text"]').val("");
    $("#response-json").val("");
    $("#request-fields").val("");

    if (apiId === "newApi") {
      var exampleData = {
        api_id: "newApi",
        category: "ExampleCategory",
        name: "ExampleName",
        url: "https://example.com/api",
        cost: "0",
        method: "GET",
        description: "Example API Description",
        request_params: [
          {
            name: "param1",
            type: "string",
            range: "1-10",
            description: "Parameter 1",
            important: true,
          }
          // Add more example parameters as needed
        ],
        responses: {
          example: {
            data: {
              // Example response data
            },
          },
        },
      };

      // Now, populate the form with the example data
      $('#edit-api-modal [name="api_id"]').val(exampleData.api_id);
      $('#edit-api-modal [name="category"]').val(exampleData.category);
      $('#edit-api-modal [name="name"]').val(exampleData.name);
      $('#edit-api-modal [name="url"]').val(exampleData.url);
      $('#edit-api-modal [name="cost"]').val(exampleData.cost);
      $('#edit-api-modal [name="method"]').val(exampleData.method);
      $('#edit-api-modal [name="description"]').val(exampleData.description);

      var requestJSON = exampleData.request_params;
      var responsesJSON = exampleData.responses;

      // Function to format and display Request and Response data as editable input fields
      function formatData(container, data) {
        // Clear the existing content
        container.html("");
        for (var i = 0; i < data.length; i++) {
          var field = data[i];
          var fieldHTML = '<div class="formatted-field">';
          // Add each property as an editable input field
          for (var key in field) {
            fieldHTML += "<div><strong>" + key + ":</strong> ";

            // Check if the key is 'important' or 'type'
            if (key === 'important') {
              // Create a dropdown for 'important'
              fieldHTML += '<select class="form-select editable-field" name="' + key + '">';
              fieldHTML += '<option value="true">True</option>';
              fieldHTML += '<option value="false">False</option>';
              fieldHTML += '</select>';
            } else if (key === 'type') {
              // Create a dropdown for 'type'
              fieldHTML += '<select class="form-select editable-field" name="' + key + '">';
              fieldHTML += '<option value="int">Int</option>';
              fieldHTML += '<option value="string">String</option>';
              fieldHTML += '<option value="boolean">Boolean</option>';
              fieldHTML += '</select>';
            } else {
              // Create a regular input field for other keys
              fieldHTML += '<input type="text" class="form-control editable-field" name="' + key + '" value="' + field[key] + '">';
            }

            fieldHTML += '</div>';
          }
          fieldHTML += "</div>";
          fieldHTML += "<hr>";
          container.append(fieldHTML);
        }
      }

      var responseJsonTextarea = $("#response-json");
      responseJsonTextarea.val(JSON.stringify(responsesJSON, null, 4));

      formatData($("#request-fields"), requestJSON);

      $("#edit-api-modal").modal("show");
    } else {
      // Fetch data from the server for an existing API
      $.ajax({
        url: "admin/api/fetch_api.php",
        method: "POST",
        data: {
          apiId: apiId, // Change to "apiId" to match the parameter name in your fetch API script
        },
        dataType: "json",
        success: function (response) {
          $('#edit-api-modal [name="api_id"]').val(response.api_id);
          $('#edit-api-modal [name="category"]').val(response.category);
          $('#edit-api-modal [name="name"]').val(response.name);
          $('#edit-api-modal [name="url"]').val(response.url);
          $('#edit-api-modal [name="cost"]').val(response.cost);
          $('#edit-api-modal [name="method"]').val(response.method);
          $('#edit-api-modal [name="description"]').val(response.description);

          var requestJSON = JSON.parse(response.request_params);
          var responsesJSON;
          try {
            responsesJSON = JSON.parse(response.responses);
          } catch (error) {
            responsesJSON = response.responses;
            var imagePreview = $("#imagePreview");
            imagePreview.attr("src", responsesJSON);
            imagePreview.css("display", "block");
          }

          // Function to format and display Request and Response data as editable input fields
          function formatData(container, data) {
            // Clear the existing content
            container.html("");
            for (var i = 0; i < data.length; i++) {
              var field = data[i];
              var fieldHTML = '<div class="formatted-field">';

              // Add each property as an editable input field
              for (var key in field) {
                fieldHTML += "<div><strong>" + key + ":</strong> ";

                // Check if the key is 'important' or 'type'
                if (key === 'important') {
                  // Create a dropdown for 'important'
                  fieldHTML += '<select class="form-select editable-field" name="' + key + '">';
                  fieldHTML += '<option value="true">True</option>';
                  fieldHTML += '<option value="false">False</option>';
                  fieldHTML += '</select>';
                } else if (key === 'type') {
                  // Create a dropdown for 'type'
                  fieldHTML += '<select class="form-select editable-field" name="' + key + '">';
                  fieldHTML += '<option value="int">Int</option>';
                  fieldHTML += '<option value="string">String</option>';
                  fieldHTML += '<option value="boolean">Boolean</option>';
                  fieldHTML += '</select>';
                } else {
                  // Create a regular input field for other keys
                  fieldHTML += '<input type="text" class="form-control editable-field" name="' + key + '" value="' + field[key] + '">';
                }

                fieldHTML += '</div>';
              }

              fieldHTML += "</div>";
              fieldHTML += "<hr>";
              container.append(fieldHTML);
            }
          }

          var responseJsonTextarea = $("#response-json");

          responseJsonTextarea.val(JSON.stringify(responsesJSON, null, 4));

          formatData($("#request-fields"), requestJSON);

          $("#edit-api-modal").modal("show");
        },
        error: function (xhr, status, error) {
          console.log(error);
          $.createToast({
            title: "Error",
            message: "An error occurred while fetching API data.",
            type: "error",
          });
        },
      });
    }
  });

  $("#edit-api-form").submit(function (e) {
    e.preventDefault();

    // Get the API data from the form
    var apiData = {
      api_id: $("#api_id").val(),
      category: $("#category").val(),
      name: $("#name").val(),
      url: $("#url").val(),
      cost: $("#cost").val(),
      method: $("#method").val(),
      description: $("#description").val(),
    };

    // Get request data from the editable input fields
    var requestFields = [];
    $(".formatted-field").each(function () {
      var request = {};
      $(this)
        .find(".editable-field")
        .each(function () {
          var key = $(this).attr("name");
          var value = $(this).val();
          request[key] = value;
        });
      requestFields.push(request);
    });

    // Get response data from the JSON formatted textarea
    var responseJSON = $("#response-json").val();

    // Prepare the data for submission
    apiData.requests = JSON.stringify(requestFields);
    apiData.responses = responseJSON;

    // Perform the API update using the data

    $.ajax({
      url: "admin/api/update_api.php",
      method: "POST",
      data: apiData,
      dataType: "json",
      success: function (response) {
        if (response.status === true) {
          $.createToast({
            title: "Success",
            message: response.message,
            type: "success",
          });
          // reloadUserTable();
          setTimeout(function () {
            location.reload();
          }, 1500);
        } else {
          $.createToast({
            title: "Error",
            message: response.message,
            type: "error",
          });
        }
        $("#add-balance-modal").modal("hide");
      },
      error: function (xhr, status, error) {
        console.log(error);
        $.createToast({
          title: "Error",
          message: "An error occurred while updating API data.",
          type: "error",
        });
      },
    });
  });
});