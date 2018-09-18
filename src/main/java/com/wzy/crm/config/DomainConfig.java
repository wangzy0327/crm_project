package com.wzy.crm.config;


import lombok.Data;
import lombok.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "domain")
public class DomainConfig {

    private String url;

}
