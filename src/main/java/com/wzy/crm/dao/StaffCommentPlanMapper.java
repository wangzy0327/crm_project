package com.wzy.crm.dao;

import com.wzy.crm.pojo.StaffCommentPlan;
import com.wzy.crm.vo.CommentsListVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StaffCommentPlanMapper {
    int insert(StaffCommentPlan record);

    List<StaffCommentPlan> selectAll();

    CommentsListVo selectByPrimaryKey(@Param("id") Integer id);
}