package com.wzy.crm.pojo;

import lombok.Data;

@Data
public class CustomerTagRelation {
    private Integer customerId;

    private Integer tagId;

    private Integer num;
}