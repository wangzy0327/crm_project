package com.wzy.crm.vo;

import com.wzy.crm.pojo.CustomerTag;
import lombok.Data;

import java.util.List;

@Data
public class CustomerTagVo {

    private Integer customerId;

    private List<CustomerTag> tags;


}
