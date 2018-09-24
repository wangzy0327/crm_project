package com.wzy.crm.vo;

import lombok.Data;

import java.util.List;

@Data
public class GroupVo {

    private String userId;

    private List<GroupDetail> groupDetails;

}
