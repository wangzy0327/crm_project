package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class GroupStaffRelation {
    private Integer groupId;

    private Integer staffId;

    private String userId;

    private Integer defGroup;

    private String staffName;

}