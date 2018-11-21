package com.wzy.crm.dao;

import com.wzy.crm.pojo.ReadTransmitRecommend;
import com.wzy.crm.vo.MessageResponseVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ReadTransmitRecommendMapper {

    int insert(ReadTransmitRecommend record);

    List<ReadTransmitRecommend> selectAll();

    List<MessageResponseVo> selectRecommendMessage(@Param("customerId") Integer customerId);
}