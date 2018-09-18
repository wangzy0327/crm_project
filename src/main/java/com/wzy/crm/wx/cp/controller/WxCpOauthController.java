package com.wzy.crm.wx.cp.controller;

import com.alibaba.fastjson.JSONObject;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.wx.cp.utils.WxApiClient;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Weixin")
public class WxCpOauthController {


    @GetMapping(value = "/oauthUserInfo")
    @ResponseBody
    public ServerResponse oauthUserInfo(String code){
        System.out.println("code:"+code);
        JSONObject jsonObj = WxApiClient.getUserJson(code);
        String userid = jsonObj.getString("UserId");
        String deviceId = jsonObj.getString("DeviceId");
        System.out.println("deviceId: "+deviceId);
        String openid = "";
        if(userid == null || StringUtils.isBlank("")){
            openid = jsonObj.getString("OpenId");
        }
        System.out.println("userid:"+userid);
        String str = "{\"userid\":\""+userid+"\"}";
        System.out.println("JsonStr:  "+str);
        JSONObject responseJson = JSONObject.parseObject(str);
        return ServerResponse.createBySuccess(responseJson);
    }

}
