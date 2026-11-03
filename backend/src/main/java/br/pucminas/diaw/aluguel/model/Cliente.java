package br.pucminas.diaw.aluguel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false, length = 100)
    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<RendimentoCliente> rendimentos = new ArrayList<>();

    public Cliente() {
        super();
        setRole(RoleUsuario.CLIENTE);
    }

    public Cliente(String username, String senha, String nome, String rg, String cpf, String endereco, String profissao) {
        super(username, senha, nome, RoleUsuario.CLIENTE);
        this.rg = rg;
        this.cpf = cpf;
        this.endereco = endereco;
        this.profissao = profissao;
    }

    public void adicionarRendimento(RendimentoCliente rendimento) {
        if (this.rendimentos.size() >= 3) {
            throw new IllegalArgumentException("O contratante pode ter no máximo 3 entidades empregadoras/rendimentos cadastrados.");
        }
        rendimento.setCliente(this);
        this.rendimentos.add(rendimento);
    }

    public void limparRendimentos() {
        this.rendimentos.clear();
    }

    public BigDecimal calcularRendaTotal() {
        return rendimentos.stream()
                .map(RendimentoCliente::getValorRendimento)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<RendimentoCliente> getRendimentos() {
        return rendimentos;
    }

    public void setRendimentos(List<RendimentoCliente> rendimentos) {
        this.rendimentos = rendimentos;
    }
}

