package com.example.enchere.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.*;
import io.minio.http.Method;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
@Service
public class ImageServiceImpl implements ImageService{
    private MinioClient minioClient;
    public ImageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public static final String IMAGE_SIZE_ERROR_MESSAGE= "La taille de l'image ne peut pas dépasser 2 Mo.";
    public static final String IMAGE_SAVE_ERROR_MESSAGE = "Une erreur s'est produite lors de l'enregistrement de l'image.";

    @Override
    public String addImage(Object entity, MultipartFile multipartFile) {
        try {
            long maxSize = 2 * 1024 * 1024;
            if(multipartFile.getSize() > maxSize){
                return null;
            }
            String nomImage = multipartFile.getOriginalFilename();
            String dossierDestination = "images";
            String cheminDestination = dossierDestination + "/" + nomImage;
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket("enchere")
                            .object(cheminDestination)
                            .stream(multipartFile.getInputStream(), multipartFile.getSize(), -1)
                            .build()
            );
            return cheminDestination;

        } catch (IOException | InvalidKeyException | NoSuchAlgorithmException | ServerException | InsufficientDataException | ErrorResponseException | XmlParserException | InternalException | InvalidResponseException e) {
            e.printStackTrace();
            return null;
        }

    }

    @Override
    public String getPrivateImageUrl(String bucketName, String ObjectName) {
        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(ObjectName)
                            .method(Method.GET)
                            .build()
            );
            return url;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }

    }

    @Override
    public boolean updateImage(Object entity, MultipartFile newImage, String objectName) {
        try {
            long maxSize = 2 * 1024 * 1024;
            if(newImage.getSize() > maxSize){
                return false;
            }
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket("enchere")
                            .object(objectName)
                            .stream(newImage.getInputStream(), newImage.getSize(), -1)
                            .build()
            );
            return true;

        } catch (IOException | InvalidKeyException | NoSuchAlgorithmException | ServerException | InsufficientDataException | ErrorResponseException | XmlParserException | InternalException | InvalidResponseException e) {
            e.printStackTrace();
            return false;
        }
    }
}