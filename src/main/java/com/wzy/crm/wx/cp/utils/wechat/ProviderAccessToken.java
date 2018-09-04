package com.wzy.crm.wx.cp.utils.wechat;

import com.wzy.crm.wx.cp.common.CalendarUtil;
import com.wzy.crm.wx.cp.common.ErrCode;

public class ProviderAccessToken {
    private String providerAccessToken;// 接口访问凭证
    private int expiresIn;// 凭证有效期，单位：秒
    private long createTime;//创建时间，单位：秒 ，用于判断是否过期

    private Integer errcode;//错误编码
    private String errmsg;//错误消息

    public ProviderAccessToken(){
        this.createTime = CalendarUtil.getTimeInSeconds();
    }

    public ProviderAccessToken(String accessToken,int expiresIn){
        this.providerAccessToken = accessToken;
        this.expiresIn = expiresIn;
        this.createTime = CalendarUtil.getTimeInSeconds();
    }

    public String getAccessToken() {
        return providerAccessToken;
    }
    public void setAccessToken(String accessToken) {
        this.providerAccessToken = accessToken;
    }
    public int getExpiresIn() {
        return expiresIn;
    }
    public void setExpiresIn(int expiresIn) {
        this.expiresIn = expiresIn;
    }
    public Integer getErrcode() {
        return errcode;
    }
    public void setErrcode(Integer errcode) {
        this.errcode = errcode;
        this.errmsg = ErrCode.errMsg(errcode);
    }
    public String getErrmsg() {
        return errmsg;
    }
    public void setErrmsg(String errmsg) {
        this.errmsg = errmsg;
    }

    /**
     * 是否超时，微信默认7200s超时
     * 空出200s的富余量
     * @return true-超时；false-没有超时
     */
    public boolean isExpires(){
        long now = CalendarUtil.getTimeInSeconds();
        return now - this.createTime >= (this.expiresIn - 200);
    }

    /**
     * 是否超时
     * 空出200s的富余量
     * @return true-超时；false-没有超时
     */
    public boolean isExpires(Long expireTime){
        long now = CalendarUtil.getTimeInSeconds();
        return now - this.createTime >= (expireTime - 200);
    }

}
