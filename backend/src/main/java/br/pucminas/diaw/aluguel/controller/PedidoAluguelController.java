package br.pucminas.diaw.aluguel.controller;

import br.pucminas.diaw.aluguel.dto.AvaliacaoFinanceiraDTO;
import br.pucminas.diaw.aluguel.dto.PedidoAluguelRequestDTO;
import br.pucminas.diaw.aluguel.model.PedidoAluguel;
import br.pucminas.diaw.aluguel.service.PedidoAluguelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoAluguelController {

    private final PedidoAluguelService pedidoService;

    public PedidoAluguelController(PedidoAluguelService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoAluguel>> listarPedidos(@RequestParam(required = false) Long clienteId) {
        return ResponseEntity.ok(pedidoService.listarPedidos(clienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoAluguel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PedidoAluguel> introduzirPedido(@Valid @RequestBody PedidoAluguelRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.introduzirPedido(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoAluguel> modificarPedido(@PathVariable Long id, @Valid @RequestBody PedidoAluguelRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.modificarPedido(id, dto));
    }

    @PatchMapping("/{id}/avaliar")
    public ResponseEntity<PedidoAluguel> avaliarPedidoFinanceiramente(
            @PathVariable Long id,
            @Valid @RequestBody AvaliacaoFinanceiraDTO dto) {
        return ResponseEntity.ok(pedidoService.avaliarPedidoFinanceiramente(id, dto));
    }

    @PatchMapping("/{id}/executar-contrato")
    public ResponseEntity<PedidoAluguel> executarContrato(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.executarContrato(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PedidoAluguel> cancelarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.cancelarPedido(id));
    }
}

