package com.platform.sharing.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shares")
public class Share {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long mediaId;

    @Column(nullable = false)
    private Long ownerId;

    private Long targetUserId; // null if public link

    @Column(unique = true)
    private String shareToken; // UUID for public access

    @Column(nullable = false)
    private String accessType; // READ, EDIT

    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Share() {}

    public Share(Long id, Long mediaId, Long ownerId, Long targetUserId, String shareToken, String accessType, LocalDateTime expiryDate, LocalDateTime createdAt) {
        this.id = id;
        this.mediaId = mediaId;
        this.ownerId = ownerId;
        this.targetUserId = targetUserId;
        this.shareToken = shareToken;
        this.accessType = accessType;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
    }

    public static ShareBuilder builder() {
        return new ShareBuilder();
    }

    public static class ShareBuilder {
        private Long id;
        private Long mediaId;
        private Long ownerId;
        private Long targetUserId;
        private String shareToken;
        private String accessType;
        private LocalDateTime expiryDate;
        private LocalDateTime createdAt;

        public ShareBuilder id(Long id) { this.id = id; return this; }
        public ShareBuilder mediaId(Long mediaId) { this.mediaId = mediaId; return this; }
        public ShareBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public ShareBuilder targetUserId(Long targetUserId) { this.targetUserId = targetUserId; return this; }
        public ShareBuilder shareToken(String shareToken) { this.shareToken = shareToken; return this; }
        public ShareBuilder accessType(String accessType) { this.accessType = accessType; return this; }
        public ShareBuilder expiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; return this; }
        public ShareBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Share build() {
            return new Share(id, mediaId, ownerId, targetUserId, shareToken, accessType, expiryDate, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMediaId() { return mediaId; }
    public void setMediaId(Long mediaId) { this.mediaId = mediaId; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }
    public String getShareToken() { return shareToken; }
    public void setShareToken(String shareToken) { this.shareToken = shareToken; }
    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
