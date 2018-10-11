package com.wzy.crm.wx.cp.controller;

import com.alibaba.fastjson.JSONObject;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.wx.cp.common.ByteHex;
import com.wzy.crm.wx.cp.config.WechatAccountConfig;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@RestController
@RequestMapping("/wechat/jssdk")
public class WxJSSDKController {

    @Autowired
    private WxCpService wxCpService;

    @Autowired
    private DomainConfig domainConfig;

    @Autowired
    private WechatAccountConfig wechatAccountConfig;

    @PostMapping("/config")
    public ServerResponse wxConfig(@RequestParam("url") String url){
        try {
            String signature = "";
            String jsApiTicket = wxCpService.getJsapiTicket();
            String timestamp = Long.toString(System.currentTimeMillis() / 1000); // 必填，生成签名的时间戳
            String nonceStr = UUID.randomUUID().toString(); // 必填，生成签名的随机串
            System.out.println("jsapiTicket: "+jsApiTicket);
            System.out.println("url: "+url);
            String sign = "jsapi_ticket=" + jsApiTicket + "&noncestr=" + nonceStr+ "&timestamp=" + timestamp + "&url=" + url;
            System.out.println("sign: "+sign);
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(sign.getBytes("UTF-8"));
            signature = ByteHex.byteToHex(crypt.digest());
            System.out.println("signature:"+signature);
            String str = "{\"appId\":\""+wechatAccountConfig.getCorpId()+"\",\"timestamp\":\""+timestamp+"\",\"nonceStr\":\""+nonceStr+"\",\"signature\":\""+signature+"\"}";
            System.out.println("testJsonStr:  "+str);
            JSONObject responseJson = JSONObject.parseObject(str);
            return ServerResponse.createBySuccess(responseJson);
        } catch (WxErrorException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return ServerResponse.createByError();
    }
}
