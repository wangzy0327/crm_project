package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
public class Message {
    private Integer id;

    private String corpId;

    private String suiteId;

    private String corpid;

    private Integer msgtype;

    private Integer type;

    private String url;

    private String picUrl;

    private String btntxt;

    private String thirdParams;

    private String thirdParamId;

    private Integer pagecount;

    private String createUserId;

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

    private String descriptionText;

    private String description;

    private String coverpicattach;

    private String contentattach;

    private List<String> tags;

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