package com.wzy.crm.dao;

import com.wzy.crm.pojo.Message;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class MessageMapperTest {

    @Autowired
    private MessageMapper messageMapper;

    @Test
    public void insert() throws Exception {
        Message message = new Message();
        message.setCorpId("wx4b8e52ee9877a5be");
        message.setSuiteId("wx9b2b1532fd370525");
        message.setCorpid("wx4b8e52ee9877a5be");
        message.setUrl("http://crm.youitech.com/module/web/message/message-share.html");
        message.setTitleText("爱迪生所多个傻大个啊烦得很发货搭嘎 更大化的哈,");
        message.setTitle("爱迪生所多个傻大个啊烦得很发货搭嘎 更大化的哈,");
        int count = messageMapper.insert(message);
        System.out.println("count:"+count);
    }

}