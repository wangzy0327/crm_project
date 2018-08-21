package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class MessageShare {
    private Integer id;

    private Integer messageId;

    private Integer staffId;

    private Date pushTime;

    private Integer shareFlag;

    private Date shareTime;

    private Integer openCount;

    private Integer delFlag;

}