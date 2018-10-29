package com.wzy.crm.vo;

import lombok.Data;

@Data
public class MessageShareVo {

    private String userId;

    private Integer messageId;

    private Integer customerId;

    private Integer page;

    private Integer size;

}
