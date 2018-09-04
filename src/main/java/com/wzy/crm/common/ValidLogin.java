package com.wzy.crm.common;


import com.wzy.crm.wx.cp.utils.wechat.Users;

import javax.servlet.http.HttpSession;

public class ValidLogin {
    public static boolean isLogin(HttpSession session){
        Users user = (Users) session.getAttribute(Const.CURRENT_USER);
        if(user == null){
            return false;
        }else{
            return true;
        }
    }
}
