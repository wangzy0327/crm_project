package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.VisitLog;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
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

    @Test
    public void selectByUserIdAndCustomerId() throws Exception {
        String userId = "wzy";
        Integer customerId = 101;
        List<VisitLog> visitLogs = visitLogMapper.selectByUserIdAndCustomerId(userId,customerId,0,10);
        for(int i = 0;i<visitLogs.size();i++){
            System.out.println(visitLogs.get(i));
        }
    }

    @Test
    public void selectDetailByPrimaryKey() throws Exception {
        Integer visitId = 21;
        VisitLog visitLog = visitLogMapper.selectDetailByPrimaryKey(visitId);
        System.out.println(visitLog);
    }


}