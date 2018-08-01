package com.wzy.crm.pojo;

import lombok.Data;

import java.util.List;

@Data
public class CustomerDetailInfo {
    private String id;
    private Customer customer;
//    private Staff createCus;
    private List<Staff> followCus;
}
