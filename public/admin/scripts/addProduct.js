
document.getElementById('addProductForm').addEventListener('submit',(e)=>{
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const regularPrice = document.getElementById('regularPrice').value;
    const salePrice = document.getElementById('salePrice').value;
    const stock = document.getElementById('stock').value;
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;

    if (!name || !description || !regularPrice || !salePrice || !stock ) {
        e.preventDefault(); 

        return Swal.fire({
            title: '<span style="color: red;">All Fields Are Required!</span>',
            text: 'must fill all fields!',
            icon: 'warning',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok',
        });

    } else
    if(!/^[a-zA-Z\s]+$/.test(name)){
        e.preventDefault();
        document.getElementById('name-error').innerText = "Product name should contain only alphabetic charecters..!"

        setTimeout(function() {
            document.getElementById('name-error').style.display = 'none';
        }, 5000);

    }else if(!/^[a-zA-Z\s]{10,}$/.test(description)){
        e.preventDefault();
        document.getElementById('description-error').innerText = "Product description should contain only alphabetic charecters and must 10 charecters length..!"

        setTimeout(function() {
            document.getElementById('description-error').style.display = 'none';
        }, 5000);
   
    }else if(!/^\d+(\.\d{1,2})?$/.test(regularPrice) || parseFloat(regularPrice) < 0){
        e.preventDefault();
        document.getElementById('regularPrice-error').innerText = "Please enter a valid non-negative regular price...!"

        setTimeout(function() {
            document.getElementById('regularPrice-error').style.display = 'none';
        }, 5000);

    }else if(!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) < 0){
        e.preventDefault();
        document.getElementById('salePrice-error').innerText = "Please enter a valid non-negative sale price...!"

        setTimeout(function() {
            document.getElementById('salePrice-error').style.display = 'none';
        }, 5000);

    }else if (parseFloat(regularPrice) <= parseFloat(salePrice)){
        e.preventDefault();
        document.getElementById('salePrice-error').innerText = "Regular price must be greater than sale price...!"
        
        setTimeout(function() {
            document.getElementById('salePrice-error').style.display = 'none';
        }, 5000);


    }else if(!/^\d+(\.\d{1,2})?$/.test(salePrice) || parseFloat(salePrice) < 0){
        e.preventDefault();
        document.getElementById('stock-error').innerText = "Please enter a valid non-negative stock...!"

        setTimeout(function() {
            document.getElementById('stock-error').style.display = 'none';
        }, 3000);

    }
})

