function validateUserLogin(){
    const email = document.getElementById("exampleInputEmail").value.trim();
    const password = document.getElementById("exampleInputPassword").value.trim();
    const emailMessageDisplay = document.getElementById("emailHelp")
    const passwordMessageDisplay = document.getElementById("passwordHelp");

    // const emailPattern = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/';

    document.getElementById("exampleInputEmail").addEventListener("focusin",()=>{
        emailMessageDisplay.style.color = "white";
        emailMessageDisplay.innerText = "We'll never share your email with anyone else";
    })

    document.getElementById("exampleInputPassword").addEventListener("focusin",()=>{
        passwordMessageDisplay.innerText = " ";
    })


    if(email === "" || email === undefined){
        emailMessageDisplay.style.color = "red";
        emailMessageDisplay.innerText = "Email can't be blank";
        return false;
    }
   
    
   
    if(password == "" || password == undefined){
        passwordMessageDisplay.style.color = "red";
        passwordMessageDisplay.innerText = "Password can't be blank";
        return false;
    }
    

    if(!(password.length == 8)){
        passwordMessageDisplay.style.color = "red";
        passwordMessageDisplay.innerText = "Password must be 8 characters";
        return false;
    }

    return true;
}


//user registration validation
function validateUserRegistration(){
    const firstname = document.getElementById("exampleInputFname").value.trim();
    const lastname = document.getElementById("exampleInputLname").value.trim();
    const email = document.getElementById("exampleInputEmail").value.trim()
    const phone = document.getElementById("exampleInputPhone").value.trim();
    const password = document.getElementById("exampleInputPassword").value.trim();

    const fnameError = document.getElementById("fnameError")
    const lnameError = document.getElementById("lnameError")
    const emailError = document.getElementById("emailError")
    const phoneError = document.getElementById("phoneError")
    const passwordError = document.getElementById("passwordError")


    document.getElementById("fnameError").addEventListener("focusin",()=>{
        fnameError.innerText = " ";
    })

    document.getElementById("lnameError").addEventListener("focusin",()=>{
        lnameError.innerText = " ";
    })

    document.getElementById("emailError").addEventListener("focusin",()=>{
        emailError.innerText = " ";
    })

    document.getElementById("phoneError").addEventListener("focusin",()=>{
        phoneError.innerText = " ";
    })

    document.getElementById("passwordError").addEventListener("focusin",()=>{
        passwordError.innerText = " ";
    })


    if(firstname === "" || firstname === undefined){
        fnameError.innerText = "Firstname can't be blank";
        return false;
    }
   
    
   
    if(lastname == "" || lastname == undefined){
        lnameError.style.color = "red";
        lnameError.innerText = "Lastname can't be blank";
        return false;
    }

    if(email == "" || email == undefined){
        emailError.style.color = "red";
        emailError.innerText = "Email can't be blank";
        return false;
    }

    if(phone == "" || phone == undefined){
        phoneError.style.color = "red";
        phoneError.innerText = "Lastname can't be blank";
        return false;
    }

    if(password == "" || password == undefined){
        passwordError.style.color = "red";
        passwordError.innerText = "Lastname can't be blank";
        return false;
    }
    

    if(!(password.length == 8)){
        passwordError.style.color = "red";
        passwordError.innerText = "Password must be 8 characters";
        return false;
    }

    return true;
}


//validate admin added users

function validateAdminAddedUsers(){
    
}