package com.platform.sharing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.platform.sharing", "com.platform.common"})
public class SharingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SharingServiceApplication.class, args);
    }
}
