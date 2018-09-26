package com.wzy.crm.dao;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.vo.MessageDetail;
import com.wzy.crm.vo.MessageResponseVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface MessageMapper {
    int deleteByPrimaryKey(Integer id);

    Integer insert(Message record);

    Message selectByPrimaryKey(Integer id);

    List<Message> selectByThirdParamId(String thirdParamId);

    List<Message> selectAll();

    int updateByPrimaryKey(Message record);

    List<Message> selectMessageTitleByParam(Map<String, String> param);

    Integer findMessageCount();

    Integer findMessageCountByParam(Map<String,String> param);

    List<MessageDetail> selectMessageByParam(Map<String,String> map);

    Integer updateStatusStop(Integer id);

    Integer updateStatusStart(Integer id);

    List<MessageResponseVo> selectMobileMessage(@Param("groupId") Integer groupId, @Param("tagId") Integer tagId, @Param("order") String order, @Param("orderType") String orderType, @Param("start") Integer start, @Param("size") Integer size);
}