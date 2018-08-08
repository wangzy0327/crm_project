package com.wzy.crm.dao;

import com.wzy.crm.pojo.GroupStaffRelation;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface GroupStaffRelationMapper {
    int deleteByPrimaryKey(@Param("groupId") Integer groupId, @Param("staffId") Integer staffId);

    int insert(GroupStaffRelation record);

    GroupStaffRelation selectByPrimaryKey(@Param("groupId") Integer groupId, @Param("staffId") Integer staffId);

    List<GroupStaffRelation> selectAll();

    int updateByPrimaryKey(GroupStaffRelation record);
}