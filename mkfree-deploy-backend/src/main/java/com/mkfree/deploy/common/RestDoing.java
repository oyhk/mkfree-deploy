package com.mkfree.deploy.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.transaction.NoTransactionException;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by oyhk on 16/2/18.
 */
@FunctionalInterface
public interface RestDoing<T> extends BaseDoing<T> {

    default JsonResult<T> go(Logger log) {
        return this.invoke(null, null, null, null, log);
    }

    default JsonResult<T> go(HttpServletRequest r, Logger log) {
        return this.invoke(null, null, r, null, log);
    }

    default JsonResult<T> go(HttpServletRequest r, ObjectMapper objectMapper, Logger log) {
        return this.invoke(null, null, r, objectMapper, log);
    }

    default JsonResult<T> go(Object visitor, HttpServletRequest request, ObjectMapper objectMapper, Logger log) {
        return this.invoke(null, visitor, request, objectMapper, log);
    }

    default JsonResult<T> go(Object inputData, Object visitor, HttpServletRequest request, ObjectMapper objectMapper, Logger log) {
        return this.invoke(inputData, visitor, request, objectMapper, log);
    }

    default JsonResult<T> invoke(Object inputData, Object visitor, HttpServletRequest request, ObjectMapper objectMapper, Logger log) {
        Long startTime = System.currentTimeMillis();
        log.info("current run method {} -------------------------------------------------------------------", Thread.currentThread().getStackTrace()[3].getMethodName());
        JsonResult<T> jr = new JsonResult();
        try {
            this.showVisitor(visitor, objectMapper, log);
            this.showParams(request, log);
            if (objectMapper != null && inputData != null) {
                log.info("request body : {}", objectMapper.writeValueAsString(inputData));
            }
            this.service(jr);
        } catch (Exception e) {
            try {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            } catch (NoTransactionException e1) {
            }
            this.errorLog(log, e, jr);
            jr.code = JsonResult.CD0[0];
            jr.desc = JsonResult.CD0[1];
        } finally {
            this.showReturnData(jr, objectMapper, log);
            log.info("current run method {} , processing time {} ms -------------------------------------------", Thread.currentThread().getStackTrace()[3].getMethodName(), (System.currentTimeMillis() - startTime));
        }
        return jr;
    }


    void service(JsonResult<T> jsonResult) throws Exception;

}
