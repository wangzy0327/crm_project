DROP DATABASE IF EXISTS `crm_project`;
CREATE DATABASE IF NOT EXISTS `crm_project` CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;
use `crm_project`;

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '销售人员id',
  `isleader` int(4) NOT NULL COMMENT '角色  0-普通员工 1-管理员',
  `userid` varchar(30) NOT NULL COMMENT '用户id',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `position` varchar(50) NOT NULL COMMENT '职位',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `gender` int(2) DEFAULT 0 COMMENT '性别 1-男 2-女 0-未知',
  `email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像路径',
  `telephone` varchar(20) DEFAULT NULL COMMENT '电话',
  `alias` varchar(255) DEFAULT NULL COMMENT '昵称',
  `wx` varchar(100) DEFAULT NULL COMMENT '微信号',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`),
  UNIQUE KEY `phone_unique` (`telephone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8 COMMENT='员工表';

# * Users{userid='wzy', name='王紫阳', position='', mobile='17326930327', gender=1, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/rM5EfD5dic7nWib8Yxic4TcGlCpibQYmzaY9mZRaE7e3JVNWfgibwB7HZBA/0', telephone='', alias=''}
# * Users{userid='yanxg', name='晏小刚', position='软件工程师', mobile='18914147690', gender=1, email='yanxg@youitech.com', isleader=0, avatar='http://shp.qpic.cn/bizmp/qUz2yxpF8KibjVaXRZ3IHhjZFKcsmbTyEswRibtCLydQLYias5NicMfGpA/', telephone='', alias=''}
# * Users{userid='ZhangChi2Hao', name='张驰2号', position='', mobile='15861668054', gender=0, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/MW1YFC6YNqztsj81dqUd2SOzicZiaGsDoR9vpg6Z3jPZlh71KS4JccAg/0', telephone='', alias=''}
# * Users{userid='zhangc', name='张驰', position='软件工程师', mobile='13771071503', gender=1, email='zhangc@youitech.com', isleader=0, avatar='http://p.qlogo.cn/bizmail/yEoPDtQXubvfzQNrJqAl6WDg52JskgvYwCM9fO4lica9hA78JFIibCKA/0', telephone='', alias=''}
# * Users{userid='hdy', name='黄大烨', position='', mobile='18262396031', gender=1, email='', isleader=0, avatar='http://p.qlogo.cn/bizmail/EEGhYtER3JotMxbWkbYGsP4bUnRfyGUr7J4cjHDBw8Adpc9DpsKhnw/0', telephone='', alias=''}
# * Users{userid='clx', name='陈丽霞', position='前端工程师', mobile='13914266226', gender=2, email='clx@youitech.com', isleader=0, avatar='http://shp.qpic.cn/bizmp/qUz2yxpF8Kicr6ZZJiaRrJeO0micoMK0lhFh9VmiaGB0sCcaWRIJ8XJhpA/', telephone='', alias=''}
# * Users{userid='cyt', name = '程言同', position = '软件工程师',mobile='18088129009',gender=1,email = 'cyt@youitech.com',isleader=0,avatar='http://p.qlogo.cn/bizmail/GticMyWDkNEjyYJwiafqlmqQDmEHMaicoafS9wwn9Bv9uHRyo9mNTictibQ/0',telephone='',alias=''}
# * Users{"userid":"zhoutao","name":"周涛","department":[9],"position":"软件工程师","mobile":"15751014845","gender":"1","email":"zhoutao@youitech.com","avatar":"http://shp.qpic.cn/bizmp/qUz2yxpF8K9nnJdEicNBrltF2lg3xKy5tstE5Wvq2zicqTM32fchvtkQ/","status":2,"isleader":0,"extattr":{"attrs":[]},"english_name":"","telephone":"","enable":0,"hide_mobile":0,"order":[0],"qr_code":"http://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vce4684a2a07628ba4","alias":""
# * Users {"userid":"wangjian","name":"王健","department":[9],"position":"软件工程师","mobile":"18861871386","gender":"1","email":"wangjian@youitech.com","avatar":"","status":2,"isleader":0,"extattr":{"attrs":[]},"english_name":"","telephone":"","enable":0,"hide_mobile":0,"order":[0],"qr_code":"http://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vc78f418618d845467","alias":""}
# * Users {"userid":"zjw","name":"朱嘉威","department":[9],"position":"项目经理","mobile":"15896483625","gender":"1","email":"zjw@youitech.com","avatar":"","status":2,"isleader":0,"extattr":{"attrs":[]},"english_name":"","telephone":"","enable":0,"hide_mobile":0,"order":[0],"qr_code":"http://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vc7fd24bc6b2562a6c","alias":""}


INSERT INTO `staff`(`isleader`,`userid`,`name`,`position`,`mobile`,`gender`,`email`,`avatar`) VALUES
  ('1', 'wzy', '王紫阳', '','17326930327','1', '', 'http://p.qlogo.cn/bizmail/rM5EfD5dic7nWib8Yxic4TcGlCpibQYmzaY9mZRaE7e3JVNWfgibwB7HZBA/0'),
  ('1', 'yanxg', '晏小刚', '软件工程师','18914147690','1', 'yanxg@youitech.com', 'http://shp.qpic.cn/bizmp/qUz2yxpF8KibjVaXRZ3IHhjZFKcsmbTyEswRibtCLydQLYias5NicMfGpA/'),
  ('1', 'ZhangChi2Hao', '张驰2号', '','15861668054','0', '', 'http://p.qlogo.cn/bizmail/MW1YFC6YNqztsj81dqUd2SOzicZiaGsDoR9vpg6Z3jPZlh71KS4JccAg/0'),
  ('1', 'zhangc', '张驰', '软件工程师','13771071503','1', 'zhangc@youitech.com', 'http://p.qlogo.cn/bizmail/yEoPDtQXubvfzQNrJqAl6WDg52JskgvYwCM9fO4lica9hA78JFIibCKA/0'),
  ('0', 'hdy', '黄大烨', '','18262396031','1', '', 'http://p.qlogo.cn/bizmail/EEGhYtER3JotMxbWkbYGsP4bUnRfyGUr7J4cjHDBw8Adpc9DpsKhnw/0'),
  ('0', 'clx', '陈丽霞', '前端工程师','13914266226','2', 'clx@youitech.com', 'http://shp.qpic.cn/bizmp/qUz2yxpF8Kicr6ZZJiaRrJeO0micoMK0lhFh9VmiaGB0sCcaWRIJ8XJhpA/'),
  ('0', 'cyt', '程言同', '软件工程师','18088129009','1', 'cyt@youitech.com', 'http://p.qlogo.cn/bizmail/GticMyWDkNEjyYJwiafqlmqQDmEHMaicoafS9wwn9Bv9uHRyo9mNTictibQ/0');
INSERT INTO `staff` VALUES ('1007', '0', 'zhoutao', '周涛', '软件工程师', '15751014845', '1', 'zhoutao@youitech.com', 'http://shp.qpic.cn/bizmp/qUz2yxpF8K9nnJdEicNBrltF2lg3xKy5tstE5Wvq2zicqTM32fchvtkQ/', null, null, null, '2018-09-06 21:57:32');
INSERT INTO `staff` VALUES ('1008', '0', 'wangjian', '王健', '软件工程师', '18861871386', '1', 'wangjian@youitech.com', 'https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vc78f418618d845467', null, null, null, '2018-09-06 21:57:32');
INSERT INTO `staff` VALUES ('1009', '1', 'zjw', '朱嘉威', '项目经理', '15896483625', '0', 'zjw@youitech.com', 'http://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vc7fd24bc6b2562a6c', null, null, null, '2018-09-06 21:57:32');



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
CREATE TABLE `staff_customer_follow_relation` (
  `user_id` varchar(30) DEFAULT NULL COMMENT '员工user_id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `is_follow` int(4) DEFAULT '1' COMMENT '是否跟进该客户 0-否 1-是',
  UNIQUE KEY `staff_id` (`user_id`,`customer_id`),
  KEY `customerId_isFollow_staffId` (`customer_id`,`is_follow`,`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='员工与客户跟进关系';

-- ----------------------------
-- Records of staff_customer_follow_relation
-- ----------------------------
INSERT INTO `staff_customer_follow_relation` VALUES ('clx', '100', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('hdy', '100', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('ZhangChi2Hao', '100', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('wzy', '101', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('zhangc', '101', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('hdy', '102', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('clx', '103', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('wzy', '103', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('clx', '104', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('yanxg', '104', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('cyt', '105', '1');
INSERT INTO `staff_customer_follow_relation` VALUES ('zhangc', '105', '1');


DROP TABLE IF EXISTS `staff_customer_create_relation`;
CREATE TABLE `staff_customer_create_relation` (
  `user_id` varchar(30) DEFAULT NULL COMMENT '员工user_id',
  `customer_id` int(11) NOT NULL COMMENT '客户id',
  `is_create` int(4) DEFAULT '0' COMMENT '是否创建该客户 0-否 1-是',
  KEY `customerId_isCreate` (`customer_id`,`is_create`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='员工与客户创建关系';

-- ----------------------------
-- Records of staff_customer_create_relation
-- ----------------------------
INSERT INTO `staff_customer_create_relation` VALUES ('wzy', '100', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('ZhangChi2Hao', '101', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('zhangc', '102', '1');
INSERT INTO `staff_customer_create_relation` VALUES ('hdy', '103', '1');


DROP TABLE IF EXISTS `visit_plan`;
CREATE TABLE `visit_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '拜访计划id',
  `user_id` varchar(30) DEFAULT NULL COMMENT '员工user_id',
  `customer_id` int(11) DEFAULT NULL COMMENT '客户id',
  `time` datetime DEFAULT NULL COMMENT '时间',
  `place` varchar(100) DEFAULT NULL COMMENT '拜访地点',
  `location` varchar(50) DEFAULT NULL COMMENT '详细地址',
  `picture` longtext COMMENT '图片路径',
  `attachment` longtext COMMENT '附件路径',
  `content` varchar(255) DEFAULT NULL COMMENT '内容',
  `remind` datetime DEFAULT NULL COMMENT '提醒时间',
  `to_staff` varchar(255) DEFAULT NULL COMMENT '发送给谁',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  KEY `customerId_staffId_time` (`customer_id`,`user_id`,`time`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='拜访计划';

-- ----------------------------
-- Records of visit_plan
-- ----------------------------
INSERT INTO `visit_plan` VALUES ('19', 'wzy', '100', '2018-07-28 17:45:00', '北京 北京市 朝阳区', null, null, null, '洽谈具体业务', '2018-07-28 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('20', 'wzy', '100', '2018-07-27 17:45:00', '北京 北京市 朝阳区', null, null, null, '洽谈具体业务', '2018-07-26 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('21', 'yanxg', '100', '2018-07-22 17:45:00', '天津 天津市 和平区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('22', 'yanxg', '100', '2018-07-21 17:45:00', '天津 天津市 和平区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('23', 'yanxg', '100', '2018-07-23 17:45:00', '天津 天津市 和平区', null, null, null, '洽谈具体业务', '2018-07-23 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('24', 'ZhangChi2Hao', '100', '2018-07-25 17:45:00', '辽宁省 沈阳市 铁西区', null, null, null, '洽谈具体业务', '2018-07-23 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('25', 'zhangc', '100', '2018-07-26 17:45:00', '上海 上海市 黄埔区', null, null, null, '洽谈具体业务', '2018-07-25 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('26', 'hdy', '100', '2018-07-21 17:45:00', '江苏省 南京市 玄武区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('27', 'wzy', '101', '2018-07-22 17:45:00', '江苏省 无锡市 滨湖区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('28', 'ZhangChi2Hao', '102', '2018-07-23 17:45:00', '北京 北京市 海淀区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('29', 'hdy', '103', '2018-07-24 17:45:00', '北京 北京市 石景山区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');
INSERT INTO `visit_plan` VALUES ('30', 'yanxg', '104', '2018-07-25 17:45:00', '北京 北京市 丰台区', null, null, null, '洽谈具体业务', '2018-07-20 17:35:00', null, '2018-08-01 17:36:51');


DROP TABLE IF EXISTS `visit_log`;
CREATE TABLE `visit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '拜访记录id',
  `user_id` varchar(30) DEFAULT NULL COMMENT '员工user_id',
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
  KEY `customerId_staffId` (`customer_id`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='拜访记录';

-- ----------------------------
-- Records of visit_log
-- ----------------------------
INSERT INTO `visit_log` VALUES ('21', 'wzy', '100', '电话拜访', '初步洽谈', null, null, '产品需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('22', 'yanxg', '100', '实地拜访', '有明确意向', null, null, '服务需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('23', 'yanxg', '100', '实地拜访', '签订合同', null, null, '服务需求', null, null, '2018-07-20 20:38:14');
INSERT INTO `visit_log` VALUES ('24', 'yanxg', '100', '实地拜访', '初步洽谈', null, null, '体验需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('25', 'ZhangChi2Hao', '100', '微信交流', '客户无意向', null, null, '无需求', null, null, '2018-07-28 20:38:14');
INSERT INTO `visit_log` VALUES ('26', 'zhangc', '100', '邮件', '客户无意向', null, null, '无需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('27', 'hdy', '100', '其他方式交流', '客户无意向', null, null, '无需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('28', 'wzy', '101', '实地拜访', '初步洽谈', null, null, '关系需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('29', 'ZhangChi2Hao', '102', '实地拜访', '签订合同', null, null, '体验需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('30', 'ZhangChi2Hao', '102', '实地拜访', '有明确意向', null, null, '体验需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('31', 'ZhangChi2Hao', '102', '实地拜访', '初步洽谈', null, null, '体验需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('32', 'hdy', '103', '微信交流', '有明确意向', null, null, '成功需求', null, null, '2018-08-01 20:38:14');
INSERT INTO `visit_log` VALUES ('33', 'yanxg', '104', '邮件', '初步洽谈', null, null, '服务需求', null, null, '2018-08-01 20:38:14');


DROP TABLE IF EXISTS `message_tag`;
CREATE TABLE `message_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签编号',
  `name` varchar(20) DEFAULT NULL COMMENT '标签名称',
  `corpid` varchar(30) DEFAULT NULL COMMENT '公司id',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message_tag
-- ----------------------------
INSERT INTO `message_tag` VALUES ('10', '2018', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('11', '盛典', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('13', '邀请函', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('14', '九零', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('15', '周报', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('16', '销售助手', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('17', '发布会', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('18', '迎春', 'wx4b8e52ee9877a5be', '2018-08-03 11:26:45');
INSERT INTO `message_tag` VALUES ('19', '生活', null, '2018-08-03 15:27:40');
INSERT INTO `message_tag` VALUES ('21', '数码', null, '2018-08-03 16:33:05');
INSERT INTO `message_tag` VALUES ('23', '餐饮', null, '2018-08-03 17:19:52');
INSERT INTO `message_tag` VALUES ('24', '时尚', null, '2018-08-03 16:43:41');
INSERT INTO `message_tag` VALUES ('47', 'adad', null, '2018-08-04 15:46:59');
INSERT INTO `message_tag` VALUES ('49', '打算的撒发生', null, '2018-08-04 16:05:05');
INSERT INTO `message_tag` VALUES ('52', '山大发', null, '2018-08-04 16:43:10');
INSERT INTO `message_tag` VALUES ('56', 'hdy', null, '2018-08-21 11:22:34');
INSERT INTO `message_tag` VALUES ('57', '阿凡达', null, '2018-08-21 13:44:41');
INSERT INTO `message_tag` VALUES ('58', '阿道夫', null, '2018-08-21 13:50:55');
INSERT INTO `message_tag` VALUES ('59', '大师傅', null, '2018-08-21 13:58:23');
INSERT INTO `message_tag` VALUES ('60', '碧桂园', null, '2018-08-22 11:11:22');
INSERT INTO `message_tag` VALUES ('61', '房地产', null, '2018-08-22 11:11:22');
INSERT INTO `message_tag` VALUES ('62', '幼师', null, '2018-08-22 16:33:49');
INSERT INTO `message_tag` VALUES ('63', '幼儿园', null, '2018-08-22 16:33:49');
INSERT INTO `message_tag` VALUES ('64', '祭祀', null, '2018-08-24 16:05:27');
INSERT INTO `message_tag` VALUES ('65', '中元节', null, '2018-08-24 16:05:27');
INSERT INTO `message_tag` VALUES ('74', '青春', null, '2018-08-27 23:11:52');
INSERT INTO `message_tag` VALUES ('75', '再来1桶', null, '2018-08-27 23:11:53');
INSERT INTO `message_tag` VALUES ('76', '促销', null, '2018-08-27 23:11:53');
INSERT INTO `message_tag` VALUES ('77', '业务员', null, '2018-08-27 23:11:53');
INSERT INTO `message_tag` VALUES ('78', '秘笈', null, '2018-08-28 10:34:09');
INSERT INTO `message_tag` VALUES ('80', '兑奖', null, '2018-08-28 10:34:09');
INSERT INTO `message_tag` VALUES ('81', '面', null, '2018-08-28 10:42:01');
INSERT INTO `message_tag` VALUES ('82', '业务', null, '2018-08-29 20:21:58');
INSERT INTO `message_tag` VALUES ('83', '大辣椒', null, '2018-08-29 20:21:58');
INSERT INTO `message_tag` VALUES ('84', '爱心', null, '2018-08-29 20:34:51');
INSERT INTO `message_tag` VALUES ('85', 'task', null, '2018-08-30 14:22:41');
INSERT INTO `message_tag` VALUES ('86', '再来一桶', null, '2018-08-30 14:24:44');
INSERT INTO `message_tag` VALUES ('87', '开学季', null, '2018-08-30 15:49:58');
INSERT INTO `message_tag` VALUES ('88', '富文本编辑器', null, '2018-08-30 16:00:36');
INSERT INTO `message_tag` VALUES ('89', '职业', null, '2018-08-31 10:33:33');
INSERT INTO `message_tag` VALUES ('90', 'test', null, '2018-08-31 14:19:34');
INSERT INTO `message_tag` VALUES ('91', '感谢', null, '2018-08-31 16:29:45');
INSERT INTO `message_tag` VALUES ('92', '教师节', null, '2018-08-31 16:29:45');
INSERT INTO `message_tag` VALUES ('93', '高能', null, '2018-08-31 16:59:16');
INSERT INTO `message_tag` VALUES ('94', '周六', null, '2018-08-31 16:59:16');
INSERT INTO `message_tag` VALUES ('95', '风暴', null, '2018-08-31 16:59:16');
INSERT INTO `message_tag` VALUES ('96', '湖南卫视', null, '2018-08-31 16:59:16');
INSERT INTO `message_tag` VALUES ('97', '中非合作', null, '2018-08-31 17:00:07');
INSERT INTO `message_tag` VALUES ('98', '人民大会堂', null, '2018-08-31 17:00:07');
INSERT INTO `message_tag` VALUES ('99', '五月天', null, '2018-08-31 17:13:28');
INSERT INTO `message_tag` VALUES ('100', '知足', null, '2018-08-31 17:13:28');
INSERT INTO `message_tag` VALUES ('101', '20年', null, '2018-08-31 17:13:28');
INSERT INTO `message_tag` VALUES ('102', '歌迷', null, '2018-08-31 17:17:12');
INSERT INTO `message_tag` VALUES ('103', '童装', null, '2018-08-31 17:18:28');
INSERT INTO `message_tag` VALUES ('104', '潮流', null, '2018-08-31 17:18:28');
INSERT INTO `message_tag` VALUES ('105', '金螳螂', null, '2018-09-03 16:28:03');
INSERT INTO `message_tag` VALUES ('106', '幼儿', null, '2018-09-05 14:17:24');
INSERT INTO `message_tag` VALUES ('107', '开学', null, '2018-09-05 14:24:45');
INSERT INTO `message_tag` VALUES ('108', '深圳', null, '2018-09-06 14:31:31');
INSERT INTO `message_tag` VALUES ('109', '家具展', null, '2018-09-06 14:31:31');
INSERT INTO `message_tag` VALUES ('110', '家居生活', null, '2018-09-06 14:31:31');
INSERT INTO `message_tag` VALUES ('111', '广场', null, '2018-09-06 14:31:31');


DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '组唯一标识',
  `name` varchar(30) DEFAULT NULL COMMENT '组名',
  `corpid` varchar(30) DEFAULT NULL COMMENT '授权方企业微信id',
  `def_group` int(1) DEFAULT '0' COMMENT '组 0新增 1默认 2公司',
  `create_group` int(11) DEFAULT NULL COMMENT '当del_group=1时，值代表成员主键（staff_id）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of group
-- ----------------------------
INSERT INTO `group` VALUES ('30', 'admin的默认组', 'wx4b8e52ee9877a5be', '1', '1000');
INSERT INTO `group` VALUES ('31', 'admin默认组', 'wx4b8e52ee9877a5be', '1', '1001');
INSERT INTO `group` VALUES ('32', 'hdy的默认组', 'wx4b8e52ee9877a5be', '1', '1003');
INSERT INTO `group` VALUES ('33', 'mike的默认组', 'wx4b8e52ee9877a5be', '1', '1005');
INSERT INTO `group` VALUES ('34', '蚂蚁技术', 'wwd700d514cc421397', '2', '1000');
INSERT INTO `group` VALUES ('35', 'test1默认组', null, '0', null);
INSERT INTO `group` VALUES ('36', 'test2默认组', null, '0', null);


DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `corp_id` varchar(255) NOT NULL COMMENT '第三方id',
  `suite_id` varchar(255) NOT NULL COMMENT '套件id',
  `corpid` varchar(255) NOT NULL COMMENT '公司id',
  `msgType` int(2) DEFAULT '1' COMMENT '1-文章 2-资料 3-图片 4-没有二维码图片 5-H5 6平面',
  `type` int(2) DEFAULT '1' COMMENT '1:图文消息',
  `titleText` longtext NOT NULL COMMENT '标题文本',
  `title` longtext NOT NULL COMMENT '标题',
  `descriptionText` longtext COMMENT '内容文本',
  `description` longtext COMMENT '描述上部分',
  `url` varchar(255) NOT NULL COMMENT '点击后跳转的链接',
  `picurl` varchar(255) DEFAULT NULL COMMENT '图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640x320，小图80x80',
  `btntxt` varchar(4) DEFAULT NULL COMMENT '按钮文字，仅在图文数为1条时才生效。 默认为“阅读全文”。',
  `coverPicAttach` longtext,
  `contentAttach` longtext,
  `third_params` varchar(255) DEFAULT NULL COMMENT '第三方参数，json格式',
  `third_param_id` varchar(50) DEFAULT NULL COMMENT '第三方唯一标识',
  `pageCount` int(11) DEFAULT '1' COMMENT '页数',
  `create_userId` int(11) DEFAULT NULL,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  `status` int(2) DEFAULT '1' COMMENT '状态 0停用 1启用',
  `delFlag` int(2) DEFAULT '0' COMMENT '删除标志位 0未删除 1删除',
  PRIMARY KEY (`id`),
  KEY `query` (`corp_id`,`suite_id`,`corpid`,`delFlag`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `corp_id` varchar(255) NOT NULL COMMENT '第三方id',
  `suite_id` varchar(255) NOT NULL COMMENT '套件id',
  `corpid` varchar(255) NOT NULL COMMENT '公司id',
  `msgType` int(2) DEFAULT '1' COMMENT '1-文章 2-资料 3-图片 4-没有二维码图片 5-H5 6平面',
  `type` int(2) DEFAULT '1' COMMENT '1:图文消息',
  `titleText` longtext NOT NULL COMMENT '标题文本',
  `title` longtext NOT NULL COMMENT '标题',
  `descriptionText` longtext COMMENT '内容文本',
  `description` longtext COMMENT '描述上部分',
  `url` varchar(255) NOT NULL COMMENT '点击后跳转的链接',
  `picurl` varchar(255) DEFAULT NULL COMMENT '图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图640x320，小图80x80',
  `btntxt` varchar(4) DEFAULT NULL COMMENT '按钮文字，仅在图文数为1条时才生效。 默认为“阅读全文”。',
  `coverPicAttach` longtext,
  `contentAttach` longtext,
  `third_params` varchar(255) DEFAULT NULL COMMENT '第三方参数，json格式',
  `third_param_id` varchar(50) DEFAULT NULL COMMENT '第三方唯一标识',
  `pageCount` int(11) DEFAULT '1' COMMENT '页数',
  `create_user_id` varchar(30) DEFAULT NULL COMMENT '员工user_id',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更新时间',
  `status` int(2) DEFAULT '1' COMMENT '状态 0停用 1启用',
  `delFlag` int(2) DEFAULT '0' COMMENT '删除标志位 0未删除 1删除',
  PRIMARY KEY (`id`),
  KEY `query` (`corp_id`,`suite_id`,`corpid`,`delFlag`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('100', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '大辣娇--加1元再来1桶', '大辣娇--加1元再来1桶', null, '/web/h5/page/bf3ec1f4-8eac-4de7-9054-06db97ea4606/neUzquH.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', '', '阅读全文', '[]', '[]', '{\"d\":\"neUzquH\",\"type\":\"rabbitpre\",\"url\":\"http://v1.rabbitpre.com/m/neUzquH\"}', 'neUzquH', '16', 'wzy', '2018-01-27 16:11:49', '1', '0');
INSERT INTO `message` VALUES ('101', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '腊八节/腊八粥/传统节日/企业宣传祝福', '腊八节/腊八粥/传统节日/企业宣传祝福', null, '/module/web/message/h5/page/ead64920-f3ef-462c-85f8-3bfe9273cf8c/y7AQQuiFp', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', '', '阅读全文', '[]', '[]', '{\"d\":\"y7AQQuiFp\",\"type\":\"rabbitpre\",\"url\":\"http://v1.rabbitpre.com/m/y7AQQuiFp\"}', null, '7', 'wzy', '2018-01-24 10:13:44', '1', '0');
INSERT INTO `message` VALUES ('102', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '企业微信注册', '<p>企业微信注册</p>', ' 以下是简单的注册「企业微信 / 微信企业号」操作步骤：1、登录【微信企业号官网/企业微信官网】-【企业注册】 2、填写【企业信息&管理员信息】★温馨提示：', '<p>★温馨提示</p>', 'http://crm.youitech.com/module/web/message/message-share.html', '', '阅读全文', '[]', '[]', null, null, '1', 'wzy', '2017-12-07 08:11:49', '1', '0');
INSERT INTO `message` VALUES ('110', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '大法师发发多少大神啊', '大法师发发多少<div><span style=\"background-color: yellow;\">大神啊</span></div>', '大法师发发多少大神啊', '大法师发发多少<div><span style=\"background-color: yellow;\">大神啊</span></div>', 'http://crm.youitech.com/module/web/message/message-share.html', null, null, null, null, null, null, null, 'wzy', '2018-08-21 13:44:20', '1', '0');
INSERT INTO `message` VALUES ('111', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', 'testtesttest', 'testtesttest', '', '', 'http://crm.youitech.com/module/web/message/message-share.html', null, null, null, null, null, null, null, 'yanxg', '2018-08-21 13:50:55', '1', '0');
INSERT INTO `message` VALUES ('112', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '大师傅', '大师傅', '', '', 'http://crm.youitech.com/module/web/message/message-share.html', null, null, null, null, null, null, null, 'ZhangChi2Hao', '2018-08-21 13:58:23', '1', '0');
INSERT INTO `message` VALUES ('113', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '33333333', '33333333', '', '', 'http://crm.youitech.com/module/web/message/message-share.html', null, null, null, null, null, null, null, 'yanxg', '2018-08-21 14:03:17', '1', '0');
INSERT INTO `message` VALUES ('129', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '我是幼师，我承诺！', '我是幼师，我承诺！', null, '/web/h5/page/bb8b00e1-51ca-4793-832f-76794a0c74c9/BRNBJv3.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, '', 'BRNBJv3', null, 'ZhangChi2Hao', '2018-08-22 16:33:48', '0', '0');
INSERT INTO `message` VALUES ('130', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '祝所有正在拥有以及曾经拥有童年的孩子', '祝所有正在拥有以及曾经拥有童年的孩子', null, '/web/h5/page/120d1848-002e-45ba-beaa-5c135bb608aa/aUe1ZicDXY.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, '', 'aUe1ZicDXY', null, 'yanxg', '2018-08-23 14:34:04', '1', '0');
INSERT INTO `message` VALUES ('152', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '2', '1', '任务一', '任务一', null, null, 'http://crm.youitech.com/module/web/message/doc/doc-share.html', null, null, 'eda8eda2-f4c0-43ab-bdf1-80ef3cbedf4f__pdf__pic_1.png,385b3131-d08e-4aea-8873-ff61f3ac0e93__pdf__pic_2.png', '{\"saveFileName\":\"04af5143-fd49-428d-b417-13072ae22db9.pdf\",\"uploadFileName\":\"任务一.pdf\"}', null, null, '2', 'ZhangChi2Hao', '2018-08-30 14:22:40', '1', '0');
INSERT INTO `message` VALUES ('153', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '大辣娇--加1元再来1桶', '大辣娇', null, '/web/h5/page/bf3ec1f4-8eac-4de7-9054-06db97ea4606/neUzquH.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, '{\"type\":\"rabbitpre\",\"url\":\"http://v1.rabbitpre.com/m/neUzquH\"}', 'neUzquH', '16', 'wzy', '2018-08-30 14:24:44', '1', '0');
INSERT INTO `message` VALUES ('155', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '测试文章 富文本编辑器', '测试文章&nbsp;<span style=\"color: inherit; background-color: yellow;\">富文本编辑器</span>', '富文本编辑器内容内容', '<span style=\"background-color: yellow;\">富文本编辑器内容</span><div><span style=\"background-color: yellow;\">内容</span></div>', 'http://crm.youitech.com/module/web/message/message-share.html', 'be1ba8dc-8fe8-44f0-bfee-d81a6b486b12.jpg', null, null, null, null, null, '1', 'wzy', '2018-08-30 16:00:36', '1', '0');
INSERT INTO `message` VALUES ('161', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '6', '1', '幼儿园开学季', '幼儿园开学季', null, null, 'http://crm.youitech.com/module/web/message/graphic/graphic-share.html', 'b1907f79-6853-4216-b67a-62509cd8e511.jpg', null, null, null, '{\"type\":\"chuangkit\",\"url\":\"https://www.chuangkit.com/sharedesign?d=058db75b-2228-45d0-8c40-42b540a0e86e\"}', '058db75b-2228-45d0-8c40-42b540a0e86e', '1', 'ZhangChi2Hao', '2018-09-05 14:24:45', '1', '0');
INSERT INTO `message` VALUES ('162', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '1', '富文本编辑器 重复三遍', '富文本编辑器 重复三遍', '富文本编辑器 富文本编辑器，富文本编辑器 重复三遍', '<span style=\"background-color: yellow;\">富文本编辑器&nbsp;</span>富文本编辑器，富文本编辑器 重复三遍<div><span style=\"background-color: yellow;\">&nbsp;&nbsp;&nbsp;&nbsp;<br></span></div>', 'http://crm.youitech.com/module/web/message/doc/doc-share.html', '5ebb5609-29f4-4473-9d80-18bb74f3db52.jpg', null, null, null, null, null, '1', 'yanxg', '2018-09-05 17:20:53', '1', '0');
INSERT INTO `message` VALUES ('164', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '6', '1', '教师节快乐', '教师节快乐', null, null, 'http://crm.youitech.com/module/web/message/graphic/graphic-share.html', 'c94d4003-c3ef-4377-82b4-ab51185b0e6c.jpg', null, null, null, '{\"type\":\"chuangkit\",\"url\":\"https://www.chuangkit.com/sharedesign?d=19aabc86-d124-49fc-9a8b-dc60683867e4\"}', '19aabc86-d124-49fc-9a8b-dc60683867e4', '1', 'zhangc', '2018-08-31 16:29:45', '1', '0');
INSERT INTO `message` VALUES ('168', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '人生中最好的一天，一生活一场五月天', '人生中最好的一天，一生活一场五月天', null, '/web/h5/page/0dd6c0df-46d2-407d-9862-78194ec28879/UZjYBjz.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, null, null, '9', 'hdy', '2018-08-31 17:17:12', '1', '0');
INSERT INTO `message` VALUES ('169', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '2', '1', '中非合作论坛', '中非合作论坛', null, null, 'http://crm.youitech.com/module/web/message/doc/doc-share.html', null, null, '24f88c1a-55dd-48ea-87ad-53243a963ac3__pdf__pic_1.png,036dc02d-84d4-47c5-a1fd-9cf50abb696a__pdf__pic_2.png', '{\"uploadFileName\":\"tetete.pdf\"}', null, null, '2', 'clx', '2018-09-05 15:49:23', '1', '0');
INSERT INTO `message` VALUES ('170', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '6', '1', '印刷海报', '印刷海报', null, null, 'http://crm.youitech.com/module/web/message/graphic/graphic-share.html', '29a1d510-cd5e-4a53-939b-b0033f65e63c.jpg', null, null, null, '{\"type\":\"chuangkit\",\"url\":\"https://www.chuangkit.com/sharedesign?d=3711282f-b1dc-4b0d-b2b9-0149ce0440ca\"}', '3711282f-b1dc-4b0d-b2b9-0149ce0440ca', '1', 'zhangc', '2018-08-31 17:18:28', '0', '0');
INSERT INTO `message` VALUES ('178', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '金螳螂 家', '金螳螂 家', null, '/web/h5/page/e2729013-6f02-47de-86cc-a657bcc09d51/NeiFJnbEx.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, '{\"type\":\"rabbitpre\",\"url\":\"http://www.rabbitpre.com/m/NeiFJnbEx\"}', 'NeiFJnbEx', '15', 'cyt', '2018-09-03 16:29:23', '1', '0');
INSERT INTO `message` VALUES ('179', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '6', '1', '微信公众号首图', '微信公众号首图', null, null, 'http://crm.youitech.com/module/web/message/graphic/graphic-share.html', '65cb047a-fc6b-4bfd-960e-69b5919f7ab2.jpg', null, null, null, '{\"type\":\"chuangkit\",\"url\":\"https://www.chuangkit.com/sharedesign?d=99c4ebeb-f913-44d4-8cd3-022641cef682\"}', '99c4ebeb-f913-44d4-8cd3-022641cef682', '1', 'clx', '2018-09-04 21:36:27', '1', '0');
INSERT INTO `message` VALUES ('180', 'wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '1', '深圳国际家具展邀请函', '深圳国际家具展邀请函', null, '/web/h5/page/da3cd323-9026-44b5-92c1-5e797ab0471a/6fiaI37.html', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', null, null, null, null, '{\"type\":\"rabbitpre\",\"url\":\"http://www.rabbitpre.com/m/6fiaI37\"}', '6fiaI37', '14', 'wzy', '2018-09-06 14:31:31', '1', '0');


DROP TABLE IF EXISTS `group_message_relation`;
CREATE TABLE `group_message_relation` (
  `group_id` int(11) NOT NULL COMMENT '组编号',
  `message_id` int(11) NOT NULL COMMENT '消息编号',
  PRIMARY KEY (`group_id`,`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `group_message_relation`(`group_id`,`message_id`)VALUES
('30','100'),
('30','101'),
('30','102'),
('31','100'),
('31','101');

DROP TABLE IF EXISTS `group_staff_relation`;
CREATE TABLE `group_staff_relation` (
  `group_id` int(11) NOT NULL COMMENT '组编号',
  `staff_id` int(11) NOT NULL COMMENT '销售员编号',
  `def_group` int(1) DEFAULT '0' COMMENT '组 0新增 1默认 2公司',
  PRIMARY KEY (`group_id`,`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `group_staff_relation`;
CREATE TABLE `group_staff_relation` (
  `group_id` int(11) NOT NULL COMMENT '组编号',
  `user_id` varchar(30) NOT NULL COMMENT '员工user_id',
  `def_group` int(1) DEFAULT '0' COMMENT '组 0新增 1默认 2公司',
  PRIMARY KEY (`group_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of group_staff_relation
-- ----------------------------
INSERT INTO `group_staff_relation` VALUES ('30', 'cyt', '0');
INSERT INTO `group_staff_relation` VALUES ('31', 'clx', '0');
INSERT INTO `group_staff_relation` VALUES ('31', 'yanxg', '0');
INSERT INTO `group_staff_relation` VALUES ('32', 'clx', '0');
INSERT INTO `group_staff_relation` VALUES ('32', 'zhangc', '1');
INSERT INTO `group_staff_relation` VALUES ('33', 'clx', '0');
INSERT INTO `group_staff_relation` VALUES ('33', 'ZhangChi2Hao', '0');
INSERT INTO `group_staff_relation` VALUES ('34', 'cyt', '1');
INSERT INTO `group_staff_relation` VALUES ('34', 'wzy', '0');
INSERT INTO `group_staff_relation` VALUES ('34', 'yanxg', '0');
INSERT INTO `group_staff_relation` VALUES ('34', 'zhangc', '0');



DROP TABLE IF EXISTS `message_tag_relation`;
CREATE TABLE `message_tag_relation` (
  `message_id` int(11) DEFAULT NULL COMMENT '消息编号',
  `tag_id` int(11) DEFAULT NULL COMMENT '标签编号',
  `page` int(11) DEFAULT '1' COMMENT '第几页',
   KEY `messageId_tagId` (`message_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `city` VALUES ('1', '合肥', '[117.283042,31.86119]');
INSERT INTO `city` VALUES ('2', '芜湖', '[118.376451,31.326319]');
INSERT INTO `city` VALUES ('3', '蚌埠', '[117.363228,32.939667]');
INSERT INTO `city` VALUES ('4', '淮南', '[117.018329,32.647574]');
INSERT INTO `city` VALUES ('5', '马鞍山', '[118.507906,31.689362]');
INSERT INTO `city` VALUES ('6', '淮北', '[116.794664,33.971707]');
INSERT INTO `city` VALUES ('7', '铜陵', '[117.816576,30.929935]');
INSERT INTO `city` VALUES ('8', '安庆', '[117.043551,30.50883]');
INSERT INTO `city` VALUES ('9', '黄山', '[118.317325,29.709239]');
INSERT INTO `city` VALUES ('10', '滁州', '[118.316264,32.303627]');
INSERT INTO `city` VALUES ('11', '阜阳', '[115.819729,32.896969]');
INSERT INTO `city` VALUES ('12', '宿州', '[116.984084,33.633891]');
INSERT INTO `city` VALUES ('13', '六安', '[116.507676,31.752889]');
INSERT INTO `city` VALUES ('14', '亳州', '[115.782939,33.869338]');
INSERT INTO `city` VALUES ('15', '池州', '[117.489157,30.656037]');
INSERT INTO `city` VALUES ('16', '宣城', '[118.757995,30.945667]');
INSERT INTO `city` VALUES ('17', '福州', '[119.306239,26.075302]');
INSERT INTO `city` VALUES ('18', '厦门', '[118.11022,24.490474]');
INSERT INTO `city` VALUES ('19', '莆田', '[119.007558,25.431011]');
INSERT INTO `city` VALUES ('20', '三明', '[117.635001,26.265444]');
INSERT INTO `city` VALUES ('21', '泉州', '[118.589421,24.908853]');
INSERT INTO `city` VALUES ('22', '漳州', '[117.661801,24.510897]');
INSERT INTO `city` VALUES ('23', '南平', '[118.178459,26.635627]');
INSERT INTO `city` VALUES ('24', '龙岩', '[117.02978,25.091603]');
INSERT INTO `city` VALUES ('25', '宁德', '[119.527082,26.65924]');
INSERT INTO `city` VALUES ('26', '兰州', '[103.823557,36.058039]');
INSERT INTO `city` VALUES ('27', '嘉峪关', '[98.277304,39.786529]');
INSERT INTO `city` VALUES ('28', '金昌', '[102.187888,38.514238]');
INSERT INTO `city` VALUES ('29', '白银', '[104.173606,36.54568]');
INSERT INTO `city` VALUES ('30', '天水', '[105.724998,34.578529]');
INSERT INTO `city` VALUES ('31', '武威', '[102.634697,37.929996]');
INSERT INTO `city` VALUES ('32', '张掖', '[100.455472,38.932897]');
INSERT INTO `city` VALUES ('33', '平凉', '[106.684691,35.54279]');
INSERT INTO `city` VALUES ('34', '酒泉', '[98.510795,39.744023]');
INSERT INTO `city` VALUES ('35', '庆阳', '[107.638372,35.734218]');
INSERT INTO `city` VALUES ('36', '定西', '[104.626294,35.579578]');
INSERT INTO `city` VALUES ('37', '陇南', '[104.929379,33.388598]');
INSERT INTO `city` VALUES ('38', '临夏', '[103.212006,35.599446]');
INSERT INTO `city` VALUES ('39', '甘南', '[102.911008,34.986354]');
INSERT INTO `city` VALUES ('40', '广州', '[113.280637,23.125178]');
INSERT INTO `city` VALUES ('41', '韶关', '[113.591544,24.801322]');
INSERT INTO `city` VALUES ('42', '深圳', '[114.085947,22.547]');
INSERT INTO `city` VALUES ('43', '珠海', '[113.553986,22.224979]');
INSERT INTO `city` VALUES ('44', '汕头', '[116.708463,23.37102]');
INSERT INTO `city` VALUES ('45', '佛山', '[113.122717,23.028762]');
INSERT INTO `city` VALUES ('46', '江门', '[113.094942,22.590431]');
INSERT INTO `city` VALUES ('47', '湛江', '[110.364977,21.274898]');
INSERT INTO `city` VALUES ('48', '茂名', '[110.919229,21.659751]');
INSERT INTO `city` VALUES ('49', '肇庆', '[112.472529,23.051546]');
INSERT INTO `city` VALUES ('50', '惠州', '[114.412599,23.079404]');
INSERT INTO `city` VALUES ('51', '梅州', '[116.117582,24.299112]');
INSERT INTO `city` VALUES ('52', '汕尾', '[115.364238,22.774485]');
INSERT INTO `city` VALUES ('53', '河源', '[114.697802,23.746266]');
INSERT INTO `city` VALUES ('54', '阳江', '[111.975107,21.859222]');
INSERT INTO `city` VALUES ('55', '清远', '[113.051227,23.685022]');
INSERT INTO `city` VALUES ('56', '东莞', '[113.746262,23.046237]');
INSERT INTO `city` VALUES ('57', '中山', '[113.382391,22.521113]');
INSERT INTO `city` VALUES ('58', '潮州', '[116.632301,23.661701]');
INSERT INTO `city` VALUES ('59', '揭阳', '[116.355733,23.543778]');
INSERT INTO `city` VALUES ('60', '云浮', '[112.044439,22.929801]');
INSERT INTO `city` VALUES ('61', '南宁', '[108.320004,22.82402]');
INSERT INTO `city` VALUES ('62', '柳州', '[109.411703,24.314617]');
INSERT INTO `city` VALUES ('63', '桂林', '[110.299121,25.274215]');
INSERT INTO `city` VALUES ('64', '梧州', '[111.297604,23.474803]');
INSERT INTO `city` VALUES ('65', '北海', '[109.119254,21.473343]');
INSERT INTO `city` VALUES ('66', '防城港', '[108.345478,21.614631]');
INSERT INTO `city` VALUES ('67', '钦州', '[108.624175,21.967127]');
INSERT INTO `city` VALUES ('68', '贵港', '[109.602146,23.0936]');
INSERT INTO `city` VALUES ('69', '玉林', '[110.154393,22.63136]');
INSERT INTO `city` VALUES ('70', '百色', '[106.616285,23.897742]');
INSERT INTO `city` VALUES ('71', '贺州', '[111.552056,24.414141]');
INSERT INTO `city` VALUES ('72', '河池', '[108.062105,24.695899]');
INSERT INTO `city` VALUES ('73', '来宾', '[109.229772,23.733766]');
INSERT INTO `city` VALUES ('74', '崇左', '[107.353926,22.404108]');
INSERT INTO `city` VALUES ('75', '贵阳', '[106.713478,26.578343]');
INSERT INTO `city` VALUES ('76', '六盘水', '[104.846743,26.584643]');
INSERT INTO `city` VALUES ('77', '遵义', '[106.937265,27.706626]');
INSERT INTO `city` VALUES ('78', '安顺', '[105.932188,26.245544]');
INSERT INTO `city` VALUES ('79', '铜仁', '[109.191555,27.718346]');
INSERT INTO `city` VALUES ('80', '黔西南', '[104.897971,25.08812]');
INSERT INTO `city` VALUES ('81', '毕节', '[105.28501,27.301693]');
INSERT INTO `city` VALUES ('82', '黔东南', '[107.977488,26.583352]');
INSERT INTO `city` VALUES ('83', '黔南', '[107.517156,26.258219]');
INSERT INTO `city` VALUES ('84', '海口', '[110.33119,20.031971]');
INSERT INTO `city` VALUES ('85', '三亚', '[109.508268,18.247872]');
INSERT INTO `city` VALUES ('86', '五指山', '[109.516662,18.776921]');
INSERT INTO `city` VALUES ('87', '琼海', '[110.466785,19.246011]');
INSERT INTO `city` VALUES ('88', '儋州', '[109.576782,19.517486]');
INSERT INTO `city` VALUES ('89', '文昌', '[110.753975,19.612986]');
INSERT INTO `city` VALUES ('90', '万宁', '[110.388793,18.796216]');
INSERT INTO `city` VALUES ('91', '东方', '[108.653789,19.10198]');
INSERT INTO `city` VALUES ('92', '定安县', '[110.349235,19.684966]');
INSERT INTO `city` VALUES ('93', '屯昌县', '[110.102773,19.362916]');
INSERT INTO `city` VALUES ('94', '澄迈县', '[110.007147,19.737095]');
INSERT INTO `city` VALUES ('95', '临高县', '[109.687697,19.908293]');
INSERT INTO `city` VALUES ('96', '白沙', '[109.452606,19.224584]');
INSERT INTO `city` VALUES ('97', '昌江', '[109.053351,19.260968]');
INSERT INTO `city` VALUES ('98', '乐东', '[109.175444,18.74758]');
INSERT INTO `city` VALUES ('99', '陵水', '[110.037218,18.505006]');
INSERT INTO `city` VALUES ('100', '保亭', '[109.70245,18.636371]');
INSERT INTO `city` VALUES ('101', '琼中', '[109.839996,19.03557]');
INSERT INTO `city` VALUES ('102', '石家庄', '[114.502461,38.045474]');
INSERT INTO `city` VALUES ('103', '唐山', '[118.175393,39.635113]');
INSERT INTO `city` VALUES ('104', '秦皇岛', '[119.586579,39.942531]');
INSERT INTO `city` VALUES ('105', '邯郸', '[114.490686,36.612273]');
INSERT INTO `city` VALUES ('106', '邢台', '[114.508851,37.0682]');
INSERT INTO `city` VALUES ('107', '保定', '[115.482331,38.867657]');
INSERT INTO `city` VALUES ('108', '张家口', '[114.884091,40.811901]');
INSERT INTO `city` VALUES ('109', '承德', '[117.939152,40.976204]');
INSERT INTO `city` VALUES ('110', '沧州', '[116.857461,38.310582]');
INSERT INTO `city` VALUES ('111', '廊坊', '[116.704441,39.523927]');
INSERT INTO `city` VALUES ('112', '衡水', '[115.665993,37.735097]');
INSERT INTO `city` VALUES ('113', '哈尔滨', '[126.642464,45.756967]');
INSERT INTO `city` VALUES ('114', '齐齐哈尔', '[123.95792,47.342081]');
INSERT INTO `city` VALUES ('115', '鸡西', '[130.975966,45.300046]');
INSERT INTO `city` VALUES ('116', '鹤岗', '[130.277487,47.332085]');
INSERT INTO `city` VALUES ('117', '双鸭山', '[131.157304,46.643442]');
INSERT INTO `city` VALUES ('118', '大庆', '[125.11272,46.590734]');
INSERT INTO `city` VALUES ('119', '伊春', '[128.899396,47.724775]');
INSERT INTO `city` VALUES ('120', '佳木斯', '[130.361634,46.809606]');
INSERT INTO `city` VALUES ('121', '七台河', '[131.015584,45.771266]');
INSERT INTO `city` VALUES ('122', '牡丹江', '[129.618602,44.582962]');
INSERT INTO `city` VALUES ('123', '黑河', '[127.499023,50.249585]');
INSERT INTO `city` VALUES ('124', '绥化', '[126.99293,46.637393]');
INSERT INTO `city` VALUES ('125', '大兴安岭', '[124.711526,52.335262]');
INSERT INTO `city` VALUES ('126', '郑州', '[113.665412,34.757975]');
INSERT INTO `city` VALUES ('127', '开封', '[114.341447,34.797049]');
INSERT INTO `city` VALUES ('128', '洛阳', '[112.434468,34.663041]');
INSERT INTO `city` VALUES ('129', '平顶山', '[113.307718,33.735241]');
INSERT INTO `city` VALUES ('130', '安阳', '[114.352482,36.103442]');
INSERT INTO `city` VALUES ('131', '鹤壁', '[114.295444,35.748236]');
INSERT INTO `city` VALUES ('132', '新乡', '[113.883991,35.302616]');
INSERT INTO `city` VALUES ('133', '焦作', '[113.238266,35.23904]');
INSERT INTO `city` VALUES ('134', '濮阳', '[115.041299,35.768234]');
INSERT INTO `city` VALUES ('135', '许昌', '[113.826063,34.022956]');
INSERT INTO `city` VALUES ('136', '漯河', '[114.026405,33.575855]');
INSERT INTO `city` VALUES ('137', '三门峡', '[111.194099,34.777338]');
INSERT INTO `city` VALUES ('138', '南阳', '[112.540918,32.999082]');
INSERT INTO `city` VALUES ('139', '商丘', '[115.650497,34.437054]');
INSERT INTO `city` VALUES ('140', '信阳', '[114.075031,32.123274]');
INSERT INTO `city` VALUES ('141', '周口', '[114.649653,33.620357]');
INSERT INTO `city` VALUES ('142', '驻马店', '[114.024736,32.980169]');
INSERT INTO `city` VALUES ('143', '济源', '[112.590047,35.090378]');
INSERT INTO `city` VALUES ('144', '武汉', '[114.298572,30.584355]');
INSERT INTO `city` VALUES ('145', '黄石', '[115.077048,30.220074]');
INSERT INTO `city` VALUES ('146', '十堰', '[110.787916,32.646907]');
INSERT INTO `city` VALUES ('147', '宜昌', '[111.290843,30.702636]');
INSERT INTO `city` VALUES ('148', '襄阳', '[112.144146,32.042426]');
INSERT INTO `city` VALUES ('149', '鄂州', '[114.890593,30.396536]');
INSERT INTO `city` VALUES ('150', '荆门', '[112.204251,31.03542]');
INSERT INTO `city` VALUES ('151', '孝感', '[113.926655,30.926423]');
INSERT INTO `city` VALUES ('152', '荆州', '[112.23813,30.326857]');
INSERT INTO `city` VALUES ('153', '黄冈', '[114.879365,30.447711]');
INSERT INTO `city` VALUES ('154', '咸宁', '[114.328963,29.832798]');
INSERT INTO `city` VALUES ('155', '随州', '[113.37377,31.717497]');
INSERT INTO `city` VALUES ('156', '恩施', '[109.48699,30.283114]');
INSERT INTO `city` VALUES ('157', '仙桃', '[113.453974,30.364953]');
INSERT INTO `city` VALUES ('158', '潜江', '[112.896866,30.421215]');
INSERT INTO `city` VALUES ('159', '天门', '[113.165862,30.653061]');
INSERT INTO `city` VALUES ('160', '神农架', '[110.671525,31.744449]');
INSERT INTO `city` VALUES ('161', '长沙', '[112.982279,28.19409]');
INSERT INTO `city` VALUES ('162', '株洲', '[113.151737,27.835806]');
INSERT INTO `city` VALUES ('163', '湘潭', '[112.944052,27.82973]');
INSERT INTO `city` VALUES ('164', '衡阳', '[112.607693,26.900358]');
INSERT INTO `city` VALUES ('165', '邵阳', '[111.46923,27.237842]');
INSERT INTO `city` VALUES ('166', '岳阳', '[113.132855,29.37029]');
INSERT INTO `city` VALUES ('167', '常德', '[111.691347,29.040225]');
INSERT INTO `city` VALUES ('168', '张家界', '[110.479921,29.127401]');
INSERT INTO `city` VALUES ('169', '益阳', '[112.355042,28.570066]');
INSERT INTO `city` VALUES ('170', '郴州', '[113.032067,25.793589]');
INSERT INTO `city` VALUES ('171', '永州', '[111.608019,26.434516]');
INSERT INTO `city` VALUES ('172', '怀化', '[109.97824,27.550082]');
INSERT INTO `city` VALUES ('173', '娄底', '[112.008497,27.728136]');
INSERT INTO `city` VALUES ('174', '湘西', '[109.739735,28.314296]');
INSERT INTO `city` VALUES ('175', '南京', '[118.767413,32.041544]');
INSERT INTO `city` VALUES ('176', '无锡', '[120.301663,31.574729]');
INSERT INTO `city` VALUES ('177', '徐州', '[117.184811,34.261792]');
INSERT INTO `city` VALUES ('178', '常州', '[119.946973,31.772752]');
INSERT INTO `city` VALUES ('179', '苏州', '[120.619585,31.299379]');
INSERT INTO `city` VALUES ('180', '南通', '[120.864608,32.016212]');
INSERT INTO `city` VALUES ('181', '连云港', '[119.178821,34.600018]');
INSERT INTO `city` VALUES ('182', '淮安', '[119.021265,33.597506]');
INSERT INTO `city` VALUES ('183', '盐城', '[120.139998,33.377631]');
INSERT INTO `city` VALUES ('184', '扬州', '[119.421003,32.393159]');
INSERT INTO `city` VALUES ('185', '镇江', '[119.452753,32.204402]');
INSERT INTO `city` VALUES ('186', '泰州', '[119.915176,32.484882]');
INSERT INTO `city` VALUES ('187', '宿迁', '[118.275162,33.963008]');
INSERT INTO `city` VALUES ('188', '南昌', '[115.892151,28.676493]');
INSERT INTO `city` VALUES ('189', '景德镇', '[117.214664,29.29256]');
INSERT INTO `city` VALUES ('190', '萍乡', '[113.852186,27.622946]');
INSERT INTO `city` VALUES ('191', '九江', '[115.992811,29.712034]');
INSERT INTO `city` VALUES ('192', '新余', '[114.930835,27.810834]');
INSERT INTO `city` VALUES ('193', '鹰潭', '[117.033838,28.238638]');
INSERT INTO `city` VALUES ('194', '赣州', '[114.940278,25.85097]');
INSERT INTO `city` VALUES ('195', '吉安', '[114.986373,27.111699]');
INSERT INTO `city` VALUES ('196', '宜春', '[114.391136,27.8043]');
INSERT INTO `city` VALUES ('197', '抚州', '[116.358351,27.98385]');
INSERT INTO `city` VALUES ('198', '上饶', '[117.971185,28.44442]');
INSERT INTO `city` VALUES ('199', '长春', '[125.3245,43.886841]');
INSERT INTO `city` VALUES ('200', '吉林', '[126.55302,43.843577]');
INSERT INTO `city` VALUES ('201', '四平', '[124.370785,43.170344]');
INSERT INTO `city` VALUES ('202', '辽源', '[125.145349,42.902692]');
INSERT INTO `city` VALUES ('203', '通化', '[125.936501,41.721177]');
INSERT INTO `city` VALUES ('204', '白山', '[126.427839,41.942505]');
INSERT INTO `city` VALUES ('205', '松原', '[124.823608,45.118243]');
INSERT INTO `city` VALUES ('206', '白城', '[122.841114,45.619026]');
INSERT INTO `city` VALUES ('207', '延边', '[129.513228,42.904823]');
INSERT INTO `city` VALUES ('208', '沈阳', '[123.429096,41.796767]');
INSERT INTO `city` VALUES ('209', '大连', '[121.618622,38.91459]');
INSERT INTO `city` VALUES ('210', '鞍山', '[122.995632,41.110626]');
INSERT INTO `city` VALUES ('211', '抚顺', '[123.921109,41.875956]');
INSERT INTO `city` VALUES ('212', '本溪', '[123.770519,41.297909]');
INSERT INTO `city` VALUES ('213', '丹东', '[124.383044,40.124296]');
INSERT INTO `city` VALUES ('214', '锦州', '[121.135742,41.119269]');
INSERT INTO `city` VALUES ('215', '营口', '[122.235151,40.667432]');
INSERT INTO `city` VALUES ('216', '阜新', '[121.648962,42.011796]');
INSERT INTO `city` VALUES ('217', '辽阳', '[123.18152,41.269402]');
INSERT INTO `city` VALUES ('218', '盘锦', '[122.06957,41.124484]');
INSERT INTO `city` VALUES ('219', '铁岭', '[123.844279,42.290585]');
INSERT INTO `city` VALUES ('220', '朝阳', '[120.451176,41.576758]');
INSERT INTO `city` VALUES ('221', '葫芦岛', '[120.856394,40.755572]');
INSERT INTO `city` VALUES ('222', '呼和浩特', '[111.670801,40.818311]');
INSERT INTO `city` VALUES ('223', '包头', '[109.840405,40.658168]');
INSERT INTO `city` VALUES ('224', '乌海', '[106.825563,39.673734]');
INSERT INTO `city` VALUES ('225', '赤峰', '[118.956806,42.275317]');
INSERT INTO `city` VALUES ('226', '通辽', '[122.263119,43.617429]');
INSERT INTO `city` VALUES ('227', '鄂尔多斯', '[109.99029,39.817179]');
INSERT INTO `city` VALUES ('228', '呼伦贝尔', '[119.758168,49.215333]');
INSERT INTO `city` VALUES ('229', '巴彦淖尔', '[107.416959,40.757402]');
INSERT INTO `city` VALUES ('230', '乌兰察布', '[113.114543,41.034126]');
INSERT INTO `city` VALUES ('231', '兴安盟', '[122.070317,46.076268]');
INSERT INTO `city` VALUES ('232', '锡林郭勒盟', '[116.090996,43.944018]');
INSERT INTO `city` VALUES ('233', '阿拉善盟', '[105.706422,38.844814]');
INSERT INTO `city` VALUES ('234', '银川', '[106.278179,38.46637]');
INSERT INTO `city` VALUES ('235', '石嘴山', '[106.376173,39.01333]');
INSERT INTO `city` VALUES ('236', '吴忠', '[106.199409,37.986165]');
INSERT INTO `city` VALUES ('237', '固原', '[106.285241,36.004561]');
INSERT INTO `city` VALUES ('238', '中卫', '[105.189568,37.514951]');
INSERT INTO `city` VALUES ('239', '西宁', '[101.778916,36.623178]');
INSERT INTO `city` VALUES ('240', '海东', '[102.10327,36.502916]');
INSERT INTO `city` VALUES ('241', '海北', '[100.901059,36.959435]');
INSERT INTO `city` VALUES ('242', '黄南', '[102.019988,35.517744]');
INSERT INTO `city` VALUES ('243', '海南', '[100.619542,36.280353]');
INSERT INTO `city` VALUES ('244', '果洛', '[100.242143,34.4736]');
INSERT INTO `city` VALUES ('245', '玉树', '[97.008522,33.004049]');
INSERT INTO `city` VALUES ('246', '海西', '[97.370785,37.374663]');
INSERT INTO `city` VALUES ('247', '济南', '[117.000923,36.675807]');
INSERT INTO `city` VALUES ('248', '青岛', '[120.355173,36.082982]');
INSERT INTO `city` VALUES ('249', '淄博', '[118.047648,36.814939]');
INSERT INTO `city` VALUES ('250', '枣庄', '[117.557964,34.856424]');
INSERT INTO `city` VALUES ('251', '东营', '[118.66471,37.434564]');
INSERT INTO `city` VALUES ('252', '烟台', '[121.391382,37.539297]');
INSERT INTO `city` VALUES ('253', '潍坊', '[119.107078,36.70925]');
INSERT INTO `city` VALUES ('254', '济宁', '[116.587245,35.415393]');
INSERT INTO `city` VALUES ('255', '泰安', '[117.129063,36.194968]');
INSERT INTO `city` VALUES ('256', '威海', '[122.116394,37.509691]');
INSERT INTO `city` VALUES ('257', '日照', '[119.461208,35.428588]');
INSERT INTO `city` VALUES ('258', '莱芜', '[117.677736,36.214397]');
INSERT INTO `city` VALUES ('259', '临沂', '[118.326443,35.065282]');
INSERT INTO `city` VALUES ('260', '德州', '[116.307428,37.453968]');
INSERT INTO `city` VALUES ('261', '聊城', '[115.980367,36.456013]');
INSERT INTO `city` VALUES ('262', '滨州', '[118.016974,37.383542]');
INSERT INTO `city` VALUES ('263', '菏泽', '[115.469381,35.246531]');
INSERT INTO `city` VALUES ('264', '太原', '[112.549248,37.857014]');
INSERT INTO `city` VALUES ('265', '大同', '[113.295259,40.09031]');
INSERT INTO `city` VALUES ('266', '阳泉', '[113.583285,37.861188]');
INSERT INTO `city` VALUES ('267', '长治', '[113.113556,36.191112]');
INSERT INTO `city` VALUES ('268', '晋城', '[112.851274,35.497553]');
INSERT INTO `city` VALUES ('269', '朔州', '[112.433387,39.331261]');
INSERT INTO `city` VALUES ('270', '晋中', '[112.736465,37.696495]');
INSERT INTO `city` VALUES ('271', '运城', '[111.003957,35.022778]');
INSERT INTO `city` VALUES ('272', '忻州', '[112.733538,38.41769]');
INSERT INTO `city` VALUES ('273', '临汾', '[111.517973,36.08415]');
INSERT INTO `city` VALUES ('274', '吕梁', '[111.134335,37.524366]');
INSERT INTO `city` VALUES ('275', '西安', '[108.948024,34.263161]');
INSERT INTO `city` VALUES ('276', '铜川', '[108.979608,34.916582]');
INSERT INTO `city` VALUES ('277', '宝鸡', '[107.14487,34.369315]');
INSERT INTO `city` VALUES ('278', '咸阳', '[108.705117,34.333439]');
INSERT INTO `city` VALUES ('279', '渭南', '[109.502882,34.499381]');
INSERT INTO `city` VALUES ('280', '延安', '[109.49081,36.596537]');
INSERT INTO `city` VALUES ('281', '汉中', '[107.028621,33.077668]');
INSERT INTO `city` VALUES ('282', '榆林', '[109.741193,38.290162]');
INSERT INTO `city` VALUES ('283', '安康', '[109.029273,32.6903]');
INSERT INTO `city` VALUES ('284', '商洛', '[109.939776,33.868319]');
INSERT INTO `city` VALUES ('285', '成都', '[104.065735,30.659462]');
INSERT INTO `city` VALUES ('286', '自贡', '[104.773447,29.352765]');
INSERT INTO `city` VALUES ('287', '攀枝花', '[101.716007,26.580446]');
INSERT INTO `city` VALUES ('288', '泸州', '[105.443348,28.889138]');
INSERT INTO `city` VALUES ('289', '德阳', '[104.398651,31.127991]');
INSERT INTO `city` VALUES ('290', '绵阳', '[104.741722,31.46402]');
INSERT INTO `city` VALUES ('291', '广元', '[105.829757,32.433668]');
INSERT INTO `city` VALUES ('292', '遂宁', '[105.571331,30.513311]');
INSERT INTO `city` VALUES ('293', '内江', '[105.066138,29.58708]');
INSERT INTO `city` VALUES ('294', '乐山', '[103.761263,29.582024]');
INSERT INTO `city` VALUES ('295', '南充', '[106.082974,30.795281]');
INSERT INTO `city` VALUES ('296', '眉山', '[103.831788,30.048318]');
INSERT INTO `city` VALUES ('297', '宜宾', '[104.630825,28.760189]');
INSERT INTO `city` VALUES ('298', '广安', '[106.633369,30.456398]');
INSERT INTO `city` VALUES ('299', '达州', '[107.502262,31.209484]');
INSERT INTO `city` VALUES ('300', '雅安', '[103.001033,29.987722]');
INSERT INTO `city` VALUES ('301', '巴中', '[106.753669,31.858809]');
INSERT INTO `city` VALUES ('302', '资阳', '[104.641917,30.122211]');
INSERT INTO `city` VALUES ('303', '阿坝', '[102.221374,31.899792]');
INSERT INTO `city` VALUES ('304', '甘孜', '[101.963815,30.050663]');
INSERT INTO `city` VALUES ('305', '凉山', '[102.258746,27.886762]');
INSERT INTO `city` VALUES ('306', '乌鲁木齐', '[87.617733,43.792818]');
INSERT INTO `city` VALUES ('307', '克拉玛依', '[84.873946,45.595886]');
INSERT INTO `city` VALUES ('308', '吐鲁番', '[89.184078,42.947613]');
INSERT INTO `city` VALUES ('309', '哈密', '[93.51316,42.833248]');
INSERT INTO `city` VALUES ('310', '昌吉', '[87.304012,44.014577]');
INSERT INTO `city` VALUES ('311', '博尔塔拉', '[82.074778,44.903258]');
INSERT INTO `city` VALUES ('312', '巴音郭楞', '[86.150969,41.768552]');
INSERT INTO `city` VALUES ('313', '阿克苏', '[80.265068,41.170712]');
INSERT INTO `city` VALUES ('314', '克孜勒苏', '[76.172825,39.713431]');
INSERT INTO `city` VALUES ('315', '喀什', '[75.989138,39.467664]');
INSERT INTO `city` VALUES ('316', '和田', '[79.92533,37.110687]');
INSERT INTO `city` VALUES ('317', '伊犁', '[81.317946,43.92186]');
INSERT INTO `city` VALUES ('318', '塔城', '[82.985732,46.746301]');
INSERT INTO `city` VALUES ('319', '阿勒泰', '[88.13963,47.848393]');
INSERT INTO `city` VALUES ('320', '石河子', '[86.041075,44.305886]');
INSERT INTO `city` VALUES ('321', '阿拉尔', '[81.285884,40.541914]');
INSERT INTO `city` VALUES ('322', '图木舒克', '[79.077978,39.867316]');
INSERT INTO `city` VALUES ('323', '五家渠', '[87.526884,44.167401]');
INSERT INTO `city` VALUES ('324', '北屯', '[87.824932,47.353177]');
INSERT INTO `city` VALUES ('325', '铁门关', '[85.501218,41.827251]');
INSERT INTO `city` VALUES ('326', '双河', '[82.353656,44.840524]');
INSERT INTO `city` VALUES ('327', '拉萨', '[91.132212,29.660361]');
INSERT INTO `city` VALUES ('328', '昌都', '[97.178452,31.136875]');
INSERT INTO `city` VALUES ('329', '山南', '[91.766529,29.236023]');
INSERT INTO `city` VALUES ('330', '日喀则', '[88.885148,29.267519]');
INSERT INTO `city` VALUES ('331', '那曲', '[92.060214,31.476004]');
INSERT INTO `city` VALUES ('332', '阿里', '[80.105498,32.503187]');
INSERT INTO `city` VALUES ('333', '林芝', '[94.362348,29.654693]');
INSERT INTO `city` VALUES ('334', '昆明', '[102.712251,25.040609]');
INSERT INTO `city` VALUES ('335', '曲靖', '[103.797851,25.501557]');
INSERT INTO `city` VALUES ('336', '玉溪', '[102.543907,24.350461]');
INSERT INTO `city` VALUES ('337', '保山', '[99.167133,25.111802]');
INSERT INTO `city` VALUES ('338', '昭通', '[103.717216,27.336999]');
INSERT INTO `city` VALUES ('339', '丽江', '[100.233026,26.872108]');
INSERT INTO `city` VALUES ('340', '普洱', '[100.972344,22.777321]');
INSERT INTO `city` VALUES ('341', '临沧', '[100.08697,23.886567]');
INSERT INTO `city` VALUES ('342', '楚雄', '[101.546046,25.041988]');
INSERT INTO `city` VALUES ('343', '红河', '[103.384182,23.366775]');
INSERT INTO `city` VALUES ('344', '文山', '[104.24401,23.36951]');
INSERT INTO `city` VALUES ('345', '西双版纳', '[100.797941,22.001724]');
INSERT INTO `city` VALUES ('346', '大理', '[100.225668,25.589449]');
INSERT INTO `city` VALUES ('347', '德宏', '[98.578363,24.436694]');
INSERT INTO `city` VALUES ('348', '怒江', '[98.854304,25.850949]');
INSERT INTO `city` VALUES ('349', '迪庆', '[99.706463,27.826853]');
INSERT INTO `city` VALUES ('350', '杭州', '[120.153576,30.287459]');
INSERT INTO `city` VALUES ('351', '宁波', '[121.549792,29.868388]');
INSERT INTO `city` VALUES ('352', '温州', '[120.672111,28.000575]');
INSERT INTO `city` VALUES ('353', '嘉兴', '[120.750865,30.762653]');
INSERT INTO `city` VALUES ('354', '湖州', '[120.102398,30.867198]');
INSERT INTO `city` VALUES ('355', '绍兴', '[120.582112,29.997117]');
INSERT INTO `city` VALUES ('356', '金华', '[119.649506,29.089524]');
INSERT INTO `city` VALUES ('357', '衢州', '[118.87263,28.941708]');
INSERT INTO `city` VALUES ('358', '舟山', '[122.106863,30.016028]');
INSERT INTO `city` VALUES ('359', '台州', '[121.428599,28.661378]');
INSERT INTO `city` VALUES ('360', '丽水', '[119.921786,28.451993]');
INSERT INTO `city` VALUES ('361', '台湾', '[121.509062,25.044332]');
INSERT INTO `city` VALUES ('362', '北京', '[116.405285,39.904989]');
INSERT INTO `city` VALUES ('363', '天津', '[117.190182,39.125596]');
INSERT INTO `city` VALUES ('364', '上海', '[121.472644,31.231706]');
INSERT INTO `city` VALUES ('365', '重庆', '[106.504962,29.533155]');
INSERT INTO `city` VALUES ('366', '香港', '[114.173355,22.320048]');
INSERT INTO `city` VALUES ('367', '澳门', '[113.54909,22.198951]');


DROP TABLE IF EXISTS `customer_tag`;
CREATE TABLE `customer_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签编号',
  `name` varchar(30) DEFAULT NULL COMMENT '标签名称',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `customer_tag_relation`;
CREATE TABLE `customer_tag_relation` (
  `customer_id` int(11) DEFAULT NULL COMMENT '客户编号',
  `tag_id` int(11) DEFAULT NULL COMMENT '标签编号',
  `num` int(11) DEFAULT '1' COMMENT '被勾选的数量',
  KEY `customerId_tagId_num` (`customer_id`,`tag_id`,`num`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `staff_comment_plan`;
CREATE TABLE `staff_comment_plan` (
  `plan_id` int(11) NOT NULL COMMENT '计划id',
  `user_id` varchar(30) NOT NULL COMMENT '销售人员id',
  `comment_id` int(11) NOT NULL COMMENT '评论id',
  `is_visit_add` int(11) DEFAULT NULL COMMENT '是否计划、记录添加 0是 1否',
  `is_comment` int(11) DEFAULT NULL COMMENT '是否评论 0未评论 1已评论'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评论与计划关系';

DROP TABLE IF EXISTS `staff_comment_log`;
CREATE TABLE `staff_comment_log` (
  `log_id` int(11) NOT NULL COMMENT '记录id',
  `user_id` varchar(30) NOT NULL COMMENT '销售人员id',
  `comment_id` int(11) NOT NULL COMMENT '评论id',
  `is_visit_add` int(11) DEFAULT NULL COMMENT '是否计划、记录添加 0是 1否',
  `is_comment` int(11) DEFAULT NULL COMMENT '是否评论 0未评论 1已评论'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评论与记录关系';

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `update_time` datetime DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='评论';


DROP VIEW IF EXISTS v_group_customer;
create view v_group_customer as
  select group_staff_relation.group_id,group_staff_relation.user_id,customer.id customer_id,customer.`name` customer_name,customer.mobile customer_mobile,customer.wechat customer_wechat,
    customer.company customer_company,customer.position customer_position,customer.address customer_address,customer.telephone customer_telephone,
    customer.email customer_email,customer.webSite customer_webSite,customer.fax customer_fax,customer.remark customer_remark,customer.update_time customer_update_time
  from group_staff_relation,staff_customer_follow_relation,customer
  where group_staff_relation.user_id = staff_customer_follow_relation.user_id  and staff_customer_follow_relation.is_follow = 1
        and staff_customer_follow_relation.customer_id = customer.id;

drop view if exists v_message_tag;
create view v_message_tag as
  select message_tag_relation.message_id,message_tag_relation.page,message_tag_relation.tag_id,message_tag.`name`
  from message_tag_relation,message_tag
  where message_tag.id = message_tag_relation.tag_id;

drop view if exists v_message_tag_hot;
create view v_message_tag_hot as
  select tag_id,`name`,count(tag_id) tag_num
  from v_message_tag
  group by tag_id;

DROP TABLE IF EXISTS `message_share`;
CREATE TABLE `message_share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `user_id` varchar(30) DEFAULT NULL,
  `push_time` datetime DEFAULT NULL,
  `share_flag` int(2) DEFAULT NULL COMMENT '0：未分享；1：已分享',
  `share_time` datetime DEFAULT NULL,
  `open_count` int(11) DEFAULT 0 COMMENT '客户打开次数',
  `del_flag` int(2) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `messageId` (`message_id`),
  KEY `delFlag_openCount` (`del_flag`,`open_count`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `message_share_customer`;
CREATE TABLE `message_share_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) DEFAULT NULL COMMENT '资料消息分享id',
  `message_id` int(11) DEFAULT NULL,
  `user_id` varchar(30) DEFAULT NULL,
  `customer_id` int(11) DEFAULT '-1',
  `open_id` varchar(32) DEFAULT NULL,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最近更新时间',
  PRIMARY KEY (`id`),
  KEY `messageId` (`message_id`) USING BTREE,
  KEY `userId` (`user_id`) USING BTREE,
  KEY `customerId` (`customer_id`) USING BTREE,
  KEY `share_id` (`share_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户消息分享表';

DROP TABLE IF EXISTS `message_share_customer_area`;
CREATE TABLE `message_share_customer_area` (
  `id` int(11) NOT NULL,
  `cid` varchar(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `message_share_transmit`;
CREATE TABLE `message_share_transmit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) DEFAULT NULL COMMENT '资料分享id',
  `user_id` varchar(30) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL COMMENT '资料消息id',
  `open_id` varchar(30) DEFAULT NULL,
  `transmit_times` int(11) DEFAULT NULL COMMENT '转发次数',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最近更新时间',
  PRIMARY KEY (`id`),
  KEY `openId` (`open_id`) USING BTREE,
  KEY `userId` (`user_id`) USING BTREE,
  KEY `message_id` (`message_id`),
  KEY `share_id` (`share_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='转发记录';


drop view if exists v_message_opencount_time_tag;
create view v_message_opencount_time_tag as
  select message.id,group_message_relation.group_id,vmt.tag_id,vmt.page,vmt.`name` tag_name,ms.open_count,message.msgType,message.title,message.create_user_id,staff.`name` staff_name,message.titleText,message.update_time
  from message
    left join
    group_message_relation
      on message.id = group_message_relation.message_id
    left join
    (select message_tag_relation.message_id,message_tag_relation.page,message_tag_relation.tag_id,message_tag.`name`
     from message_tag_relation,message_tag
     where message_tag.id = message_tag_relation.tag_id) vmt
      on vmt.message_id = message.id
    left join(
               select message_share.message_id,sum(open_count) open_count
               from message_share
               where share_flag = 1
               group by message_id
             ) ms
      on message.id = ms.message_id
    left join staff
      on staff.userid = message.create_user_id;

DROP TABLE IF EXISTS `customer_readinfo`;
CREATE TABLE `customer_readinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) DEFAULT NULL,
  `user_id` varchar(30) DEFAULT NULL,
  `times` int(11) DEFAULT NULL COMMENT '点击阅读次数',
  `message_id` int(11) DEFAULT NULL COMMENT '资料消息id',
  `customer_id` int(11) DEFAULT NULL,
  `open_id` varchar(30) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `cid` varchar(50) DEFAULT '-1',
  `city` varchar(100) DEFAULT NULL,
  `open_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '打开页面时间点',
  `view_time` int(11) DEFAULT '1' COMMENT '平均每页浏览时间',
  `page_count` int(11) DEFAULT NULL COMMENT '页面长度',
  `total_time` int(11) DEFAULT NULL COMMENT '文案阅读总时长',
  `read_info` longtext COMMENT '阅读信息/浏览时长',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最近更新时间',
  PRIMARY KEY (`id`),
  KEY `openId` (`open_id`) USING BTREE,
  KEY `userId` (`user_id`) USING BTREE,
  KEY `customerId` (`customer_id`) USING BTREE,
  KEY `message_id` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='客户阅读详情';

drop view if exists v_share_message;
create view v_share_message
  as (
    select ms.message_id,message.titleText,ms.user_id,ms.oc open_count,ms.share_flag,mst.tt transmit_times,ms.share_time
    from (
           select message_id,user_id,SUM(open_count) oc,share_flag,share_time
           from message_share
           where share_flag = 1 and del_flag = 0
           group by message_id
         ) ms
      LEFT JOIN
      (
        select message_id,user_id,SUM(transmit_times) tt
        from message_share_transmit
        group by message_id
      ) mst
        ON ms.message_id = mst.message_id and ms.user_id = mst.user_id
      LEFT JOIN
      message
        ON ms.message_id = message.id and message.titleText is not NULL
  );

DROP VIEW IF EXISTS v_avg_view_time;
CREATE VIEW v_avg_view_time
  AS (
    SELECT
      cr.customer_id,
      customer.`name`,
      cr.avg_view_time
    FROM
      (SELECT
         customer_id,
         AVG(view_time) avg_view_time
       FROM customer_readinfo
       GROUP BY customer_id) cr
      LEFT JOIN customer
        ON customer.id = cr.customer_id);

DROP VIEW IF EXISTS v_customer_read_times;
CREATE VIEW v_customer_read_times
  AS (
    SELECT
      cr.message_id,
      message.titleText,
      cr.customer_id,
      customer.`name`,
      cr.times
    FROM (
           SELECT
             message_id,
             customer_id,
             sum(times) times
           FROM customer_readinfo
           GROUP BY message_id, customer_id
         ) cr
      LEFT JOIN customer
        ON customer.id = cr.customer_id
      LEFT JOIN message
        ON message.id = cr.message_id);


drop view if exists v_customer_transmit;
create view v_customer_transmit
  as (
    select nmst.customer_id,customer.`name`,nmst.message_id,message.titleText,nmst.transmit_times,nmst.update_time
    from
      (select mst.customer_id,mst.message_id,sum(transmit_times) transmit_times,mst.update_time
       from
         (SELECT customer_id,message_id,transmit_times,update_time
          FROM message_share_transmit
          ORDER BY update_time desc
          limit 999999) mst
       group by customer_id,message_id) nmst
      left join message
        on message.id = nmst.message_id
      left join customer
        on customer.id = nmst.customer_id);
