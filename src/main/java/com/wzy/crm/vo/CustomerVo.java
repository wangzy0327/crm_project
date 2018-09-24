package com.wzy.crm.vo;

import lombok.Data;

@Data
public class CustomerVo {

    private String userId;

    private Integer groupId;

    private String searchInput;

    private Integer page;

    private Integer size;

}
