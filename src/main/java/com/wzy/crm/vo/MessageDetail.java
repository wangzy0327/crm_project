package com.wzy.crm.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MessageDetail {

    private Integer id;

    private String corpId;

    private String suiteId;

    private String corpid;

    private Integer msgtype;

    //类型名称 1-文章 2-资料 3-图片 4-没有二维码图片 5-H5 6平面
    private String msgName;

    //分享详情
    private String shareMessage;

    private Integer createUserId;

    private String createUserName;

    /**
     * 最近更新时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date updateTime;

    private Integer status;

    private Integer delflag;

    private String titleText;

    private String title;

    public String getCorpid() {
        return corpid;
    }

    public void setCorpid(String corpid) {
        this.corpid = corpid;
    }

    public String getCorpId() {
        return corpId;
    }

    public void setCorpId(String corpId) {
        this.corpId = corpId;
    }

}
