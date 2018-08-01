package com.wzy.crm.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Company {

    @Id
    private String id;

    private String name;
}
