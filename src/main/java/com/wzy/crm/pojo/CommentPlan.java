package com.wzy.crm.pojo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

/**
 * 评论拜访计划
 */
@Data
public class CommentPlan {

    @Id
    private String id;

    /**
     * 拜访计划
     */
    private VisitPlan visitPlan;

    /**
     * 评论人
     */
    private Staff critic;

    /**
     * 最近更新时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

}
