

// // function validateAndSubmitForm(){
// //     const form = document.getElementById('addProductForm');
// //     if(validateForm()){
// //         form.submit();

        
// //     }
// // }


// function viewImage1(event){
//     document.getElementById('imgView1').src = URL.createObjectURL(event.target.files[0])
// }
// function viewImage2(event){
//     document.getElementById('imgView2').src = URL.createObjectURL(event.target.files[0])
// }
// function viewImage3(event){
//     document.getElementById('imgView3').src = URL.createObjectURL(event.target.files[0])
// }

// // function viewImage(event,index){
// //     let input = event.target;
// //     let reader = new FileReader();
// //     reader.onload = function (){
// //         let dataURL = reader.result;
// //         let image = document.getElementById('imgView'+index);
// //         image.src = dataURL;

// //         let cropper = new Cropper(image,{
// //             aspectRatio:1,
// //             viewMode : 1,
// //             guides:true,
// //             background:false,
// //             autoCropArea:1,
// //             zoomable:true
// //         });
        
// //         let cropperContainer = document.querySelector("#croppedImg"+index).parentNode;
// //         cropperContainer.style.display = 'block';

// //         let saveButton = document.querySelector("#saveButton"+index);
// //         saveButton.addEventListener('click',async function (){
// //             let croppedCanvas = cropper.getCroppedCanvas();
// //             let croppedImage = document.getElementById("croppedImg"+index);
// //             croppedImage.src = croppedCanvas.toDataURL('image/jpeg',1.0);

// //             let timestamp = new Date().getTime();
// //             let fileName = `cropped-img-${timestamp}-${index}.png`;

// //             await croppedCanvas.toBlob(blob=>{
// //                 let input = document.getElementById('input'+index);
// //                 let imgFile  = new File([blob],fileName,blob);
// //                 const fileList = new DataTransfer();
// //                 fileList.items.add(imgFile);
// //                 input.files = fileList.files;
// //             });

// //             cropperContainer.style.display = "none";
// //             cropper.destroy();


// //         });
// //     };

// //     reader.readAsDataURL(input.files[0]);

// // }



// function viewImage(event, index) {
//     const input = event.target;

//     if (!input.files || input.files.length === 0) {
//         alert("Please select a file.");
//         return;
//     }

//     const reader = new FileReader();
//     reader.onload = function () {
//         const imgView = document.getElementById(`imgView${index}`);
//         const croppedImg = document.getElementById(`croppedImg${index}`);
//         const saveButton = document.getElementById(`saveButton${index}`);
//         const cropperContainer = croppedImg.parentElement;

//         imgView.src = reader.result;
//         cropperContainer.style.display = 'flex';

//         // Initialize Cropper.js
//         const cropper = new Cropper(imgView, {
//             aspectRatio: 1,
//             viewMode: 1,
//         });

//         saveButton.onclick = function () {
//             const croppedCanvas = cropper.getCroppedCanvas();

//             if (croppedCanvas) {
//                 croppedImg.src = croppedCanvas.toDataURL('image/jpeg');
//                 cropperContainer.style.display = 'none';

//                 // Save the cropped image back to input
//                 croppedCanvas.toBlob((blob) => {
//                     const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: blob.type });
//                     const dataTransfer = new DataTransfer();
//                     dataTransfer.items.add(croppedFile);
//                     input.files = dataTransfer.files;

//                     cropper.destroy();
//                 });
//             }
//         };
//     };

//     reader.readAsDataURL(input.files[0]);
// }



// const selectedImages = [];
// document.getElementById('input1').addEventListener("change",handleFileSelect)

// function handleFileSelect(event){
//     const addImageContainer = document.getElementById('addedImagesContainer');
//     addImageContainer.innerHTML = ""
//     const files = event.target.files;

//     for(let i=0;i<files.length;i++){
//         const file = files[i]
//         selectedImages.push(file);
//         const thumbnile = document.createElement("div");
//         thumbnile.classList.add("thumbnile");

