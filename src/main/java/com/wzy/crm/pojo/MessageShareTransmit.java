package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class MessageShareTransmit {
    private Integer id;

    private String userId;

    private Integer customerId;

    private String openId;

    private Date updateTime;
}