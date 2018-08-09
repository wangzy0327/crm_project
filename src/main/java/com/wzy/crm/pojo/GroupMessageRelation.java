package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class GroupMessageRelation {
    private Integer groupId;

    private Integer messageId;

    private String messageTitle;

}