document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/api/v1/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        if (result.success) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('logout').style.display = 'inline-block';
        } else {
            document.getElementById('login').style.display = 'inline-block';
            document.getElementById('logout').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('logout').addEventListener('click', function() {
        fetch('/api/v1/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = './login.html';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
})