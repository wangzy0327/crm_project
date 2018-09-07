package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class StaffCustomerCreateRelation {
    private String userId;

    private Integer customerId;

    private Integer isCreate;

}