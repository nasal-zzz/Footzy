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

  // Function to start the countdown
  function startTimer() {
      const timerElement = document.getElementById('timer');

      const countdown = setInterval(() => {
          // Calculate minutes and seconds
          let minutes = Math.floor(timeLeft / 60);
          let seconds = timeLeft % 60;

          // Format time as MM:SS
          seconds = seconds < 10 ? '0' + seconds : seconds;
          minutes = minutes < 10 ? '0' + minutes : minutes;

          // Display updated time
          timerElement.textContent = `${minutes}:${seconds}`;

          // Stop the timer when it reaches zero
          if (timeLeft <= 0) {
              clearInterval(countdown);
              timerElement.textContent = '00:00'; // Ensure it shows 00:00 at the end
              Swal.fire({
                icon:"error",
                title:"OTP  has expired..!",
                text : "Please request a new one"
            })          
        }

          timeLeft--;
      }, 1000);
  }

  // Start the timer when the page is rendered
  window.onload = startTimer;


// // validate the otp form 
// function validateOTPForm(e){
//     e.preventDefault()
// const otpInput = document.getElementById("otp").value;
// console.log('hiiii');
// console.log(otpInput);


// // $.ajax({
// //     type: "POST",
// //     url: "verify-otp",
// //     data: { otp: otpInput },
// //   });
// //   return false;  
// // 

// $.ajax({
//     type: "POST",
//     url: "verify-otp",
//     data: JSON.stringify({ otp: otpInput }), // Sending as JSON
//     contentType: "application/json",
//     success: function(response) {
//       if (response.success) {
//         Swal.fire({
//           icon: "success",
//           title: "OTP Verified Successfully",
//           showConfirmButton: false,
//           timer: 1500,
//         }).then(() => {
//           window.location.href = response.redirectUrl;
//         });
//       } else {
//         // Handle the failure response
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: response.message,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     },
//     error: function(xhr, status, error) {
//       Swal.fire({
//         icon: "error",
//         title: "Invalid OTP",
//         text: "Please try again",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   });
  

// }
  

// validate the otp form 
function validateOTPForm() {
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

    return true; // If validation passes, allow form submission
}


    

document.getElementById('otpForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents the default form submission
  
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
  });
  
