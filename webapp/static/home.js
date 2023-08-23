function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

function markdownToHtml(text) {
  // Replace code blocks (3 backticks) with <pre><code>...<code/><pre/>
  text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

  // Replace inline code (single backticks) with <code>...<code/>
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');

  // Convert numbered list to HTML
  text = text.replace(/(\d+\..*?(?=\d+\.|$))/gs, '<li>$1</li><br>');
  if (text.includes('<li>')) {
    text = '<ul>' + text + '</ul>';
  }

  return text;
}



document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle logic
  const openSidebarBtn = document.getElementById('open-sidebar');  // The new button
  const toggleSidebarBtn = document.getElementById('toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');  // Get the main content element

  const processBtn = document.getElementById('processBtn');
  const pdfUploader = document.getElementById('pdfUploader');

  if (processBtn && pdfUploader) {
    processBtn.addEventListener('click', function () {
      // Check if files are selected
      if (pdfUploader.files.length === 0) {
        alert('Please select at least one file to upload.');
        return;
      }

      let formData = new FormData();
      for (let i = 0; i < pdfUploader.files.length; i++) {
        formData.append('files[]', pdfUploader.files[i]);
      }

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Handle the response from the server here.
        })
        .catch(error => {
          console.error('There was an error uploading the file(s)!', error);
        });
    });
  }


  // Open Sidebar Button Logic
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', function () {
      sidebar.classList.remove('sidebar-collapsed');  // Un-collapse the sidebar
      mainContent.style.marginLeft = '210px';  // Adjust main content's margin
      openSidebarBtn.style.display = 'none';  // Hide the open-sidebar button
      toggleSidebarBtn.style.display = 'block';  // Show the X button
    });
  }

  // Toggle Sidebar Button (X) Logic
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function () {
      if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');

        if (sidebar.classList.contains('sidebar-collapsed')) {
          mainContent.style.marginLeft = '0px';
          openSidebarBtn.style.display = 'flex'; // Show the > div
        } else {
          mainContent.style.marginLeft = '210px';
          openSidebarBtn.style.display = 'none'; // Hide the > div
        }
      }
    });
  }

  // Let's also ensure the sidebar expands when the > div is clicked:
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', function () {
      sidebar.classList.remove('sidebar-collapsed');
      mainContent.style.marginLeft = '210px';
      openSidebarBtn.style.display = 'none'; // Hide the > div again
    });
  }


  // Chat logic
  const textInput = document.getElementById('textInput');
  const chatbox = document.getElementById('chatbox');

  if (textInput) {
    textInput.addEventListener('keydown', function (e) {
      // Check if the key pressed was 'Enter' (key code 13)
      if (e.key === 'Enter') {
        // Scroll chat to the bottom
        scrollToBottom();
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

    // Show the loading GIF
    var loadingGif = document.getElementById('loadingGif');
    loadingGif.style.display = 'block';

    // Send the user's message to your Flask backend
    fetch('/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'message': rawText
      })
    })
      .then(response => response.json())
      .then(data => {
        // Hide the loading GIF
        loadingGif.style.display = 'none';

        var botResponse = markdownToHtml(data.message);
        var botHtml = '<div class="botText"><span>' + botResponse + '</span></div>';
        chatbox.innerHTML += botHtml;

        // Scroll chat to the bottom
        scrollToBottom();
      })
      .catch(error => {
        // If there's an error, also hide the loading GIF
        loadingGif.style.display = 'none';
        console.error('Error while sending message:', error);
      });
  }


});
