DROP DATABASE IF EXISTS `crm_project`;
CREATE DATABASE IF NOT EXISTS `crm_project` CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;
use `crm_project`;

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '销售人员id',
  `role` int(4) NOT NULL COMMENT '角色  0-普通员工 1-管理员',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(50) NOT NULL COMMENT '用户密码，MD5加密',
  `age` int(4) DEFAULT NULL COMMENT '年龄',
  `wx` varchar(100) DEFAULT NULL COMMENT '微信号',
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_unique` (`phone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='员工表';

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`(
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户id',
  `name` varchar(50) DEFAULT '' COMMENT '姓名',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机',
  `wechat` varchar(20) DEFAULT NULL COMMENT '微信号',
  `company` varchar(20) DEFAULT NULL COMMENT '公司',
  `position` varchar(20) DEFAULT NULL COMMENT '职位',
  `address` varchar(100) DEFAULT NULL COMMENT '地址',
  `telephone` varchar(20) DEFAULT NULL COMMENT '座机',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `webSite` varchar(50) DEFAULT NULL COMMENT '网址',
  `fax` varchar(50) DEFAULT NULL COMMENT '传真',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COMMENT='客户表';

BEGIN;
INSERT INTO `customer`(`name`,`mobile`,`wechat`,`company`,`position`,`address`,`telephone`,`email`) VALUES
 ('张三', '18911003322', 'zhangsan', '惠龙公司','经理','无锡新吴区', '010-3389034', 'zhangsan@happy.com'),
 ('李四', '18911003311', 'lisi', '无锡天宇集团','经理','无锡滨湖区', '020-3377034', 'lisi@happy.com'),
 ('王五', '18911003333', 'wangwu', '继续教育公司','经理','北京海淀区', '030-3359034', 'wangwu@happy.com'),
 ('孙六', '18911003344', 'sunliu', '中国石油大学继续教育学院','院长','北京石景山区', '010-3899034', 'sunliu@happy.com'),
 ('吴七', '18911003355', 'wuqi', '浙江省机电技师学院','书记','杭州西湖区', '010-3098034', 'wuqi@happy.com'),
 ('腊八', '18911003366', 'laba', '泸州蜀泸酒业','副总','四川省泸州市', '010-3389304', 'laba@happy.com');
COMMIT;

DROP TABLE IF EXISTS `staff_customer_follow_relation`;
CREATE TABLE `staff_customer_follow_relation`(
  `staff_id` int(11) NOT NULL COMMENT '销售id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `is_follow` int(4) DEFAULT 1 COMMENT '是否跟进该客户 0-否 1-是',
  UNIQUE KEY `staff_id` (`staff_id`,`customer_id`),
  KEY `customerId_isFollow_staffId` (`customer_id`,`is_follow`,`staff_id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='员工与客户跟进关系';

