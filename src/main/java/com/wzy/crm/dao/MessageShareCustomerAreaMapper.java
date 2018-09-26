package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShareCustomerArea;
import java.util.List;

public interface MessageShareCustomerAreaMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShareCustomerArea record);

    MessageShareCustomerArea selectByPrimaryKey(Integer id);

    List<MessageShareCustomerArea> selectAll();

    int updateByPrimaryKey(MessageShareCustomerArea record);
}