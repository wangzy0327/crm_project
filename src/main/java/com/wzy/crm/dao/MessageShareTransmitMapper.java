package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShareTransmit;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageShareTransmitMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShareTransmit record);

    MessageShareTransmit selectByPrimaryKey(Integer id);

    List<MessageShareTransmit> selectAll();

    int updateByPrimaryKey(MessageShareTransmit record);

    MessageShareTransmit selectByKey(@Param("shareId") Integer shareId);
}