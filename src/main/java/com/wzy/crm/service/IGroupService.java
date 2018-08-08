package com.wzy.crm.service;

import com.wzy.crm.vo.ServerResponse;

import java.util.List;

public interface IGroupService {

    ServerResponse updateFollow(Integer groupId,List<Integer> staffIds);
}