//         const img = document.createElement("img")
//         img.src = URL.createObjectURL(file);
//         img.alt = "thumbnile";
//         img.style.width="50px";
//         img.style.height="auto";

        
//         const removeIcon = document.createElement("span");
//         removeIcon.classList.add("remove-icon")
//         removeIcon.innerHTML = "&times";
//         removeIcon.addEventListener("click",function (){
//             const index = selectedImages.indexOf(file);
//             if(index !== -1){
//                 selectedImages.splice(index,1)

//             }

//             thumbnile.remove();

//         });
//         thumbnile.appendChild(img);
//         thumbnile.appendChild(removeIcon);
//         addImageContainer.appendChild(thumbnile);

//     }
// }




// // document.getElementById("addProductForm").addEventListener('submit',async function (e){

// //     const name = document.getElementById('productName').value.trim();
// //     const description = document.getElementById('productDescription').value.trim();
// //     const regularPrice = document.getElementById('regularPrice').value;
// //     const salePrice = document.getElementById('salePrice').value;
// //     const status = document.getElementById('status').value;
// //     const category = document.getElementById('category').value;
// //     const sizeInputs = document.querySelectorAll('#size-container div');
   
// //     if (name.trim() === "") {
// //         e.preventDefault()
// //         document.getElementById('name-error').innerText = "Please enter a product name...!"
  
// //         setTimeout(function() {
// //             document.getElementById('name-error').style.display = 'none';
// //         }, 5000);

// //     } else
// //     if(!/^[a-zA-Z\s]+$/.test(name)){
// //         e.preventDefault()

// //         document.getElementById('name-error').innerText = "Product name should contain only alphabetic charecters..!"

// //         setTimeout(function() {
// //             document.getElementById('name-error').style.display = 'none';
// //         }, 5000);

// //     }else if(description.trim() === ""){
// //         e.preventDefault()

// //         document.getElementById('description-error').innerText = "PPlease enter the product description...!"

// //         setTimeout(function() {
// //             document.getElementById('description-error').style.display = 'none';
// //         }, 5000);

// //     }else if(!/^[a-zA-Z\s]{10,}$/.test(description)){
// //         e.preventDefault()

// //         document.getElementById('description-error').innerText = "Product description should contain only alphabetic charecters and must 10 charecters length..!"

// //         setTimeout(function() {
// //             document.getElementById('description-error').style.display = 'none';
// //         }, 5000);
   
// //     }else if(!/^\d+(\.\d{1,2})?$/.test(regularPrice) || parseFloat(regularPrice) < 0){
// //         e.preventDefault()

// //         document.getElementById('regularPrice-error').innerText = "Please enter a valid non-negative regular price...!"

// //         setTimeout(function() {
// //             document.getElementById('regularPrice-error').style.display = 'none';
// //         }, 5000);

// //     }else if(!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) < 0){
// //         e.preventDefault()

// //         document.getElementById('salePrice-error').innerText = "Please enter a valid non-negative sale price...!"

// //         setTimeout(function() {
// //             document.getElementById('salePrice-error').style.display = 'none';
// //         }, 5000);

// //     }else if (parseFloat(regularPrice) <= parseFloat(salePrice)){
// //         e.preventDefault()

// //         document.getElementById('salePrice-error').innerText = "Regular price must be greater than sale price...!"
        
// //         setTimeout(function() {
// //             document.getElementById('salePrice-error').style.display = 'none';
// //         }, 5000);

// // }else if( sizeInputs.forEach((input, index) => {
// //     const size = input.querySelector(`input[name="sizes[${index}][size]"]`).value;
// //     const stock = input.querySelector(`input[name="sizes[${index}][stock]"]`).value;

// //     if(!/^\d+(\.\d{1,2})?$/.test(stock) || parseFloat(stock) < 0){
// //         e.preventDefault()

// //         document.getElementById('stock-error').innerText = "Please enter a valid non-negative stock...!"

// //         setTimeout(function() {
// //             document.getElementById('stock-error').style.display = 'none';
// //         }, 3000);

