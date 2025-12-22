package com.concierge.apiconcierge.controllers.file;

import com.concierge.apiconcierge.dtos.file.FileLocalDto;
import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/file")
public class FileUploadController {

    @Value("${local.image.upload}")
    private String UPLOAD_DIR;

    @PostMapping("/upload/image")
    public ResponseEntity<Object> uploadImage(@RequestParam("file") MultipartFile file,
                                              @RequestParam("local") String local) {
        try {
            // Criação do diretório, se não existir
            File directory = new File(UPLOAD_DIR + local);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Nome do arquivo
            Path filePath = Paths.get(UPLOAD_DIR + local + file.getOriginalFilename());

            // Salvar o arquivo
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retornar o caminho do arquivo salvo
            Map<String, String> map = new HashMap<>();
            map.put("url", "/images/" + local + file.getOriginalFilename());

            MessageResponse response = new MessageResponse();
            response.setStatus(ConstantsMessage.SUCCESS);
            response.setHeader("Imagem");
            response.setMessage("Salva com socesso.");
            response.setData(map);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(e.getMessage()));
        }

    }

    @PostMapping("/delete/image")
    public ResponseEntity<Object> deleteImage(@RequestBody FileLocalDto fileLocal) {
        try {
            Path basePath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

            Path filePath = basePath.resolve(fileLocal.local()).normalize();

            MessageResponse response = new MessageResponse();
            response.setHeader("Imagem");

            // Proteção contra path traversal
            if (!filePath.startsWith(basePath)) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setMessage("Caminho invalido.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
                response.setStatus(ConstantsMessage.ERROR);
                response.setMessage("Imagem não encontrada.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Files.delete(filePath);

            response.setStatus(ConstantsMessage.SUCCESS);
            response.setMessage("Excluída com socesso.");

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(e.getMessage()));
        }
    }

}
