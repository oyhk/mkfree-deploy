package com.mkfree.deploy.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.mkfree.deploy.domain.enumclass.Whether;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by oyhk on 14-6-21.
 *
 * 自动递增的工具
 *
 */
@MappedSuperclass
@JsonInclude(JsonInclude.Include.NON_NULL)//如果为空的属性，去除
@JsonIgnoreProperties(value = {"updatedAt", "isDelete"})
public class IDEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;
    @Column(columnDefinition = " timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP")
    protected Date createdAt = new Date();
    @Column(columnDefinition = " timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    protected Date updatedAt = new Date();
    @Column(columnDefinition = "varchar (20) default 'NO' comment '是否逻辑删除 (是:YES,否:NO)'")
    @Enumerated(EnumType.STRING)
    protected Whether isDelete = Whether.NO;

    public static final String CHECK_IDENTIFIER_IS_NOT_NULL = "唯一标识不能为空";
    public static final String CHECK_BODY_IS_NOT_NULL = "body 不能为空";
    public static final String REMIND_RECORD_IS_NOT_EXIST = "记录不存在";
    public static final String ATTR_PAGE="page";

    public IDEntity() {
    }

    public IDEntity(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Whether getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Whether isDelete) {
        this.isDelete = isDelete;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        IDEntity idEntity = (IDEntity) o;

        return id.equals(idEntity.id);

    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
