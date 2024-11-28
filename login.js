document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    if (!localStorage.getItem(username)){
        alert("Account doesn't exist")
    }
    else{
        window.location.href = 'main.html'
    }
})

