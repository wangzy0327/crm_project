package com.wzy.crm.dao;

import com.wzy.crm.pojo.GroupStaffRelation;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface GroupStaffRelationMapper {
    int deleteByPrimaryKey(@Param("groupId") Integer groupId, @Param("staffId") Integer staffId);

    int insert(GroupStaffRelation record);

    GroupStaffRelation selectByPrimaryKey(@Param("groupId") Integer groupId, @Param("staffId") Integer staffId);

    List<GroupStaffRelation> selectAll();

    int updateByPrimaryKey(GroupStaffRelation record);

    List<GroupStaffRelation> selectStaffNameByParam(Map<String, String> param);

    List<Integer> selectStaffIdsByParam(Integer groupId);

    void deleteByParam(@Param("groupId") Integer groupId, @Param("staffIds") List<Integer> needToDel);

    void insertByParam(@Param("groupId") Integer groupId, @Param("staffIds") List<Integer> needToInsert);

    List<Integer> selectAllStaffIdsByGroupId(Integer groupId);
}