package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.vo.MessageHotTagVo;

import java.util.List;
import java.util.Map;

public interface MessageTagMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageTag record);

    MessageTag selectByPrimaryKey(Integer id);

    List<MessageTag> selectAll();

    List<String> selectAllTag();

    int updateByPrimaryKey(MessageTag record);

    Integer findMessageTagCount();

    Integer findMessageTagCountByParam(Map<String, String> param);

    List<MessageTag> selectMessageTagByParam(Map<String, String> param);

    Integer selectMessageTagCountByName(String name);

    List<Integer> selectByTagName(String name);

    List<MessageHotTagVo> selectHotTags();
}