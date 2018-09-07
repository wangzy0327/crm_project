package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class GroupStaffRelation {
    private Integer groupId;

    private String userId;

    private Integer defGroup;

    private String staffName;

}