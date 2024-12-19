const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const addressSchema =  require('../../models/addressSchema')

const bcrypt = require('bcrypt')


const userAddress = async (req,res) => {
    try {
        
        const userId = req.session.user;
        console.log('id..',userId);

        let userAddress = await addressSchema.findOne({ userId });
        console.log('adrses',userAddress);
        
        if(userAddress){

res.render('address',{
    title:'Address',
    data:userAddress.address
})
        }else{
            res.render('address',{
                title:'Address',
                data:0
            })
        }

    } catch (error) {
        console.log('error',error);
        res.redirect('/notFound')
    }
}

const loadOrders = async (req,res) => {
    try {
        
res.render('orders')

    } catch (error) {
        console.log('error',error);
res.redirect('/notFound')
    }
}

const loadEditInfo = async (req,res) => {
    try {
        const id = req.session.user
        
        console.log("sessn user..../",id);

        
const user = await userSchema.findById(id)
console.log(" user..../infoo",user);

res.render('editInfo',{user:user})

    } catch (error) {
console.log('error',error);
res.redirect('/notFound')
        
    }
}


const editInfo = async (req,res) => {
try {

    const id = req.session.user;
    console.log(" user_id..../infoo",id);

    const {username,dob,phone} = req.body;
    console.log('bodyy..',req.body);
    

    // const user = await userSchema.findOne({email}
    // console.log('find user',user);
    

await userSchema.findByIdAndUpdate(id,{
    username:username,
    dob:dob,
    phone:phone
})

console.log('updated.../');

    console.log('reech..');
    res.redirect('/userProfile')
    
} catch (error) {
    res.redirect('/notFound')

}
   
}


const addAddress = async (req,res) => {

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
        res.redirect('/address');

    } catch (error) {
        console.log('err',error.message);
        
        res.redirect('/notFound')

    }
}


const getEditAddress = async (req,res) => {

    try {
    const index = req.query.index;
    console.log('indxx',index);

    const userId  = req.session.user;
    console.log('user==',userId);
    
    const userAddresses = await addressSchema.findOne({ userId });

    const address = userAddresses.address[index];
    console.log('cur adrs ==',address);
    

    

        res.render('editAddress',{
            title:'Edit Address',
            data:address,
            index:index
        })
        
            } catch (error) {
                console.log('error',error);
        res.redirect('/notFound')
            }
    
}


const editAddress = async (req,res) => {
    try {
        const userId  = req.session.user;
        console.log('user==',userId);

// console.log('bbdy',req.body);


        const { index,fullName, address, addressType, city, landMark, state, place, pincode, phone,country } = req.body;

        const userAddresses = await addressSchema.findOne({ userId });


        const editedAddress = {
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

        if(userAddresses.address[index]){
           
            userAddresses.address[index] = editedAddress;
        }else{
            console.log('invalid addres index');
            
        }

        await userAddresses.save();
        console.log("Address updated successfully");
        
        res.redirect('/address')

        
    } catch (error) {
        console.log('error',error);
        res.redirect('/notFound')
    }
}


const dltAddress = async (req,res) => {
    try {

       const userId = req.session.user;
       console.log('usssr,,./',userId);

    const addresssId = req.query.address;
       console.log('adrs',addresssId);

       const addressExist = await addressSchema.findOne({"address._id":addresssId})
       console.log('exist =',addressExist);
       
       if(!addressExist){
        console.log('address not found..!!');
        
       }
       
    await addressSchema.updateOne(
        {userId:userId},
    {$pull:{address:{_id:addresssId}}}
    );

    console.log('address deleted successfully..!');
    
    res.redirect('/address');

        
    } catch (error) {
        console.log('error',error);
        res.redirect('/notFound')
    }
}


// const setDefaultAddress = async (req,res) => {
    
// try {

//     const userId = req.session.user;
//     console.log('usssr,,./',userId);

//  const addresssId = req.query.address;
//     console.log('adrs',addresssId)


//     await addressSchema.findOneAndUpdate(
//         {userId:userId,"address._id":addresssId},
//         {$set:{"address.$.isDefault":true}}
//     )
//     console.log('address set as default...!');
    
//     await addressSchema.updateMany(
//         {userId:userId,"address._id":{$ne:addresssId}},
//         {$set:{"address.$[].isDefault":false}}
//     )
//     console.log('others set as not default...!');

//     console.log("success....!!");
    

//     res.redirect('/address');


    
// } catch (error) {
//     console.log('error',error);
//         res.redirect('/notFound')
// }

// }

const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.session.user;
        const addressId = req.query.address; // Corrected typo

        // Atomic update in a single operation
        await addressSchema.updateMany(
            { userId: userId },
            { 
                $set: { 
                    "address.$[elem].isDefault": false 
                }
            },
            { 
                arrayFilters: [{ "elem._id": { $ne: addressId } }],
                // multi: true 
            }
        );

        await addressSchema.updateOne(
            { userId: userId, "address._id": addressId },
            { $set: { "address.$.isDefault": true } }
        );

        res.redirect('/address');
    } catch (error) {
        console.error('Error setting default address:', error);
        res.redirect('/notFound');
    }
};

module.exports = {
    userAddress,
    loadOrders,
    loadEditInfo,
    editInfo,
    addAddress,
    getEditAddress,
    editAddress,
    dltAddress,
    setDefaultAddress
}