package com.platform.media.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.platform.media.model.MediaAsset;
import com.platform.media.repository.MediaRepository;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class ProcessingService {

    private static final Logger log = LoggerFactory.getLogger(ProcessingService.class);
    private final MediaRepository mediaRepository;

    public ProcessingService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    
@Async
    public void processMedia(Long mediaId) {
        MediaAsset asset = mediaRepository.findById(mediaId).orElse(null);
        if (asset == null) return;

        try {
            if (asset.getContentType().startsWith("image")) {
                processImage(asset);
            } else if (asset.getContentType().startsWith("video")) {
                processVideo(asset);
            }
        } catch (Exception e) {
            log.error("Error processing media {}: {}", mediaId, e.getMessage());
        }
    }

    private void processImage(MediaAsset asset) throws IOException {
        Path originalPath = Paths.get(asset.getOriginalPath());
        String fileName = originalPath.getFileName().toString();
        
        // Define processed path (e.g., thumbnail)
        Path processedRoot = originalPath.getParent().getParent().resolve("processed");
        Path targetPath = processedRoot.resolve("thumb_" + fileName);

        Thumbnails.of(originalPath.toFile())
                .size(300, 300)
                .outputQuality(0.8)
                .toFile(targetPath.toFile());

        asset.setProcessedPath(targetPath.toString());
        mediaRepository.save(asset);
        log.info("Processed image saved at: {}", targetPath);
    }

    private void processVideo(MediaAsset asset) {
        // Implementation for FFmpeg could go here
        log.info("Video processing placeholder for: {}", asset.getFileName());
    }
}
