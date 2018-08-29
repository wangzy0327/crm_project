package com.wzy.crm.utils;

import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

public class FtpUtil {

    private String ip;
    private int port;
    private String user;
    private String pwd;
    private FTPClient ftpClient;

    //生成一个日志类
    private static Logger logger = LoggerFactory.getLogger(FtpUtil.class);
    //用来加载配置文件中的信息
    private static String ftpId = PropertiesUtil.getProperty("ftp.server.ip");
    private static String ftpUser = PropertiesUtil.getProperty("ftp.server.user");
    private static String ftpPass = PropertiesUtil.getProperty("ftp.server.password");
    public FtpUtil(String ip,int port,String user,String pwd){
        this.ip = ip;
        this.port = port;
        this.user = user;
        this.pwd = pwd;
    }
    //文件上传是否成功
    public static boolean uploadFile(List<File> fileList) throws IOException {
        FtpUtil ftpUtil = new FtpUtil(ftpId,21,ftpUser,ftpPass);
        logger.info("开始连接ftp服务器");
        boolean result = ftpUtil.uploadFile(PropertiesUtil.getProperty("ftp.server.http.prefix"),fileList);
        logger.info("上传文件完成：结果：{}",result);
        return result;
    }

    //文件上传是否成功
    public static boolean uploadFilePath(String path,List<File> fileList) throws IOException {
        FtpUtil ftpUtil = new FtpUtil(ftpId,21,ftpUser,ftpPass);
        logger.info("开始连接ftp服务器");
        boolean result = ftpUtil.uploadFile(path,fileList);
        logger.info("上传文件完成：结果：{}",result);
        return result;
    }

    private boolean uploadFile(String remotePath,List<File> fileList) throws IOException{
        boolean uploaded = true;
        FileInputStream fis = null;
        //连接到ftp服务器
        if(connectFtpServer(this.ip,this.port,this.user,this.pwd)){
            try {
                //切换工作路径
                ftpClient.changeWorkingDirectory(remotePath);
                //设置字符编码
                ftpClient.setControlEncoding("UTF-8");
                //配置缓冲区
                ftpClient.setBufferSize(1024);
                //将文件类型设置成二级制文件的类型防止乱码的发生
                ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
                //设置为被动传输模式
                ftpClient.enterLocalPassiveMode();
                for(File fileItem:fileList){
                    fis = new FileInputStream(fileItem);
                    ftpClient.storeFile(fileItem.getName(),fis);
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                uploaded = false;
                logger.error("上传错误",e);
            }finally{
                fis.close();
                ftpClient.disconnect();
            }
            return uploaded;
        }
        return false;
    }
    //连接到ftp服务器
    private boolean connectFtpServer(String ip,int port,String user,String pass){
        boolean isSuccess = false;
        ftpClient = new FTPClient();
        try {
            ftpClient.connect(ip);
//            System.out.println("user:"+user);
//            System.out.println("password:"+pass);
            isSuccess = ftpClient.login(user, pass);
            logger.info("ftp connect is " + isSuccess);
        } catch (IOException e) {
            logger.error("连接异常",e);
            logger.error("登录异常",e);
        }
        return isSuccess;
    }
    public String getIp() {
        return ip;
    }
    public void setIp(String ip) {
        this.ip = ip;
    }
    public int getPort() {
        return port;
    }
    public void setPort(int port) {
        this.port = port;
    }
    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }
    public String getPwd() {
        return pwd;
    }
    public void setPwd(String pwd) {
        this.pwd = pwd;
    }
    public FTPClient getFtpClient() {
        return ftpClient;
    }
    public void setFtpClient(FTPClient ftpClient) {
        this.ftpClient = ftpClient;
    }
}
