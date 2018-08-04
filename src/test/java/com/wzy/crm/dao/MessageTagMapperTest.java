package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageTag;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class MessageTagMapperTest {

    @Autowired
    private MessageTagMapper messageTagMapper;

    @Test
    public void selectMessageTagByName() throws Exception {
        String name = "生活";
        Integer num = messageTagMapper.selectMessageTagByName(name);
        System.out.println("selectNum:"+num);
    }

}