// //     }else if(!/^(?:[0-9]|1[0-2])$/.test(size) || parseFloat(size) < 0){
// //         e.preventDefault()
    
// //         document.getElementById('size-error').innerText = "Please enter a valid  size between 0 to 12...!"
    
// //         setTimeout(function() {
// //             document.getElementById('size-error').style.display = 'none';
// //         }, 3000);



// //     }else{

// //         try {
            
// // const response = await fetch(`/admin/editProduct/${id}`,{
// //     method: 'PATCH',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({ name, description}),

// // })

// //         } catch (error) {
            
// //         }

// //     }
// //   })
// // )

// //     return;
// // })


// document.getElementById("addProductForm").addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const name = document.getElementById('productName').value.trim();
//     const description = document.getElementById('productDescription').value.trim();
//     const regularPrice = document.getElementById('regularPrice').value;
//     const salePrice = document.getElementById('salePrice').value;
//     const sizeInputs = document.querySelectorAll('#size-container div');

//     let isValid = true;

//     // Validate Product Name
//     if (name === "") {
//         document.getElementById('name-error').innerText = "Please enter a product name!";
//         document.getElementById('name-error').style.display = 'block';
//         isValid = false;
//     } else if (!/^[a-zA-Z\s]+$/.test(name)) {
//         document.getElementById('name-error').innerText = "Product name should contain only alphabetic characters!";
//         document.getElementById('name-error').style.display = 'block';
//         isValid = false;
//     } else {
//         document.getElementById('name-error').style.display = 'none';
//     }

//     // Validate Description
//     if (description === "") {
//         document.getElementById('description-error').innerText = "Please enter the product description!";
//         document.getElementById('description-error').style.display = 'block';
//         isValid = false;
//     } else if (!/^[a-zA-Z\s]{10,}$/.test(description)) {
//         document.getElementById('description-error').innerText = "Description should be at least 10 characters long!";
//         document.getElementById('description-error').style.display = 'block';
//         isValid = false;
//     } else {
//         document.getElementById('description-error').style.display = 'none';
//     }

//     // Validate Prices
//     if (!/^\d+(\.\d{1,2})?$/.test(regularPrice) || parseFloat(regularPrice) < 0) {
//         document.getElementById('regularPrice-error').innerText = "Please enter a valid non-negative regular price!";
//         document.getElementById('regularPrice-error').style.display = 'block';
//         isValid = false;
//     } else {
//         document.getElementById('regularPrice-error').style.display = 'none';
//     }

//     if (!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) < 0 || parseFloat(regularPrice) <= parseFloat(salePrice)) {
//         document.getElementById('salePrice-error').innerText = "Sale price must be less than regular price and non-negative!";
//         document.getElementById('salePrice-error').style.display = 'block';
//         isValid = false;
//     } else {
//         document.getElementById('salePrice-error').style.display = 'none';
//     }

//     // Validate Sizes
//     // sizeInputs.forEach((input, index) => {
//     //     const size = input.querySelector(`input[name="sizes[${index}][size]"]`).value;
//     //     const stock = input.querySelector(`input[name="sizes[${index}][stock]"]`).value;

//     //     if (!/^(?:[0-9]|1[0-2])$/.test(size)) {
//     //         document.getElementById('size-error').innerText = "Size must be between 0 and 12!";
//     //         document.getElementById('size-error').style.display = 'block';
//     //         isValid = false;
//     //     } else {
//     //         document.getElementById('size-error').style.display = 'none';
//     //     }

//     //     if (!/^\d+(\.\d{1,2})?$/.test(stock) || parseFloat(stock) < 0) {
//     //         document.getElementById('stock-error').innerText = "Stock must be a non-negative number!";
//     //         document.getElementById('stock-error').style.display = 'block';
//     //         isValid = false;
//     //     } else {
//     //         document.getElementById('stock-error').style.display = 'none';
//     //     }
//     // });

//     if (!isValid) return;

//     // Submit the Form
//     try {
//         const response = await fetch(`/admin/editProduct/${id}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ name, description, regularPrice, salePrice,category,salePrice,sizes,status,productImage }),
//         });

