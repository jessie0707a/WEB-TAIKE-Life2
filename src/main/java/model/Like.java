package model;

import java.sql.Timestamp;

public class Like {
    private int userId;
    private int cardId;
    private Timestamp createdAt;

    // Constructors
    public Like() {}

    public Like(int userId, int cardId) {
        this.userId = userId;
        this.cardId = cardId;
    }

    // Getters and Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public int getCardId() { return cardId; }
    public void setCardId(int cardId) { this.cardId = cardId; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}