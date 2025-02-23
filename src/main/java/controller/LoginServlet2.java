package controller;


import javax.servlet.*;
import javax.servlet.http.*;
import service.UserService;
import model.User;
import org.json.JSONObject;
import java.io.*;

public class LoginServlet2 extends HttpServlet {
    private UserService userService;
    
    @Override
    public void init() throws ServletException {
        userService = new UserService();
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();
        
        try {
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            
            userService.login(email, password).ifPresentOrElse(user -> {
                // Create session
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", user.getId());
                session.setAttribute("username", user.getUsername());
                session.setAttribute("userEmail", user.getEmail());
                session.setMaxInactiveInterval(30 * 60);
                
                // Set cookies
                addCookie(response, "userId", String.valueOf(user.getId()));
                addCookie(response, "username", user.getUsername());
                addCookie(response, "userEmail", user.getEmail());
                
                jsonResponse.put("success", true);
                jsonResponse.put("username", user.getUsername());
                jsonResponse.put("message", "登入成功！");
                
            }, () -> {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "帳號或密碼錯誤");
            });
            
        } catch (Exception e) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "系統錯誤：" + e.getMessage());
            e.printStackTrace();
        }
        
        out.print(jsonResponse.toString());
    }
    
    private void addCookie(HttpServletResponse response, String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}