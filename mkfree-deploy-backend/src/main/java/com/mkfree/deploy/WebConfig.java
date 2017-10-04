package com.mkfree.deploy;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mkfree.deploy.domain.User;
import com.mkfree.deploy.interceptor.RoleInterceptor;
import com.mkfree.deploy.interceptor.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;

@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private UserInterceptor userInterceptor;
    @Autowired
    private RoleInterceptor roleInterceptor;


    /**
     * 配置react 路由
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/*.js", "/*.css").addResourceLocations("classpath:/templates/");
        // 这里注意 classpath:/templates/ 为跟路径，如果访问路径为 /static/index-bg.jpg 那么需要添加 /static/static/index-bg.jpg,所以现在我把addResourceLocations 改成classpath:/templates/static/
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/templates/static/");
        registry.setOrder(-1); // 这个是非常重要的

    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        super.configureMessageConverters(converters);
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();

        builder.dateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        //重新配置 json 的输出格式 驼峰标示 转为 下划线(helloWorld => hello_world)
//        builder.propertyNamingStrategy(new PropertyNamingStrategy.LowerCaseWithUnderscoresStrategy());
        builder.serializationInclusion(JsonInclude.Include.NON_NULL);
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter(builder.build());
        converters.add(mappingJackson2HttpMessageConverter);
    }

    /**
     * 允许跨域请求
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        super.addInterceptors(registry);
        registry.addInterceptor(userInterceptor).addPathPatterns("/api/**").excludePathPatterns("/api/user/login");
        registry.addInterceptor(roleInterceptor).addPathPatterns("/api/user/**", "/api/server_machine/**").excludePathPatterns("/api/user/login","/api/server_machine/page");
    }


}