INSERT INTO `staff_customer_follow_relation` VALUES ('1001', '100', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('1000', '100', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('1002', '101', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('1004', '103', '1');


DROP TABLE IF EXISTS `staff_customer_create_relation`;
CREATE TABLE `staff_customer_create_relation`(
  `staff_id` int(11) NOT NULL COMMENT '销售id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `is_create` int(4) DEFAULT 0 COMMENT '是否创建该客户 0-否 1-是',
  KEY `customerId_isCreate` (`customer_id`,`is_create`) USING BTREE,
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='员工与客户创建关系';

INSERT INTO `staff_customer_create_relation` VALUES ('1000', '100', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('1002', '101', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('1003', '102', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('1004', '103', '1');


DROP TABLE IF EXISTS  `visit_plan`;
CREATE TABLE `visit_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '拜访计划id',
  `staff_id` int(11) DEFAULT NULL COMMENT '销售员id',
  `customer_id` int(11) DEFAULT NULL COMMENT '客户id',
  `time` datetime DEFAULT NULL COMMENT '时间',
  `place` varchar(100) DEFAULT NULL COMMENT '拜访地点',
  `picture` longtext COMMENT '图片路径',
  `attachment` longtext COMMENT '附件路径',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  `remind` datetime DEFAULT NULL COMMENT '提醒时间',
  `to_staff` varchar(255) DEFAULT NULL COMMENT '发送给谁',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  KEY `customerId_staffId_time` (`customer_id`,`staff_id`,`time`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='拜访计划';


INSERT INTO `visit_plan`(`staff_id`,`customer_id`,`time`,`place`,`content`,`remind`)VALUES
('1000','100','2018-07-28 17:45:00','北京 北京市 朝阳区','洽谈具体业务','2018-07-28 17:35:00'),
 ('1001','100','2018-07-23 17:45:00','天津 天津市 和平区','洽谈具体业务','2018-07-23 17:35:00'),
 ('1002','100','2018-07-25 17:45:00','辽宁省 沈阳市 铁西区','洽谈具体业务','2018-07-23 17:35:00'),
 ('1003','100','2018-07-26 17:45:00','上海 上海市 黄埔区','洽谈具体业务','2018-07-25 17:35:00'),
 ('1004','100','2018-07-21 17:45:00','江苏省 南京市 玄武区','洽谈具体业务','2018-07-20 17:35:00'),
 ('1000','101','2018-07-22 17:45:00','江苏省 无锡市 滨湖区','洽谈具体业务','2018-07-20 17:35:00'),
 ('1002','102','2018-07-23 17:45:00','北京 北京市 海淀区','洽谈具体业务','2018-07-20 17:35:00'),
 ('1004','103','2018-07-24 17:45:00','北京 北京市 石景山区','洽谈具体业务','2018-07-20 17:35:00'),
 ('1001','104','2018-07-25 17:45:00','北京 北京市 丰台区','洽谈具体业务','2018-07-20 17:35:00');

DROP TABLE IF EXISTS `visit_log`;
CREATE TABLE `visit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '拜访记录id',
  `staff_id` int(11) DEFAULT NULL COMMENT '销售员id',
  `customer_id` int(11) DEFAULT NULL COMMENT '客户id',
  `way` varchar(20) DEFAULT NULL COMMENT '拜访方式',
  `result` varchar(50) DEFAULT NULL COMMENT '拜访结果',
  `picture` longtext COMMENT '图片路径',
  `attachment` longtext COMMENT '附件路径',
  `requirement` varchar(255) DEFAULT NULL COMMENT '客户需求',
  `memo` varchar(255) DEFAULT NULL COMMENT '备注',
  `to_staff` varchar(255) DEFAULT NULL COMMENT '发送给谁',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  KEY `customerId_staffId` (`customer_id`,`staff_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='拜访记录';


INSERT INTO `visit_log`(`staff_id`,`customer_id`,`way`,`result`,`requirement`)VALUES
('1000','100','电话拜访','初步洽谈','产品需求'),
 ('1001','100','实地拜访','有明确意向','服务需求'),
 ('1002','100','微信交流','客户无意向','无需求'),
 ('1003','100','邮件','客户无意向','无需求'),
 ('1004','100','其他方式交流','客户无意向','无需求'),
 ('1000','101','实地拜访','初步洽谈','关系需求'),
 ('1002','102','实地拜访','签订合同','体验需求'),
 ('1004','103','微信交流','有明确意向','成功需求'),
 ('1001','104','邮件','初步洽谈','服务需求');


 CREATE TABLE `message_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签编号',
  `name` varchar(20) DEFAULT NULL COMMENT '标签名称',
  `corpid` varchar(30) DEFAULT NULL COMMENT '公司id',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

INSERT INTO `message_tag`(`name`,`corpid`)VALUES
('2018','wx4b8e52ee9877a5be'),
 ('盛典','wx4b8e52ee9877a5be'),
 ('致辞','wx4b8e52ee9877a5be'),
 ('邀请函','wx4b8e52ee9877a5be'),
 ('九零','wx4b8e52ee9877a5be'),
 ('周报','wx4b8e52ee9877a5be'),
 ('销售助手','wx4b8e52ee9877a5be'),
 ('发布会','wx4b8e52ee9877a5be'),
 ('迎春','wx4b8e52ee9877a5be');

