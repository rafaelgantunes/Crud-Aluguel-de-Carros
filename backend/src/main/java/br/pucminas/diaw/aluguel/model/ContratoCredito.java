package br.pucminas.diaw.aluguel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_contrato", nullable = false, unique = true, length = 50)
    private String numeroContrato;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "banco_agente_id", nullable = false)
    private Agente bancoAgente;

    @Column(name = "valor_financiado", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorFinanciado;

    @Column(name = "taxa_juros_mensal", nullable = false, precision = 5, scale = 2)
    private BigDecimal taxaJurosMensal;

    @Column(name = "quantidade_parcelas", nullable = false)
    private Integer quantidadeParcelas;

    @Column(name = "status_credito", nullable = false, length = 30)
    private String statusCredito = "APROVADO";

    @Column(name = "data_concessao")
    private LocalDateTime dataConcessao = LocalDateTime.now();

    public ContratoCredito() {
    }

    public ContratoCredito(String numeroContrato, Agente bancoAgente, BigDecimal valorFinanciado,
                           BigDecimal taxaJurosMensal, Integer quantidadeParcelas) {
        this.numeroContrato = numeroContrato;
        this.bancoAgente = bancoAgente;
        this.valorFinanciado = valorFinanciado;
        this.taxaJurosMensal = taxaJurosMensal;
        this.quantidadeParcelas = quantidadeParcelas;
        this.statusCredito = "APROVADO";
        this.dataConcessao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroContrato() {
        return numeroContrato;
    }

    public void setNumeroContrato(String numeroContrato) {
        this.numeroContrato = numeroContrato;
    }

    public Agente getBancoAgente() {
        return bancoAgente;
    }

    public void setBancoAgente(Agente bancoAgente) {
        this.bancoAgente = bancoAgente;
    }

    public BigDecimal getValorFinanciado() {
        return valorFinanciado;
    }

    public void setValorFinanciado(BigDecimal valorFinanciado) {
        this.valorFinanciado = valorFinanciado;
    }

    public BigDecimal getTaxaJurosMensal() {
        return taxaJurosMensal;
    }

    public void setTaxaJurosMensal(BigDecimal taxaJurosMensal) {
        this.taxaJurosMensal = taxaJurosMensal;
    }

    public Integer getQuantidadeParcelas() {
        return quantidadeParcelas;
    }

    public void setQuantidadeParcelas(Integer quantidadeParcelas) {
        this.quantidadeParcelas = quantidadeParcelas;
    }

    public String getStatusCredito() {
        return statusCredito;
    }

    public void setStatusCredito(String statusCredito) {
        this.statusCredito = statusCredito;
    }

    public LocalDateTime getDataConcessao() {
        return dataConcessao;
    }

    public void setDataConcessao(LocalDateTime dataConcessao) {
        this.dataConcessao = dataConcessao;
    }
}

