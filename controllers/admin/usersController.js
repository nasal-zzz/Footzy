const userSchema = require('../../models/userSchema')


const customerInfo = async (req,res) => {
    try {
        let search ="";
        if(req.query.search){
            search = req.query.search;
        }
        
        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        const limit = 10
        const userData = await userSchema.find({
            isAdmin:false,
            $or:[
                {name:{$regex:".*"+search+".*"}},
                {email:{$regex:".*"+search+".*"}}
            ]
        })
        .limit(limit*1)
        .skip((page-1)*limit)
        .exec();

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