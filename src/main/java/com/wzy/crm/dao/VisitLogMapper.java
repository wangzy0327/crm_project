package com.wzy.crm.dao;

import com.wzy.crm.pojo.VisitLog;
import java.util.List;

public interface VisitLogMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(VisitLog record);

    VisitLog selectByPrimaryKey(Integer id);

    List<VisitLog> selectAll();

    int updateByPrimaryKey(VisitLog record);
}