package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.Customer;
import com.wzy.crm.pojo.CustomerDetailInfo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CrmApplication.class)
public class CustomerMapperTest {

    @Autowired
    private CustomerMapper customerMapper;

    @Test
    public void selectCustomerDetail() throws Exception {
        Map param = Maps.newHashMap();
        param.put("start",0);
        param.put("length",5);
        param.put("orderColumn","customer.company");
        param.put("orderType","desc");
        List<CustomerDetailInfo> lists = customerMapper.selectCustomerDetailByParam(param);
        for(int i = 0;i<lists.size();i++){
            System.out.println(lists.get(i));
        }
//        System.out.println(Arrays.deepToString(lists.toArray()));
    }

    @Test
    public void findCustomerCountByParam() throws Exception {
        Map param = Maps.newHashMap();
        param.put("start",0);
        param.put("length",5);
        param.put("orderColumn","customer.company");
        param.put("orderType","desc");
        Integer count = customerMapper.findCustomerCountByParam(param);
        System.out.println("***************");
        System.out.println("paramCount:"+count);
        System.out.println("***************");
    }

    @Test
    public void selectCustomerDetail1() throws Exception {
        List<CustomerDetailInfo> lists = customerMapper.selectCustomerDetail();
        for(int i = 0;i<lists.size();i++){
            System.out.println(lists.get(i));
        }
    }


    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer id = 100;
        Customer customer = customerMapper.selectByPrimaryKey(id);
        System.out.println(customer);
    }

    @Test
    public void updateByPrimaryKey() throws Exception {
        Integer id = 100;
        Customer customer = customerMapper.selectByPrimaryKey(id);
        customer.setOpenId("openid");
        int count = customerMapper.updateByPrimaryKey(customer);
        System.out.println("count:"+count);
    }


}