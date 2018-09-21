package com.wzy.crm.pojo;

public class StaffCommentPlan {
    private Integer planId;

    private String userId;

    private Integer commentId;

    private Integer isVisitAdd;

    private Integer isComment;

    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId == null ? null : userId.trim();
    }

    public Integer getCommentId() {
        return commentId;
    }

    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }

    public Integer getIsVisitAdd() {
        return isVisitAdd;
    }

    public void setIsVisitAdd(Integer isVisitAdd) {
        this.isVisitAdd = isVisitAdd;
    }

    public Integer getIsComment() {
        return isComment;
    }

    public void setIsComment(Integer isComment) {
        this.isComment = isComment;
    }
}