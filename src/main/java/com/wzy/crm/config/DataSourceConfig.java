package com.wzy.crm.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceConfig {

    private String driverClassName;

    private String url;

    private String username;

    private String password;

}
