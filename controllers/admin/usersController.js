const userSchema = require('../../models/userSchema')


const customerInfo = async (req,res) => {
    try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 4;
        const skip = (page-1)*limit;

        const userData = await userSchema.find({
            isAdmin:false,
            $or:[
                {name:{$regex:".*"+search+".*"}},
                {email:{$regex:".*"+search+".*"}}
            ]
        })
        .skip(skip)
        .limit(limit)
        .exec();

        const moment = require('moment');


const count = await userSchema.find({
    isAdmin:false,
    $or:[
        {name:{$regex:".*"+search+".*", $options: "i"}},
        {email:{$regex:".*"+search+".*", $options: "i"}}
    ]
}).countDocuments();

const totalPages = Math.ceil(count / limit);


res.render('users',{
    data: userData,
    currentPage: page,
    totalPages: totalPages,
    limit: limit,
    moment
})

    } catch (error) {
        
    }
}


// block user 
const userBlock = async (req,res) => {
    try {
        let id = req.query.id;
        await userSchema.updateOne({_id:id},{$set:{isBlocked:true}})
        res.redirect('/admin/users')
    } catch (error) {
        console.log('user blocking failed');
        
        res.redirect('/notFound')
    }
}



// unblock user
const userunBlock = async (req,res) => {
    try {
        let id = req.query.id;
        await userSchema.updateOne({_id:id},{$set:{isBlocked:false}})
        res.redirect('/admin/users')

    } catch (error) {
        console.log('user unblocking failed');
        res.redirect('/notFound')
    }
}


module.exports = {customerInfo,userBlock,userunBlock}