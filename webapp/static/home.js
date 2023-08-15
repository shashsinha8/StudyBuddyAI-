function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}



document.addEventListener("DOMContentLoaded", function () {

  // Sidebar toggle logic
  const toggleSidebarBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');  // Get the main content element

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function () {
      if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');

        // Adjust margin-left for main-content based on sidebar state
        if (sidebar.classList.contains('sidebar-collapsed')) {
          // If sidebar is collapsed, set main content's margin-left to 0
          mainContent.style.marginLeft = '0px';
        } else {
          // Otherwise, set it back to 210px
          mainContent.style.marginLeft = '210px';
        }
      }
    });
  }

  // Chat logic
  const textInput = document.getElementById('textInput');
  const chatbox = document.getElementById('chatbox');

  if (textInput) {
    textInput.addEventListener('keydown', function (e) {
      // Check if the key pressed was 'Enter' (key code 13)
      if (e.key === 'Enter') {
        // Prevent the default action to stop the form from being submitted
        e.preventDefault();
        sendMessage();
      }
    });
  }

  function sendMessage() {
    var rawText = textInput.value;
    var userHtml = '<div class="userText"><span>' + rawText + "</span></div>";
    chatbox.innerHTML += userHtml;
    textInput.value = "";

    // Send the user's message to your Flask backend
    fetch('/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'message': rawText
      })
    }).then(response => response.json()).then(data => {
      // Add the chatbot's response to the chat logs
      var botHtml = '<div class="botText"><span>' + data.message + '</span></div>';
      chatbox.innerHTML += botHtml;

      // Scroll chat to the bottom
      scrollToBottom();
    })
  }

});
