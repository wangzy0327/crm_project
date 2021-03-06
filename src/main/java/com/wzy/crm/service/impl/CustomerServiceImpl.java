package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.*;
import com.wzy.crm.pojo.*;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.utils.SendWxMessage;
import com.wzy.crm.vo.CustomerShareVo;
import com.wzy.crm.vo.CustomerVo;
import com.wzy.crm.vo.UserProfileVo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private StaffCustomerFollowRelationMapper staffCustomerFollowRelationMapper;

    @Autowired
    private StaffCustomerCreateRelationMapper staffCustomerCreateRelationMapper;

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

    @Autowired
    private MessageShareCustomerMapper messageShareCustomerMapper;

    @Autowired
    @Lazy
    private IMessageService messageService;

    @Autowired
    private CustomerReadinfoMapper customerReadinfoMapper;

    @Autowired
    private ArticleCustomerReadinfoMapper articleCustomerReadinfoMapper;

    @Autowired
    private MessageShareMapper messageShareMapper;

    @Autowired
    private ArticleShareMapper articleShareMapper;

    @Autowired
    private SendWxMessage sendWxMessage;

    @Override
    public List<CustomerDetailInfo> findCustomerByParam(Map<String,String> map) {
        return customerMapper.selectCustomerDetailByParam(map);
    }

    @Override
    public ServerResponse updateFollow(Integer customerId, List<String> userIds) {
        List<String> oldFollow = staffCustomerFollowRelationMapper.selectStaffIdsByParam(customerId);
        List<String> needToDel = Lists.newArrayList();
        List<String> needToInsert = Lists.newArrayList();
        for(int i = 0;i<oldFollow.size();i++){
            if(!userIds.contains(oldFollow.get(i)))
                needToDel.add(oldFollow.get(i));
        }
        for(int i = 0;i<userIds.size();i++){
            if(!oldFollow.contains(userIds.get(i))){
                needToInsert.add(userIds.get(i));
            }
        }
        handleFollowData(customerId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    private void handleFollowData(Integer customerId, List<String> needToDel, List<String> needToInsert){
        if(needToDel!=null&&needToDel.size()>0)
            staffCustomerFollowRelationMapper.deleteByParam(customerId,needToDel);
        if(needToInsert!=null&&needToInsert.size()>0)
            staffCustomerFollowRelationMapper.insertByParam(customerId,needToInsert);
    }

    @Override
    public ServerResponse getCustomerList(CustomerVo customerVo){
        String userId = customerVo.getUserId();
        Integer page = customerVo.getPage();
        Integer size = customerVo.getSize();
        Integer groupId = customerVo.getGroupId();
        String keyword = customerVo.getSearchInput();
        if(StringUtils.isNotBlank(keyword)){
            keyword = "%"+keyword+"%";
        }
        Integer start = (page - 1)*size;
        if(userId!=null){
            List<Customer> customers = staffCustomerFollowRelationMapper.selectCustomersByUserId(userId,keyword,start,size);
            if(customers.size()>0){
                return ServerResponse.createBySuccess(customers);
            }else{
                return ServerResponse.createBySuccess();
            }
        }else{
            return ServerResponse.createBySuccess(groupStaffRelationMapper.selectCustomersByGroupId(groupId,keyword,start,size));
        }
    }

    @Override
    public ServerResponse getCustomerListDetail(CustomerVo customerVo) {
        String userId = customerVo.getUserId();
        Integer page = customerVo.getPage();
        Integer size = customerVo.getSize();
        Integer groupId = customerVo.getGroupId();
        String keyword = customerVo.getSearchInput();
        if(StringUtils.isNotBlank(keyword)){
            keyword = "%"+keyword+"%";
        }
        Integer start = (page - 1)*size;
        if(userId!=null){
            List<Customer> customers = staffCustomerFollowRelationMapper.selectCustomersDetailByUserId(userId,keyword,start,size);
            if(customers.size()>0){
                return ServerResponse.createBySuccess(customers);
            }else{
                return ServerResponse.createBySuccess();
            }
        }else{
            return ServerResponse.createBySuccess(groupStaffRelationMapper.selectCustomersByGroupId(groupId,keyword,start,size));
        }
    }

    @Override
    public ServerResponse saveShareCustomer(CustomerShareVo customerShareVo) {
        Customer customer = customerShareVo.getCustomer();
        System.out.println("customer:"+customer);
        customerMapper.insert(customer);
        System.out.println("save customer:"+customer);
        StaffCustomerFollowRelation staffCustomerFollowRelation = new StaffCustomerFollowRelation();
        staffCustomerFollowRelation.setUserId(customerShareVo.getUserId());
        staffCustomerFollowRelation.setCustomerId(customer.getId());
        staffCustomerFollowRelation.setIsFollow(1);
        staffCustomerFollowRelationMapper.insert(staffCustomerFollowRelation);
        StaffCustomerCreateRelation staffCustomerCreateRelation = new StaffCustomerCreateRelation();
        staffCustomerCreateRelation.setUserId(customerShareVo.getUserId());
        staffCustomerCreateRelation.setCustomerId(customer.getId());
        staffCustomerCreateRelation.setIsCreate(1);
        staffCustomerCreateRelationMapper.insert(staffCustomerCreateRelation);
        MessageShareCustomer messageShareCustomer = new MessageShareCustomer();
        messageShareCustomer.setUserId(customerShareVo.getUserId());
        messageShareCustomer.setMessageId(customerShareVo.getMessageId());
        messageShareCustomer.setShareId(customerShareVo.getShareId());
        messageShareCustomer.setCustomerId(customerShareVo.getCustomer().getId());
        messageShareCustomer.setOpenId(customerShareVo.getCustomer().getOpenId());
        return messageService.saveShareCustomer(messageShareCustomer);
    }

    @Override
    public ServerResponse updateCustomerReadInfo(CustomerReadinfo customerReadinfo) {
        Integer shareId = customerReadinfo.getShareId();
        Integer messageId = customerReadinfo.getMessageId();
        String openId = customerReadinfo.getOpenId();
        System.out.println("readInfo openId:"+openId);
        Customer customer = customerMapper.selectByPrimaryKey(customerReadinfo.getCustomerId());
        List<Customer> customers;
        if(customer == null){
            customers = customerMapper.selectByOpenid(openId);
            if(customers.size()>0){
                customer = customers.get(0);
                customerReadinfo.setCustomerId(customer.getId());
                customerReadinfo.setCustomerName(customer.getName());
                MessageShareCustomer messageShareCustomer = new MessageShareCustomer();
                messageShareCustomer.setShareId(customerReadinfo.getShareId());
                messageShareCustomer.setMessageId(customerReadinfo.getMessageId());
                messageShareCustomer.setUserId(customerReadinfo.getUserId());
                messageShareCustomer.setCustomerId(customerReadinfo.getCustomerId());
                messageShareCustomerMapper.insert(messageShareCustomer);
            }
        }
        if(customer == null){
            return ServerResponse.createByErrorMessage("客户id问题!");
        }
        if(openId!=null && customer.getOpenId()!=null && !openId.equals(customer.getOpenId())){
            return ServerResponse.createByErrorMessage("客户身份信息不匹配");
        }else if(customer.getOpenId() == null){
            String cusOpenid = customer.getOpenId();
            if(openId!=null&&!openId.equals("-1")&& cusOpenid == null){
                customer.setOpenId(openId);
                customerMapper.updateByPrimaryKey(customer);
            }
        }
        List<CustomerReadinfo> customerReadinfos = customerReadinfoMapper.selectByShareKey(shareId,messageId);
        CustomerReadinfo customerReadinfoModify = null;
        if(customerReadinfos == null || customerReadinfos.size() == 0){
            customerReadinfo.setTimes(1);
            customerReadinfoMapper.insert(customerReadinfo);
            MessageShare messageShare = new MessageShare();
            messageShare.setId(customerReadinfo.getShareId());
            messageShareMapper.updateOpenCount(messageShare);
            sendWxMessage.handleSendCustomerScan(customerReadinfo);
        }else if(customerReadinfos!=null && customerReadinfo.getId()!=null){
            customerReadinfoModify = customerReadinfos.get(0);
            customerReadinfoMapper.updateByKeyAndTime(customerReadinfoModify.getId(),customerReadinfo.getViewTime(),customerReadinfo.getTotalTime(),customerReadinfo.getReadInfo());
        }else{
            customerReadinfoModify = customerReadinfos.get(0);
            customerReadinfo.setId(customerReadinfoModify.getId());
            customerReadinfo.setTimes(customerReadinfoModify.getTimes()+1);
            MessageShare messageShare = new MessageShare();
            messageShare.setId(customerReadinfo.getShareId());
            messageShareMapper.updateOpenCount(messageShare);
            customerReadinfoMapper.updateInfoAndTimesByKey(customerReadinfo);
            sendWxMessage.handleSendCustomerScan(customerReadinfo);
        }
        return ServerResponse.createBySuccess(customerReadinfo);
    }

    @Override
    public ServerResponse updateArticleCustomerReadInfo(CustomerReadinfo customerReadinfo) {
        Integer shareId = customerReadinfo.getShareId();
        Integer messageId = customerReadinfo.getMessageId();
        String openId = customerReadinfo.getOpenId();
        System.out.println("readInfo openId:"+openId);
        Customer customer = customerMapper.selectByPrimaryKey(customerReadinfo.getCustomerId());
        List<Customer> customers;
        if(customer == null){
            customers = customerMapper.selectByOpenid(openId);
            if(customers.size()>0){
                customer = customers.get(0);
                customerReadinfo.setCustomerId(customer.getId());
                customerReadinfo.setCustomerName(customer.getName());
                MessageShareCustomer messageShareCustomer = new MessageShareCustomer();
                messageShareCustomer.setShareId(customerReadinfo.getShareId());
                messageShareCustomer.setMessageId(customerReadinfo.getMessageId());
                messageShareCustomer.setUserId(customerReadinfo.getUserId());
                messageShareCustomer.setCustomerId(customerReadinfo.getCustomerId());
                messageShareCustomerMapper.insert(messageShareCustomer);
            }
        }
        if(customer == null){
            return ServerResponse.createByErrorMessage("客户id问题!");
        }
        if(openId!=null && customer.getOpenId()!=null && !openId.equals(customer.getOpenId())){
            return ServerResponse.createByErrorMessage("客户身份信息不匹配");
        }else if(customer.getOpenId() == null){
            String cusOpenid = customer.getOpenId();
            if(openId!=null&&!openId.equals("-1")&& cusOpenid == null){
                customer.setOpenId(openId);
                customerMapper.updateByPrimaryKey(customer);
            }
        }
        List<CustomerReadinfo> customerReadinfos = articleCustomerReadinfoMapper.selectByShareKey(shareId,messageId);
        CustomerReadinfo customerReadinfoModify = null;
        if(customerReadinfos == null || customerReadinfos.size() == 0){
            customerReadinfo.setTimes(1);
            articleCustomerReadinfoMapper.insert(customerReadinfo);
            MessageShare messageShare = new MessageShare();
            messageShare.setId(customerReadinfo.getShareId());
            articleShareMapper.updateOpenCount(messageShare);
            sendWxMessage.handleSendArticleCustomerScan(customerReadinfo);
        }else if(customerReadinfos!=null && customerReadinfo.getId()!=null){
            customerReadinfoModify = customerReadinfos.get(0);
            articleCustomerReadinfoMapper.updateByKeyAndTime(customerReadinfoModify.getId(),customerReadinfo.getViewTime(),customerReadinfo.getTotalTime(),customerReadinfo.getReadInfo());
        }else{
            customerReadinfoModify = customerReadinfos.get(0);
            customerReadinfo.setId(customerReadinfoModify.getId());
            customerReadinfo.setTimes(customerReadinfoModify.getTimes()+1);
            MessageShare messageShare = new MessageShare();
            messageShare.setId(customerReadinfo.getShareId());
            articleShareMapper.updateOpenCount(messageShare);
            articleCustomerReadinfoMapper.updateInfoAndTimesByKey(customerReadinfo);
            sendWxMessage.handleSendArticleCustomerScan(customerReadinfo);
        }
        return ServerResponse.createBySuccess(customerReadinfo);
    }

    @Override
    public ServerResponse findCustomer(Integer shareId, String openid) {
        MessageShareCustomer messageShareCustomer = messageShareCustomerMapper.selectCustomerIdByShareId(shareId);
        System.out.println("messageShareCustomer:"+messageShareCustomer);
        Integer customerId = messageShareCustomer.getCustomerId();
        System.out.println("customerId:"+customerId);
        Customer customer = customerMapper.selectByPrimaryKey(customerId);
        if(openid!= null && openid.equals("-1")){
            return ServerResponse.createBySuccess(customer);
        }else if(customer.getOpenId()!= null && !customer.getOpenId().equals(openid)){
            customerMapper.updateByPrimaryKey(customer);
            return ServerResponse.createBySuccess(customer);
        }else if(customer.getOpenId() == null && !openid.equals("-1")){
            customer.setOpenId(openid);
            customerMapper.updateByPrimaryKey(customer);
            return ServerResponse.createBySuccess(customer);
        }else if(customer.getOpenId()!=null && customer.getOpenId().equals(openid)){
            return ServerResponse.createBySuccess(customer);
        }else{
            return ServerResponse.createBySuccess(customer);
        }
    }

    @Override
    public ServerResponse findReadMessage(CustomerVo customerVo) {
        String userId = customerVo.getUserId();
        Integer customerId = customerVo.getCustomerId();
        Integer page = customerVo.getPage();
        Integer size = customerVo.getSize();
        Integer start = (page - 1)*size;
        List<ShareDetail> shareDetails = new ArrayList<>();
        if(userId!=null){
            shareDetails = customerReadinfoMapper.selectReadMessageByUserId(userId,customerId,start,size);
        }else{
            shareDetails = customerReadinfoMapper.selectReadMessage(customerId,start,size);
        }
        return ServerResponse.createBySuccess(shareDetails);
    }

    @Override
    public ServerResponse findUserProfile(Integer customerId) {
        System.out.println("customerId:"+customerId);
        List<UserProfileVo> userProfileVos = customerMapper.findCustomerProfile(customerId);
        List<UserProfileVo> userCitys = customerMapper.findCustomerCity(customerId);
        if(userCitys!=null && userCitys.size()>0)
            userProfileVos.addAll(userCitys);
        return ServerResponse.createBySuccess(userProfileVos);
    }


}
