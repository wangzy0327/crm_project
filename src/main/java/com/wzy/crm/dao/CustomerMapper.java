package com.wzy.crm.dao;

import com.wzy.crm.controller.CustomerController;
import com.wzy.crm.pojo.Customer;
import com.wzy.crm.pojo.CustomerDetailInfo;

import java.util.List;
import java.util.Map;

public interface CustomerMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Customer record);

    Customer selectByPrimaryKey(Integer id);

    List<Customer> selectByOpenid(String openid);

    List<Customer> selectAll();

    int updateByPrimaryKey(Customer record);

    List<CustomerDetailInfo> selectCustomerDetailByParam(Map<String,String> map);

    List<CustomerDetailInfo> selectCustomerDetail();

    Integer findCustomerCount();

    Integer findCustomerCountByParam(Map<String,String> map);

    Integer selectByMobile(String mobile);


}