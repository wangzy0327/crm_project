package com.wzy.crm.config;

import com.wzy.crm.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class TestConfig {

    @Autowired
    private RequestPathConfig requestPathConfig;

    @Test
    public void testTargetPath(){
        String path = requestPathConfig.getPath();
        System.out.println("path:"+path);
    }

}
