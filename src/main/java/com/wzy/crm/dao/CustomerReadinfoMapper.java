package com.wzy.crm.dao;

import com.wzy.crm.pojo.CustomerReadinfo;
import com.wzy.crm.pojo.MessageReadInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CustomerReadinfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CustomerReadinfo record);

    CustomerReadinfo selectByPrimaryKey(Integer id);

    List<CustomerReadinfo> selectAll();

    int updateByPrimaryKey(CustomerReadinfo record);

//    int updateTimesByKey(@Param("id") Integer id,@Param("times") Integer times);

    int updateInfoAndTimesByKey(CustomerReadinfo record);

    int updateByKeyAndTime(@Param("id") Integer id,@Param("viewTime") Integer viewTime,@Param("totalTime") Integer totalTime,@Param("readInfo") String readInfo);

    List<CustomerReadinfo> selectByShareKey(@Param("shareId") Integer shareId,@Param("messageId") Integer messageId);

    List<MessageReadInfo> selectMessageShareDetail(@Param("userId") String userId,@Param("messageId") Integer messageId);
}