package com.concierge.apiconcierge.controllers.email;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.concierge.apiconcierge.dtos.budget.BudgetDto;
import com.concierge.apiconcierge.dtos.email.EmailDto;
import com.concierge.apiconcierge.dtos.message.MessageResponseDto;
import com.concierge.apiconcierge.models.budget.Budget;
import com.concierge.apiconcierge.models.budget.BudgetItemPart;
import com.concierge.apiconcierge.models.budget.BudgetItemRequisition;
import com.concierge.apiconcierge.models.budget.BudgetItemService;
import com.concierge.apiconcierge.models.budget.enums.StatusBudgetEnum;
import com.concierge.apiconcierge.models.clientcompany.ClientCompany;
import com.concierge.apiconcierge.services.budget.BudgetService;
import com.concierge.apiconcierge.services.budget.part.BudgetItemPartService;
import com.concierge.apiconcierge.services.budget.requisition.BudgetItemRequisitionService;
import com.concierge.apiconcierge.services.budget.service.BudgetItemServiceService;
import com.concierge.apiconcierge.services.clientcompany.ClientCompanyService;
import com.concierge.apiconcierge.services.email.EmailService;
import com.concierge.apiconcierge.services.vehicle.VehicleEntryService;
import com.concierge.apiconcierge.util.ConstantsMessage;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    EmailService service;

    @Value("token.email.secret")
    private String secret;

    @Autowired
    private BudgetService budgetService;
    @Autowired
    BudgetItemRequisitionService budgetItemRequisitionService;
    @Autowired
    private BudgetItemServiceService budgetItemServiceService;
    @Autowired
    private BudgetItemPartService budgetItemPartService;

    @Autowired
    private ClientCompanyService clientCompanyService;
    @Autowired
    private VehicleEntryService vehicleEntryService;

    @PostMapping("/send")
    public ResponseEntity<Object> sendEmail(@RequestBody EmailDto data) {
        try {
            String message = this.service.send(data);
            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(message));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/token/{companyId}/{resaleId}/{numberBudget}")
    public ResponseEntity<Object> tokenEmail(@PathVariable(name = "companyId") String companyId,
                                             @PathVariable(name = "resaleId") String resaleId,
                                             @PathVariable(name = "numberBudget") String numberBudget) {
        try {

            Algorithm algorithm = Algorithm.HMAC256(secret);
            Instant inst = LocalDateTime.now().plusHours(12).toInstant(ZoneOffset.of("-03:00"));

            String token = JWT.create()
                    .withIssuer("AtenaTruck")
                    .withSubject(companyId + ";" + resaleId + ";" + numberBudget)
                    .withExpiresAt(inst)
                    .sign(algorithm);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(token));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @GetMapping("/token/valid/{token}")
    public ResponseEntity<Object> validTokenEmail(@PathVariable(name = "token") String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String result = JWT.require(algorithm)
                    .withIssuer("AtenaTruck")
                    .build()
                    .verify(token)
                    .getSubject();

            String[] dados = result.split(";");

            Map<String, Object> budget = this.budgetService.filterBudgetId(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(dados[2]));
            if (budget.get("status") != StatusBudgetEnum.PendingApproval) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto("Not found."));
            }

            List<BudgetItemRequisition> listReq = this.budgetItemRequisitionService.listAllRequisition(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(dados[2]));

            List<BudgetItemService> listSer = this.budgetItemServiceService.listAllServices(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(dados[2]));

            List<BudgetItemPart> listParts = this.budgetItemPartService.listAllParts(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(dados[2]));

            ClientCompany client = this.clientCompanyService.filterId(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(budget.get("clientCompanyId").toString()));

            Map<String, Object> vehicle = this.vehicleEntryService.filterId(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(budget.get("vehicleEntryId").toString()));

            Map<String, Object> complete = new HashMap<>();
            complete.put("Budget", budget);
            complete.put("BudgetItemRequisition", listReq);
            complete.put("BudgetItemService", listSer);
            complete.put("BudgetItemPart", listParts);
            complete.put("Client", client);
            complete.put("Vehicle", vehicle);

            return ResponseEntity.status(HttpStatus.OK).body(complete);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }

    @PostMapping("/status/update/{token}")
    public ResponseEntity<Object> statusUpdateBudget(@PathVariable(name = "token") String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String result = JWT.require(algorithm)
                    .withIssuer("AtenaTruck")
                    .build()
                    .verify(token)
                    .getSubject();

            String[] dados = result.split(";");
            Budget budget = this.budgetService.filterId(Integer.parseInt(dados[0]), Integer.parseInt(dados[1]), Integer.parseInt(dados[2]));
            if (budget == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto("Not found."));
            }

            if (budget.getStatus() != StatusBudgetEnum.PendingApproval) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto("Not found."));
            }

            budget.setStatus(StatusBudgetEnum.Approved);
            this.budgetService.statusUpdate(budget);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponseDto(ConstantsMessage.SUCCESS));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto(ex.getMessage()));
        }
    }


}
