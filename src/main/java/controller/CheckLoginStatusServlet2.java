package controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.*;
import javax.servlet.http.*;
import service.UserService;
import org.json.JSONObject;
import java.io.*;
import java.util.concurrent.atomic.AtomicReference;

public class CheckLoginStatusServlet2 extends HttpServlet {
    private UserService userService;
    
    @Override
    public void init() throws ServletException {
        userService = new UserService();
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();
        
        try {
            Cookie[] cookies = request.getCookies();
            String userId = null;
            String username = null;
            String userEmail = null;

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    switch (cookie.getName()) {
                        case "userId": userId = cookie.getValue(); break;
                        case "username": username = cookie.getValue(); break;
                        case "userEmail": userEmail = cookie.getValue(); break;
                    }
                }
            }

            AtomicReference<String> userIdRef = new AtomicReference<>(userId);
            AtomicReference<String> usernameRef = new AtomicReference<>(username);
            AtomicReference<String> userEmailRef = new AtomicReference<>(userEmail);
            if (userIdRef.get() != null && username != null) {
                userService.getUserById(Integer.parseInt(userIdRef.get())).ifPresentOrElse(user -> {
                    jsonResponse.put("isLoggedIn", true);
                    jsonResponse.put("userId", userIdRef.get());
                    jsonResponse.put("username", usernameRef.get());
                    jsonResponse.put("userEmail", usernameRef.get());
                }, () -> {
                    clearLoginCookies(request, response);
                    jsonResponse.put("isLoggedIn", false);
                    jsonResponse.put("message", "用戶資料無效");
                });
            } else {
                jsonResponse.put("isLoggedIn", false);
                jsonResponse.put("message", "未登入");
            }
            
        } catch (Exception e) {
            jsonResponse.put("isLoggedIn", false);
            jsonResponse.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        out.print(jsonResponse.toString());
    }
    
    private void clearLoginCookies(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("userId") || 
                    cookie.getName().equals("username") || 
                    cookie.getName().equals("userEmail")) {
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }
            }
        }
    }
}