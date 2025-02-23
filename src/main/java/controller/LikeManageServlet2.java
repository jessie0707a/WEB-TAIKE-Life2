package controller;

import java.io.IOException;
import java.sql.SQLException;
import service.LikeService;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class LikeManageServlet2 extends HttpServlet {
    private LikeService likeService;
    
    @Override
    public void init() throws ServletException {
        likeService = new LikeService();
    }
    
    // 新增讚
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        processRequest(request, response, true);
    }
    
    // 取消讚
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        processRequest(request, response, false);
    }
    
    // 統一處理請求的方法
    private void processRequest(HttpServletRequest request, HttpServletResponse response, boolean isAdding) 
            throws ServletException, IOException {
            
        // 從 URL 參數獲取 userId
        String userIdStr = request.getParameter("userId");
        if (userIdStr == null || userIdStr.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing userId");
            return;
        }
        
        try {
            int userId = Integer.parseInt(userIdStr);
            String pathInfo = request.getPathInfo();
            
            if (pathInfo == null || pathInfo.equals("/")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing cardId");
                return;
            }
            
            int cardId = Integer.parseInt(pathInfo.substring(1));
            
            if (isAdding) {
                likeService.addLike(userId, cardId);
                response.setStatus(HttpServletResponse.SC_CREATED);
            } else {
                likeService.removeLike(userId, cardId);
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
            
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid userId or cardId");
            e.printStackTrace();
        } catch (SQLException e) {
            if (e.getMessage().contains("already exists")) {
                response.sendError(HttpServletResponse.SC_CONFLICT, "Already liked");
            } else if (e.getMessage().contains("does not exist")) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Like not found");
            } else {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error");
            }
            e.printStackTrace();
        }
    }
}