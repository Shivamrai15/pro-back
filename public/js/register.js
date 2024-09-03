document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', function(event) {
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        const jsonData = JSON.stringify(data);
        fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            window.location.href = './login.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

