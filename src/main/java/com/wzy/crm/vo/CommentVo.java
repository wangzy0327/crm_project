package com.wzy.crm.vo;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class CommentVo {
    private Integer commentId;

    private String userId;

    private Integer cutomerId;

    private String staffName;

    private String customerName;

    private String content;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * type=1，评论类型为拜访计划
     * type=2，评论类型为拜访记录
     */
    private Integer type;

    /**
     * type=1,拜访主键为拜访计划主键
     * type=2,拜访主键为拜访记录主键
     */
    private Integer visitId;

    /**
     * 发送给
     */
    private String toStaff;


}
