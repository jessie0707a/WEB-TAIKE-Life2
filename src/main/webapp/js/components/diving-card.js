async function handleLikeClick(event) {
    const button = event.currentTarget;
    
    try {
        // Check login status
        const loginResponse = await fetch('CheckLoginStatusServlet2');
        const loginData = await loginResponse.json();
        
        if (!loginData.isLoggedIn) {
            alert('請先登入才能按讚！');
            window.location.href = 'login.html';
            return;
        }

        const cardId = button.getAttribute('data-card-id');
        const isLiked = button.classList.contains('active');
        const method = isLiked ? 'DELETE' : 'POST';

        const response = await fetch(`LikeManageServlet/${cardId}?userId=${loginData.userId}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update like status');
        }

        // Update button state
        button.classList.toggle('active');
        showMessage(isLiked ? '已取消讚' : '已按讚');
        
    } catch (error) {
        console.error('Error handling like:', error);
        showError(null, '無法更新讚狀態，請稍後再試');
    }
}