package com.wzy.crm.utils;


import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.vo.CommentVo;
import com.wzy.crm.wx.cp.config.WechatAccountConfig;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.WxCpMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;

@Component
public class SendWxMessage {


    @Autowired
    private WechatAccountConfig accountConfig;

    @Autowired
    private WxCpService wxCpService;

    @Autowired
    private DomainConfig domainConfig;


    public boolean handleSendPlanMessage(VisitPlan visitPlan){
        String [] userIds = visitPlan.getToStaff().split(",");
        String title = "";
        String content = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        content += "您有一条新的拜访计划需要评论：\n";
        content += visitPlan.getStaffName() + "\n即将于" + sdf.format(visitPlan.getTime()) +
                "\n拜访 " + (visitPlan.getCompany() == null ? "【未知公司】" : visitPlan.getCompany())+
                "__" + (visitPlan.getCustomerName() == null ? "【未知姓名】":visitPlan.getCustomerName());
        title = "待评论："+visitPlan.getStaffName()+"拜访计划";
        Integer type = 1;
        String description = content;
        String url = domainConfig.getUrl()+"module/discuss/visit-detail-evaluation.html?userid=%s"+"&customer_id=%d"+"&type=%d"+"&visit_id=%d";
        String btntxt = "计划详情";
        url = String.format(url,visitPlan.getUserId(),visitPlan.getCustomerId(),type,visitPlan.getId());
        System.out.println("url:  "+url);
        for(int i = 0;i< userIds.length;i++){
            WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                    .agentId(accountConfig.getAppConfigs()
                            .get(0).getAgentId())
                    .toUser(userIds[i])
                    .title(title).description(description).url(url).btnTxt(btntxt).build();
            try {
                wxCpService.messageSend(wxCpMessage);
            } catch (WxErrorException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean handleSendLogMessage(VisitLog visitLog){
        String [] userIds = visitLog.getToStaff().split(",");
        String title = "";
        String content = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        content += "您有一条新的拜访记录需要评论：\n";
        content += visitLog.getStaffName() + "\n于" + sdf.format(visitLog.getUpdateTime()) +
                "\n拜访了 " + (visitLog.getCompany() == null ? "【未知公司】" : visitLog.getCompany())+
                "__" + (visitLog.getCustomerName() == null ? "【未知姓名】":visitLog.getCustomerName());
        title = "待评论："+visitLog.getStaffName()+"拜访记录";
        Integer type = 2;
        String description = content;
        String url = domainConfig.getUrl()+"module/discuss/visit-detail-evaluation.html?userid=%s"+"&customer_id=%d"+"&type=%d"+"&visit_id=%d";
        String btntxt = "记录详情";
        url = String.format(url,visitLog.getUserId(),visitLog.getCustomerId(),type,visitLog.getId());
        System.out.println("url:  "+url);
        for(int i = 0;i< userIds.length;i++){
            WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                    .agentId(accountConfig.getAppConfigs()
                            .get(0).getAgentId())
                    .toUser(userIds[i])
                    .title(title).description(description).url(url).btnTxt(btntxt).build();
            try {
                wxCpService.messageSend(wxCpMessage);
            } catch (WxErrorException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean handleSendCommentMessage(CommentVo commentVo){
        String [] userIds = commentVo.getToStaff().split(",");
        int type = commentVo.getType().intValue();
        String content = "";
        content += "您收到一条评论：\n";
        content += "关于" + commentVo.getStaffName() + "对" + commentVo.getCustomerName() + "（客户）的" + (type == 1 ? "拜访计划" : "拜访记录");

        String title = type == 1 ? "拜访计划评论" : "拜访记录评论";
        String description = content;
        String url = domainConfig.getUrl()+"module/discuss/visit-detail-evaluation.html?userid=%s"+"&customer_id=%d"+"&type=%d"+"&visit_id=%d";
        String btntxt = "评论详情";
        for(int i = 0;i<userIds.length;i++){
            url = String.format(url,userIds[i],commentVo.getCutomerId(),commentVo.getType(),commentVo.getVisitId());
            System.out.println("url:  "+url);
            WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                    .agentId(accountConfig.getAppConfigs()
                            .get(0).getAgentId())
                    .toUser(userIds[i])
                    .title(title).description(description).url(url).btnTxt(btntxt).build();
            try {
                wxCpService.messageSend(wxCpMessage);
            } catch (WxErrorException e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    public boolean handleSendRemindPlanMessage(VisitPlan visitPlan){
        String title = "";
        String content = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        content += "您有一个最近需要拜访的客户：\n";
        content += "于" + sdf.format(visitPlan.getTime()) +
                "\n拜访 " + (visitPlan.getCompany() == null ? "【未知公司】" : visitPlan.getCompany())+
                "__" + (visitPlan.getCustomerName() == null ? "【未知姓名】":visitPlan.getCustomerName());
        title = "拜访计划提醒";
        Integer type = 1;
        String description = content;
        String url = domainConfig.getUrl()+"module/discuss/visit-detail-evaluation.html?userid=%s"+"&customer_id=%d"+"&type=%d"+"&visit_id=%d";
        String btntxt = "计划详情";
        url = String.format(url,visitPlan.getUserId(),visitPlan.getCustomerId(),type,visitPlan.getId());
        System.out.println("url:  "+url);
        WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                .agentId(accountConfig.getAppConfigs()
                        .get(0).getAgentId())
                .toUser(visitPlan.getUserId())
                .title(title).description(description).url(url).btnTxt(btntxt).build();
        try {
            wxCpService.messageSend(wxCpMessage);
        } catch (WxErrorException e) {
            e.printStackTrace();
        }
        return true;
    }

}
