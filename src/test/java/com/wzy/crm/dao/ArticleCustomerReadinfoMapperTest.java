package com.wzy.crm.dao;

import com.wzy.crm.Application;
import org.apache.ibatis.annotations.Param;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class ArticleCustomerReadinfoMapperTest {

    @Autowired
    private ArticleCustomerReadinfoMapper articleCustomerReadinfoMapper;

    @Test
    public void updateByKeyAndTime() throws Exception {
        Integer id = 5;
        Integer viewTime = 4;
        Integer totalTime = 5;
        String readInfo = "[5]";
        int count = articleCustomerReadinfoMapper.updateByKeyAndTime(id,viewTime,totalTime,readInfo);
        System.out.println("count = "+count);
    }

}