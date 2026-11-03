package br.pucminas.diaw.aluguel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rendimentos_cliente")
public class RendimentoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entidade_empregadora", nullable = false, length = 150)
    private String entidadeEmpregadora;

    @Column(name = "valor_rendimento", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorRendimento;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    public RendimentoCliente() {
    }

    public RendimentoCliente(String entidadeEmpregadora, BigDecimal valorRendimento) {
        this.entidadeEmpregadora = entidadeEmpregadora;
        this.valorRendimento = valorRendimento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntidadeEmpregadora() {
        return entidadeEmpregadora;
    }

    public void setEntidadeEmpregadora(String entidadeEmpregadora) {
        this.entidadeEmpregadora = entidadeEmpregadora;
    }

    public BigDecimal getValorRendimento() {
        return valorRendimento;
    }

    public void setValorRendimento(BigDecimal valorRendimento) {
        this.valorRendimento = valorRendimento;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}

