package com.wzy.crm.service.impl;

import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.service.IFileService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class FileServiceImplTest {

    @Autowired
    private IFileService fileService;

    @Test
    public void upload() throws Exception {

        File file = new File("test.jpg");
//        File file = new File("application.properties");
        FileInputStream inputStream = new FileInputStream(file);
        System.out.println("fileName:"+file.getName());
        MultipartFile multipartFile = new MockMultipartFile(file.getName(), inputStream);
        String path = "/";
        System.out.println("************************");
        System.out.println("上传文件名:"+fileService.uploadImg(multipartFile,path));
        System.out.println("************************");
    }

}