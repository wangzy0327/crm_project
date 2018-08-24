package com.wzy.crm.service.impl;

import com.wzy.crm.Application;
import com.wzy.crm.service.IMessageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MessageServiceImplTest {


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


}