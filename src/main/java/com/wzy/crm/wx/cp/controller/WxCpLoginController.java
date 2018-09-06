package com.wzy.crm.wx.cp.controller;

import com.wzy.crm.common.Const;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.common.ValidLogin;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.wx.cp.utils.WxApiClient;
import com.wzy.crm.wx.cp.utils.wechat.Users;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
@RequestMapping("/wechatlogin")
public class WxCpLoginController {

    @GetMapping("/pageLogin")
    public String pageLogin(String code, String state, HttpServletRequest request, HttpServletResponse response,HttpSession session) {
        try {
            System.out.println("code:"+code);
            System.out.println("state:"+state);
            String userId = WxApiClient.getUserId(code);
            System.out.println("userId:"+userId);
            if(userId!=null){
                Staff staff = WxApiClient.getUserInfo(userId);
                Integer isLeader = staff.getIsleader();
                System.out.println("users:"+staff);
                session.setAttribute(Const.CURRENT_USER, staff);
                response.sendRedirect("/web/index.html?userId="+userId);
                return staff.getUserid();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return null;
    }

    /**
     * 安全退出
     * @return
     */
    @RequestMapping(value = "/logout",method = RequestMethod.GET)
    public String logout(HttpSession session,HttpServletResponse response) {
        session.removeAttribute(Const.CURRENT_USER);
        session.invalidate();
        try {
            response.sendRedirect("/web/web_login.html");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "logout";
    }


}
