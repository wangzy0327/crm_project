package com.wzy.crm.pojo;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

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

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    private String picture;

    private String attachment;

}