//         const result = await response.json();

//         console.log(result,"hdddddsdsssss");
        
//         if (response.ok) {
//             alert('Product updated successfully!', 'Success');

//             setTimeout(() => {
//                 window.location.href = '/admin/products';
//               }, 1000); 
            


//         } else {
//             alert(result.message, 'Error');
//         }
//     } catch (error) {
//         console.log('Error:`````````````````````````', error);
//         alert('An error occurred while updating the product!');
//     }
// });





// let sizeIndex = 1;
      
// document.getElementById('add-size').addEventListener('click', () => {
//   const container = document.getElementById('size-container');
//   const sizeInput = `
//     <div>
//       <input type="text" name="sizes[${sizeIndex}][size]" placeholder="Size (e.g., 6)"><br><br>
//         <div id="size-error" class="error-message text-danger"></div>
//       <input type="number" name="sizes[${sizeIndex}][stock]" placeholder="Stock for this size"><br><br>
//       <div id="stock-error" class="error-message text-danger"></div>
//       <button type="button" class="remove-size" style="display: inline-block;">Remove Size</button>
//     </div>
//   `;
//   container.insertAdjacentHTML('beforeend', sizeInput);
//   sizeIndex++;
// });

// document.getElementById('size-container').addEventListener('click', (event) => {
//   if (event.target.classList.contains('remove-size')) {
//     const sizeInputs = document.querySelectorAll('#size-container > div');
//     if (sizeInputs.length > 1) {
//       event.target.closest('div').remove();
//     } else {
//       alert('You must have at least one size input');
//     }
//   }
// });





// // document.addEventListener('DOMContentLoaded', function() {
// //     // Use event delegation for remove image buttons
// //     document.querySelector('#card-body').addEventListener('click', function(event) {
// //         if (event.target.classList.contains('remove-img')) {
// //             // Find the parent container of the clicked button
// //             const imageContainer = event.target.closest('#img-container');
            
// //             // Reset the file input
// //             const fileInput = imageContainer.querySelector('input[type="file"]');
// //             fileInput.value = ''; // Clear the selected file
            
// //             // Hide the preview and cropped images
// //             const imgView = imageContainer.querySelector(`[id^="imgView"]`);
// //             const croppedImg = imageContainer.querySelector(`[id^="croppedImg"]`);
            
// //             if (imgView) imgView.style.display = 'none';
// //             if (croppedImg) croppedImg.src = ''; // Or set to a default placeholder image
            
// //             // Optional: You could remove the entire container if needed
// //             // imageContainer.remove();
// //         }
// //     });
// // });

// // // Adding new image containers dynamically
// // document.addEventListener('DOMContentLoaded', () => {
// //     let imageIndex = document.querySelectorAll('.card-body #img-container').length; // Track the current image index

// //     // Add event listener to the "Add Another Image" button
// //     document.getElementById('add-image').addEventListener('click', function () {
// //         const cardBody = document.querySelector('#card-body');

// //         // Create a new image container dynamically
// //         const newImageContainer = document.createElement('div');
// //         newImageContainer.className = 'mb-4';
// //         newImageContainer.id = 'img-container';

// //         newImageContainer.innerHTML = `
// //             <div class="input-upload">
// //                 <img src="" id="imgView${imageIndex}" alt="Preview Image ${imageIndex}" style="max-width: 100%; height: auto; display: none;">
// //                 <input class="form-control" type="file" name="images" id="input${imageIndex}"
// //                     accept="image/png, image/jpeg" onchange="viewImage(event, ${imageIndex})">
// //             </div>
// //             <div class="image-cropper d-flex align-items-center" style="margin-top: 10px;">
// //                 <img src="" id="croppedImg${imageIndex}" alt="Cropped Image ${imageIndex}" style="max-width: 100%; height: auto;">
// //                 <button type="button" id="saveButton${imageIndex}" class="btn-sm btn-primary" style="margin: 10px;">Save</button>
// //                 <br><br>
// //                 <button type="button" class="remove-img" style="margin: 40px;">Remove Image</button>
// //             </div>
// //         `;

