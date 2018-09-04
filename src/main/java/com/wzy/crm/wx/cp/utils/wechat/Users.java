package com.wzy.crm.wx.cp.utils.wechat;

/**
 * 成员信息
 */
public class Users {
    private String userid;
    private String name;
    private String position;
    private String mobile;
    private Integer gender;
    private String email;
    private Integer isleader;
    private String avatar;
    private String telephone;
    private String alias;

    public Users() {
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getIsleader() {
        return isleader;
    }

    public void setIsleader(Integer isleader) {
        this.isleader = isleader;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    @Override
    public String toString() {
        return "Users{" +
                "userid='" + userid + '\'' +
                ", name='" + name + '\'' +
                ", position='" + position + '\'' +
                ", mobile='" + mobile + '\'' +
                ", gender=" + gender +
                ", email='" + email + '\'' +
                ", isleader=" + isleader +
                ", avatar='" + avatar + '\'' +
                ", telephone='" + telephone + '\'' +
                ", alias='" + alias + '\'' +
                '}';
    }
}
