package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.vo.MessageResponseVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class ReadTransmitRecommendMapperTest {

    @Autowired
    private ReadTransmitRecommendMapper readTransmitRecommendMapper;

    @Test
    public void selectRecommendMessage() throws Exception {
        Integer customerId = 101;
        List<MessageResponseVo> recommends =
                readTransmitRecommendMapper.selectRecommendMessage(customerId);
        recommends.forEach(item -> System.out.println(item));
    }

}