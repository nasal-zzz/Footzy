const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema =  require('../../models/orderSchema')




const loadCheckout = async (req,res) => {
    
try {

    const userId = req.session.user;
    console.log('ussr=',userId);
    
    const cartDetails = await cartSchema.findOne({userId:userId})
    console.log('cartill==',cartDetails);


    const address = await addressSchema.findOne({userId:userId})
    console.log('addess==',address);

    if(!address){
        const ad = []
        // res.status(500).json('please add an address')
        res.render('checkout',{
            title:'Checkout',
            address:ad,
            items:cartDetails.items,
            finalPaice:cartDetails.finalPrice,
            suser:userId

        })

        console.log('please add an address');
        
    }else{


    res.render('checkout',{
        title:'Checkout',
        address:address.address,
        items:cartDetails.items,
        finalPaice:cartDetails.finalPrice,
        suser:userId
    })
}
} catch (error) {
    
    console.error(error);
    res.redirect('/notFound')
    
}


}


const addNewAddress = async (req,res) => {

    console.log('reeeeeeeeeeeeeeeeeeeeeecheddddddddddddddddddddd////');
    

    const userId = req.session.user;
    console.log(" user_id..../infoo",userId);

    console.log('bodyy..',req.body);

    try {
       

        const { fullName, address, addressType, city, landMark, state, place, pincode, phone,country } = req.body;


        const newAddress = {
            fullName,
            address,
            addressType,
            city,
            landMark,
            state,
            place,
            pincode,
            phone,
            country
        };
        console.log('neww.../',newAddress);
        

        let userAddress = await addressSchema.findOne({ userId });
        console.log('ussr',userAddress);
        

        if (userAddress) {
            userAddress.address.push(newAddress);
            await userAddress.save();
        } else {
            // If no document exists, create a new one
            userAddress = new addressSchema({
                userId,
                address: [newAddress]
            });
            await userAddress.save();
        }

        console.log("New address saved successfully.");
        res.redirect('/checkOut');

    } catch (error) {
        console.log('err',error.message);
        
        res.redirect('/notFound')

    }
}





const generateOrderId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);  // Random number between 1000 and 9999
    return `ORD${randomNum}`;
  };


const getOrderDetails = async (req,res) => {
 
    try {
        
        const userId = req.session.user;
        console.log('boooooooody post',req.body , 'usr',userId);
        
        const  { addressId, paymentMethod } = req.body

        console.log('id adres body =',addressId);
        

      const orderItems = await cartSchema.findOne({userId:userId})
      console.log('cargt=',orderItems);


      const newOrder = new orderSchema ({
        orderId: generateOrderId(),
        userId,
        orderedItems: [],
        totalPrice:orderItems.finalPrice,
        discount:0,
        finalAmount:0,
        address:addressId,
        paymentMethod,
        invoiceDate:Date.now(),
        orderStatus:'Pending'
      })

      console.log();
      

      orderItems.items.forEach(item => {
        newOrder.orderedItems.push({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            size:item.size,
            price: item.price,
            quantity: item.quantity,
            total: item.totalPrice
        });
        })
        newOrder.finalAmount = newOrder.totalPrice - newOrder.discount
        await newOrder.save();

        console.log('order saved success full..!');
        
        for (let item of newOrder.orderedItems) {

            const product = await productSchema.findOne({
                _id: item.productId,'sizes.size': item.size,
             }); 

             const sizeIndex = product.sizes.findIndex(size => size.size === item.size);

                product.sizes[sizeIndex].stock -= item.quantity;  
            await product.save();
          }


          console.log('product stocks updated');

          await cartSchema.deleteMany({ userId: userId });

          console.log('cart updated');


    } catch (error) {

        console.log('err',error.message);
        
        res.redirect('/notFound')
        
    }

}




const loadplaceOrder = async (req,res) => {
 
    try {

        const userId = req.session.user;

        const latestOrder = await orderSchema
  .findOne({ userId: userId }) 
  .sort({ invoiceDate: -1 })  
  .populate('orderedItems.productId'); 

console.log('Latest Order:', latestOrder);

        const address = await addressSchema.findOne({'address._id':latestOrder.address},{ "address.$": 1 })
        console.log('addr Id = ',latestOrder.address);
        
        console.log('adrrs==',address);
        
        

        res.render('orderConfermation',{
            title:'Order Placed',
            details:latestOrder,
            items:latestOrder.orderedItems,
            address:address.address,
            suser:userId
        })
        
    } catch (error) {

        console.log('err',error.message);
        
        res.redirect('/notFound')
        
    }

}







module.exports ={
    loadCheckout,
    addNewAddress,
    loadplaceOrder,
    getOrderDetails
}
