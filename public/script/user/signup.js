document.getElementById('signupForm').addEventListener('submit',(e)=>{
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;


    if(!username || !email || !phone || !dob || !password || !confirm_password){
        e.preventDefault();
        // document.getElementById('errmsg').innerText = "All Fields Are Required...!"
        // return ;
        return  Swal.fire({
            title: 'All Fields Are Required..!', 
            text: 'must fill all fields!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#d32',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
        })
    }else

    if(!username.match(/^[A-Za-z\s]+$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Please Enter a valid Name..."
        return ;
    }else
    if(!email.match(/^([a-zA-Z0-9_]+)@([a-zA-Z0-9]+).([a-zA-Z]+)(.[a-zA-Z]+)?$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Email should be correctly entered..!"
        return; 
    }else
    if(!phone.match(/^\d{10,}$/) ){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Enter a correct PhoneNumber..!"
        return; 
    }else
    if(!password.match(/^(?=.*[\W_]).{8,}$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Password must have a special charecter and eight charecter length..!"
        return; 
    }else
    if(password !== confirm_password){
        e.preventDefault();
        document.getElementById('errmsg').innerText = 'Passwords do not match...!'
        return;
    }else{
        return  Swal.fire({
            title: `OTP send to ${email}`, 
            text: 'Please check your email..!',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false, // Hides the OK button
            timer: 5500            
        })

    }

})


// message erasing 
setTimeout(function() {
    let alertElement = document.getElementById('alertMessage');
    if (alertElement) {
      alertElement.style.display = 'none'; // Hides the element
    }
  }, 5000);

