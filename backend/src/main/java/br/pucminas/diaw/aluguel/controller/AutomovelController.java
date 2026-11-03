package br.pucminas.diaw.aluguel.controller;

import br.pucminas.diaw.aluguel.dto.AutomovelRequestDTO;
import br.pucminas.diaw.aluguel.model.Automovel;
import br.pucminas.diaw.aluguel.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @GetMapping
    public ResponseEntity<List<Automovel>> listarTodos() {
        return ResponseEntity.ok(automovelService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Automovel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(automovelService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Automovel> cadastrarAutomovel(@Valid @RequestBody AutomovelRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(automovelService.cadastrarAutomovel(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Automovel> atualizarAutomovel(@PathVariable Long id, @Valid @RequestBody AutomovelRequestDTO dto) {
        return ResponseEntity.ok(automovelService.atualizarAutomovel(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAutomovel(@PathVariable Long id) {
        automovelService.excluirAutomovel(id);
        return ResponseEntity.noContent().build();
    }
}

