package com.wzy.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import tk.mybatis.spring.annotation.MapperScan;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ComponentScan({"com.wzy.crm"})
@MapperScan("com.wzy.crm.dao")
public class CrmApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(CrmApplication.class, args);
	}
}
