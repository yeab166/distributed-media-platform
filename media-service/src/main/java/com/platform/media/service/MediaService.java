package com.platform.media.service;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.platform.common.exception.ResourceNotFoundException;
import com.platform.media.model.MediaAsset;
import com.platform.media.repository.MediaRepository;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final ProcessingService processingService;

    public MediaService(MediaRepository mediaRepository, 
                        StorageService storageService, 
                        ProcessingService processingService) {
        this.mediaRepository = mediaRepository;
        this.storageService = storageService;
        this.processingService = processingService;
    }

public MediaAsset uploadMedia(MultipartFile file, Long ownerId) {
        String originalPath = storageService.store(file);

        MediaAsset asset = MediaAsset.builder()
                .fileName(file.getOriginalFilename())
                .originalPath(originalPath)
                .contentType(file.getContentType())
                .size(file.getSize())
                .ownerId(ownerId)
                .uploadDate(LocalDateTime.now())
                .build();

        MediaAsset savedAsset = mediaRepository.save(asset);
        
        // Trigger asynchronous processing
        processingService.processMedia(savedAsset.getId());

        return savedAsset;
    }

    public MediaAsset getMedia(Long id) {
        return mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
    }

    public List<MediaAsset> getUserMedia(Long ownerId) {
        return mediaRepository.findByOwnerId(ownerId);
    }

    public Path getFilePath(Long id) {
        MediaAsset asset = getMedia(id);
        return Path.of(asset.getOriginalPath());
    }

    public void openFileOnDesktop(Long id) {
        MediaAsset asset = getMedia(id);
        try {
            java.io.File file = new java.io.File(asset.getOriginalPath());
            if (java.awt.Desktop.isDesktopSupported()) {
                java.awt.Desktop.getDesktop().open(file);
            } else {
                // Fallback for environments where Desktop is not supported
                String os = System.getProperty("os.name").toLowerCase();
                if (os.contains("win")) {
                    Runtime.getRuntime().exec(new String[]{"cmd", "/c", "start", "", file.getAbsolutePath()});
                } else if (os.contains("mac")) {
                    Runtime.getRuntime().exec(new String[]{"open", file.getAbsolutePath()});
                } else {
                    Runtime.getRuntime().exec(new String[]{"xdg-open", file.getAbsolutePath()});
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not open file: " + e.getMessage());
        }
    }
}
