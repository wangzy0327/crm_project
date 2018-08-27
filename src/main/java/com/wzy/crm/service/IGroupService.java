package com.wzy.crm.service;

import com.wzy.crm.common.ServerResponse;

import java.util.List;

public interface IGroupService {

    ServerResponse updateStaffRelation(Integer groupId,List<Integer> staffIds);

    ServerResponse updateMessageRelation(Integer groupId, List<Integer> messageIds);
}
