const userSchema = require('../../models/userSchema') // requiring user schema

const productSchema = require('../../models/productSchema')

const categorySchema =  require('../../models/categorySchema')

const cartSchema = require('../../models/cartSchema')


const getDetails = async (req, res) => {
    try {
        let id = req.query.id;

        // Check if id is valid
        if (!id || id.trim() === "") {
            console.log("Invalid or missing ID");
            return res.redirect("/shop");
        }

        console.log("id........", id);

        // Query the database
        const product = await productSchema.findOne({ _id: id }).populate('category')
        const related = await productSchema.find({
            category: product.category._id, // Use category._id if populated
            _id: { $ne: product._id }, // Exclude the current product
        });
        
        console.log('rele................',related);
        

        console.log("proo.....", product);
        if (product) {
            res.render("singleProduct", {
                product: product,
                related:related,
                suser:req.session.user,
                title:'Details'

            });
        } else {
            console.log("Product not found");
            res.redirect("/shop");
        }
    } catch (error) {
        console.log("Error...!", error);
        res.redirect("/shop");
    }
};









module.exports ={
    getDetails
}