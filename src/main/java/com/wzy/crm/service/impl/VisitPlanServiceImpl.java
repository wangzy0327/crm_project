package com.wzy.crm.service.impl;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.dao.VisitPlanMapper;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitPlanService;
import com.wzy.crm.utils.SendWxMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VisitPlanServiceImpl implements IVisitPlanService {

    @Autowired
    private SendWxMessage sendWxMessage;

    @Autowired
    private VisitPlanMapper visitPlanMapper;

    @Override
    public List<VisitPlan> findPlanByParam(Map<String, String> param) {
        return visitPlanMapper.selectPlanByParam(param);
    }

    @Override
    public ServerResponse addPlan(VisitPlan visitPlan) {
        visitPlanMapper.insert(visitPlan);
        if(visitPlan.getToStaff()!=null){
            sendWxMessage.handleSendPlanMessage(visitPlan);
//            handleSendMessage(visitPlan);
        }
        return ServerResponse.createBySuccess();
    }


}
