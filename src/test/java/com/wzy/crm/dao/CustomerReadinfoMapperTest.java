package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.CustomerReadinfo;
import com.wzy.crm.pojo.MessageReadInfo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.omg.CORBA.INTERNAL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class CustomerReadinfoMapperTest {


    @Autowired
    private CustomerReadinfoMapper customerReadinfoMapper;

    @Test
    public void updateByPrimaryKey() throws Exception {
        CustomerReadinfo customerReadinfo = new CustomerReadinfo();
        customerReadinfo.setId(1);
        customerReadinfo.setShareId(1367);
        customerReadinfo.setUserId("wzy");
        customerReadinfo.setMessageId(100);
        customerReadinfo.setCustomerId(-1);
        customerReadinfo.setIp("117.85.28.191:8080");
        customerReadinfo.setCid("320200");
        customerReadinfo.setCity("江苏省无锡市");
        customerReadinfo.setOpenTime(new Date());
        customerReadinfo.setViewTime(20);
        int count = customerReadinfoMapper.updateByKeyAndTime(customerReadinfo.getId(),6,10,customerReadinfo.getReadInfo());
        System.out.println("count:"+count);
    }

    @Test
    public void insert() throws Exception {
        CustomerReadinfo customerReadinfo = new CustomerReadinfo();
        customerReadinfo.setShareId(1367);
        customerReadinfo.setUserId("wzy");
        customerReadinfo.setTimes(1);
        customerReadinfo.setMessageId(189);
        customerReadinfo.setCustomerId(-1);
        customerReadinfo.setIp("117.85.28.191:8080");
        customerReadinfo.setCid("320200");
        customerReadinfo.setCity("江苏省无锡市");
        customerReadinfo.setOpenTime(new Date());
    }

    @Test
    public void selectByShareKey() throws Exception {
        Integer shareId = 1380;
        Integer messageId = 184;
        List<CustomerReadinfo> customerReadinfos = customerReadinfoMapper.selectByShareKey(shareId,messageId);
        for(int i = 0;i<customerReadinfos.size();i++){
            System.out.println(customerReadinfos.get(0));
        }
    }

    @Test
    public void updateInfoAndTimesByKey() throws Exception {
        CustomerReadinfo customerReadinfo = new CustomerReadinfo();
        customerReadinfo.setId(1);
        customerReadinfo.setCid("CN");
        customerReadinfo.setCity("CHINA");
        int count = customerReadinfoMapper.updateInfoAndTimesByKey(customerReadinfo);
        System.out.println("count:"+count);
    }

    @Test
    public void selectMyReadInfoDetail() throws Exception {
        Integer customerId =122;
        Integer messageId = 190;
        String userId = "wzy";
        List<MessageReadInfo> messageReadInfos = customerReadinfoMapper.selectMyReadInfoDetail(userId,customerId,messageId);
        for(int i = 0;i<messageReadInfos.size();i++){
            System.out.println(messageReadInfos.get(i));
        }
    }

}