package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Comments {
    private Integer id;

    private String content;

    private Date updateTime;

}