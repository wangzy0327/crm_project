package com.wzy.crm.dao;

import com.wzy.crm.pojo.KeywordsArticle;
import com.wzy.crm.vo.MessageResponseVo;

import java.util.List;

public interface KeywordsArticleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(KeywordsArticle record);

    KeywordsArticle selectByPrimaryKey(Integer id);

    List<KeywordsArticle> selectAll();

    int updateByPrimaryKey(KeywordsArticle record);

    int selectByTitle(String title);

    List<MessageResponseVo> findArticleByKeywords(String keywords);

}