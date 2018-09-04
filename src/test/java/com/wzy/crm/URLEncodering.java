package com.wzy.crm;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class URLEncodering {

    public static void main(String[] args) throws UnsupportedEncodingException {
        String encode = URLEncoder.encode("http://wangzy.tunnel.qydev.com/wechatlogin/pageLogin","UTF-8");
        System.out.println("urlEncode:   "+encode);
    }

}
