package com.wzy.crm.dao;

import com.wzy.crm.pojo.GroupMessageRelation;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface GroupMessageRelationMapper {
    int deleteByPrimaryKey(@Param("groupId") Integer groupId, @Param("messageId") Integer messageId);

    int insert(GroupMessageRelation record);

    List<GroupMessageRelation> selectAll();
}