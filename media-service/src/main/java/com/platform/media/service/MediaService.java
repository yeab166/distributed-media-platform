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

}