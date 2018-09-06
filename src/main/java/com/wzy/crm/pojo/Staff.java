package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Staff {
    private Integer id;

    private Integer isleader;

    private String userid;

    private String name;

    private String position;

    private String mobile;

    private Integer gender;

    private String email;

    private String avatar;

    private String telephone;

    private String alias;

    private String wx;

    private Date updateTime;

}