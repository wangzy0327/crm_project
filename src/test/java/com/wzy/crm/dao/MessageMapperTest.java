package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.Message;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageMapperTest {

    @Autowired
    private MessageMapper messageMapper;


    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer id = 164;
        Message message = messageMapper.selectByPrimaryKey(id);
    }

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

    @Test
    public void selectByThirdParamId() throws Exception {
        String thirdParamId = "neUzquH";
        List<Message> messages = messageMapper.selectByThirdParamId(thirdParamId);
        System.out.println(messages);
    }

    @Test
    public void findMessageCountByParam() throws Exception {
        Map<String,String> param = new HashMap<String,String>();
        String searchValue = "admin";
        String startTime = "2017-01-01 00:00:00";
        String endTime = "2018-03-01 00:00:00";
        param.put("keyword", "%" + (searchValue) + "%");
        param.put("startTime",startTime);
        param.put("endTime",endTime);
        int count = messageMapper.findMessageCountByParam(param);
        System.out.println("count:"+count);
    }

    @Test
    public void updateStatusStop() throws Exception {
        Integer id = 100;
        int count = messageMapper.updateStatusStop(id);
        System.out.println("count:"+count);
    }

    @Test
    public void updateStatusStart() throws Exception {
        Integer id = 100;
        int count = messageMapper.updateStatusStart(id);
        System.out.println("count:"+count);
    }


}