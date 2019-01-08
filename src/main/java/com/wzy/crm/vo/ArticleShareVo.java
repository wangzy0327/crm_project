package com.wzy.crm.vo;

import lombok.Data;

@Data
public class ArticleShareVo {

    private String userId;

    private Integer articleId;

    private Integer customerId;

    private Integer page;

    private Integer size;
}
