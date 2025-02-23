document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate password format
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!passwordPattern.test(password)) {
                alert('密碼格式錯誤！需包含字母和數字，最少6個字符。');
                return;
            }

            try {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('memberType', 'user'); // Default to user registration
                
                const response = await fetch('RegisterServlet2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData
                });

                const data = await response.text();
                
                // Check if response is JSON
                try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.success) {
                        alert('註冊成功！');
                        window.location.href = 'login.html';
                    } else {
                        alert(jsonData.message || '註冊失敗，請稍後再試');
                    }
                } catch (e) {
                    // If not JSON, assume it's the existing HTML response
                    document.write(data);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('系統錯誤，請稍後再試');
            }
        });
    }
});