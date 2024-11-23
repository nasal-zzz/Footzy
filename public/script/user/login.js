// message erasing 
setTimeout(function() {
    let alertElement = document.getElementById('alertMessage');
    if (alertElement) {
      alertElement.style.display = 'none'; // Hides the element
    }
  }, 5000);

  document.getElementById('loginForm').addEventListener('submit',(e)=>{

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        if(!email || !password){
            e.preventDefault();   
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
        if(!email.match(/^([a-zA-Z0-9_]+)@([a-zA-Z0-9]+).([a-zA-Z]+)(.[a-zA-Z]+)?$/)){
            e.preventDefault();
            document.getElementById('errmsg').innerText = "Email should be correctly entered..!"
            return; 
        }else
        if(!password.match(/^(?=.*[\W_]).{8,}$/)){
            e.preventDefault();
            document.getElementById('errmsg').innerText = "Password must have a special charecter and eight charecter length..!"
            return; 
        }


  })