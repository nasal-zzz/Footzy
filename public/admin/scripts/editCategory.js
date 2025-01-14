
// document.getElementById('editCategoryForm').addEventListener('submit', async function (event) {
//     event.preventDefault();
  
//     const id = document.getElementById('categoryId').value;
//     const name = document.getElementById('name').value.trim();
//     const description = document.getElementById('description').value.trim();
//     const discount = document.getElementById('discount').value.trim();
//     const isListed = document.getElementById('status').value;  // Get the value of the isListed field


//     if (!name || !description) {
//         return Swal.fire({
//             title: '<span style="color: red;">All Fields Are Required!</span>',
//             text: 'must fill all fields!',
//             icon: 'warning',
//             confirmButtonColor: '#d33',
//             confirmButtonText: 'Ok',
//         });
//       }else if(name.length < 3){
//         e.preventDefault();
//         document.getElementById('name-error').innerText = "Category name must be at least 3 characters long..!"


//     }else if(description.length<10){
//         document.getElementById('description-error').innerText = "Description must have 10 charecter length..!"

     

//     } else if(discount < 0 || discount > 99){
//       e.preventDefault();
//       document.getElementById('discount-error').innerText = "Discount must be between 0 and 99..!"

//     }
    
//     else{
  
//     try {
//       const response = await fetch(`/admin/editCategory/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name,description,discount,isListed}),
//       });
  
//       const result = await response.json();
  
//       if (response.ok) {
//         toastr.success('Your category was updated successfully!', 'Success');

          
//         setTimeout(() => {
//             window.location.href = '/admin/categories';
//           }, 1000); 
        
//         } else {
//             toastr.error(result.message, 'Error');
//                 }
//     } catch (error) {
//       console.error('Error updating category:', error);
//     //   toastr.error('An error occurred while updating the category.', 'Error');
//     }
// }
//   });



document.getElementById('editCategoryForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Ensure form submission is prevented

  const id = document.getElementById('categoryId').value;
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const discount = document.getElementById('discount').value.trim();
  const isListed = document.getElementById('status').value;

  // Clear previous error messages
  document.getElementById('name-error').innerText = '';
  document.getElementById('description-error').innerText = '';
  document.getElementById('discount-error').innerText = '';

  // Validation checks
  let hasError = false;

  if (!name) {
      document.getElementById('name-error').innerText = 'Category name is required!';
      hasError = true;
  } else if (name.length < 3) {
      document.getElementById('name-error').innerText = 'Category name must be at least 3 characters long!';
      hasError = true;
  }

  if (!description) {
      document.getElementById('description-error').innerText = 'Description is required!';
      hasError = true;
  } else if (description.length < 10) {
      document.getElementById('description-error').innerText = 'Description must have at least 10 characters!';
      hasError = true;
  }

//   if (discount < 0 || discount > 99 || isNaN(discount)) {
//       document.getElementById('discount-error').innerText = 'Discount must be a number between 0 and 99!';
//       hasError = true;
//   }

  // Stop form submission if there's an error
  if (hasError) {
      return;
  }

  // Proceed with the form submission if validation passes
  try {
      const response = await fetch(`/admin/editCategory/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description, isListed }),
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
      toastr.error('An error occurred while updating the category.', 'Error');
  }
});
