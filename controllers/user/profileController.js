const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const addressSchema =  require('../../models/addressSchema')

const orderSchema = require('../../models/orderSchema')

const bcrypt = require('bcrypt')


const userAddress = async (req,res) => {
    try {
        
        const userId = req.session.user;
        console.log('id..',userId);

        let userAddress = await addressSchema.findOne({ userId });
        console.log('adrses',userAddress);
        
        if(userAddress){

res.render('address',{
    title:' Address',
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

const loadOrders = async (req, res) => {
    try {
        const userId = req.session.user;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;  
        const skip = (page - 1) * limit;
        
        const orders = await orderSchema.find({ userId: userId }).sort({ invoiceDate: -1 })
        .skip(skip)
        .limit(limit)
        console.log('ordrs-=', orders);

        const totalOrders = await orderSchema.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalOrders / limit);
        

        res.render('orders', {
            title: 'Orders',
            orders: orders,
            items: orders.orderedItems,
            currentPage: page,
            totalPages: totalPages,
        });

    } catch (error) {
        console.error('Error loading orders:', error);
        res.status(500).send('Error loading orders.');
    }
};







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


// const editInfo = async (req,res) => {
// try {

//     const id = req.session.user;
//     console.log(" user_id..../infoo",id);

//     const {username,dob,phone} = req.body;
//     console.log('bodyy..',req.body);
    

//     // const user = await userSchema.findOne({email}
//     // console.log('find user',user);

// const existPhone = await userSchema.findOne({phone:phone})
// console.log('exist!!',existPhone);

    

// await userSchema.findByIdAndUpdate(id,{
//     username:username,
//     dob:dob,
//     phone:phone
// })

// console.log('updated.../');

//     console.log('reech..');
//     res.redirect('/userProfile')
    
// } catch (error) {
//     res.redirect('/notFound')

// }
   
// }

const editInfo = async (req, res) => {
    try {
        const id = req.session.user;
        const { username, dob, phone } = req.body;

        console.log("User ID: ", id);
        console.log('Request Body: ', req.body);
        

        const existPhone = await userSchema.findOne({ phone: phone, _id: { $ne: id } });
        if (existPhone) {
            console.log('Phone number already in use: ', existPhone);
            return res.status(400).json({ error: "Phone number already in use." });
        }

        const updatedUser = await userSchema.findByIdAndUpdate(id, {
            username,
            dob,
            phone
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log('User updated successfully: ', updatedUser);

        // Send success response
        res.status(200).json({ message: "Profile updated successfully!" });

    } catch (error) {
        console.error('Error updating profile: ', error);
        res.status(500).json({ error: "An error occurred. Please try again later." });
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




const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.session.user;
        const addressId = req.query.address; 

        await addressSchema.updateMany(
            { userId: userId },
            { 
                $set: { 
                    "address.$[elem].isDefault": false 
                }
            },
            { 
                arrayFilters: [{ "elem._id": { $ne: addressId } }],
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