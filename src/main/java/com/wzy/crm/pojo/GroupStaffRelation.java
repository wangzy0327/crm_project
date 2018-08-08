package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class GroupStaffRelation {
    private Integer groupId;

    private Integer staffId;

    private Integer defGroup;

    private String staffName;

}