package com.wzy.crm.service;

import com.wzy.crm.common.ServerResponse;

import java.util.List;

public interface IGroupService {

    ServerResponse updateStaffRelation(Integer groupId, List<String> userIds);

    ServerResponse updateMessageRelation(Integer groupId, List<Integer> messageIds);

    ServerResponse getSelfGroupMessage(String userId);
}
