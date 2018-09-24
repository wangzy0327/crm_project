package com.wzy.crm.dao;

import com.wzy.crm.pojo.Customer;
import com.wzy.crm.pojo.GroupStaffRelation;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface GroupStaffRelationMapper {
    int deleteByPrimaryKey(@Param("groupId") Integer groupId, @Param("userId") Integer userId);

    int insert(GroupStaffRelation record);

    GroupStaffRelation selectByPrimaryKey(@Param("groupId") Integer groupId, @Param("userId") Integer userId);

    List<GroupStaffRelation> selectAll();

    int updateByPrimaryKey(GroupStaffRelation record);

    List<GroupStaffRelation> selectStaffNameByParam(Map<String, String> param);

    List<String> selectStaffIdsByParam(Integer groupId);

    void deleteByParam(@Param("groupId") Integer groupId, @Param("userIds") List<String> needToDel);

    void insertByParam(@Param("groupId") Integer groupId, @Param("userIds") List<String> needToInsert);

    List<Integer> selectAllStaffIdsByGroupId(Integer groupId);

    Integer selectCountByGroupId(@Param("groupId") Integer groupId);

    List<Customer> selectCustomersByGroupId(@Param("groupId") Integer groupId,@Param("keyword") String keyword,@Param("start") Integer start,@Param("length") Integer length);
}