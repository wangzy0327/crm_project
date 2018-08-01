package com.wzy.crm.common;

public enum VisitResult {

    INITIAL_NEGOTIATION(0,"初步洽谈"),DIFINITE_INTENTION(1,"有明确意向"),SIGN_CONTRACT(2,"签订合同"),NO_INTENTION(3,"客户无意向");

    private int index;
    private String name;

    private VisitResult(int index,String name){
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
