package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShare;
import java.util.List;

public interface MessageShareMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShare record);

    MessageShare selectByPrimaryKey(Integer id);

    List<MessageShare> selectAll();

    int updateByPrimaryKey(MessageShare record);
}