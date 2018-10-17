package com.wzy.crm.dao;

import com.wzy.crm.pojo.CustomerReadinfo;
import java.util.List;

public interface CustomerReadinfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CustomerReadinfo record);

    CustomerReadinfo selectByPrimaryKey(Integer id);

    List<CustomerReadinfo> selectAll();

    int updateByPrimaryKey(CustomerReadinfo record);
}