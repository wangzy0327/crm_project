package com.wzy.crm.common;

public enum EventDict {

    VISIT_CUSTOMER(0,10,"拜访客户"),SIGN_CONTRACT(1,20,"签单"),DEVELOP_MARKET(2,10,"开拓市场"),VISIT_PLAN(3,5,"拜访计划"),VISIT_LOG(4,5,"拜访记录"),NEW_CUSTOMER(5,5,"新增客户"),SHARE_MESSAGE(6,5,"分享消息"),CUSTOMER_READ(7,5,"客户打开消息");

    private int index;
    private int score;
    private String name;

    private EventDict(int index,int score,String name){
        this.index = index;
        this.score = score;
        this.name = name;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
