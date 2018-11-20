package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.MessageShareCustomer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageShareCustomerMapperTest {

    @Autowired
    private MessageShareCustomerMapper messageShareCustomerMapper;

    @Test
    public void insert() throws Exception {
        String userId = "wzy";
        Integer msgId = 100;
        Integer customerId = 110;
        MessageShareCustomer messageShareCustomer = new MessageShareCustomer();
        messageShareCustomer.setUserId(userId);
        messageShareCustomer.setMessageId(msgId);
        messageShareCustomer.setCustomerId(customerId);
        messageShareCustomerMapper.insert(messageShareCustomer);
    }

}