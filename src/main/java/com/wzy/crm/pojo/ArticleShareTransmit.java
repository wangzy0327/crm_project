package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class ArticleShareTransmit {
    private Integer id;

    private Integer shareId;

    private String userId;

    private Integer customerId;

    private String customerName;

    private String title;

    private Integer articleId;

    private String openId;

    private Integer transmitTimes;

    private Date updateTime;

}