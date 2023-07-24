$(document).ready(function () {

  $("#textInput").keydown(function (e) {
    // Check if the key pressed was 'Enter' (key code 13)
    if (e.key === 'Enter') {
      // Prevent the default action to stop the form from being submitted
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    var rawText = $("#textInput").val();
    var userHtml = '<div class="userText"><span>' + rawText + "</span></div>";
    $("#chatbox").append(userHtml);
    $("#textInput").val("");

    // Send the user's message to your Flask backend
    $.ajax({
      url: '/chatbot',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        'message': rawText
      }),
      success: function (data) {
        // Add the chatbot's response to the chat logs
        var botHtml = '<div class="botText"><span>' + data.message + '</span></div>';
        $("#chatbox").append(botHtml);

        // Scroll chat to the bottom
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  }

});
