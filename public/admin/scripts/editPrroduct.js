


// document.getElementById("editProductForm").addEventListener('submit', async function (e) {

//     const name = document.getElementById('productName').value.trim();
//     const description = document.getElementById('productDescription').value.trim();
//     const regularPrice = document.getElementById('regularPrice').value;
//     const salePrice = document.getElementById('salePrice').value;
//     const sizeInputs = document.querySelectorAll('#size-container div');


//     // Validate Product Name
//     if (name === "") {
//         document.getElementById('name-error').innerText = "Please enter a product name!";
//         document.getElementById('name-error').style.display = 'block';
//         e.preventDefault();
//     // } else if (!/^[a-zA-Z\s]+$/.test(name)) {
//     //     document.getElementById('name-error').innerText = "Product name should contain only alphabetic characters!";
//     //     document.getElementById('name-error').style.display = 'block';
//     //     e.preventDefault();
//     } else {
//         document.getElementById('name-error').style.display = 'none';
//     }

//     // Validate Description
//     if (description === "") {
//         document.getElementById('description-error').innerText = "Please enter the product description!";
//         document.getElementById('description-error').style.display = 'block';
//         e.preventDefault();
//     // } else if (!/^[a-zA-Z\s]{10,}$/.test(description)) {
//     //     document.getElementById('description-error').innerText = "Description should be at least 10 characters long!";
//     //     document.getElementById('description-error').style.display = 'block';
//     //     isValid = false;
//     } else {
//         document.getElementById('description-error').style.display = 'none';
//     }

//     // Validate Prices
//     if (!/^\d+(\.\d{1,2})?$/.test(regularPrice) || parseFloat(regularPrice) <= 0) {
//         document.getElementById('regularPrice-error').innerText = "Please enter a valid non-negative regular price!";
//         document.getElementById('regularPrice-error').style.display = 'block';
//         e.preventDefault();
//     } else {
//         document.getElementById('regularPrice-error').style.display = 'none';
//     }

//     if (!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) <= 0 || parseFloat(regularPrice) <= parseFloat(salePrice)) {
//         document.getElementById('salePrice-error').innerText = "Sale price must be less than regular price and non-negative!";
//         document.getElementById('salePrice-error').style.display = 'block';
//         e.preventDefault();
//     } else {
//         document.getElementById('salePrice-error').style.display = 'none';
//     }

//     // Validate Sizes
//     sizeInputs.forEach((input, index) => {
//         const size = input.querySelector(`input[name="sizes[${index}][size]"]`).value;
//         const stock = input.querySelector(`input[name="sizes[${index}][stock]"]`).value;

//         if (!/^(?:[0-9]|1[0-2])$/.test(size)) {
//             document.getElementById('size-error').innerText = "Size must be between 0 and 12!";
//             document.getElementById('size-error').style.display = 'block';
//             e.preventDefault();
//         } else {
//             document.getElementById('size-error').style.display = 'none';
//         }

//         if (!/^\d+(\.\d{1,2})?$/.test(stock) || parseFloat(stock) < 0) {
//             document.getElementById('stock-error').innerText = "Stock must be a non-negative number!";
//             document.getElementById('stock-error').style.display = 'block';
//             e.preventDefault();
//         } else {
//             document.getElementById('stock-error').style.display = 'none';
//         }
//     });

// return ;

// });







