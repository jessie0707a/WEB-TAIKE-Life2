package service;

import dao.LikeDao;
import model.Like;
import java.sql.SQLException;

public class LikeService {
    private final LikeDao likeDao;
    
    public LikeService() {
        this.likeDao = new LikeDao();
    }
    
    public void addLike(int userId, int cardId) throws SQLException {
        Like like = new Like(userId, cardId);
        if (!likeDao.checkLikeExists(like)) {
            likeDao.addLike(like);
        } else {
            throw new SQLException("Like already exists");
        }
    }
    
    public void removeLike(int userId, int cardId) throws SQLException {
        Like like = new Like(userId, cardId);
        if (likeDao.checkLikeExists(like)) {
            likeDao.removeLike(like);
        } else {
            throw new SQLException("Like does not exist");
        }
    }
}