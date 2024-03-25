package com.concierge.apiconcierge.dtos;

public record AddressDto(
        Integer id,
        String state,
        String city,
        String zipCode,
        String address
        ) {
}
