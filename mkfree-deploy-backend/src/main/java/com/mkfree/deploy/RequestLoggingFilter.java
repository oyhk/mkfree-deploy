package com.mkfree.deploy;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ReadListener;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.*;


/**
 * Created by oyhk on 17-11-17.
 *
 * 统一http 请求 -> 响应 日志
 */
public class RequestLoggingFilter extends OncePerRequestFilter {

    private Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();



        String uri = request.getRequestURI();
        if(uri.contains("favicon.ico")){
            filterChain.doFilter(request, response);
            return;
        }

        CachedRequestWrapper requestWrapper = new CachedRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        String method = requestWrapper.getMethod();

        String queryString = requestWrapper.getQueryString();
        if (StringUtils.isNotBlank(queryString)) {
            uri += "?" + queryString;
        }
        log.info("=> [{}] {} {} ", startTime, method, uri);
        byte[] requestBodyByte = requestWrapper.toByteArray();
        if (requestBodyByte.length > 0) {
            log.info("=> [{}] {} {} , request body:\n{}", startTime, method, uri, new String(requestBodyByte));
        }
        filterChain.doFilter(requestWrapper, responseWrapper);
        String responseBody = this.getContentAsString(responseWrapper.getContentAsByteArray(), request.getCharacterEncoding());
        if (StringUtils.isNotBlank(responseBody)) {
            log.info("=> [{}] {} {} , response body:\n{}", startTime, method, uri, responseBody);
        }
        log.info("<= [{}] {} {} , processing time {} ms ", startTime, method, uri, (System.currentTimeMillis() - startTime));
        responseWrapper.copyBodyToResponse();
    }

    private String getContentAsString(byte[] buf, String charsetName) throws UnsupportedEncodingException {
        if (buf == null || buf.length == 0)
            return "";
        int length = Math.min(buf.length, 8192);
        return new String(buf, 0, length, charsetName);
    }

    public class CachedRequestWrapper extends HttpServletRequestWrapper {
        private final byte[] cachedBody;

        CachedRequestWrapper(HttpServletRequest request) throws IOException {
            super(request);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            IOUtils.copy(request.getInputStream(), bos);
            cachedBody = bos.toByteArray();
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {
            return new CachedServletInputStream();
        }

        byte[] toByteArray() {
            return cachedBody;
        }

        private class CachedServletInputStream extends ServletInputStream {
            private InputStream baseInputStream;

            CachedServletInputStream() throws IOException {
                baseInputStream = new ByteArrayInputStream(cachedBody);
            }

            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener listener) {

            }

            @Override
            public int read() throws IOException {
                return baseInputStream.read();
            }
        }
    }
}