document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        const jsonData = JSON.stringify(data);
        fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData,
            credentials: 'include'
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            window.location.href = './index.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});