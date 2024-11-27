

// function validateAndSubmitForm(){
//     const form = document.getElementById('addProductForm');
//     if(validateForm()){
//         form.submit();

        
//     }
// }


function viewImage1(event){
    document.getElementById('imgView1').src = URL.createObjectURL(event.target.files[0])
}
function viewImage2(event){
    document.getElementById('imgView2').src = URL.createObjectURL(event.target.files[0])
}
function viewImage3(event){
    document.getElementById('imgView3').src = URL.createObjectURL(event.target.files[0])
}

// function viewImage(event,index){
//     let input = event.target;
//     let reader = new FileReader();
//     reader.onload = function (){
//         let dataURL = reader.result;
//         let image = document.getElementById('imgView'+index);
//         image.src = dataURL;

//         let cropper = new Cropper(image,{
//             aspectRatio:1,
//             viewMode : 1,
//             guides:true,
//             background:false,
//             autoCropArea:1,
//             zoomable:true
//         });
        
//         let cropperContainer = document.querySelector("#croppedImg"+index).parentNode;
//         cropperContainer.style.display = 'block';

//         let saveButton = document.querySelector("#saveButton"+index);
//         saveButton.addEventListener('click',async function (){
//             let croppedCanvas = cropper.getCroppedCanvas();
//             let croppedImage = document.getElementById("croppedImg"+index);
//             croppedImage.src = croppedCanvas.toDataURL('image/jpeg',1.0);

//             let timestamp = new Date().getTime();
//             let fileName = `cropped-img-${timestamp}-${index}.png`;

//             await croppedCanvas.toBlob(blob=>{
//                 let input = document.getElementById('input'+index);
//                 let imgFile  = new File([blob],fileName,blob);
//                 const fileList = new DataTransfer();
//                 fileList.items.add(imgFile);
//                 input.files = fileList.files;
//             });

//             cropperContainer.style.display = "none";
//             cropper.destroy();


//         });
//     };

//     reader.readAsDataURL(input.files[0]);

// }



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
        cropperContainer.style.display = 'flex';

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



const selectedImages = [];
document.getElementById('input1').addEventListener("change",handleFileSelect)

function handleFileSelect(event){
    const addImageContainer = document.getElementById('addedImagesContainer');
    addImageContainer.innerHTML = ""
    const files = event.target.files;

    for(let i=0;i<files.length;i++){
        const file = files[i]
        selectedImages.push(file);
        const thumbnile = document.createElement("div");
        thumbnile.classList.add("thumbnile");

        const img = document.createElement("img")
        img.src = URL.createObjectURL(file);
        img.alt = "thumbnile";
        img.style.width="50px";
        img.style.height="auto";

        
        const removeIcon = document.createElement("span");
        removeIcon.classList.add("remove-icon")
        removeIcon.innerHTML = "&times";
        removeIcon.addEventListener("click",function (){
            const index = selectedImages.indexOf(file);
            if(index !== -1){
                selectedImages.splice(index,1)

            }

            thumbnile.remove();

        });
        thumbnile.appendChild(img);
        thumbnile.appendChild(removeIcon);
        addImageContainer.appendChild(thumbnile);

    }
}




document.getElementById("addProductForm").addEventListener('submit',(e)=>{

    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const regularPrice = document.getElementById('regularPrice').value;
    const salePrice = document.getElementById('salePrice').value;
    const stock = document.getElementById('stock').value;
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;

    if (name.trim() === "") {
        e.preventDefault()
        document.getElementById('name-error').innerText = "Please enter a product name...!"
  
        setTimeout(function() {
            document.getElementById('name-error').style.display = 'none';
        }, 5000);

    } else
    if(!/^[a-zA-Z\s]+$/.test(name)){
        e.preventDefault()

        document.getElementById('name-error').innerText = "Product name should contain only alphabetic charecters..!"

        setTimeout(function() {
            document.getElementById('name-error').style.display = 'none';
        }, 5000);

    }else if(description.trim() === ""){
        e.preventDefault()

        document.getElementById('description-error').innerText = "PPlease enter the product description...!"

        setTimeout(function() {
            document.getElementById('description-error').style.display = 'none';
        }, 5000);

    }else if(!/^[a-zA-Z\s]{10,}$/.test(description)){
        e.preventDefault()

        document.getElementById('description-error').innerText = "Product description should contain only alphabetic charecters and must 10 charecters length..!"

        setTimeout(function() {
            document.getElementById('description-error').style.display = 'none';
        }, 5000);
   
    }else if(!/^\d+(\.\d{1,2})?$/.test(regularPrice) || parseFloat(regularPrice) < 0){
        e.preventDefault()

        document.getElementById('regularPrice-error').innerText = "Please enter a valid non-negative regular price...!"

        setTimeout(function() {
            document.getElementById('regularPrice-error').style.display = 'none';
        }, 5000);

    }else if(!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) < 0){
        e.preventDefault()

        document.getElementById('salePrice-error').innerText = "Please enter a valid non-negative sale price...!"

        setTimeout(function() {
            document.getElementById('salePrice-error').style.display = 'none';
        }, 5000);

    }else if (parseFloat(regularPrice) <= parseFloat(salePrice)){
        e.preventDefault()

        document.getElementById('salePrice-error').innerText = "Regular price must be greater than sale price...!"
        
        setTimeout(function() {
            document.getElementById('salePrice-error').style.display = 'none';
        }, 5000);


    }else if(!/^\d+(\.\d{1,2})?$/.test(stock) || parseFloat(stock) < 0){
        e.preventDefault()

        document.getElementById('stock-error').innerText = "Please enter a valid non-negative stock...!"

        setTimeout(function() {
            document.getElementById('stock-error').style.display = 'none';
        }, 3000);

    }
    return;
})


