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
  KEY `customerId_isCreate` (`customer_id`,`is_create`) USING BTREE
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
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
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

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '组唯一标识',
  `name` varchar(30) DEFAULT NULL COMMENT '组名',
  `corpid` varchar(30) DEFAULT NULL COMMENT '授权方企业微信id',
  `def_group` int(1) DEFAULT '0' COMMENT '组 0新增 1默认 2公司',
  `create_group` int(11) DEFAULT NULL COMMENT '当del_group=1时，值代表成员主键（staff_id）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

INSERT INTO `group`(`name`,`corpid`,`def_group`,`create_group`)VALUES
('admin的默认组','wx4b8e52ee9877a5be',1,'1000'),
('admin3的默认组','wx4b8e52ee9877a5be',1,'1001'),
('hdy的默认组','wx4b8e52ee9877a5be',1,'1003'),
('mike的默认组','wx4b8e52ee9877a5be',1,'1005'),
('蚂蚁技术','wwd700d514cc421397',2,'1000');


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

INSERT INTO `message`(`corp_id`,`suite_id`,`corpid`,`msgType`,`titleText`,`title`
,`descriptionText`,`description`,`url`,`picurl`,`btntxt`,`coverPicAttach`
,`contentAttach`,`third_params`,`pageCount`,`create_userId`,`update_time`
,`status`,`delFlag`)VALUES
('wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '大辣娇--加1元再来1桶', '大辣娇--加1元再来1桶'
, null, '/module/web/message/h5/page/3e29e698-7995-4f0f-9443-29bc3ecbd717/neUzquH', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', '', '阅读全文', '[]'
, '[]', '{"d":"neUzquH\","type":"rabbitpre","url":"http://v1.rabbitpre.com/m/neUzquH"}', '16', '1000', '2018-01-27 16:11:49', '1', '0'),
('wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '5', '腊八节/腊八粥/传统节日/企业宣传祝福', '腊八节/腊八粥/传统节日/企业宣传祝福'
, null, '/module/web/message/h5/page/ead64920-f3ef-462c-85f8-3bfe9273cf8c/y7AQQuiFp', 'http://crm.youitech.com/module/web/message/h5/h5-share.html', '', '阅读全文', '[]'
, '[]', '{"d":"y7AQQuiFp","type":"rabbitpre","url":"http://v1.rabbitpre.com/m/y7AQQuiFp"}', '7', '1000', '2018-01-24 10:13:44', '1', '0'),
('wx4b8e52ee9877a5be', 'wx9b2b1532fd370525', 'wx4b8e52ee9877a5be', '1', '企业微信注册', '<p>企业微信注册</p>'
, ' 以下是简单的注册「企业微信 / 微信企业号」操作步骤：1、登录【微信企业号官网/企业微信官网】-【企业注册】 2、填写【企业信息&管理员信息】★温馨提示：','<p>★温馨提示</p>','http://crm.youitech.com/module/web/message/message-share.html', '', '阅读全文', '[]'
, '[]', null, '1', '1000', '2017-12-07 08:11:49', '1', '0');

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

INSERT INTO `group_staff_relation`(`group_id`,`staff_id`,`def_group`)VALUES
('30','1000',1),
('31','1001',1),
('32','1003',1),
('34','1000',0),
('34','1001',0),
('34','1003',0);

DROP TABLE IF EXISTS `message_share`;
CREATE TABLE `message_share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `push_time` datetime DEFAULT NULL,
  `share_flag` int(2) DEFAULT NULL COMMENT '0：未分享；1：已分享',
  `share_time` datetime DEFAULT NULL,
  `open_count` int(11) DEFAULT NULL COMMENT '客户打开次数',
  `del_flag` int(2) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `messageId` (`message_id`),
  KEY `delFlag_openCount` (`del_flag`,`open_count`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `message_tag_relation`;
CREATE TABLE `message_tag_relation` (
  `message_id` int(11) DEFAULT NULL COMMENT '消息编号',
  `tag_id` int(11) DEFAULT NULL COMMENT '标签编号',
  `page` int(11) DEFAULT '1' COMMENT '第几页',
   KEY `messageId_tagId` (`message_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `message_share` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `push_time` datetime DEFAULT NULL,
  `share_flag` int(2) DEFAULT NULL COMMENT '0：未分享；1：已分享',
  `share_time` datetime DEFAULT NULL,
  `open_count` int(10) DEFAULT NULL COMMENT '客户打开次数',
  `del_flag` int(2) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `messageId` (`message_id`),
  KEY `delFlag_openCount` (`del_flag`,`open_count`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='员工消息分享表';


CREATE TABLE `message_share_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT '-1',
  `engine` varchar(20) DEFAULT NULL,
  `deviceName` varchar(20) DEFAULT NULL,
  `deviceVersion` varchar(20) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `browserName` varchar(20) DEFAULT NULL,
  `browserVersion` varchar(20) DEFAULT NULL,
  `major` varchar(10) DEFAULT NULL,
  `orientation` int(2) DEFAULT NULL COMMENT '0：横屏；1：竖屏',
  `ip` varchar(20) DEFAULT NULL,
  `cid` varchar(50) DEFAULT '-1',
  `city` varchar(100) DEFAULT NULL,
  `open_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '打开页面时间点',
  `view_time` int(11) DEFAULT '1' COMMENT '浏览时间',
  `read_info` longtext COMMENT '阅读信息/浏览时长',
  `same_id` int(11) DEFAULT '-1',
  `times` int(11) DEFAULT '-1' COMMENT '传播链上的位置，1销售员 2客户 3客户...（依次类推）',
  `times_flag` int(11) DEFAULT '0' COMMENT '有无转发 1转发 0无转发',
  `pre_times_id` int(11) DEFAULT '-1' COMMENT '前一个转发的id',
  `uid` varchar(255) DEFAULT NULL COMMENT '上一个转发的uid',
  `cur_uid` varchar(255) DEFAULT NULL COMMENT '当前打开的uid',
  PRIMARY KEY (`id`),
  KEY `customerId_timesFlag_shareId` (`customer_id`,`times_flag`,`share_id`) USING BTREE,
  KEY `shareId` (`share_id`),
  KEY `shareId_staffId` (`share_id`,`staff_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='客户消息分享表';


CREATE TABLE `message_share_customer_area` (
  `id` int(11) NOT NULL,
  `cid` varchar(11) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `message_share_uid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `share_id` int(11) DEFAULT NULL COMMENT '分享编号',
  `share_detail_id` int(11) DEFAULT NULL COMMENT '分享记录编号',
  `ip` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL COMMENT '地区',
  `province_py` varchar(50) DEFAULT NULL COMMENT '省份拼音',
  `address_code` varchar(50) DEFAULT NULL COMMENT '地区编码',
  `point` varchar(50) DEFAULT NULL COMMENT '坐标',
  `time` datetime DEFAULT NULL COMMENT '分享时间',
  `uid` varchar(255) DEFAULT NULL COMMENT '分享页面的uid',
  `customer_id` int(11) DEFAULT '-1' COMMENT '客户编号',
  PRIMARY KEY (`id`),
  KEY `customerId_shareId` (`customer_id`,`share_id`) USING BTREE,
  KEY `shareId_shareDetailId` (`share_id`,`share_detail_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COMMENT='转发、分享记录';

CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8;

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
