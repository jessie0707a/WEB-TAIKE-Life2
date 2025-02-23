package util;

import config.DatabaseConfig;
import javax.sql.DataSource;
import com.mysql.cj.jdbc.MysqlDataSource;
import java.sql.Connection;
import java.sql.SQLException;


public class DatabaseConnectionManager {
    private static DataSource dataSource;
    
    static {
        initializeDataSource();
    }
    
    private static void initializeDataSource() {
        try {
            Class.forName(DatabaseConfig.JDBC_DRIVER);
            System.out.println("Driver loaded...");
            
            MysqlDataSource mysqlDS = new MysqlDataSource();
            mysqlDS.setURL(DatabaseConfig.JDBC_URL);
            mysqlDS.setUser(DatabaseConfig.JDBC_USER);
            mysqlDS.setPassword(DatabaseConfig.JDBC_PASSWORD);
            
            dataSource = mysqlDS;
            System.out.println("DataSource initialized...");
        } catch (ClassNotFoundException e) {
            System.out.println("Driver loading failed: " + e.getMessage());
            throw new ExceptionInInitializerError(e);
        }
    }
    
    public static DataSource getDataSource() {
        return dataSource;
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}