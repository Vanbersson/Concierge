package com.concierge.apiconcierge.services.user;

import com.concierge.apiconcierge.dtos.file.FileLocalDto;
import com.concierge.apiconcierge.models.message.MessageResponse;
import com.concierge.apiconcierge.models.user.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


public interface IUserService {

    public MessageResponse save(User user);

    public MessageResponse update(User user);

    public MessageResponse listAll(Integer companyId, Integer resaleId);

    public MessageResponse filterId(Integer companyId, Integer resaleId, Integer id);

    public MessageResponse filterRoleId(Integer companyId, Integer resaleId, Integer roleId);

    public MessageResponse filterEmail(Integer companyId, Integer resaleId, String email);

    public MessageResponse saveImage(MultipartFile file, String local);

    public MessageResponse deleteImage(String userEmail);
}
