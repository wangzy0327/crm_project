package com.wzy.crm.service.impl;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.service.IMessageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class MessageServiceImplTest {

    @Autowired
    private IMessageService messageService;

    @Test
    public void parseUrl() throws Exception {
        String url = "https://v6.rabbitpre.com/m2/aUe1Zi9U0E?mobile=1";
        messageService.parseUrl(url);
    }

    @Test
    public void saveH5Page() throws Exception {
        String url = "https://v6.rabbitpre.com/m2/aUe1Zi9U0E?mobile=1";
        Message message = new Message();
        message.setTitle("啦啦啦");
        String realPath = "/";
        messageService.saveH5Page(url,message,realPath);
    }

}