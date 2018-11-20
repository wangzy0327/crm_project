package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.Comments;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class CommentsMapperTest {

    @Autowired
    private CommentsMapper commentsMapper;

    @Test
    public void insert() throws Exception {
        Comments comments = new Comments();
        comments.setContent("测试评论");
        commentsMapper.insert(comments);
        System.out.println("commentId:"+comments.getId());
    }

}