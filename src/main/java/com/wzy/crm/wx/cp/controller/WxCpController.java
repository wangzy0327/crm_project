package com.wzy.crm.wx.cp.controller;

import com.wzy.crm.common.Const;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.common.ValidLogin;
import com.wzy.crm.wx.cp.utils.WxApiClient;
import com.wzy.crm.wx.cp.utils.wechat.Users;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/wechatlogin")
public class WxCpController {

    @GetMapping("/pageLogin")
    public String pageLogin(String code, String state, HttpServletRequest request, HttpServletResponse response,HttpSession session) {
        try {
            System.out.println("code:"+code);
            System.out.println("state:"+state);
            String userId = WxApiClient.getUserId(code);
            System.out.println("userId:"+userId);
            if(userId!=null){
                Users users = WxApiClient.getUserInfo(userId);
                Integer isLeader = users.getIsleader();
                System.out.println("users:"+users);
                session.setAttribute(Const.CURRENT_USER, users);
                response.sendRedirect("/web/index.html?userId="+userId);
                return users.getUserid();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return null;
    }

    @PostMapping("/userInfo")
    public ServerResponse getUserInfo(HttpSession session,@RequestParam String userId){
        Users users = WxApiClient.getUserInfo(userId);
        if(!ValidLogin.isLogin(session)){
            return null;
        }
        if(users!=null){
            return ServerResponse.createBySuccess(users);
        }
        else{
            return ServerResponse.createByError();
        }
    }

}
