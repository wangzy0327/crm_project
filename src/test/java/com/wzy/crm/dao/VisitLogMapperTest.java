package com.wzy.crm.dao;

import com.wzy.crm.pojo.VisitLog;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class VisitLogMapperTest {
    @Autowired
    private VisitLogMapper visitLogMapper;

    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer logId = 21;
        VisitLog visitLog = visitLogMapper.selectByPrimaryKey(logId);
        System.out.println(visitLog);
    }

    @Test
    public void selectLogByParam() throws Exception {
    }


}