package com.wzy.crm.dao;

import com.wzy.crm.pojo.ArticleCustomerReadinfo;
import com.wzy.crm.pojo.CustomerReadinfo;
import com.wzy.crm.pojo.MessageReadInfo;
import com.wzy.crm.pojo.ShareDetail;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ArticleCustomerReadinfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CustomerReadinfo record);

    ArticleCustomerReadinfo selectByPrimaryKey(Integer id);

    List<ArticleCustomerReadinfo> selectAll();

    int updateByPrimaryKey(ArticleCustomerReadinfo record);

    List<MessageReadInfo> selectArticleShareDetail(@Param("userId") String userId, @Param("messageId") Integer messageId);

    List<MessageReadInfo> selectMyReadInfoDetail(@Param("userId") String userId,@Param("customerId") Integer customerId,@Param("messageId") Integer messageId);

    List<MessageReadInfo> selectReadInfoDetail(@Param("customerId") Integer customerId,@Param("messageId") Integer messageId);

    List<CustomerReadinfo> selectByShareKey(@Param("shareId") Integer shareId, @Param("messageId") Integer messageId);

    int updateByKeyAndTime(@Param("id") Integer id,@Param("viewTime") Integer viewTime,@Param("totalTime") Integer totalTime,@Param("readInfo") String readInfo);

    int updateInfoAndTimesByKey(CustomerReadinfo record);

}