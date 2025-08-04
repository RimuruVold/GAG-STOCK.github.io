function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === 'adminsiji' && pass === 'Skull771') {
                isAdmin = true;
                toggleLogin();
                renderTable();
            } else {
                alert('Invalid credentials.');
            }
        }