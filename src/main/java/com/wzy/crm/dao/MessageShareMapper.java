package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageShare;
import com.wzy.crm.vo.MyShareVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageShareMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(MessageShare record);

    MessageShare selectByPrimaryKey(Integer id);

    List<MessageShare> selectAll();

    int updateByPrimaryKey(MessageShare record);

    int updateOpenCount(MessageShare record);

    List<MyShareVo> selectSelfShare(@Param("userId") String userId,@Param("start") Integer start,@Param("size") Integer size);
}