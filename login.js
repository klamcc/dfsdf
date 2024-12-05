document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    if (!localStorage.getItem(username)){
        alert("Account doesn't exist")
    }
    else{
        window.location.href = 'main.html'
        localStorage.setItem('login',username)
    }
})

