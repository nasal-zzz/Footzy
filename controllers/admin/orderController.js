const productSchema = require('../../models/productSchema');
const categorySchema = require('../../models/categorySchema');
const userSchema = require('../../models/userSchema')
const orderSchema = require('../../models/orderSchema')
const addressSchema = require('../../models/addressSchema')





const ordersList = async (req,res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 5;  
        const skip = (page - 1) * limit;

        const orders = await orderSchema.find().populate('userId', 'username').sort({ invoiceDate: -1 })
        .skip(skip)
        .limit(limit)


        const totalOrders = await orderSchema.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);



        
res.render('ordersAdmin',{
    title:'Orders',
    orders:orders,
    currentPage: page,
    totalPages: totalPages,
})



    } catch (error) {
        console.log(error);
        res.redirect('/admin/notFound')
        
    }
}




    
const orderDetails = async (req,res) => {
    try {
        const orderId = req.query.orderId;

        const order = await orderSchema.findOne({orderId:orderId})
        console.log(order,'orderrrr.');
        const orderedItems = order.orderedItems;

        const itemDetails = await Promise.all(
            orderedItems.map(async (item) => {
                const product = await productSchema.findOne({ _id: item.productId });
                return {
                    ...item,
                    image: product ? product.productImage : 'img/default.jpg' 
                };
            })
        );

        const address = await addressSchema.findOne({'address._id':order.address},{ "address.$": 1 })

        console.log('ad id==',order.address);


        console.log('adress==',address);
        


        res.render('oderDetails',{
            title:'Order Details',
            order:order,
            items:orderedItems,
            img:itemDetails,
            address:address
        })
        

    
} catch (error) {
    console.log(error);
    res.redirect('/admin/notFound')
    
}

}


const updateOrderStatus = async (req, res) => {
    try {
      const { orderId, newStatus } = req.body; 
  
      const order = await orderSchema.findOne({orderId:orderId});
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (newStatus === 'Cancelled'){

        await orderSchema.findOneAndUpdate({ orderId: orderId }, { $set: { orderStatus: 'Cancelled' } });

        res.status(200).json({ message: 'Order status updated successfully', order });

        console.log('Order Cancelled successfully............../');

        for (let item of order.orderedItems) {
            await productSchema.findOneAndUpdate(
                { 
                    _id: item.productId._id, 
                    'sizes.size': item.size 
                },
                { 
                    $inc: { 'sizes.$.stock': item.quantity } 
                },
                { new: true }
            );
        }

        console.log('cancelled.............');

      }else{

      await orderSchema.findOneAndUpdate({orderId:orderId},{$set:{orderStatus:newStatus}})
  
  
      res.status(200).json({ message: 'Order status updated successfully', order });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports = {
    ordersList,
    orderDetails,
    updateOrderStatus 
}

