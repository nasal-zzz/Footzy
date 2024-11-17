



const erroPage = async(req,res)=>{
    try {
        res.render('404')

    } catch (error) {
        res.redirect('*')
    }
}


const loaduserHome = async(req,res)=>{
    try{

return res.render('home',{title:'Home'})

    }catch(error){

console.log('not found');
res.status(500).send('server error')

    }
}




module.exports = {
    loaduserHome,erroPage
}