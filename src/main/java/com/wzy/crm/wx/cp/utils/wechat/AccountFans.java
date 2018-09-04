package com.wzy.crm.wx.cp.utils.wechat;


import com.wzy.crm.wx.cp.common.DateUtil;

import java.io.Serializable;
import java.util.Date;

/**
 * 账号粉丝信息
 */
public class AccountFans implements Serializable{

    private String openId;//openId，每个用户都是唯一的
    private Integer subscribeStatus;//订阅状态
    private Date subscribeTime;//订阅时间
//    private byte[] nickname;
    private String nicknameStr;//昵称显示  //昵称,二进制保存emoji表情
    private String wxid;//微信号
    private Integer gender;//性别 0-未知；1-男；2-女
    private String language;//语言
    private String country;//国家
    private String province;//省
    private String city;//城市
    private String headimgurl;//头像
    private String remark;//备注

    private Date createTime;

    private Date updateTime;

    public AccountFans() {
    }

    public AccountFans(String openId, Integer subscribeStatus, Date subscribeTime, String nicknameStr, String wxid, Integer gender, String language, String country, String province, String city, String headimgurl, String remark, Date createTime, Date updateTime) {
        this.openId = openId;
        this.subscribeStatus = subscribeStatus;
        this.subscribeTime = subscribeTime;
//        this.nickname = nickname;
        this.nicknameStr = nicknameStr;
        this.wxid = wxid;
        this.gender = gender;
        this.language = language;
        this.country = country;
        this.province = province;
        this.city = city;
        this.headimgurl = headimgurl;
        this.remark = remark;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    public String getOpenId() {
        return openId;
    }
    public void setOpenId(String openId) {
        this.openId = openId;
    }
    public String getWxid() {
        return wxid;
    }
    public void setWxid(String wxid) {
        this.wxid = wxid;
    }
    public Integer getSubscribeStatus() {
        return subscribeStatus;
    }
    public void setSubscribeStatus(Integer subscribeStatus) {
        this.subscribeStatus = subscribeStatus;
    }
    public Date getSubscribeTime() { return subscribeTime; }
    public void setSubscribeTime(Date subscribeTime) { this.subscribeTime =  subscribeTime; }
//    public byte[] getNickname() { return nickname; }
//    public void setNickname(byte[] nickname) { this.nickname = nickname; }
    public String getNicknameStr() { return nicknameStr; }
    public void setNicknameStr(String nicknameStr) {
        this.nicknameStr = nicknameStr;
    }
    public Integer getGender() {
        return gender;
    }
    public void setGender(Integer gender) {
        this.gender = gender;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getProvince() {
        return province;
    }
    public void setProvince(String province) {
        this.province = province;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getHeadimgurl() {
        return headimgurl;
    }
    public void setHeadimgurl(String headimgurl) {
        this.headimgurl = headimgurl;
    }
    public String getRemark() {
        return remark;
    }
    public void setRemark(String remark) {
        this.remark = remark;
    }


    public String getCreateTime() { return (createTime == null)?null:DateUtil.COMMON_FULL.getDateText(createTime); }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return (updateTime == null)?null: DateUtil.COMMON_FULL.getDateText(updateTime);
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        return "AccountFans{" +
                "openId='" + openId + '\'' +
                ", subscribeStatus=" + subscribeStatus +
                ", subscribeTime=" + subscribeTime +
                ", nicknameStr='" + nicknameStr + '\'' +
                ", wxid='" + wxid + '\'' +
                ", gender=" + gender +
                ", language='" + language + '\'' +
                ", country='" + country + '\'' +
                ", province='" + province + '\'' +
                ", city='" + city + '\'' +
                ", headimgurl='" + headimgurl + '\'' +
                ", remark='" + remark + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                '}';
    }
}
