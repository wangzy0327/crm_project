package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageTag;
import java.util.List;
import java.util.Map;

public interface MessageTagMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageTag record);

    MessageTag selectByPrimaryKey(Integer id);

    List<MessageTag> selectAll();

    int updateByPrimaryKey(MessageTag record);

    Integer findMessageTagCount();

    Integer findMessageTagCountByParam(Map<String, String> param);

    List<MessageTag> selectMessageTagByParam(Map<String, String> param);

    Integer selectMessageTagByName(String name);
}