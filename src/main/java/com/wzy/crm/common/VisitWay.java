package com.wzy.crm.common;

public enum VisitWay {

    PHONE_VISIT(0,"电话拜访"),SITE_VISIT(1,"实地拜访"),WECHAT_VISIT(2,"微信交流"),EMAIL_VISIT(3,"邮件"),OTHERS_VISIT(4,"其他方式交流");

    private int index;
    private String name;

    private VisitWay(int index,String name){
        this.index = index;
        this.name = name;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
