document.getElementById('signupForm').addEventListener('submit',(e)=>{
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;


    if(!username || !email || !phone || !dob || !password || !confirm_password){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "All Fields Are Required...!"
        return ;
       
    }

    if(!username.match(/^[A-Za-z\s]+$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Please Enter a valid Name..."
        return ;
    }
    if(!email.match(/^([a-zA-Z0-9_]+)@([a-zA-Z0-9]+).([a-zA-Z]+)(.[a-zA-Z]+)?$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Email should be correctly entered..!"
        return; 
    }
    if(!phone.match(/^(\+?\d{1,4}[-\s]?)?(\(?\d{1,4}\)?[-\s]?)?(\d{1,4}[-\s]?\d{1,4}[-\s]?\d{1,4})$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Enter a correct PhoneNumber..!"
        return; 
    }
    if(!password.match(/^(?=.*[\W_]).{8,}$/)){
        e.preventDefault();
        document.getElementById('errmsg').innerText = "Password must have a special charecter and eight charecter length..!"
        return; 
    }
    if(password !== confirm_password){
        e.preventDefault();
        document.getElementById('errmsg').innerText = 'Passwords do not match...!'
        return;
    }

})