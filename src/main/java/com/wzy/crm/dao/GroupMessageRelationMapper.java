package com.wzy.crm.dao;

import com.wzy.crm.pojo.GroupMessageRelation;
import java.util.List;
import java.util.Map;

import com.wzy.crm.pojo.Message;
import org.apache.ibatis.annotations.Param;

public interface GroupMessageRelationMapper {
    int deleteByPrimaryKey(@Param("groupId") Integer groupId, @Param("messageId") Integer messageId);

    int insert(GroupMessageRelation record);

    List<GroupMessageRelation> selectAll();

    List<Integer> selectMessageIdsByParam(Integer groupId);

    void deleteByParam(@Param("groupId") Integer groupId,@Param("messageIds") List<Integer> needToDel);

    void insertByParam(@Param("groupId") Integer groupId, @Param("messageIds") List<Integer> needToInsert);

    List<Integer> selectAllMessageIdsByGroupId(Integer groupId);

    List<GroupMessageRelation> selectMessageTitleByParam(Map<String, String> param);

    Integer selectCountByGroupId(@Param("groupId") Integer groupId);
}