// //         // Append the new container to the card body
// //         cardBody.appendChild(newImageContainer);

// //         // Increment the image index for the next added image
// //         imageIndex++;
// //     });
// // });




// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('addProductForm');
//     const addSizeButton = document.getElementById('add-size');
//     const sizeContainer = document.getElementById('size-container');
//     let sizeIndex = document.querySelectorAll('#size-container > div').length;

//     // Image preview functionality
//     function viewImage(event, index) {
//         const input = event.target;
//         const imgView = document.getElementById(`imgView${index}`);
//         const croppedImg = document.getElementById(`croppedImg${index}`);
//         const saveButton = document.getElementById(`saveButton${index}`);
//         const cropperContainer = croppedImg.closest('.image-cropper');

//         if (!input.files || input.files.length === 0) {
//             alert("Please select a file.");
//             return;
//         }

//         const reader = new FileReader();
//         reader.onload = function () {
//             imgView.src = reader.result;
//             cropperContainer.style.display = 'flex';

//             const cropper = new Cropper(imgView, {
//                 aspectRatio: 1,
//                 viewMode: 1,
//             });

//             saveButton.onclick = function () {
//                 const croppedCanvas = cropper.getCroppedCanvas();

//                 if (croppedCanvas) {
//                     croppedImg.src = croppedCanvas.toDataURL('image/jpeg');
//                     cropperContainer.style.display = 'none';

//                     croppedCanvas.toBlob((blob) => {
//                         const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: blob.type });
//                         const dataTransfer = new DataTransfer();
//                         dataTransfer.items.add(croppedFile);
//                         input.files = dataTransfer.files;

//                         cropper.destroy();
//                     });
//                 }
//             };
//         };

//         reader.readAsDataURL(input.files[0]);
//     }

//     // Add dynamic viewImage event listeners
//     document.getElementById('card-body').addEventListener('change', (event) => {
//         if (event.target.type === 'file') {
//             const index = event.target.id.replace('input', '');
//             viewImage(event, index);
//         }
//     });

//     // Add Size functionality
//     addSizeButton.addEventListener('click', () => {
//         const sizeInput = `
//             <div>
//                 <input type="text" name="sizes[${sizeIndex}][size]" placeholder="Size (e.g., 6)">
//                 <div id="size-error" class="error-message text-danger"></div>
//                 <input type="number" name="sizes[${sizeIndex}][stock]" placeholder="Stock for this size">
//                 <div id="stock-error" class="error-message text-danger"></div>
//                 <button type="button" class="remove-size" style="display: inline-block;">Remove Size</button>
//             </div>
//         `;
//         sizeContainer.insertAdjacentHTML('beforeend', sizeInput);
//         sizeIndex++;
//     });

//     // Remove Size functionality
//     sizeContainer.addEventListener('click', (event) => {
//         if (event.target.classList.contains('remove-size')) {
//             const sizeInputs = document.querySelectorAll('#size-container > div');
//             if (sizeInputs.length > 1) {
//                 event.target.closest('div').remove();
//             } else {
//                 alert('You must have at least one size input');
//             }
//         }
//     });

//     // Form Submission
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const formData = new FormData(form);
//         const productId = form.dataset.productId; // Add a data attribute to the form with the product ID

//         try {
//             const response = await fetch(`/admin/editProduct/${productId}`, {
//                 method: 'PATCH',
//                 body: formData
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert('Product updated successfully!');
//                 window.location.href = '/admin/products';
//             } else {
//                 alert(result.message || 'An error occurred while updating the product');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('An error occurred while updating the product');
//         }
//     });
// });



// Image Preview and Cropping Functionality
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

// Dynamic Size Input Management
let sizeIndex = document.querySelectorAll('#size-container > div').length;

