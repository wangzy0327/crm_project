package com.wzy.crm.wx.cp.utils;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.wx.cp.utils.wechat.Users;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class WxApiClientTest {


    /**
     * Users{userid='wzy', name='王紫阳', position='', mobile='17326930327', gender=1, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/rM5EfD5dic7nWib8Yxic4TcGlCpibQYmzaY9mZRaE7e3JVNWfgibwB7HZBA/0', telephone='', alias=''}
     * Users{userid='yanxg', name='晏小刚', position='软件工程师', mobile='18914147690', gender=1, email='yanxg@youitech.com', isleader=0, avatar='http://shp.qpic.cn/bizmp/qUz2yxpF8KibjVaXRZ3IHhjZFKcsmbTyEswRibtCLydQLYias5NicMfGpA/', telephone='', alias=''}
     * Users{userid='ZhangChi2Hao', name='张驰2号', position='', mobile='15861668054', gender=0, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/MW1YFC6YNqztsj81dqUd2SOzicZiaGsDoR9vpg6Z3jPZlh71KS4JccAg/0', telephone='', alias=''}
     * Users{userid='zhangc', name='张驰', position='软件工程师', mobile='13771071503', gender=1, email='zhangc@youitech.com', isleader=0, avatar='http://p.qlogo.cn/bizmail/yEoPDtQXubvfzQNrJqAl6WDg52JskgvYwCM9fO4lica9hA78JFIibCKA/0', telephone='', alias=''}
     * Users{userid='hdy', name='黄大烨', position='', mobile='18262396031', gender=1, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/EEGhYtER3JotMxbWkbYGsP4bUnRfyGUr7J4cjHDBw8Adpc9DpsKhnw/0', telephone='', alias=''}
     * Users{userid='clx', name='陈丽霞', position='前端工程师', mobile='13914266226', gender=2, email='clx@youitech.com', isleader=0, avatar='http://shp.qpic.cn/bizmp/qUz2yxpF8Kicr6ZZJiaRrJeO0micoMK0lhFh9VmiaGB0sCcaWRIJ8XJhpA/', telephone='', alias=''}
     * Users{userid='cyt', name = '程言同', position = '软件工程师',mobile='18088129009',gender=1,email = 'cyt@youitech.com',isleader=0,avatar='http://p.qlogo.cn/bizmail/GticMyWDkNEjyYJwiafqlmqQDmEHMaicoafS9wwn9Bv9uHRyo9mNTictibQ/0',telephone='',alias=''}
     *
     * @throws Exception
     */
    @Test
    public void getUserInfo() throws Exception {
        String userId = "wj";
        Staff staff = WxApiClient.getUserInfo(userId);
        System.out.println("****************************");
        System.out.println(staff);
        System.out.println("****************************");
    }

    @Test
    public void getUserInfo1() throws Exception {
        String departmentId = String.valueOf(1);
        String fetchChild = String.valueOf(1);
        List<Staff> staffList = WxApiClient.getDepartmentUserInfo(departmentId,fetchChild);
        System.out.println(staffList);
    }

}