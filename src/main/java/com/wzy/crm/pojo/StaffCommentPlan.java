package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class StaffCommentPlan {
    private Integer planId;

    private String userId;

    private Integer commentId;

    private Integer isVisitAdd;

    private Integer isComment;

}