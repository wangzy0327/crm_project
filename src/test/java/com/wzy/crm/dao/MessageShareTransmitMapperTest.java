package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.MessageShareTransmit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageShareTransmitMapperTest {

    @Autowired
    private MessageShareTransmitMapper messageShareTransmitMapper;

    @Test
    public void selectByKey() throws Exception {
        Integer customerId = 110;
        Integer messageId = 100;
        Integer shareId = 1391;
        MessageShareTransmit messageShareTransmit = messageShareTransmitMapper.selectByKey(shareId);
        System.out.println("messageShareTransmit:"+messageShareTransmit);
    }

}