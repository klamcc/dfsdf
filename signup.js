document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    if (!localStorage.getItem(username)){
        localStorage.setItem(username,password)
        window.location.href = 'main.html'
    }
    else{
        alert('Account already exists')
    }
})

