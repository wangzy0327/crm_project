package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.wzy.crm.Application;
import com.wzy.crm.dao.ReadTimesRecommendMapper;
import com.wzy.crm.dao.ReadTransmitRecommendMapper;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.MessageResponseVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageServiceImplTest {


    @Autowired
    private ReadTimesRecommendMapper readTimesRecommendMapper;

    @Autowired
    private ReadTransmitRecommendMapper readTransmitRecommendMapper;

    @Autowired
    private IMessageService messageService;

    @Test
    public void parseUrl() throws Exception {
        String url = "https://v6.rabbitpre.com/m2/aUe1Zi9U0E?mobile=1";
        messageService.parseH5Url(url);
    }

    @Test
    public void parseGraphicUrl() throws Exception {
        String url = "https://www.chuangkit.com/sharedesign?d=f73984b0-1480-4da1-a6cd-ba435cd247ac";
        messageService.parseGraphicUrl(url);
    }

    @Test
    public void saveImage() throws Exception {
        String imgUrl = "http://imgpub.chuangkit.com/design/2018/08/24/433954865_thumb";
        String path = "D:\\project\\crm-project\\target\\crm-project";
//        String imgUrl = "http://photocdn.sohu.com/20151104/mp39742996_1446630670566_3.png";

//         byte[] data = RequestUtil.getImageBytes(imgUrl);
//        System.out.println(data);
        String picUrl = messageService.saveImage(imgUrl,path);
        System.out.println("picUrl:"+picUrl);
    }

    @Test
    public void addTags() throws Exception {
        Integer messageId = 999;
        Map<Integer,List<MessageTag>> map = Maps.newHashMap();
        MessageTag messageTag1 = new MessageTag();
        messageTag1.setName("gan");
        MessageTag messageTag2 = new MessageTag();
        messageTag2.setName("gangan");
        MessageTag messageTag3 = new MessageTag();
        messageTag3.setName("gangangan");
        map.put(0, Lists.newArrayList(messageTag1,messageTag2,messageTag3));
        map.put(1, Lists.newArrayList(messageTag1,messageTag2));
        map.put(2, Lists.newArrayList(messageTag1,messageTag3));
        messageService.addTags(messageId,map);
    }

    @Test
    public void findH5Message() throws Exception {
        Integer id = 153;
        messageService.findH5Message(id);
    }

    @Test
    public void needToDelTags() throws Exception {
        Integer id = 165;
        messageService.needToDelTags(id);
    }

    @Test
    public void getRecommendMessageList() throws Exception {
        Integer customerId = 102;
        System.out.println("customerId:"+customerId);
        List<MessageResponseVo> scorePrefs = readTimesRecommendMapper.selectRecommendMessage(customerId);
        List<MessageResponseVo> booleanPrefs = readTransmitRecommendMapper.selectRecommendMessage(customerId);
        Set<MessageResponseVo> prefSets = Sets.newHashSet();
        prefSets.addAll(scorePrefs);
        prefSets.addAll(booleanPrefs);
        List<MessageResponseVo> prefs = Lists.newArrayList();
        prefs.addAll(prefSets);
        prefs.forEach(item -> System.out.println(item));
    }


}