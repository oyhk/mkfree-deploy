package com.mkfree.deploy;

import com.mkfree.deploy.common.BusinessException;
import com.mkfree.deploy.common.CheckException;
import com.mkfree.deploy.common.JsonResult;
import com.mkfree.deploy.common.RemindException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Optional;

@ControllerAdvice
public class ApiResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    private Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleExceptions(Exception e, WebRequest request)   { 
        HttpStatus status = HttpStatus.OK;
        HttpHeaders headers = new HttpHeaders();
        JsonResult<Throwable> restResult = new JsonResult<Throwable>(JsonResult.CD0[0],JsonResult.CD0[1]);
        if (e instanceof RemindException) {
            restResult = buildJsonResultForRemindException(e) ;
        } else if (e instanceof CheckException) {
            restResult = buildJsonResultForCheckException(e) ;
        } else if (e instanceof BusinessException) {
            restResult = buildJsonResultForBusinessException(e) ;
        }else {
            log.error(ExceptionUtils.getStackTrace(e));
        } 
        headers.add("Content-Type", "application/json;charset=UTF-8");
        return handleExceptionInternal(e, restResult, headers, status, request);
    }
    
    private JsonResult<Throwable> buildJsonResultForBusinessException(Throwable e ) {
        JsonResult<Throwable> restResult = new JsonResult<>();
        if(e  instanceof BusinessException) { 
            restResult.code = Optional.ofNullable(((BusinessException) e ).code).orElse(JsonResult.CD0[0]) ;    
            restResult.desc = ((BusinessException) e ).desc; 
        }
        return restResult ;
    }
    
    private JsonResult<Throwable> buildJsonResultForCheckException(Throwable e ) {
        JsonResult<Throwable> restResult = new JsonResult<>();
        if(e  instanceof CheckException) {             
            restResult.code = Optional.ofNullable(((CheckException) e ).code).orElse(JsonResult.CD2[0]) ;
            restResult.desc = ((CheckException) e ).desc; 
        }
        return restResult ;
    }
    
    private JsonResult<Throwable> buildJsonResultForRemindException(Throwable e ) {
        JsonResult<Throwable> restResult = new JsonResult<>();
        if(e  instanceof RemindException) { 
            restResult.code = Optional.ofNullable(((RemindException) e ).code).orElse(JsonResult.CD3[0]) ;  
            restResult.desc = ((RemindException) e ).desc; 
        }
        return restResult ;
    }
    


}