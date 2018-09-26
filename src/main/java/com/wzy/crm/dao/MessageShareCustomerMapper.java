package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShareCustomer;
import java.util.List;

public interface MessageShareCustomerMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShareCustomer record);

    MessageShareCustomer selectByPrimaryKey(Integer id);

    List<MessageShareCustomer> selectAll();

    int updateByPrimaryKey(MessageShareCustomer record);
}