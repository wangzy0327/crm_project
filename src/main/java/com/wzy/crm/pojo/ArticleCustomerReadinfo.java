package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class ArticleCustomerReadinfo {
    private Integer id;

    private Integer shareId;

    private String userId;

    private Integer times;

    private Integer articleId;

    private Integer customerId;

    private String openId;

    private String ip;

    private String cid;

    private String city;

    private Date openTime;

    private Integer viewTime;

    private Integer pageCount;

    private Integer totalTime;

    private Date updateTime;

    private String readInfo;

}