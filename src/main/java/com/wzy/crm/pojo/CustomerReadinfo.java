package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class CustomerReadinfo {
    private Integer id;

    private Integer shareId;

    private String userId;

    private Integer times;

    private Integer messageId;

    private String messageTitle;

    private Integer customerId;

    private String customerName;

    private String openId;

    private String ip;

    private String cid;

    private String city;

    private Date openTime;

    private Integer viewTime;

    private Integer pageCount;

    private Integer totalTime;

    private String readInfo;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date updateTime;


}