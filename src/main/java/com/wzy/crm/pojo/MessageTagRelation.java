package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class MessageTagRelation {
    private Integer messageId;

    private Integer tagId;

    private Integer page;

}