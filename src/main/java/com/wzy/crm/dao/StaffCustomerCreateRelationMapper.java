package com.wzy.crm.dao;

import com.wzy.crm.pojo.StaffCustomerCreateRelation;
import java.util.List;

public interface StaffCustomerCreateRelationMapper {
    int insert(StaffCustomerCreateRelation record);

    List<StaffCustomerCreateRelation> selectAll();
}