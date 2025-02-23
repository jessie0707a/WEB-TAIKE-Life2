package service;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.UserDao;
import model.User;
import java.sql.SQLException;
import java.util.Optional;

public class UserService {
    private final UserDao userDao;
    
    public UserService() {
        this.userDao = new UserDao();
    }
    
    public Optional<User> login(String email, String password) throws SQLException {
        return userDao.findByEmailAndPassword(email, password);
    }
    
    public Optional<User> getUserById(int id) throws SQLException {
        return userDao.findById(id);
    }
    
    public void register(String username, String email, String password) throws SQLException {
        if (!isValidPassword(password)) {
            throw new IllegalArgumentException("Invalid password format");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        
        userDao.save(user);
    }
    
    private boolean isValidPassword(String password) {
        return password.matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$");
    }
}