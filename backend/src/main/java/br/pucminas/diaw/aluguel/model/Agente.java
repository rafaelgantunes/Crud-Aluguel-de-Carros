package br.pucminas.diaw.aluguel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "agentes")
public class Agente extends Usuario {

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(name = "razao_social", nullable = false, length = 150)
    private String razaoSocial;

    @Column(name = "tipo_agente", nullable = false, length = 20)
    private String tipoAgente; // EMPRESA ou BANCO

    public Agente() {
        super();
    }

    public Agente(String username, String senha, String nome, String cnpj, String razaoSocial, String tipoAgente) {
        super(
                username,
                senha,
                nome,
                "BANCO".equalsIgnoreCase(tipoAgente) ? RoleUsuario.AGENTE_BANCO : RoleUsuario.AGENTE_EMPRESA
        );
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.tipoAgente = tipoAgente.toUpperCase();
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getTipoAgente() {
        return tipoAgente;
    }

    public void setTipoAgente(String tipoAgente) {
        this.tipoAgente = tipoAgente;
        if ("BANCO".equalsIgnoreCase(tipoAgente)) {
            setRole(RoleUsuario.AGENTE_BANCO);
        } else {
            setRole(RoleUsuario.AGENTE_EMPRESA);
        }
    }
}

