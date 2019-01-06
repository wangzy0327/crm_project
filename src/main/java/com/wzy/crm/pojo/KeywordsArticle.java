package com.wzy.crm.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class KeywordsArticle {
    private Integer id;

    private Integer msgType;

    private String author;

    private String title;

    private String description;

    private String link;

    private Date pubTime;

    private String keyword;

}