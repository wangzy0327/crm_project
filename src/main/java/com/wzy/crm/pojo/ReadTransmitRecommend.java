package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class ReadTransmitRecommend {
    private Integer customerId;

    private Integer messageId;

    private Double value;

    private Date updateTime;
}