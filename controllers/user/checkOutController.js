const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')

const addressSchema =  require('../../models/addressSchema')



const loadCheckout = async (req,res) => {
    
try {

    const userId = req.session.user;
    console.log('ussr=',userId);
    

    const address = await addressSchema.findOne({userId:userId})
    console.log('addess==',address);

   const cartDetails = await cartSchema.findOne({userId:userId})
   console.log('cartill==',cartDetails);
   
    

    res.render('checkout',{
        title:'Checkout',
        address:address.address,
        items:cartDetails.items,
        finalPaice:cartDetails.finalPrice
    })
    
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



const loadplaceOrder = async (req,res) => {
 
    try {

        res.render('orderConfermation',{
            title:'Order Placed'
        })
        
    } catch (error) {

        console.log('err',error.message);
        
        res.redirect('/notFound')
        
    }

}









module.exports ={
    loadCheckout,
    addNewAddress,
    loadplaceOrder
}
