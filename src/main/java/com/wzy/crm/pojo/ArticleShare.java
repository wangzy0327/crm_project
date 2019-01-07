package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class ArticleShare {
    private Integer id;

    private Integer articleId;

    private String userId;

    private Date pushTime;

    private Integer shareFlag;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date shareTime;

    private Integer openCount;

    private Integer delFlag;

}