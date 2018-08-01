package com.wzy.crm.service;

import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.pojo.VisitPlan;

import java.util.List;
import java.util.Map;

public interface IVisitPlanService {

    List<VisitPlan> findPlanByParam(Map<String, String> param);
    
}
