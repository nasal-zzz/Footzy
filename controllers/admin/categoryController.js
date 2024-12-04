const categorySchema = require('../../models/categorySchema');
const { find } = require('../../models/userSchema');


const categoryInfo = async (req,res) => {
    try {
const moment = require('moment');
const page = parseInt(req.query.page) || 1;
const limit = 2;
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
    totalCategories:totalCategories,
    moment,
    limit 
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
            return res.render('addCategory', {
                error: "Category already exists with this name!",
                data: { name: name, description: description, isListed },
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
        setTimeout(() => {
            res.redirect('/admin/categories')
        }, 2000); 

    } catch (error) {
        console.error("Error in addCategory:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};

// list category
const listCategory = async (req,res) => {
    try {
        let id = req.query.id;
        await categorySchema.updateOne({_id:id},{$set:{isListed:true}})
        res.redirect('/admin/categories');
    } catch (error) {
        console.log('category listing failed',error);
        res.redirect('/admin/notFound')
        
    }
}


// unlist category
const unlistCategory = async (req,res) => {
    try {
        let id = req.query.id    
        await categorySchema.updateOne({_id:id},{$set:{isListed:false}})
        res.redirect('/admin/categories');

        
    } catch (error) {
        console.log('category unlisting failed',error);
        res.redirect('/admin/notFound')
    }
}

// load edit category page
const loadEditCategory = async (req,res) => {
    try {
        let id = req.query.id;
        const categoryData = await categorySchema.findOne({_id:id}); 
        res.render('editCategory',{
            category:categoryData,
        })
    } catch (error) {
        res.redirect('/admin/notFound')
    }
}


const editCategory = async (req,res) => {
    const {id} = req.params;
    const {name,description} = req.body;


    // const existCategory = await categorySchema.findOne({name:name});
    // if(existCategory){
    //     return res.status(404).json({ message: 'Category already exist with this name...!' });

    // }

    try {
        

        const category = await categorySchema.findByIdAndUpdate(id,{
            name:name,
            description:description,
        },{new:true})

    
        if(!category){
            return res.status(404).json({ message: 'Category not found' });

        }
        
        res.json({ message: 'Category updated successfully', category });


    } catch (error) {
        return res.status(404).json({ message: 'Category already exist with this name...!' });

    }
}

module.exports = {
    categoryInfo,
    addCategory,
    loadAddCategory,
    listCategory,
    unlistCategory,
    loadEditCategory,
    editCategory
}
