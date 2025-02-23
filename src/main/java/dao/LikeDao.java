package dao;

import model.Like;
import util.DatabaseConnectionManager;
import java.sql.*;

public class LikeDao {
    public void addLike(Like like) throws SQLException {
        String sql = "INSERT INTO user_likes (user_id, card_id) VALUES (?, ?)";
        
        try (Connection conn = DatabaseConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, like.getUserId());
            stmt.setInt(2, like.getCardId());
            
            stmt.executeUpdate();
        }
    }
    
    public void removeLike(Like like) throws SQLException {
        String sql = "DELETE FROM user_likes WHERE user_id = ? AND card_id = ?";
        
        try (Connection conn = DatabaseConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, like.getUserId());
            stmt.setInt(2, like.getCardId());
            
            stmt.executeUpdate();
        }
    }
    
    public boolean checkLikeExists(Like like) throws SQLException {
        String sql = "SELECT COUNT(*) FROM user_likes WHERE user_id = ? AND card_id = ?";
        
        try (Connection conn = DatabaseConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, like.getUserId());
            stmt.setInt(2, like.getCardId());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
}