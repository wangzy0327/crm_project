package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MessageReadInfo {

    private Integer id;

    private Integer shareId;

    private Integer messageId;

    private Integer msgType;

    private String userId;

    private Integer customerId;

    private String customerName;

    private Integer times;

    private String city;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date openTime;

    private Integer viewTime;

    private Integer pageCount;

    private Integer totalTime;

    private String readInfo;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
