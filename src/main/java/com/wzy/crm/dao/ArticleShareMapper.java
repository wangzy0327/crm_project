package com.wzy.crm.dao;

import com.wzy.crm.pojo.ArticleShare;
import java.util.List;

public interface ArticleShareMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(ArticleShare record);

    ArticleShare selectByPrimaryKey(Integer id);

    List<ArticleShare> selectAll();

    int updateByPrimaryKey(ArticleShare record);
}