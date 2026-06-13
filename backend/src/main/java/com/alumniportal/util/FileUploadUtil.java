package com.alumniportal.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String subfolder) throws IOException {
        String folder = uploadDir + subfolder + "/";
        Path uploadPath = Paths.get(folder);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + subfolder + "/" + filename;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty())
            return;
        try {
            String relativePath = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't fail
        }
    }

    public boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null &&
                (contentType.equals("image/jpeg") || contentType.equals("image/png") ||
                        contentType.equals("image/gif") || contentType.equals("image/webp"));
    }

    public boolean isValidPdfFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.equals("application/pdf");
    }
}
