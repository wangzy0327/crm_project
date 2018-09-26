package com.wzy.crm.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MessageResponseVo {

    private Integer id;

    private Integer openCount;

    private Integer groupId;

    private Integer tagId;

    private Integer msgType;

    private String createUserName;

    private String titleText;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