document.getElementById('add-size').addEventListener('click', () => {
    const container = document.getElementById('size-container');
    const sizeInput = `
        <div>
            <input type="text" name="sizes[${sizeIndex}][size]" placeholder="Size (e.g., 6)">
            <div id="size-error" class="error-message text-danger"></div>
            <input type="number" name="sizes[${sizeIndex}][stock]" placeholder="Stock for this size">
            <div id="stock-error" class="error-message text-danger"></div>
            <button type="button" class="remove-size">Remove Size</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', sizeInput);
    sizeIndex++;
});

// Remove Size Input
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
                <input class="form-control" type="file" name="images" id="input${imageIndex}"
                    accept="image/png, image/jpeg" onchange="viewImage(event, ${imageIndex})">
            </div>
            <div class="image-cropper d-flex align-items-center" style="margin-top: 10px;">
                <img src="" id="croppedImg${imageIndex}" alt="Cropped Image ${imageIndex}" style="max-width: 100%; height: auto;">
                <button type="button" id="saveButton${imageIndex}" class="btn-sm btn-primary" style="margin: 10px;">Save</button>
                <button type="button" class="remove-img" style="margin: 40px;">Remove Image</button>
            </div>
        `;

        cardBody.appendChild(newImageContainer);
        imageIndex++;
    });

    // Remove Image Functionality
    document.getElementById('card-body').addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-img')) {
            const imageContainer = event.target.closest('#img-container');
            
            // Reset file input
            const fileInput = imageContainer.querySelector('input[type="file"]');
            fileInput.value = '';
            
            // Hide preview images
            const imgView = imageContainer.querySelector(`[id^="imgView"]`);
            const croppedImg = imageContainer.querySelector(`[id^="croppedImg"]`);
            
            if (imgView) imgView.style.display = 'none';
            if (croppedImg) croppedImg.src = '';
            
            // Optional: Remove the entire container
            imageContainer.remove();
        }
    });
});

// Form Validation and Submission
document.getElementById("addProductForm").addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(this);
    const productId = formData.get('productId'); // Assuming you have a hidden input for product ID

    // Validate inputs
    const validateInput = (id, errorId, validationFn, errorMessage) => {
        const input = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        
        if (!validationFn(input.value)) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            return false;
        }
        
        errorElement.style.display = 'none';
        return true;
    };

    // Validation checks
    const isValid = 
        validateInput('productName', 'name-error', 
            (val) => val.trim() !== '' && /^[a-zA-Z\s]+$/.test(val), 
            "Product name should contain only alphabetic characters") &&
        validateInput('productDescription', 'description-error', 
            (val) => val.trim() !== '' && val.trim().length >= 10, 
            "Description must be at least 10 characters long") &&
        validateInput('regularPrice', 'regularPrice-error', 
            (val) => /^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) > 0, 
            "Please enter a valid positive regular price") &&
        validateInput('salePrice', 'salePrice-error', 
            (val) => /^\d+(\.\d{1,2})?$/.test(val) && 
                     parseFloat(val) > 0 && 
                     parseFloat(val) < parseFloat(document.getElementById('regularPrice').value), 
            "Sale price must be less than regular price");

    if (!isValid) return;

    // Prepare sizes data
    const sizes = Array.from(document.querySelectorAll('#size-container > div')).map((div, index) => ({
        size: div.querySelector(`input[name="sizes[${index}][size]"]`).value,
        stock: div.querySelector(`input[name="sizes[${index}][stock]"]`).value
    }));

    try {
        const response = await fetch(`/admin/editProduct/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: formData.get('productName'),
                description: formData.get('productDescription'),
                regularPrice: formData.get('regularPrice'),
                salePrice: formData.get('salePrice'),
                category: formData.get('category'),
                status: formData.get('status'),
                sizes: sizes
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            // Success handling
            Swal.fire({
                icon: 'success',
                title: 'Product Updated!',
                text: result.message,
                timer: 2000,
                timerProgressBar: true,
                didClose: () => {
                    window.location.href = '/admin/products';
                }
            });
        } else {
            // Error handling
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: result.message || 'An error occurred while updating the product'
            });
        }
    } catch (error) {
        console.error('Submission error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred'
        });
    }
});