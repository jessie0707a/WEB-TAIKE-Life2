package config;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DatabaseConfig {
    public static final String JDBC_URL = "jdbc:mysql://localhost:3306/jsdb1";
    public static final String JDBC_USER = "root";
    public static final String JDBC_PASSWORD = "jessiepassword";
    public static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
}
