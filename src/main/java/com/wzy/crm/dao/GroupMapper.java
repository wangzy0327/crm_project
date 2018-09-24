package com.wzy.crm.dao;

import com.wzy.crm.pojo.Group;
import com.wzy.crm.vo.GroupVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface GroupMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Group record);

    Group selectByPrimaryKey(Integer id);

    List<Group> selectAll();

    int updateByPrimaryKey(Group record);

    List<Group> selectGroupByParam(Map<String, String> param);

    Integer selectGroupByName(@Param("id") Integer id, @Param("name") String name);

    GroupVo selectByUserId(@Param("userId") String userId);
}