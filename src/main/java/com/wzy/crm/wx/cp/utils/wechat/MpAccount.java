package com.wzy.crm.wx.cp.utils.wechat;

import java.io.Serializable;

public class MpAccount implements Serializable{
    private static final long serialVersionUID = -6315146640254918207L;

    private String account;//账号
    private String corpid;//corpid
    private String appsecret;//appsecret
    private String agentid;
    private String url;//验证时用的url
    private String token;//token

    //ext
    private Integer msgcount;//自动回复消息条数;默认是5条


    public String getAccount() {
        return account;
    }
    public void setAccount(String account) {
        this.account = account;
    }
    public String getCorpid() { return corpid; }

    public void setCorpid(String corpid) { this.corpid = corpid; }

    public String getAgentid() { return agentid; }

    public void setAgentid(String agentid) { this.agentid = agentid; }

    public String getAppsecret() {
        return appsecret;
    }
    public void setAppsecret(String appsecret) {
        this.appsecret = appsecret;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public Integer getMsgcount() {
        if(msgcount == null)
            msgcount = 5;//默认5条
        return msgcount;
    }
    public void setMsgcount(Integer msgcount) {
        this.msgcount = msgcount;
    }
}
