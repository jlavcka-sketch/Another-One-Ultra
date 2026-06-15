// ===== FORM SUBMISSION HANDLER =====
// Sends form data to a Google Apps Script Web App, which writes it
// to a Google Sheet (one tab per form: lottery / partnership / contact).
//
// IMPORTANT: replace SCRIPT_URL below with your deployed Apps Script
// Web App URL (ends with /exec).

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd-DVNywSIyi3Kc_ZXpjVbaYLOtbPI_4J5ZfmE_Lu0_P7glfDRjFUTHAs7p2HrZXFm/exec';

document.querySelectorAll('form[data-form-name]').forEach(function(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();

    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    if (SCRIPT_URL.indexOf('PASTE_YOUR') === 0) {
      status.textContent = 'Form is not connected yet.';
      status.className = 'form-status error';
      return;
    }

    const formData = new FormData(form);
    formData.append('form_name', form.getAttribute('data-form-name'));

    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (data && data.result === 'success') {
          status.textContent = 'Thank you! Your submission has been received.';
          status.className = 'form-status success';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Please try again or email us directly.';
          status.className = 'form-status error';
        }
      })
      .catch(function(){
        status.textContent = 'Something went wrong. Please try again or email us directly.';
        status.className = 'form-status error';
      })
      .finally(function(){
        button.disabled = false;
        button.textContent = originalText;
      });
  });
});
