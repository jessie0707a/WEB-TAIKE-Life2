document.addEventListener('DOMContentLoaded', function() {
    loadCollectionData();
});

// 載入收藏資料
async function loadCollectionData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const cardsContainer = document.getElementById('collectionCards');

    try {
        // 顯示載入中提示
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        emptyMessage.style.display = 'none';

        // 獲取用戶登入狀態
        const loginResponse = await fetch('CheckLoginStatusServlet');
        if (!loginResponse.ok) {
            throw new Error('無法檢查登入狀態');
        }
        const loginData = await loginResponse.json();

        if (!loginData.isLoggedIn) {
            throw new Error('請先登入後查看收藏');
        }

        // 獲取收藏的潛水點
        const response = await fetch(`CollectionServlet?userId=${loginData.userId}`);
        if (!response.ok) {
            throw new Error('伺服器回應錯誤');
        }
        const text = await response.text();
        
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Server response:', text);
            throw new Error('伺服器回應格式錯誤');
        }

        // 清空容器
        cardsContainer.innerHTML = '';

        if (!result.success) {
            throw new Error(result.error || '載入失敗');
        }

        if (!result.data || result.data.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        // 創建卡片元素
        result.data.forEach(spot => {
            const card = createDivingCard(spot);
            cardsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading collection:', error);
        errorMessage.textContent = error.message || '載入收藏資料時發生錯誤';
        errorMessage.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// 創建潛水點卡片 - 移除 like 按鈕
function createDivingCard(spot) {
    const card = document.createElement('div');
    card.className = 'diving-card';
    card.innerHTML = `
        <div class="diving-info">
            <h2 class="diving-title">${spot.name}</h2>
            <div class="diving-location">
                <span class="label">Location: </span>
                <span class="value">${spot.location}</span>
            </div>
            <div class="diving-way">
                <span class="label">Diving Way: </span>
                <span class="value">${spot.divingWay}</span>
            </div>
            <p class="diving-content">${spot.content}</p>
        </div>
        <div class="diving-image-container">
            <img src="${spot.imageUrl}" alt="${spot.name}" class="diving-image">
        </div>
    `;

    return card;
}

// 顯示訊息提示
function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-popup';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}