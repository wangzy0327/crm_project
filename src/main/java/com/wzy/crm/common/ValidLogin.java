package com.wzy.crm.common;


import com.wzy.crm.pojo.Staff;

import javax.servlet.http.HttpSession;

public class ValidLogin {
    public static boolean isLogin(HttpSession session){
        Staff staff = (Staff) session.getAttribute(Const.CURRENT_USER);
        if(staff == null){
            return false;
        }else{
            return true;
        }
    }
}
