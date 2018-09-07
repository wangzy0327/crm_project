package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class StaffCustomerFollowRelation {
    private String userId;

    private Integer customerId;

    private Integer isFollow;

}