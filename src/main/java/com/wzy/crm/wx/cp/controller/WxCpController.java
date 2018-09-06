package com.wzy.crm.wx.cp.controller;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.common.ValidLogin;
import com.wzy.crm.dao.StaffMapper;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.wx.cp.utils.WxApiClient;
import com.wzy.crm.wx.cp.utils.wechat.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/wechat")
public class WxCpController {

    @Autowired
    private StaffMapper staffMapper;

    @PostMapping("/userInfo")
    public ServerResponse getUserInfo(HttpSession session, @RequestParam String userId){
        if(!ValidLogin.isLogin(session)){
            return ServerResponse.createByError();
        }
        Staff staff = staffMapper.selectByUserId(userId);
        if(staff!=null){
            return ServerResponse.createBySuccess(staff);
        }
        staff = WxApiClient.getUserInfo(userId);
        if(staff!=null){
            staffMapper.insert(staff);
            return ServerResponse.createBySuccess(staff);
        }
        else{
            return ServerResponse.createByError();
        }
    }

}
