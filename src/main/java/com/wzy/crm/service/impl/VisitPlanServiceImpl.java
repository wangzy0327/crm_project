package com.wzy.crm.service.impl;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.VisitPlanMapper;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VisitPlanServiceImpl implements IVisitPlanService {

    @Autowired
    private VisitPlanMapper visitPlanMapper;

    @Override
    public List<VisitPlan> findPlanByParam(Map<String, String> param) {
        return visitPlanMapper.selectPlanByParam(param);
    }
}
