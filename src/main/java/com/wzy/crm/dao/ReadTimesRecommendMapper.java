package com.wzy.crm.dao;

import com.wzy.crm.pojo.ReadTimesRecommend;
import com.wzy.crm.vo.MessageResponseVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ReadTimesRecommendMapper {

    int insert(ReadTimesRecommend record);

    List<ReadTimesRecommend> selectAll();

    List<MessageResponseVo> selectRecommendMessage(@Param("customerId") Integer customerId);
}