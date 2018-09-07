package com.wzy.crm.wx.cp.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.utils.PropertiesUtil;
import com.wzy.crm.wx.cp.common.ErrCode;
import com.wzy.crm.wx.cp.utils.wechat.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class WxApiClient {

    static MpAccount mpAccount = null;

    static{
        if(null == mpAccount){
            mpAccount = new MpAccount();
            mpAccount.setAgentid(PropertiesUtil.getProperty("wechat.cp.appConfigs.agentId"));
            mpAccount.setToken(PropertiesUtil.getProperty("wechat.cp.appConfigs.token"));
            mpAccount.setCorpid(PropertiesUtil.getProperty("wechat.cp.corpId"));
            mpAccount.setAppsecret(PropertiesUtil.getProperty("wechat.cp.appConfigs.secret"));
        }
    }

    /**
     * 获取公众号
     */
    public static MpAccount getMpAccount(){
        return mpAccount;
    }

    /**
     * 获取accessToken
     * @param
     * @return
     */
    public static String getAccessToken(){
        return getAccessToken(mpAccount);
    }
    public static String getAccessToken(MpAccount mpAccount){
        //获取唯一的accessToken，如果是多账号，请自行处理
        AccessToken token = WxMemoryCacheClient.getSingleAccessToken();
        if(token != null && !token.isExpires()){//不为空，并且没有过期
            return token.getAccessToken();
        }else{
            token = WxApi.getAccessToken(mpAccount.getCorpid(),mpAccount.getAppsecret());
            if(token != null){
                if(token.getErrcode() != null){//获取失败
                    System.out.println("## getAccessToken Error = " + token.getErrmsg());
                }else{
                    WxMemoryCacheClient.addAccessToken(mpAccount.getAgentid(), token);
                    return token.getAccessToken();
                }
            }
            return null;
        }
    }

    /**
     * 刷新accessToken
     * @param
     * @return
     */
    public static String refreshAccessToken(){
        return refreshAccessToken(mpAccount);
    }
    public static String refreshAccessToken(MpAccount mpAccount){
        //获取唯一的accessToken，如果是多账号，请自行处理
        AccessToken token = WxApi.getAccessToken(mpAccount.getCorpid(),mpAccount.getAppsecret());
        if(token != null){
            if(token.getErrcode() != null){//获取失败
                System.out.println("## getAccessToken Error = " + token.getErrmsg());
            }else{
                WxMemoryCacheClient.addAccessToken(mpAccount.getAccount(), token);
                return token.getAccessToken();
            }
        }
        return null;
    }

    /**
     * 获取jsTicket
     * @param
     * @return
     */
    public static String getJSTicket(){
        return getJSTicket(mpAccount);
    }
    public static String getJSTicket(MpAccount mpAccount){
        //获取唯一的JSTicket，如果是多账号，请自行处理
        JSTicket jsTicket = WxMemoryCacheClient.getSingleJSTicket();
        if(jsTicket != null && !jsTicket.isExpires()){//不为空，并且没有过期
            return jsTicket.getTicket();
        }else{
            String token = getAccessToken(mpAccount);
            jsTicket = WxApi.getJSTicket(token);
            if(jsTicket != null){
                if(jsTicket.getErrcode() != null){//获取失败
                    System.out.println("## getJSTicket Error = " + jsTicket.getErrmsg());
                }else{
                    WxMemoryCacheClient.addJSTicket(mpAccount.getAccount(), jsTicket);
                    return jsTicket.getTicket();
                }
            }
            return null;
        }
    }

    /**
     * 获取OAuthAccessToken
     * @param
     * @param code
     * @return
     */
    public static String getOAuthAccessToken(String code){
        return getOAuthAccessToken(mpAccount,code);
    }
    public static String getOAuthAccessToken(MpAccount mpAccount,String code){
        //获取唯一的accessToken，如果是多账号，请自行处理
        OAuthAccessToken token = WxMemoryCacheClient.getSingleOAuthAccessToken();
        if(token != null && !token.isExpires()){//不为空，并且没有过期
            return token.getOauthAccessToken();
        }else{
            token = WxApi.getOAuthAccessToken(mpAccount.getCorpid(),mpAccount.getAppsecret(),code);
            if(token != null){
                if(token.getErrcode() != null){//获取失败
                    System.out.println("## getOAuthAccessToken Error = " + token.getErrmsg());
                }else{
                    token.setOpenid(null);//获取OAuthAccessToken的时候设置openid为null；不同用户openid缓存
                    WxMemoryCacheClient.addOAuthAccessToken(mpAccount.getAccount(), token);
                    return token.getOauthAccessToken();
                }
            }
            return null;
        }
    }

    /**
     * 获取openId
     * @param
     * @param code
     * @return
     */
    public static String getOAuthOpenId(String code){
        return getOAuthOpenId(mpAccount,code);
    }
    public static String getOAuthOpenId(MpAccount mpAccount,String code){
        OAuthAccessToken token = WxApi.getOAuthAccessToken(mpAccount.getCorpid(),mpAccount.getAppsecret(),code);
        if(token != null){
            if(token.getErrcode() != null){//获取失败
                System.out.println("## getOAuthAccessToken Error = " + token.getErrmsg());
            }else{
                return token.getOpenid();
            }
        }
        return null;
    }

    /**
     * 根据openId获取粉丝信息
     * @param openId
     * @param
     * @return
     */
    public static AccountFans getAccountFans(String openId){
        return getAccountFans(openId, mpAccount);
    }
    public static AccountFans getAccountFans(String openId,MpAccount mpAccount){
        String accessToken = getAccessToken(mpAccount);
        String url = WxApi.getFansInfoUrl(accessToken, openId);
        JSONObject jsonObj = WxApi.httpsRequest(url, "GET", null);
        if (null != jsonObj) {
            if(jsonObj.containsKey("errcode")){
                int errorCode = Integer.valueOf(jsonObj.getString("errcode"));
                System.out.println(String.format("获取用户信息失败 errcode:{} errmsg:{}", errorCode, ErrCode.errMsg(errorCode)));
                return null;
            }else{
                AccountFans fans = new AccountFans();
                fans.setOpenId(jsonObj.getString("openid"));// 用户的标识
                fans.setSubscribeStatus(new Integer(jsonObj.getString("subscribe")));// 关注状态（1是关注，0是未关注），未关注时获取不到其余信息
                if(jsonObj.containsKey("subscribe_time")){
                    fans.setSubscribeTime(new Date(jsonObj.getLong("subscribe_time")*1000));// 用户关注时间
                }
                if(jsonObj.containsKey("nickname")){// 昵称
                    String nickname = jsonObj.getString("nickname");
                    fans.setNicknameStr(nickname);
                }
                if(jsonObj.containsKey("sex")){// 用户的性别（1是男性，2是女性，0是未知）
                    fans.setGender(Integer.valueOf(jsonObj.getString("sex")));
                }
                if(jsonObj.containsKey("language")){// 用户的语言，简体中文为zh_CN
                    fans.setLanguage(jsonObj.getString("language"));
                }
                if(jsonObj.containsKey("country")){// 用户所在国家
                    fans.setCountry(jsonObj.getString("country"));
                }
                if(jsonObj.containsKey("province")){// 用户所在省份
                    fans.setProvince(jsonObj.getString("province"));
                }
                if(jsonObj.containsKey("city")){// 用户所在城市
                    fans.setCity(jsonObj.getString("city"));
                }
                if(jsonObj.containsKey("headimgurl")){// 用户头像
                    fans.setHeadimgurl(jsonObj.getString("headimgurl"));
                }
                if(jsonObj.containsKey("remark")){
                    fans.setRemark(jsonObj.getString("remark"));
                }
                return fans;
            }
        }
        return null;
    }

    /**
     * 根据code跟获取用户信息UserId
     * @param code
     * @param
     * @return
     */
    public static String getUserId(String code){ return getUserId(code, mpAccount); }
    public static String getUserId(String code,MpAccount mpAccount) {
        String accessToken = getAccessToken(mpAccount);
        String url = WxApi.getUsersInfoUrl(accessToken, code);
        JSONObject jsonObj = WxApi.httpsRequest(url, "GET", null);
        if (null != jsonObj) {
            if (jsonObj.containsKey("UserId")) {
                return jsonObj.getString("UserId");
            } else {
                int errorCode = Integer.valueOf(jsonObj.getString("errcode"));
                System.out.println(String.format("获取用户信息失败 errcode:{} errmsg:{}", errorCode, ErrCode.errMsg(errorCode)));
            }
            return null;
        }
        return null;
    }

    /**
     * 根据userId跟获取用户详细信息
     * @param userId
     * @param
     * @return
     */
    public static Staff getUserInfo(String userId){ return getUserInfo(userId, mpAccount); }
    public static Staff getUserInfo(String userId,MpAccount mpAccount) {
        String accessToken = getAccessToken(mpAccount);
        String url = WxApi.getUsersDetailInfoUrl(accessToken, userId);
        JSONObject jsonObj = WxApi.httpsRequest(url, "GET", null);
        if (null != jsonObj) {
            String errorcode = jsonObj.getString("errcode");
            if (Integer.valueOf(errorcode).equals(Integer.valueOf(0))) {

                Staff staff = new Staff();
                staff.setUserid(jsonObj.getString("userid"));
                if(jsonObj.containsKey("name")){
                    staff.setName(jsonObj.getString("name"));
                }
                if(jsonObj.containsKey("position")){// 昵称
                    String position = jsonObj.getString("position");
                    staff.setPosition(position);
                }
                if(jsonObj.containsKey("gender")){// 用户的性别（1是男性，2是女性，0是未知）
                    staff.setGender(Integer.valueOf(jsonObj.getString("gender")));
                }
                if(jsonObj.containsKey("mobile")){// 用户的语言，简体中文为zh_CN
                    staff.setMobile(jsonObj.getString("mobile"));
                }
                if(jsonObj.containsKey("email")){// 用户所在国家
                    staff.setEmail(jsonObj.getString("email"));
                }
                if(jsonObj.containsKey("isleader")){// 用户所在省份
                    staff.setIsleader(Integer.valueOf(jsonObj.getString("isleader")));
                }
                if(jsonObj.containsKey("avatar")){// 用户所在城市
                    staff.setAvatar(jsonObj.getString("avatar"));
                }
                if(jsonObj.containsKey("telephone")){// 用户头像
                    staff.setTelephone(jsonObj.getString("telephone"));
                }
                if(jsonObj.containsKey("alias")){
                    staff.setAlias(jsonObj.getString("alias"));
                }
                return staff;
            } else {
                int errorCode = Integer.valueOf(jsonObj.getString("errcode"));
                System.out.println(String.format("获取用户信息失败 errcode:{} errmsg:{}", errorCode, ErrCode.errMsg(errorCode)));
            }
            return null;
        }
        return null;
    }


    /**
     * 根据部门获取部门下用户信息
     * @param departmentId
     * @param
     * @return
     */
    public static List<Staff> getDepartmentUserInfo(String departmentId,String fetchChild){ return getDepartmentUserInfo(departmentId,fetchChild, mpAccount); }
    public static List<Staff> getDepartmentUserInfo(String departmentId,String fetchChild,MpAccount mpAccount) {
        String accessToken = getAccessToken(mpAccount);
        String url = WxApi.getDepartmentUserInfoUrl(accessToken, departmentId,fetchChild);
        JSONObject jsonObj = WxApi.httpsRequest(url, "GET", null);
        if (null != jsonObj) {
            String errorcode = jsonObj.getString("errcode");
            if (Integer.valueOf(errorcode).equals(Integer.valueOf(0))) {

                List<Staff> staffs = new ArrayList<>();
                JSONArray array = jsonObj.getJSONArray("userlist");
                for(int i = 0;i<array.size();i++){
                    staffs.add((Staff)array.get(i));
                }
                return staffs;
            } else {
                int errorCode = Integer.valueOf(jsonObj.getString("errcode"));
                System.out.println(String.format("获取用户信息失败 errcode:{} errmsg:{}", errorCode, ErrCode.errMsg(errorCode)));
            }
            return null;
        }
        return null;
    }





}
