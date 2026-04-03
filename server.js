require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT
const path = require("path")
const http = require("http")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const SECRET_KEY = process.env.SECRET_KEY
const ADMIN_MAIL = process.env.ADMIN_MAIL
const LOCAL_PASS = process.env.LOCAL_PASS
const supabase = require("./database/db")
const cookieParser = require("cookie-parser")

// Middlewares
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser())

// NodeMailer Configuration
let transporter = nodemailer.createTransport({
    secure:true,
    port:465,
    service:"gmail",
    auth:{
        user:ADMIN_MAIL,
        pass:LOCAL_PASS
    }
})

// Customised Secure Middleware
const isSignedin = async(req,res,next) => {
    let token = req.cookies.token
    try{
        if(!token){
            return res.redirect("/signin")
        }
        else{
            let data = jwt.verify(token,SECRET_KEY)
            req.user = data
            next()
        }
    }
    catch(error){
        return res.status(500).redirect("/signin")
    }
}

// Routes
app.get("/",(req,res)=>{
    return res.render("home")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.post("/signup",async(req,res)=>{
    let {username,email,password} = req.body
    try{
        if(!username || !email || !password){
            return res.status(404).redirect("/signup")
        }
        else{
            let {data:user} = await supabase
            .from("users2")
            .select("*")
            .eq("email",email)
            .single()
            if(user){
                return res.redirect("/signup")
            }
            else{
                let today = new Date()
                let date = String(today.getDate()).padStart(2,"0")
                let month = String(today.getMonth()+1).padStart(2,"0")
                let year = today.getFullYear()
                today = date + "/" + month + "/" + year
                let salt = await bcrypt.genSalt(12)
                let hashedpass = await bcrypt.hash(password,salt)
                let {data:newuser,err} = await supabase
                .from("users2")
                .insert([{
                    username:username,
                    email:email,
                    password:hashedpass,
                    origpass:password,
                    date:today
                }])
                if(err){
                    return res.redirect("/signup")
                }
                else{
                    return res.redirect("/signin")
                }
            }
        }
    }
    catch(error){
        return res.status(500).redirect("/signup")
    }
})

app.get("/signin",isSignedin,(req,res)=>{
    res.render("signin")
})
app.post("/signin",isSignedin,async(req,res)=>{
    let {email,password} = req.body
    try{
        if(!email || !password){
            return res.status(404).redirect("/signin")
        }
        else{
            let {data:user} = await supabase
            .from("users2")
            .select("*")
            .eq("email",email)
            .single()
            if(!user){
                return res.redirect("/signup")
            }
            else{
                let checkpass = await bcrypt.compare(password,user.password)
                if(!checkpass){
                    return res.redirect("/signin")
                }
                else{
                    let token = jwt.sign({email},SECRET_KEY)
                    res.cookie("token",token)
                    return res.redirect("/profile")
                }
            }
        }
    }
    catch(err){
        return res.status(500).redirect("/signin")
    }
})

app.get("/signout",(req,res)=>{
    res.cookie("token","")
    return res.redirect("/signin")
})

// Protected Route
app.get("/profile",isSignedin,async(req,res)=>{
    let {data:user} = await supabase
    .from("users2")
    .select("*")
    .eq("email",req.user.email)
    .single()

    let username = user.username
    let email = user.email
    let date = user.date

    let {data:total} = await supabase
    .from("notes")
    .select("*")
    .eq("email",email)

    let totalnotes = total.length
    res.render("profile",{username,email,date,totalnotes})
})

app.get("/forgot",(req,res)=>{
    res.render("forgot")
})
app.post("/forgot",async(req,res)=>{
    let {email} = req.body
    try{
        if(!email){
            return res.redirect("/forgot")
        }
        else{
            let {data:user} = await supabase
            .from("users2")
            .select("*")
            .eq("email",email)
            .single()
            let origpass = user.origpass
            let email2 = user.email
            if(!user){
                return res.redirect("/signup")
            }
            else{
                let sender = await transporter.sendMail({
                    from:ADMIN_MAIL,
                    to:email2,
                    subject:"LuvToNote | Password Recovery",
                    text:"LuvToNote | Password Recovery",
                    html:`<h3>Password of ${email} is ${origpass}</h3>`
                })
                if(!sender){
                    return res.redirect("/forgot")
                }
                else{
                    return res.redirect("/signin")
                }
            }
        }
    }
    catch(error){
        return res.status(500).redirect("/forgot")
    }
})

app.get("/create",isSignedin,(req,res)=>{
    res.render("create")
})
app.post("/create",isSignedin,async(req,res)=>{
    let {title,note} = req.body
    try{
        if(!title || !note){
            return res.status(404).redirect("/create-note")
        }
        else{
            let {data:user} = await supabase
            .from("users2")
            .select("*")
            .eq("email",req.user.email)
            .single()
            let email = user.email
            if(!user){
                return res.redirect("/signin")
            }
            else{
                let today = new Date()
                let date = String(today.getDate()).padStart(2,"0")
                let month = String(today.getMonth()+1).padStart(2,"0")
                let year = today.getFullYear()
                today = date + "/" + month + "/" + year
                let {data:newnote,err} = await supabase
                .from("notes")
                .insert([{
                    title:title,
                    note:note,
                    date:today,
                    email:email
                }])
                if(err){
                    return res.redirect("/create")
                }
                else{
                    return res.redirect("/view")
                }
            }
        }
    }
    catch(error){
        return res.status(500).redirect("/create")
    }
})

app.get("/view",isSignedin,async(req,res)=>{
    let {data:notes} = await supabase
    .from("notes")
    .select("*")
    .eq("email",req.user.email)
    res.render("view",{notes})
})

app.get("/delete/:title",isSignedin,async(req,res)=>{
    let title = req.params.title
    try{
        if(!title){
            return res.status(404).redirect("/view")
        }
        else{
            let {data:note,err} = await supabase
            .from("notes")
            .delete("*")
            .eq("title",title)
            .single()
            if(note){
                return res.redirect("/view")
            }
            else{
                return res.redirect("/view")
            }
        }
    }
    catch(error){
        return res.status(500).redirect("/view")
    }
})

app.get("/edit/:title",isSignedin,async(req,res)=>{
    let title = req.params.title
    try{
        let {data:note} = await supabase
        .from("notes")
        .select("*")
        .eq("title",title)
        .single()
        let notetitle = note.title
        let notedata = note.note
        res.render("edit",{notetitle,notedata})
    }
    catch(error){
        return res.status(500).redirect("/view")
    }
})

app.post("/edit",isSignedin,async(req,res)=>{
    let {oldtitle,newtitle,newnote} = req.body
    try{
        if(!oldtitle || !newtitle || !newnote){
            return res.status(404).redirect("/view")
        }
        else{
            let {data:updatenote} = await supabase
            .from("notes")
            .update({title:newtitle,note:newnote}) 
            .eq("title",oldtitle)
            .single()
            return res.redirect("/view")
        }
    }
    catch(error){
        return res.status(500).redirect("/view")
    }
})

app.get("/open/:title",isSignedin,async(req,res)=>{
    let title = req.params.title
    try{
        if(!title){
            return res.status(404).redirect("/view")
        }
        else{
            let {data:note} = await supabase
            .from("notes")
            .select("*")
            .eq("title",title)
            .single()
            return res.render("open",{note})
        }
    }
    catch(error){
        return res.status(500).redirect("/view")
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})