document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editProductForm');
    
    // Utility function to show error
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear all errors
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => element.textContent = '');
    }

    // Validate product name
    function validateProductName() {
        const productName = document.getElementById('productName').value.trim();
        if (!productName) {
            showError('name-error', 'Product name is required');
            return false;
        }
        if (productName.length < 3) {
            showError('name-error', 'Product name must be at least 3 characters long');
            return false;
        }
        return true;
    }

    // Validate description
    function validateDescription() {
        const description = document.getElementById('productDescription').value.trim();
        if (!description) {
            showError('description-error', 'Product description is required');
            return false;
        }
        if (description.length < 10) {
            showError('description-error', 'Description must be at least 10 characters long');
            return false;
        }
        return true;
    }

    // Validate price
    function validatePrice() {
        const price = document.getElementById('regularPrice').value;
        if (!price) {
            showError('regularPrice-error', 'Regular price is required');
            return false;
        }
        if (price <= 0) {
            showError('regularPrice-error', 'Price must be greater than 0');
            return false;
        }
        return true;
    }

    // Validate discount
    // function validateDiscount() {
    //     const discount = document.getElementById('discount').value;
    //     if (discount) {
    //         if (discount < 0 || discount > 99) {
    //             showError('discount-error', 'Discount must be between 0 and 99');
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    function validatesalePrice() {
        const price = document.getElementById('regularPrice').value;
        const salePrice = document.getElementById('salePrice').value;
        if (!salePrice) {
            showError('salePrice-error', 'Sale price is required');
            return false;
        }
        if (!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) <= 0 || parseFloat(price) <= parseFloat(salePrice)) {
            showError('regularPrice-error', 'Sale price must be less than regular price and non-negative...!');
            return false;
        }
        return true;
    }

    // Validate sizes and stock
    function validateSizesAndStock() {
        const sizeInputs = document.querySelectorAll('input[name^="sizes"][name$="[size]"]');
        const stockInputs = document.querySelectorAll('input[name^="sizes"][name$="[stock]"]');
        
        if (sizeInputs.length === 0) {
            showError('size-error', 'At least one size is required');
            return false;
        }

        for (let i = 0; i < sizeInputs.length; i++) {
            const size = sizeInputs[i].value.trim();
            const stock = stockInputs[i].value.trim();

            if (!size) {
                showError('size-error', 'Size cannot be empty');
                return false;
            }

            if (!stock || stock < 0) {
                showError('stock-error', 'Stock must be a positive number');
                return false;
            }
        }
        return true;
    }

    // Validate images
    // function validateImages() {
    //     const imageInputs = [
    //         document.getElementById('input1'),
    //         document.getElementById('input2'),
    //         document.getElementById('input3')
    //     ];

    //     let imageCount = 0;
    //     for (const input of imageInputs) {
    //         if (input.files && input.files.length > 0) {
    //             imageCount++;
    //             const file = input.files[0];
                
    //             // Check file type
    //             if (!file.type.match(/^image\/(jpeg|png)$/)) {
    //                 showError('img-errorr', 'Only JPG and PNG images are allowed');
    //                 return false;
    //             }
                
    //             // Check file size (max 5MB)
    //             if (file.size > 5 * 1024 * 1024) {
    //                 showError('img-errorr', 'Image size should not exceed 5MB');
    //                 return false;
    //             }
    //         }
    //     }

    //     if (imageCount === 0) {
    //         showError('img-errorr', 'At least one product image is required');
    //         return false;
    //     }

    //     return true;
    // }

    // Add size button functionality
    // const addSizeBtn = document.getElementById('add-size');
    // const sizeContainer = document.getElementById('size-container');
    // let sizeCount = 1;

    // addSizeBtn.addEventListener('click', function() {
    //     const newSizeDiv = document.createElement('div');
    //     newSizeDiv.innerHTML = `
    //         <div>
    //             <input type="text" name="sizes[${sizeCount}][size]" placeholder="Size (e.g., 6)" style="width: 400px;padding: 8px;margin-bottom: 10px;border: 1px solid #ddd;border-radius: 4px;">
    //             <input type="number" name="sizes[${sizeCount}][stock]" placeholder="Stock for this size" style="width: 400px;padding: 8px;margin-bottom: 10px;border: 1px solid #ddd;border-radius: 4px;">
    //             <button type="button" class="remove-size">Remove Size</button>
    //         </div>
    //     `;
    //     sizeContainer.appendChild(newSizeDiv);
    //     sizeCount++;
        
    //     // Add remove button functionality
    //     const removeBtn = newSizeDiv.querySelector('.remove-size');
    //     removeBtn.addEventListener('click', function() {
    //         newSizeDiv.remove();
    //     });
    // });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();

        // Run all validations
        const isValid = 
            validateProductName() &&
            validateDescription() &&
            validatePrice() &&
            validatesalePrice() &&
            validateSizesAndStock();
            // validateImages();

        if (isValid) {
            form.submit();
        }
    });
});



let sizeIndex = 1;
      
