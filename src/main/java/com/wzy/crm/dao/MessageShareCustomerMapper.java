package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShareCustomer;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageShareCustomerMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShareCustomer messageShareCustomer);

    MessageShareCustomer selectByPrimaryKey(Integer id);

    List<MessageShareCustomer> selectAll();

    int updateByPrimaryKey(MessageShareCustomer record);
}