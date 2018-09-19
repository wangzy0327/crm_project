package com.wzy.crm.vo;

import com.wzy.crm.pojo.CustomerTag;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.pojo.VisitPlan;
import lombok.Data;

import java.util.List;

@Data
public class PlanAndLog {

    private VisitPlan visitPlan;

    private VisitLog visitLog;

    private List<CustomerTag> tags;

}