document.getElementById('add-size').addEventListener('click', () => {
  const container = document.getElementById('size-container');
  const sizeInput = `
    <div>
      <input type="text" name="sizes[${sizeIndex}][size]" placeholder="Size (e.g., 6)"><br><br>
        <div id="size-error" class="error-message text-danger"></div>
      <input type="number" name="sizes[${sizeIndex}][stock]" placeholder="Stock for this size"><br><br>
      <div id="stock-error" class="error-message text-danger"></div>
      <button type="button" class="remove-size" style="display: inline-block;">Remove Size</button>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', sizeInput);
  sizeIndex++;
});

document.getElementById('size-container').addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-size')) {
    const sizeInputs = document.querySelectorAll('#size-container > div');
    if (sizeInputs.length > 1) {
      event.target.closest('div').remove();
    } else {
      alert('You must have at least one size input');
    }
  }
});


setTimeout(() => {
    const alertElement = document.getElementById('alertMessage');
    if (alertElement) {
        alertElement.style.display = 'none';
    }
}, 3000);




function viewImage(event, index) {
    const input = event.target;

    if (!input.files || input.files.length === 0) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const imgView = document.getElementById(`imgView${index}`);
        const croppedImg = document.getElementById(`croppedImg${index}`);
        const saveButton = document.getElementById(`saveButton${index}`);
        const cropperContainer = croppedImg.parentElement;

        imgView.src = reader.result;
        cropperContainer.style.display = 'block';

        // Initialize Cropper.js
        const cropper = new Cropper(imgView, {
            aspectRatio: 1,
            viewMode: 1,
            // guides:true,
            // background:false,
            // autoCropArea:1,
            // zoomable:true
        });

        saveButton.onclick = function () {
            const croppedCanvas = cropper.getCroppedCanvas();

            if (croppedCanvas) {
                croppedImg.src = croppedCanvas.toDataURL('image/jpeg');
                cropperContainer.style.display = 'none';

                // Save the cropped image back to input
                croppedCanvas.toBlob((blob) => {
                    const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: blob.type });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedFile);
                    input.files = dataTransfer.files;

                    cropper.destroy();
                });
            }
        };
    };

    reader.readAsDataURL(input.files[0]);
}




// Dynamic Image Addition
document.addEventListener('DOMContentLoaded', () => {
    let imageIndex = document.querySelectorAll('#card-body #img-container').length;

    document.getElementById('add-image').addEventListener('click', function () {
        const cardBody = document.getElementById('card-body');

        const newImageContainer = document.createElement('div');
        newImageContainer.className = 'mb-4';
        newImageContainer.id = 'img-container';

        newImageContainer.innerHTML = `
            <div class="input-upload">
                <img src="" id="imgView${imageIndex}" alt="Preview Image ${imageIndex}" style="max-width: 100%; height: auto; display: none;">
                <input class="form-control" type="file" name="newImages[]" id="input${imageIndex}"  multiple
                    accept="image/png, image/jpeg" onchange="viewImage(event, ${imageIndex})">
            </div>
            <div class="image-cropper d-flex align-items-center" style="margin-top: 10px;">
                <img src="" id="croppedImg${imageIndex}" alt="Cropped Image ${imageIndex}" style="max-width: 100%; height: auto;">
                <button type="button" id="saveButton${imageIndex}" class="btn-sm btn-primary" style="margin: 10px;">Save</button> <br><br>
                 <button type="button" class="remove-img" onclick="deleteImg('<%=product.productImage[i]%>','<%=product._id%>')" style="margin: 40px;">Remove Image</button>
            </div>
        `;

        
        cardBody.appendChild(newImageContainer);
        imageIndex++;
    });
});















function deleteImg(imageId,productId){
    $.ajax({
        url:"/admin/deleteImage",
        method:'post',
        data:{imageNameToServer:imageId,productIdToServer:productId},
        success:((response)=>{
            if(response.status===true){
                window.location.reload()
            }
        })
    })

} 


// function deleteImg(imageId, productId) {
//     $.ajax({
//         url: "/admin/deleteImage",
//         method: 'post',
//         data: {
//             imageNameToServer: imageId,
//             productIdToServer: productId
//         },
//         success: function(response) {
//             if (response.status === true) {
//                 // Find the closest parent container and remove it
//                 $(`button[onclick="deleteImg('${imageId}','${productId}')"]`).closest('.mb-4').remove();
//             } else {
//                 alert(response.message); // Show the message from the server if deletion is not allowed
//             }
//         },
//         error: function() {
//             alert('Failed to remove image');
//         }
//     });
// }




// function deleteImg(imageId, productId) {
//     const cardBody = document.getElementById("card-body");
//     const imageCount = parseInt(cardBody.getAttribute("data-image-count"), 10);

//     if (imageCount <= 2) {
//         alert('You cannot delete an image if only 2 images remain.');
//         return;
//     }

//     $.ajax({
//         url: "/admin/deleteImage",
//         method: 'post',
//         data: {
//             imageNameToServer: imageId,
//             productIdToServer: productId
//         },
//         success: function(response) {
//             if (response.status === true) {
//                 $(`button[onclick="deleteImg('${imageId}','${productId}')"]`).closest('.mb-4').remove();
//                 cardBody.setAttribute("data-image-count", imageCount - 1); // Update the image count
//             } else {
//                 alert(response.message);
//             }
//         },
//         error: function() {
//             alert('Failed to remove image');
//         }
//     });
// }