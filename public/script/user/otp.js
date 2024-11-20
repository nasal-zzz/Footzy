document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputs[index - 1].focus();
        }
    });
});


// timer 
  // Total countdown time in seconds
  let timeLeft = 60;

  let isTimerActive = true; // Flag to check if the timer is still active

  // Function to start the countdown
  function startTimer() {

    isTimerActive = true
    const timerElement = document.getElementById('timer');
    countdown = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        timerElement.textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            isTimerActive = false;
            timerElement.textContent = '00:00';
            Swal.fire({
                icon: "error",
                title: "OTP has expired..!",
                text: "Please request a new one",
            });
        }

        timeLeft--; // Decrement the time
    }, 1000);
}

  // Start the timer when the page is rendered
  window.onload = startTimer;

// validate the otp form 
function validateOTPForm() {

  if (!isTimerActive) {
    Swal.fire({
        icon: 'error',
        title: 'OTP Expired',
        text: 'Please request a new OTP.',
        showConfirmButton: true
    });
    return false; // Prevent form submission if the timer has ended
}else{



    const otpInput = document.getElementById('otp').value;

    // Check if OTP is provided and is a 6-digit number
    if (!otpInput) {
        Swal.fire({
            icon: 'error',
            title: 'OTP Required',
            text: 'Please enter the OTP.',
            showConfirmButton: true
        });
        return false; // Prevent form submission if OTP is empty
    }

    // Check if the OTP length is exactly 6 digits
    if (otpInput.length !== 6 || isNaN(otpInput)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid OTP',
            text: 'Please enter a valid 6-digit OTP.',
            showConfirmButton: true
        });
        return false; // Prevent form submission if OTP is invalid
    }
  }
    return true; // If validation passes, allow form submission
}


    

document.getElementById('otpForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents the default form submission
  
     if (!isTimerActive) {
    Swal.fire({
        icon: 'error',
        title: 'OTP Expired',
        text: 'Please request a new OTP.',
        showConfirmButton: true
    });
    return false; // Prevent form submission if the timer has ended
}else{


    const otpInput = document.getElementById('otp').value;
  
    $.ajax({
      type: "POST",
      url: "/verify-otp",
      data: JSON.stringify({ otp1: otpInput }), // Send data as JSON
      contentType: "application/json",
      success: function (response) {
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "OTP Verified Successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = response.redirectUrl;
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: "Please try again",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    
    });
  
    return ;
  }
  });
  

  // resend otp 
  function resendOTP() {
    clearInterval(countdown); // Stop any ongoing timer
    isTimerActive = false;
    timeLeft = 60; // Reset the timer duration to 60 seconds
    document.getElementById("otp").disabled = false;
     // Restart the timer

    $.ajax({
        type: "POST",
        url: "/resend-otp",
        contentType: "application/json",
        success: function (response) {
          console.log(response); // Add this to inspect the response
          if (!response.success) {
            Swal.fire({
              icon: "success",
              title: "OTP Resended Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            startTimer();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response.message || "An error occurred",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        },
     
    });
    return false; // Prevent form submission
}
