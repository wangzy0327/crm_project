package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.vo.MessageHotTagVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class MessageTagMapperTest {


    @Autowired
    private MessageTagMapper messageTagMapper;

    @Test
    public void selectMessageTagByName() throws Exception {
        String name = "生活";
        Integer num = messageTagMapper.selectMessageTagCountByName(name);
        System.out.println("selectNum:"+num);
    }

    @Test
    public void insertByName() throws Exception {
        String name = "hdy";
        MessageTag messageTag = new MessageTag();
        messageTag.setName(name);
        messageTagMapper.insert(messageTag);
        Integer tagId = messageTag.getId();
        System.out.println("insert Id:"+tagId);
    }

    @Test
    public void selectHotTags() throws Exception {
        List<MessageHotTagVo> messageHotTagVos = messageTagMapper.selectHotTags();
        for(int i = 0;i<messageHotTagVos.size();i++){
            System.out.println(messageHotTagVos.get(i));
        }
    }

}