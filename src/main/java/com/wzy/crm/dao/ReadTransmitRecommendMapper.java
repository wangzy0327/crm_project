package com.wzy.crm.dao;

import com.wzy.crm.pojo.ReadTransmitRecommend;
import java.util.List;

public interface ReadTransmitRecommendMapper {

    int insert(ReadTransmitRecommend record);

    List<ReadTransmitRecommend> selectAll();
}