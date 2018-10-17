package com.wzy.crm.vo;

import com.wzy.crm.pojo.Customer;
import lombok.Data;

@Data
public class CustomerShareVo {
    private Customer customer;
    private String userId;
    private Integer messageId;
    private Integer shareId;
}
