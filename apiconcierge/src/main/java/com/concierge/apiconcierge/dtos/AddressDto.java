package com.concierge.apiconcierge.dtos;

public record AddressDto(
        Integer id,
        String cep,
        String address,
        String city) {
}
