document.getElementById('submit').addEventListener('click',(e)=>{
    e.preventDefault()
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    if (!localStorage.getItem(username)){
        localStorage.setItem(username,JSON.stringify({'password':password,'bookmarks':[]}))
        window.location.href = 'main.html'
        localStorage.setItem('login',username)
    }
    else{
        alert('Account already exists')
    }
})

