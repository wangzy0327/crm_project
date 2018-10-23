package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.MessageShareTransmit;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
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