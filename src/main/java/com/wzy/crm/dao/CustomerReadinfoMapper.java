package com.wzy.crm.dao;

import com.wzy.crm.pojo.CustomerReadinfo;
import com.wzy.crm.pojo.MessageReadInfo;
import com.wzy.crm.pojo.ShareDetail;
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

    List<ShareDetail> selectReadMessageByUserId(@Param("userId") String userId, @Param("customerId") Integer customerId, @Param("start") Integer start, @Param("size") Integer size);

    List<ShareDetail> selectReadMessage(@Param("customerId") Integer customerId,@Param("start") Integer start,@Param("size") Integer size);

    List<MessageReadInfo> selectMyReadInfoDetail(@Param("userId") String userId,@Param("customerId") Integer customerId,@Param("messageId") Integer messageId);

    List<MessageReadInfo> selectReadInfoDetail(@Param("customerId") Integer customerId,@Param("messageId") Integer messageId);
}