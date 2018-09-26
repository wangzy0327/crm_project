package com.wzy.crm.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class MessageVo {

    private Integer groupId;

    private Integer tagId;

    private String order;

    private Integer page;

    private Integer size;

}
