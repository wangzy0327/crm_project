package com.wzy.crm.dao;

import com.wzy.crm.pojo.CustomerTag;
import com.wzy.crm.pojo.CustomerTagRelation;
import com.wzy.crm.vo.CustomerTagVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CustomerTagRelationMapper {
    int insert(CustomerTagRelation record);

    List<CustomerTagRelation> selectAll();

    List<CustomerTag> selectHotTags();

    int updateByCustomerIdAndTagId(@Param("customerId") Integer customerId,@Param("tagId")Integer tagId);

    int insertByCustomerIdAndTagId(@Param("customerId") Integer customerId,@Param("tagId")Integer tagId);

    CustomerTagVo selectByCustomerId(Integer customerId);

}