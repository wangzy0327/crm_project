package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.CustomerTag;
import com.wzy.crm.vo.CustomerTagVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class CustomerTagRelationMapperTest {

    @Autowired
    private CustomerTagRelationMapper customerTagRelationMapper;

    @Test
    public void selectHotTags() throws Exception {
        List<CustomerTag> customerTags = customerTagRelationMapper.selectHotTags();
        for(int i = 0;i<customerTags.size();i++){
            System.out.println(customerTags.get(i));
        }
    }

    @Test
    public void updateByCustomerIdAndTagId() throws Exception {
        Integer customerId = 100;
        Integer tagId = 13;
        int count = customerTagRelationMapper.updateByCustomerIdAndTagId(100, 13);
        System.out.println("count:" + count);
    }

    @Test
    public void selectByCustomerId() throws Exception {
        Integer customerId = 101;
        CustomerTagVo customerTagVo = customerTagRelationMapper.selectByCustomerId(customerId);
        List<CustomerTag> tags = customerTagVo.getTags();
        for(int i = 0;i<tags.size();i++){
            System.out.println(tags.get(i));
        }
    }


}