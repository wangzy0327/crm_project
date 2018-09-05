package com.wzy.crm.wx.cp.controller;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.common.ValidLogin;
import com.wzy.crm.wx.cp.utils.WxApiClient;
import com.wzy.crm.wx.cp.utils.wechat.Users;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/wechat")
public class WxCpController {

    @PostMapping("/userInfo")
    public ServerResponse getUserInfo(HttpSession session, @RequestParam String userId){
        Users users = WxApiClient.getUserInfo(userId);
        if(!ValidLogin.isLogin(session)){
            return ServerResponse.createByError();
        }
        if(users!=null){
            return ServerResponse.createBySuccess(users);
        }
        else{
            return ServerResponse.createByError();
        }
    }

}
