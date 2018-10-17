package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.MessageShareCustomer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
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