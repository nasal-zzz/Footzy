
document.getElementById('editCategoryForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name || !description) {
        return Swal.fire({
            title: '<span style="color: red;">All Fields Are Required!</span>',
            text: 'must fill all fields!',
            icon: 'warning',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok',
        });
    }else if(!/^[a-zA-Z\s]+$/.test(name)){
        document.getElementById('name-error').innerText = "Category name should contain only alphabetic charecters..!"

    }else if(description.length<10){
        document.getElementById('description-error').innerText = "Description must have 10 charecter length..!"

     

    }else{
  
    try {
      const response = await fetch(`/admin/editCategory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description}),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toastr.success('Your category was updated successfully!', 'Success');

          
        setTimeout(() => {
            window.location.href = '/admin/categories';
          }, 1000); 
        
        } else {
            toastr.error(result.message, 'Error');
                }
    } catch (error) {
      console.error('Error updating category:', error);
    //   toastr.error('An error occurred while updating the category.', 'Error');
    }
}
  });
