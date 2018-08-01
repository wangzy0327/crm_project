package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class VisitLog {
    private Integer id;

    private Integer staffId;

    private Integer customerId;

    private String staffName;

    private String customerName;

    private String way;

    private String result;

    private String requirement;

    private String memo;

    private String toStaff;

    private Date updateTime;

    private String picture;

    private String attachment;

}