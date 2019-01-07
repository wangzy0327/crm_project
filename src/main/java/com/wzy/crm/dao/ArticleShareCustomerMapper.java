package com.wzy.crm.dao;

import com.wzy.crm.pojo.ArticleShareCustomer;
import java.util.List;

public interface ArticleShareCustomerMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(ArticleShareCustomer record);

    ArticleShareCustomer selectByPrimaryKey(Integer id);

    List<ArticleShareCustomer> selectAll();

    int updateByPrimaryKey(ArticleShareCustomer record);
}