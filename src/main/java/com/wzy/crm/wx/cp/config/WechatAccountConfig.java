package com.wzy.crm.wx.cp.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "wechat.cp")
public class WechatAccountConfig {

    private String corpId;

    private List<WxCpProperties.AppConfig> appConfigs;

    @Getter
    @Setter
    public static class AppConfig {
        /**
         * 设置微信企业应用的AgentId
         */
        private Integer agentId;

        /**
         * 设置微信企业应用的Secret
         */
        private String secret;

        /**
         * 设置微信企业号的token
         */
        private String token;

        /**
         * 设置微信企业号的EncodingAESKey
         */
        private String aesKey;

    }

}
