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
}