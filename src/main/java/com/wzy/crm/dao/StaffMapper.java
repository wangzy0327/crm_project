package com.wzy.crm.dao;

import com.wzy.crm.pojo.Staff;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface StaffMapper {
    int deleteByKey(String userId);

    int insert(Staff record);

    Staff selectByKey(String userId);

    Staff selectByUserId(String userId);

    List<Staff> selectStaffByParam(Map<String,String> map);

    Integer findStaffCount();

    Integer findStaffCountByParam(Map<String,String> map);

    List<Staff> selectStaffNameByParam(Map<String, String> param);

    List<Staff> selectAll();

    List<String> selectUserIds(@Param("staffIds") List<Integer> staffIds);

    int updateByPrimaryKey(Staff record);

    List<Staff> selectByUserIdNot(String userid);

}