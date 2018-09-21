package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.VisitPlan;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class VisitPlanMapperTest {

    @Autowired
    private VisitPlanMapper visitPlanMapper;

    @Test
    public void selectPlanByParam() throws Exception {
        Integer customerId = 100;
        Map<String,String> map = Maps.newHashMap();
        map.put("customerId",String.valueOf(customerId));
        map.put("startTime","");
        map.put("endTime","");
        map.put("orderColumn","time");
        map.put("orderType","desc");
        map.put("start","0");
        map.put("length","10");
        List<VisitPlan> plans = visitPlanMapper.selectPlanByParam(map);
        for(int i = 0;i<plans.size();i++){
            System.out.println(plans.get(i));
        }
    }

    @Test
    public void findPlanCount() throws Exception {
        Integer customerId = 100;
        Integer recordNum = visitPlanMapper.findPlanCount(customerId);
        System.out.println("count:"+recordNum);
    }

    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer planId = 19;
        VisitPlan visitPlan = visitPlanMapper.selectByPrimaryKey(planId);
        System.out.println("************************");
        System.out.println(visitPlan);
        System.out.println("************************");
    }

    @Test
    public void selectByUserIdAndCustomerId() throws Exception {
        String userId = "wzy";
        Integer customerId = 101;
        List<VisitPlan> visitPlans = visitPlanMapper.selectByUserIdAndCustomerId(userId,customerId,0,10);
        for(int i = 0;i<visitPlans.size();i++){
            System.out.println(visitPlans.get(i));
        }
    }

    @Test
    public void selectDetailByPrimaryKey() throws Exception {
        Integer visitId = 19;
        VisitPlan visitPlan = visitPlanMapper.selectDetailByPrimaryKey(visitId);
        System.out.println(visitPlan);
    }

}