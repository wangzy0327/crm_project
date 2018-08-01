package com.wzy.crm.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.javafx.beans.IDProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Indexed;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class Staff {
    @Id
    private Integer id;

    private Integer role;

    @NotBlank
    private String username;

    private String name;

    private String password;

    private Integer age;

    private String wx;

    private String email;

    @NotBlank
    private String phone;

    @JsonIgnore
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}