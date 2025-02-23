async function initializeDivingCard(cardId) {
    const card = document.getElementById(`divingCard${cardId}`);
    if (!card) return;

    try {
        // 添加載入中狀態
        card.classList.add('loading');

        // 呼叫 DivingSpotServlet 獲取潛水點資料
        const response = await fetch(`DivingSpotServlet/${cardId}`);
        if (!response.ok) {
            throw new Error('Failed to load diving spot data');
        }

        const data = await response.json();
        updateCardContent(card, data);
        
        // 初始化按讚狀態
        await checkInitialLikeStatus(cardId);
        
    } catch (error) {
        console.error('Error loading card data:', error);
        showError(card, '無法載入潛水點資料');
    } finally {
        // 移除載入中狀態
        card.classList.remove('loading');
    }
}

// 更新卡片內容
function updateCardContent(card, data) {
    // 更新標題
    card.querySelector('.diving-title').textContent = data.name;
    
    // 更新位置
    card.querySelector('.diving-location .value').textContent = data.location;
    
    // 更新潛水方式
    card.querySelector('.diving-way .value').textContent = data.divingWay;
    
    // 更新內容描述
    card.querySelector('.diving-content').textContent = data.content;
    
    // 更新圖片
    const imgElement = card.querySelector('.diving-image');
    imgElement.src = data.imageUrl;
    imgElement.alt = data.name;
    
    // 更新讚按鈕的 data-card-id
    const likeButton = card.querySelector('.like-button');
    if (likeButton) {
        likeButton.setAttribute('data-card-id', data.cardId);
        // 添加點擊事件
        likeButton.addEventListener('click', handleLikeClick);
    }
}

// 處理按讚點擊
async function handleLikeClick(event) {
    const button = event.currentTarget;
    
    try {
        // 檢查登入狀態
        const loginResponse = await fetch('CheckLoginStatusServlet');
        const loginData = await loginResponse.json();
        
        if (!loginData.isLoggedIn) {
            showLoginPrompt();
            return;
        }

        const cardId = button.getAttribute('data-card-id');
        const isLiked = button.classList.contains('active');
        const method = isLiked ? 'DELETE' : 'POST';

        // 呼叫 LikeManageServlet
        const response = await fetch(`LikeManageServlet/${cardId}?userId=${loginData.userId}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update like status');
        }

        // 更新按鈕狀態
        button.classList.toggle('active');
        
        // 顯示成功訊息
        showMessage(isLiked ? '已取消讚' : '已按讚');
        
        // 觸發按讚動畫
        animateLikeButton(button);
        
    } catch (error) {
        console.error('Error handling like:', error);
        showError(null, '無法更新讚狀態，請稍後再試');
    }
}

// 檢查初始按讚狀態
async function checkInitialLikeStatus(cardId) {
    try {
        // 檢查登入狀態
        const loginResponse = await fetch('CheckLoginStatusServlet');
        const loginData = await loginResponse.json();
        
        if (!loginData.isLoggedIn) {
            return;
        }

        // 檢查按讚狀態
        const response = await fetch(`LikeCheckServlet/check/${cardId}?userId=${loginData.userId}`);
        if (!response.ok) {
            throw new Error('Failed to check like status');
        }

        const data = await response.json();
        const button = document.querySelector(`#divingCard${cardId} .like-button`);
        if (data.isLiked && button) {
            button.classList.add('active');
        }
    } catch (error) {
        console.error('Error checking initial like status:', error);
    }
}

// 顯示登入提示
function showLoginPrompt() {
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
        loginPrompt.style.display = 'block';
    } else {
        alert('請先登入才能按讚！');
    }
}

// 關閉登入提示
function closeLoginPrompt() {
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
        loginPrompt.style.display = 'none';
    }
}

// 轉向登入頁面
function redirectToLogin() {
    window.location.href = 'login.html';
}

// 按讚按鈕動畫
function animateLikeButton(button) {
    button.classList.add('animate');
    setTimeout(() => {
        button.classList.remove('animate');
    }, 500);
}

// 顯示錯誤訊息
function showError(card, message) {
    if (card) {
        // 在卡片內顯示錯誤
        let errorElement = card.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            card.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        // 全局錯誤提示
        alert(message);
    }
}

// 顯示一般訊息
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-popup';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);

    // 2秒後自動移除
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}

// 當 DOM 載入完成時初始化卡片
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有潛水卡片
    const cardIds = [1, 2]; // 可以根據實際需求調整卡片ID
    cardIds.forEach(cardId => {
        initializeDivingCard(cardId);
    });
});