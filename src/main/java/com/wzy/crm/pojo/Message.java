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

    private String picurl;

    private String btntxt;

    private String thirdParams;

    private Integer pagecount;

    private Integer createUserid;

    private Date updateTime;

    private Integer status;

    private Integer delflag;

    private String titletext;

    private String title;

    private String descriptiontext;

    private String description;

    private String coverpicattach;

    private String contentattach;

}