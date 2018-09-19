package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.CustomerTag;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class CustomerTagMapperTest {


    @Autowired
    private CustomerTagMapper customerTagMapper;

    @Test
    public void insertTag() throws Exception {
        CustomerTag tag = new CustomerTag();
        tag.setId(1);
        tag.setName("不错");
        List<CustomerTag> customerTags = new ArrayList<>();
        customerTags.add(tag);
        customerTags.get(0).setId(3);
        System.out.println("list tag id:"+customerTags.get(0).getId());
        System.out.println("tag id:"+tag.getId());
//        String tagName = "不错";
//        Integer count = customerTagMapper.insertTag(tag);
//        System.out.println("tagId:"+tag.getId());
    }

    @Test
    public void insertTag1() throws Exception {
        CustomerTag tag = new CustomerTag();
        tag.setName("恶劣");
        int count = customerTagMapper.insertTag(tag);
        System.out.println("count:"+count);
    }

}