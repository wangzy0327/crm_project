package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class MessageShareCustomer {
    private Integer id;

    private Integer messageId;

    private String userId;

    private Integer customerId;

    private String openId;

    private String ip;

    private String cid;

    private String city;

    private Date openTime;

    private Integer viewTime;

    private Date updateTime;

    private String readInfo;
}