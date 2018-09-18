package com.wzy.crm.wx.cp.config;

import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpServiceImpl;
import me.chanjar.weixin.cp.config.WxCpConfigStorage;
import me.chanjar.weixin.cp.config.WxCpInMemoryConfigStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class WechatCpConfig {

    @Autowired
    private WechatAccountConfig accountConfig;

    @Bean
    public WxCpService wxCpService(){
        WxCpService wxCpService = new WxCpServiceImpl();
        wxCpService.setWxCpConfigStorage(wxCpConfigStorage());
        return wxCpService;
    }

    @Bean
    public WxCpConfigStorage wxCpConfigStorage(){
        WxCpInMemoryConfigStorage wxCpConfigStorage = new WxCpInMemoryConfigStorage();
        wxCpConfigStorage.setCorpId(accountConfig.getCorpId());
        wxCpConfigStorage.setCorpSecret(accountConfig.getAppConfigs().get(0).getSecret());
        wxCpConfigStorage.setAgentId(accountConfig.getAppConfigs().get(0).getAgentId());
        return wxCpConfigStorage;
    }

}
