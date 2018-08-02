package com.wzy.crm.dao;

import com.wzy.crm.pojo.Staff;
import com.wzy.crm.pojo.StaffCustomerFollowRelation;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StaffCustomerFollowRelationMapper {
    int insert(StaffCustomerFollowRelation record);

    Integer insertByParam(@Param("customerId") Integer customerId,@Param("staffIds") List<Integer> staffIds);

    List<StaffCustomerFollowRelation> selectAll();

    List<Staff> selectStaffsByParam(Integer customerId);

    List<Integer> selectStaffIdsByParam(Integer customerId);

    Integer deleteByParam(@Param("customerId") Integer customerId,@Param("staffIds") List<Integer> staffIds);
}