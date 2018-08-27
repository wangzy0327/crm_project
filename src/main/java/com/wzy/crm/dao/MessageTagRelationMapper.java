package com.wzy.crm.dao;

import com.wzy.crm.pojo.MessageTagRelation;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageTagRelationMapper {
    int insert(MessageTagRelation record);

    List<MessageTagRelation> selectAll();

    int insertByParam(@Param("messageId") Integer messageId,@Param("tagIds") List<Integer> tagIds);

    int insertByMessageTagRelation(@Param("messageTagRelations") List<MessageTagRelation> messageTagRelations);

}