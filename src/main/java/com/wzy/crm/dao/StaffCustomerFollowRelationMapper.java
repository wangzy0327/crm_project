package com.wzy.crm.dao;

import com.wzy.crm.pojo.Staff;
import com.wzy.crm.pojo.StaffCustomerFollowRelation;
import java.util.List;

public interface StaffCustomerFollowRelationMapper {
    int insert(StaffCustomerFollowRelation record);

    int insertByParam(Integer customerId,Integer staffId);

    List<StaffCustomerFollowRelation> selectAll();

    List<Staff> selectStaffsByParam(Integer customerId);

    List<Integer> selectStaffIdsByParam(Integer customerId);

    Integer deleteByParam(Integer customerId,Integer staffId);
}