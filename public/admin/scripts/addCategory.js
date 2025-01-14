document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    // const discount = document.getElementById('discount').value.trim();
   


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
    }else if(name.length < 3){
        e.preventDefault();
        document.getElementById('name-error').innerText = "Category name must be at least 3 characters long..!"

    }else if(description.length<10){
        e.preventDefault();
        document.getElementById('description-error').innerText = "Description must have 10 charecter length..!"

     

    }
    // else if(discount < 0 || discount > 99){
    //     e.preventDefault();
    //     document.getElementById('discount-error').innerText = "Discount must be between 0 and 99..!"

     

    // }
    
    else{
        return Swal.fire({
              icon: "success",
              title: '<span style="color: green;">Catgopry added successfully...!!</span>',
              showConfirmButton: false,
              timer: 1500,
            });
    }
});
