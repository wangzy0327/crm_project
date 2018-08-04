package com.wzy.crm.service;

import com.wzy.crm.pojo.MessageTag;

import java.util.List;
import java.util.Map;

public interface IMessageTagService {

    List<MessageTag> findMessageTagByParam(Map<String,String> param);

}
