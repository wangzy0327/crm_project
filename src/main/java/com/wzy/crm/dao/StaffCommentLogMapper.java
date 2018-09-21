package com.wzy.crm.dao;

import com.wzy.crm.pojo.StaffCommentLog;
import com.wzy.crm.vo.CommentsListVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StaffCommentLogMapper {
    int insert(StaffCommentLog record);

    List<StaffCommentLog> selectAll();

    CommentsListVo selectByPrimaryKey(@Param("id") Integer id);
}