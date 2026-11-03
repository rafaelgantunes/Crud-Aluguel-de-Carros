package br.pucminas.diaw.aluguel.controller;

import br.pucminas.diaw.aluguel.dto.AgenteRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginRequestDTO;
import br.pucminas.diaw.aluguel.dto.LoginResponseDTO;
import br.pucminas.diaw.aluguel.model.Agente;
import br.pucminas.diaw.aluguel.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.autenticar(dto));
    }

    @PostMapping("/registro-agente")
    public ResponseEntity<Agente> registrarAgente(@Valid @RequestBody AgenteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrarAgente(dto));
    }

    @GetMapping("/bancos")
    public ResponseEntity<List<Agente>> listarBancosAgentes() {
        return ResponseEntity.ok(authService.listarBancosAgentes());
    }

    @GetMapping("/agentes")
    public ResponseEntity<List<Agente>> listarTodosAgentes() {
        return ResponseEntity.ok(authService.listarTodosAgentes());
    }
}

