package com.wzy.crm.dao;

import com.wzy.crm.pojo.Group;
import com.wzy.crm.pojo.Staff;
import java.util.List;
import java.util.Map;

public interface StaffMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Staff record);

    Staff selectByPrimaryKey(Integer id);

    Staff selectByPhone(String phone);

    List<Staff> selectAll();

    int updateByPrimaryKey(Staff record);

    List<Staff> selectStaffByParam(Map<String,String> map);

    Integer findStaffCount();

    Integer findStaffCountByParam(Map<String,String> map);

    List<Staff> selectStaffNameByParam(Map<String, String> param);
}