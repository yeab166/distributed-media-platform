package com.platform.media.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "media_assets")
public class MediaAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalPath;

    private String processedPath;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long size;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    public MediaAsset() {}

    public MediaAsset(Long id, String fileName, String originalPath, String processedPath, String contentType, Long size, Long ownerId, LocalDateTime uploadDate) {
        this.id = id;
        this.fileName = fileName;
        this.originalPath = originalPath;
        this.processedPath = processedPath;
        this.contentType = contentType;
        this.size = size;
        this.ownerId = ownerId;
        this.uploadDate = uploadDate;
    }

    public static MediaAssetBuilder builder() {
        return new MediaAssetBuilder();
    }

    public static class MediaAssetBuilder {
        private Long id;
        private String fileName;
        private String originalPath;
        private String processedPath;
        private String contentType;
        private Long size;
        private Long ownerId;
        private LocalDateTime uploadDate;

        public MediaAssetBuilder id(Long id) { this.id = id; return this; }
        public MediaAssetBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public MediaAssetBuilder originalPath(String originalPath) { this.originalPath = originalPath; return this; }
        public MediaAssetBuilder processedPath(String processedPath) { this.processedPath = processedPath; return this; }
        public MediaAssetBuilder contentType(String contentType) { this.contentType = contentType; return this; }
        public MediaAssetBuilder size(Long size) { this.size = size; return this; }
        public MediaAssetBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public MediaAssetBuilder uploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; return this; }

        public MediaAsset build() {
            return new MediaAsset(id, fileName, originalPath, processedPath, contentType, size, ownerId, uploadDate);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getOriginalPath() { return originalPath; }
    public void setOriginalPath(String originalPath) { this.originalPath = originalPath; }
    public String getProcessedPath() { return processedPath; }
    public void setProcessedPath(String processedPath) { this.processedPath = processedPath; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
}
