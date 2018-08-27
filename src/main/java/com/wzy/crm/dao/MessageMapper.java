package com.wzy.crm.dao;

import com.wzy.crm.pojo.Group;
import com.wzy.crm.pojo.Message;
import java.util.List;
import java.util.Map;

public interface MessageMapper {
    int deleteByPrimaryKey(Integer id);

    Integer insert(Message record);

    Message selectByPrimaryKey(Integer id);

    Message selectByThirdParamId(String thirdParamId);

    List<Message> selectAll();

    int updateByPrimaryKey(Message record);

    List<Message> selectMessageTitleByParam(Map<String, String> param);
}