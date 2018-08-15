package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Message {
    private Integer id;

    private String corpId;

    private String suiteId;

    private String corpid;

    private Integer msgtype;

    private Integer type;

    private String url;

    private String picUrl;

    private String btntxt;

    private String thirdParams;

    private Integer pagecount;

    private Integer createUserId;

    private Date updateTime;

    private Integer status;

    private Integer delflag;

    private String titleText;

    private String title;

    private String descriptionText;

    private String description;

    private String coverpicattach;

    private String contentattach;

    public String getCorpid() {
        return corpid;
    }

    public void setCorpid(String corpid) {
        this.corpid = corpid;
    }

    public String getCorpId() {
        return corpId;
    }

    public void setCorpId(String corpId) {
        this.corpId = corpId;
    }
}