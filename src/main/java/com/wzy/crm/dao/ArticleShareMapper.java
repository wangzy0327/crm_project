package com.wzy.crm.dao;

import com.wzy.crm.pojo.ArticleShare;
import com.wzy.crm.pojo.MessageShare;
import com.wzy.crm.pojo.ShareDetail;
import com.wzy.crm.vo.MessageResponseVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ArticleShareMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(ArticleShare record);

    ArticleShare selectByPrimaryKey(Integer id);

    List<ArticleShare> selectAll();

    int updateByPrimaryKey(ArticleShare record);

    int updateOpenCount(MessageShare messageShare);

    List<ShareDetail> selectSelfShare(@Param("userId") String userId, @Param("start") Integer start, @Param("size") Integer size);


}