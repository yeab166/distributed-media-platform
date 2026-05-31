package com.platform.media.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.platform.common.exception.PlatformException;

import jakarta.annotation.PostConstruct;

@Service
public class StorageService {

    @Value("${storage.upload-dir:segments}")
    private String uploadDir;

    private Path rootPath;
    private Path originalPath;
    private Path processedPath;

    @PostConstruct
    public void init() {
        try {
            rootPath = Paths.get(uploadDir);
            originalPath = rootPath.resolve("original");
            processedPath = rootPath.resolve("processed");
            
            Files.createDirectories(originalPath);
            Files.createDirectories(processedPath);
        } catch (IOException e) {
            throw new PlatformException("Could not initialize storage: " + e.getMessage());
        }
    }
}