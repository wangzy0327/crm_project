package com.wzy.crm.dao;

import com.wzy.crm.pojo.Customer;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.pojo.StaffCustomerFollowRelation;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StaffCustomerFollowRelationMapper {
    int insert(StaffCustomerFollowRelation record);

    Integer insertByParam(@Param("customerId") Integer customerId,@Param("userIds") List<String> needToInsert);

    List<StaffCustomerFollowRelation> selectAll();

    List<Staff> selectStaffsByParam(Integer customerId);

    List<String> selectStaffIdsByParam(Integer customerId);

    Integer deleteByParam(@Param("customerId") Integer customerId,@Param("userIds") List<String> needToDel);

    List<Customer> selectCustomersByUserId(@Param("userid") String userid,@Param("start") Integer start,@Param("length") Integer length);

    Integer selectCustomerCountsByUserId(@Param("userid") String userid);
}