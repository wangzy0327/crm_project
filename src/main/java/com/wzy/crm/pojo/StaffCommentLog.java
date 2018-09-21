package com.wzy.crm.pojo;

public class StaffCommentLog {
    private Integer logId;

    private String userId;

    private Integer commentId;

    private Integer isVisitAdd;

    private Integer isComment;

    public Integer getLogId() {
        return logId;
    }

    public void setLogId(Integer logId) {
        this.logId = logId;
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