package com.example.demo.repos.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.mongo.Uniforme;

public interface UniformeRepository extends MongoRepository<Uniforme, String> {
    void deleteByColegioId(String colegioId);
    List<Uniforme> findByColegioId(String colegioId);
}