package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class MessageShareCustomer {
    private Integer id;

    private Integer shareId;

    private Integer messageId;

    private String userId;

    private Integer customerId;

    private String openId;

    private Date updateTime;

}