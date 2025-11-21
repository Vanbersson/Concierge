package com.concierge.apiconcierge.dtos.notification;

import java.util.UUID;

public record NotificationUserDto(Integer companyId,
                                  Integer resaleId,
                                  UUID id,
                                  UUID notificationId,
                                  Integer userId
                                  ) {
}
