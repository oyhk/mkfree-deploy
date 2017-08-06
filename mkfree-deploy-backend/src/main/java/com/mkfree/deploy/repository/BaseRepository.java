package com.mkfree.deploy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

/**
 * Created by oyhk on 2017/4/13.
 */
@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {

    @Transactional
    public void softDelete(T entity);

    @Transactional
    public void softDelete(ID id);

    @Transactional
    public void softDelete(Iterable<? extends T> entities);

    @Transactional
    public void softDeleteInBatch(Iterable<T> entities);
}


