package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MessageShareTransmit {
    private Integer id;

    private Integer shareId;

    private String userId;

    private Integer customerId;

    private String customerName;

    private Integer messageId;

    private String messageTitle;

    private String openId;

    private Integer transmitTimes;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date updateTime;

}