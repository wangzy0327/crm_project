package com.wzy.crm.wx.cp.controller;

import com.wzy.crm.config.DomainConfig;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Base64;

@Controller
@RequestMapping("/wechat/oauth")
@Slf4j
public class WxOauthController {

    @Autowired
    private WxCpService wxCpService;

    @Autowired
    private DomainConfig domainConfig;

    /**
     * 访问这个时便会发起微信的网页授权
     * @param returnUrl 发起授权是可携带的一个参数，我这里用的是下面将要用到的login()的地址，将获取到的openid传递过去
     * @return
     */
    @GetMapping("/authorize")
    public String authorize(@RequestParam("returnUrl") String returnUrl) {
        //设置回调地址

        System.out.println("domain url:"+domainConfig.getUrl());
        String url = domainConfig.getUrl()+"wechat/oauth/userInfo";
//        String url = "http://wangzy.tunnel.qydev.com/wechat/userInfo";
        String redirectUrl = wxCpService.getOauth2Service().buildAuthorizationUrl(url,URLEncoder.encode(returnUrl),WxConsts.OAuth2Scope.SNSAPI_BASE);
//        String redirectUrl = wxCpService.getOauth2Service().oauth2buildAuthorizationUrl(url, WxConsts.OAUTH2_SCOPE_BASE, URLEncoder.encode(returnUrl));
        log.info("【微信网页授权】获取code, result = {}",redirectUrl);
        return "redirect:" + redirectUrl;
    }

    //微信回调时访问的地址  这里获得code和之前所设置的returnUrl
    @GetMapping("/userInfo")
    public String userInfo(@RequestParam("code") String code,
                           @RequestParam("state") String returnUrl) {
        System.out.println("code:"+code);
        System.out.println("state:"+returnUrl);
        String accessToken = "";
        try {
            accessToken = wxCpService.getAccessToken();
        } catch (WxErrorException e) {
            e.printStackTrace();
        }
        System.out.println("accessToken:"+accessToken);
        String[] res = new String[5];
        try {
            res = wxCpService.getOauth2Service().getUserInfo(code);
        } catch (WxErrorException e) {
            e.printStackTrace();
        }

        String userId = res[0];
        String deviceId = res[1];
        String openId = res[2];
        System.out.println("userId:"+userId);
        System.out.println("deviceId:"+deviceId);
        System.out.println("openId:"+openId);
        if(res[0] == null){
            return "redirect:" + returnUrl + "?openid=" + openId;
        }
        return "redirect:" + returnUrl + "?userid=" + userId;
    }


    @GetMapping("/authorize/openid")
    public String authorizeOpenid(@RequestParam("returnUrl") String returnUrl) {
        //设置回调地址

        System.out.println("domain url:"+domainConfig.getUrl());
        String url = domainConfig.getUrl()+"wechat/oauth/userInfo/openid";
//        String url = "http://wangzy.tunnel.qydev.com/wechat/userInfo";
//        String redirectUrl = wxCpService.getOauth2Service().buildAuthorizationUrl(url,URLEncoder.encode(returnUrl),WxConsts.OAuth2Scope.SNSAPI_BASE);
        //采用base64进行加密
        String asB64 = "";
        try {
            asB64 = Base64.getEncoder().encodeToString(returnUrl.getBytes("utf-8"));
            System.out.println("asB64: "+asB64);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String redirectUrl = wxCpService.getOauth2Service().buildAuthorizationUrl(url,asB64,WxConsts.OAuth2Scope.SNSAPI_BASE);
//        String redirectUrl = wxCpService.getOauth2Service().oauth2buildAuthorizationUrl(url, WxConsts.OAUTH2_SCOPE_BASE, URLEncoder.encode(returnUrl));
        log.info("【微信网页授权】获取code, result = {}",redirectUrl);
        return "redirect:" + redirectUrl;
    }


    //微信回调时访问的地址  这里获得code和之前所设置的returnUrl
    @GetMapping("/userInfo/openid")
    public String userInfoOpenid(@RequestParam("code") String code,
                           @RequestParam("state") String returnUrl) {
        System.out.println("code:"+code);
        System.out.println("state:"+returnUrl);
        //采用base64进行解密
        byte[] asBytes = Base64.getDecoder().decode(returnUrl);
        String encodeReturnUrl = "";
        try {
            encodeReturnUrl = new String(asBytes,"utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        System.out.println("encodeReturnUrl: "+encodeReturnUrl);

        String accessToken = "";
        try {
            accessToken = wxCpService.getAccessToken();
        } catch (WxErrorException e) {
            e.printStackTrace();
        }
        System.out.println("accessToken:"+accessToken);
        String[] res = new String[5];
        try {
            res = wxCpService.getOauth2Service().getUserInfo(code);
        } catch (WxErrorException e) {
            e.printStackTrace();
        }

        String userId = res[0];
        String deviceId = res[1];
        String openId = res[2];
        System.out.println("userId:"+userId);
        System.out.println("deviceId:"+deviceId);
        System.out.println("openId:"+openId);
        if(res[0] == null){
            return "redirect:" + encodeReturnUrl + "&openid=" + openId;
        }
        return "redirect:" + encodeReturnUrl + "&openid=-1";
    }

}
