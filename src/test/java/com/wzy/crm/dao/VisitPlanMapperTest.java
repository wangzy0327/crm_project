package com.wzy.crm.dao;

import com.google.common.collect.Maps;
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
@SpringBootTest
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

}