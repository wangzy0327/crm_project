package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class VisitPlan {
    private Integer id;

    private Integer staffId;

    private Integer customerId;

    private String staffName;

    private String customerName;

    private Date time;

    private String place;

    private String content;

    private Date remind;

    private String toStaff;

    private Date updateTime;

    private String picture;

    private String attachment;

}