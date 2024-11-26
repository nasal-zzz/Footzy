document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
   


    // Prevent form submission if validation fails
    if (!name || !description) {
        e.preventDefault();
        return Swal.fire({
            title: '<span style="color: red;">All Fields Are Required!</span>',
            text: 'must fill all fields!',
            icon: 'warning',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok',
        });
    }else if(!/^[a-zA-Z\s]+$/.test(name)){
        e.preventDefault();
        document.getElementById('name-error').innerText = "Category name should contain only alphabetic charecters..!"

    }else if(description.length<10){
        e.preventDefault();
        document.getElementById('description-error').innerText = "Description must have 10 charecter length..!"

     

    }else{
        return Swal.fire({
              icon: "success",
              title: '<span style="color: green;">Catgopry added successfully...!!</span>',
              showConfirmButton: false,
              timer: 1500,
            });
    }
});
