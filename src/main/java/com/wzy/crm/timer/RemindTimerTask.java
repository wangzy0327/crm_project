package com.wzy.crm.timer;

import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.utils.SendWxMessage;
import lombok.Data;

import java.util.TimerTask;

@Data
public class RemindTimerTask extends TimerTask{

    private SendWxMessage sendWxMessage;

    private VisitPlan visitPlan;

    private String name;

    public RemindTimerTask(String name){
        this.name = name;
    }

    public RemindTimerTask(SendWxMessage sendWxMessage,VisitPlan visitPlan){
        this.sendWxMessage = sendWxMessage;
        this.visitPlan = visitPlan;
    }


    @Override
    public void run() {
        System.out.println("***********************");
        sendWxMessage.handleSendRemindPlanMessage(visitPlan);
        System.out.println("111111111111111111111");
        System.out.println("***********************");
    }
}
