package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class VisitLog {
    private Integer id;

    private String userId;

    private Integer customerId;

    private String staffName;

    private String customerName;

    private String company;

    private String way;

    private String result;

    private String requirement;

    private String memo;

    private String toStaff;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    private String picture;

    private String attachment;

}