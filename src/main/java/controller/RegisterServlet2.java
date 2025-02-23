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
import java.io.*;

public class RegisterServlet2 extends HttpServlet {
    private UserService userService;
    
    @Override
    public void init() throws ServletException {
        userService = new UserService();
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            
            userService.register(username, email, password);
            
            out.println("<script>");
            out.println("alert('Congratulations! You are now a member!');");
            out.println("window.location='index.html';");
            out.println("</script>");
            
        } catch (IllegalArgumentException e) {
            out.println("<script>");
            out.println("alert('Registration failed: " + e.getMessage() + "');");
            out.println("window.location='register.jsp';");
            out.println("</script>");
        } catch (Exception e) {
            out.println("<script>");
            out.println("alert('Registration failed: System error');");
            out.println("window.location='register.jsp';");
            out.println("</script>");
            e.printStackTrace();
        }
    }
}
