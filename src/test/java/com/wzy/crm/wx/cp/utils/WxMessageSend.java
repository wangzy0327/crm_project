package com.wzy.crm.wx.cp.utils;

import com.wzy.crm.Application;
import com.wzy.crm.CrmApplication;
import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.wx.cp.config.WechatAccountConfig;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.WxCpMessage;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class WxMessageSend {

    @Autowired
    private WechatAccountConfig accountConfig;

    @Autowired
    private DomainConfig domainConfig;

    @Autowired
    private WxCpService wxCpService;

    @Test
    public void SendTextMessage(){
        String userId = "wzy";
        WxCpMessage wxCpMessage = WxCpMessage.TEXT()
                .agentId(accountConfig.getAppConfigs()
                        .get(0).getAgentId())
                .toUser(userId)
                .content("测试")
                .build();
        try {
            wxCpService.messageSend(wxCpMessage);
        } catch (WxErrorException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void SendTextCardMessage(){
        String staffName = "黄大烨";
        String CustomerName = "李四";
        Integer customerId = 100;
        Integer visitId = 41;
        String userId = "wzy";
        int type = 1;
        String content = "";
        content += "您收到一条评论：\n";
        content += "关于" + staffName + "对" + CustomerName + "（客户）的" + (type == 1 ? "拜访计划" : "拜访记录");

        String title = type == 1 ? "拜访计划评论" : "拜访记录评论";
        String description = content;
        String url = domainConfig.getUrl()+"module/discuss/visit-detail-evaluation.html?userid=%s"+"&customer_id=%d"+"&type=%d"+"&visit_id=%d";
        String btntxt = "评论详情";
        url = String.format(url,userId,customerId,type,visitId);
        System.out.println("url:  "+url);
        WxCpMessage wxCpMessage = WxCpMessage.TEXTCARD()
                .agentId(accountConfig.getAppConfigs()
                        .get(0).getAgentId())
                .toUser(userId)
                .title(title)
                .description(description)
                .url(url)
                .btnTxt(btntxt)
                .build();
        try {
            wxCpService.messageSend(wxCpMessage);
        } catch (WxErrorException e) {
            e.printStackTrace();
        }
    }


}
