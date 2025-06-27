document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('waitlist-modal-overlay');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const waitlistForm = document.getElementById('waitlist-form');
  const feedbackDiv = document.getElementById('form-feedback');

  // Do not show modal if it doesn't exist on the page
  if (!modalOverlay) {
    return;
  }

  // Function to show the modal
  const showModal = () => {
    modalOverlay.classList.add('visible');
    // Add a class to body to prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to hide the modal
  const hideModal = () => {
    modalOverlay.classList.remove('visible');
    // Restore body scrolling
    document.body.style.overflow = '';
  };

  // Show modal on page load after a short delay
  // We can add cookie-based logic here later to show it only once.
  setTimeout(showModal, 1500);

  // --- Event Listeners to close the modal ---
  
  // 1. Close button
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
  
  // 2. Clicking on the background overlay
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      hideModal();
    }
  });

  // 3. Pressing the 'Escape' key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
      hideModal();
    }
  });

  // --- Netlify Form Submission Handler ---
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(waitlistForm);
      const submitButton = waitlistForm.querySelector('button[type="submit"]');
      
      // Basic validation
      const email = formData.get('email');
      const name = formData.get('name');
      if (!email || !name) {
          alert('請填寫電子郵件和姓名！');
          return;
      }

      submitButton.disabled = true;
      submitButton.textContent = '傳送中...';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })
      .then(() => {
        waitlistForm.style.display = 'none';
        if (feedbackDiv) {
            feedbackDiv.textContent = '感謝您！您已成功加入我們的等候清單。';
            feedbackDiv.className = 'success'; // Use classList for better management
        }
        // Hide the modal automatically after showing success message
        setTimeout(hideModal, 3000);
      })
      .catch((error) => {
        if (feedbackDiv) {
            feedbackDiv.textContent = '抱歉，發生錯誤，請稍後再試。';
            feedbackDiv.className = 'error';
        }
        console.error('Form submission error:', error);
        submitButton.disabled = false;
        submitButton.textContent = '加入等候清單';
      });
    });
  }
}); 