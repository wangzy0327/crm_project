package com.wzy.crm.service.impl;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class test {

    public static void testFtpClient() {
        //穿件一個ftp客戶對象
        FTPClient ftpClient = new FTPClient();
        FileInputStream inputStream = null;
        try {
            //创建ftp链接
            ftpClient.connect("192.168.33.1", 21);
            //登陆ftp服务器  用户名 密码
            ftpClient.login("wangzy", "wangziyang19930327");
            //读取本地文件
            inputStream = new FileInputStream(new File("D:\\王紫阳\\照片\\车\\che.jpg"));
            //设置上传路径
            ftpClient.changeWorkingDirectory("D:\\ftpServer\\");
            //修改上传文件格式
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            ftpClient.setControlEncoding("UTF-8");
            ftpClient.enterLocalPassiveMode();
            //上传文件   上传文件名  上传文档的inputStream
            System.out.println(ftpClient.storeFile(new String("hello.jpg".getBytes("UTF-8"), "iso-8859-1"), inputStream));
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                ftpClient.logout();
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }


    }

    public static void main(String[] args) throws IOException {
//        File file = new File("test.jpg");
////        File file = new File("application.properties");
//        FileInputStream inputStream = new FileInputStream(file);
//        int l;
//        while ((l=inputStream.read())!=-1) {
//            System.out.println((char)l);
//            //测试read()方法的含义，什么是逐字节读，及int类型的l代表什么意思，测试结果l代表存储的内容的int的表现形式，与进制相关，不做深究
//            //System.out.println((char)l+"\t"+l);
//        }
//        inputStream.close();
        testFtpClient();

    }
}
