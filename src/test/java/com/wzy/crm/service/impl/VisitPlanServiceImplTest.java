package com.wzy.crm.service.impl;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitPlanService;
import com.wzy.crm.utils.SendWxMessage;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Calendar;
import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class VisitPlanServiceImplTest {

    @Autowired
    private SendWxMessage sendWxMessage;

    @Autowired
    private IVisitPlanService visitPlanService;

    @Test
    public void handleRemind() throws Exception {
        VisitPlan visitPlan = new VisitPlan();
        visitPlan.setUserId("wzy");
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE,1);
        visitPlan.setRemind(calendar.getTime());
        System.out.println("提醒时间为："+visitPlan.getRemind());
        visitPlan.setCustomerName("包拯");
        visitPlan.setCompany("开封府");
        visitPlan.setTime(new Date());
        visitPlanService.handleRemind(sendWxMessage,visitPlan);
    }

}