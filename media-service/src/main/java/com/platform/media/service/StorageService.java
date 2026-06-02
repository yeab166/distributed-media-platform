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
    
public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new PlatformException("Failed to store empty file.");
            }
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.originalPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            return targetLocation.toString();
        } catch (IOException e) {
            throw new PlatformException("Failed to store file: " + e.getMessage());
        }
    }
    public Path load(String filename) {
        return originalPath.resolve(filename);
    }
    public Path getOriginalPath(String fileName) {
        return originalPath.resolve(fileName);
    }

    public Path getProcessedPath(String fileName) {
        return processedPath.resolve(fileName);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }