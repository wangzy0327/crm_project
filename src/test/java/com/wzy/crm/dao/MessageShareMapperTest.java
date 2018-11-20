package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.MessageShare;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageShareMapperTest {

    @Autowired
    private MessageShareMapper messageShareMapper;

    @Test
    public void updateOpenCount() throws Exception {
        MessageShare messageShare = new MessageShare();
        messageShare.setId(1387);
        messageShareMapper.updateOpenCount(messageShare);
    }

}