const categorySchema = require('../../models/categorySchema');
const { find } = require('../../models/userSchema');


const categoryInfo = async (req,res) => {
    try {
        
const page = parseInt(req.query.page) || 1;
const limit = 4;
const skip = (page-1)*limit;

const categoryData = await categorySchema.find({})
.sort({createdAt:-1})
.skip(skip)
.limit(limit)

const totalCategories = await categorySchema.countDocuments();
const totalPages = Math.ceil(totalCategories/limit)
res.render('category',{
    category:categoryData,
    currentPage:page,
    totalPages:totalPages,
    totalCategories:totalCategories 
});

    } catch (error) {
   console.error(error);
   res.redirect('/admin/notFound')
     
        
    }
}

// get 
const loadAddCategory = async (req,res) => {
    try {
        res.render('addCategory')
    } catch (error) {
        res.redirect('/admin/notFound')
    }
}

// post
const addCategory = async (req, res) => {
    const { name, description,isListed } = req.body;

    try {
        // Check if category name already exists
        const existingCategory = await categorySchema.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).render('addCategory', {
                error: "Category already exists with this name!",
                data: { name: trimmedName, description: trimmedDescription, isListed },
            });
         }

        // Create a new category
        const newCategory = new categorySchema({
            name: name.trim(),
            description: description.trim(),
            isListed: isListed,
        });

        await newCategory.save();

        // return res.status(201).json({ message: "Category added successfully!" });
         res.redirect('/admin/categories')

    } catch (error) {
        console.error("Error in addCategory:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};









module.exports = {categoryInfo,addCategory,loadAddCategory}
