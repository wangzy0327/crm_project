package com.wzy.crm.dao;

import com.wzy.crm.pojo.ArticleShareTransmit;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ArticleShareTransmitMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(ArticleShareTransmit record);

    ArticleShareTransmit selectByPrimaryKey(Integer id);

    List<ArticleShareTransmit> selectAll();

    int updateByPrimaryKey(ArticleShareTransmit record);

    ArticleShareTransmit selectByKey(@Param("shareId") Integer shareId);
}