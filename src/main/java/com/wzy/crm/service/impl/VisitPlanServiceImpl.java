package com.wzy.crm.service.impl;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.dao.VisitPlanMapper;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitPlanService;
import com.wzy.crm.timer.RemindTimerTask;
import com.wzy.crm.utils.SendWxMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Timer;

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
        }
        if(visitPlan.getRemind()!=null){
            handleRemind(sendWxMessage,visitPlan);
        }
        return ServerResponse.createBySuccess();
    }

    @Override
    public void handleRemind(SendWxMessage sendWxMessage,VisitPlan visitPlan){
        Timer timer = new Timer();
        RemindTimerTask remindTimerTask = new RemindTimerTask(sendWxMessage,visitPlan);
        timer.schedule(remindTimerTask,visitPlan.getRemind());
    }


}
