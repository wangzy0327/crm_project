package com.wzy.crm.dao;

import com.wzy.crm.pojo.CustomerTag;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CustomerTagMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CustomerTag record);

    CustomerTag selectByPrimaryKey(Integer id);

    List<CustomerTag> selectAll();

    int updateByPrimaryKey(CustomerTag record);

    Integer insertTag(CustomerTag tag);

    CustomerTag selectByKey(String name);
}