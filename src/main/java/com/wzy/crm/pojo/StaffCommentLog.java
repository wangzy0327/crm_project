package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class StaffCommentLog {
    private Integer logId;

    private String userId;

    private Integer commentId;

    private Integer isVisitAdd;

    private Integer isComment;
}