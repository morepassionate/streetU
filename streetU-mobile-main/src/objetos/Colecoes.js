import { DataFormated } from "./Data";

export const novaColecao = (idUser, ideColecao, AvatarPerfil, DescricaoColecao, listaDeFotos, Lojas, nomeUser, tipoLista, titleLista, Views, shares, seguindo, visivel, isLoja) => {

    let colecao = {
        idUser: idUser,
        idColecao: ideColecao,
        AvatarPerfil: AvatarPerfil,
        DataCriacaoColecao: DataFormated(new Date()),
        DescricaoColecao: DescricaoColecao,
        FotosLista: listaDeFotos,
        Lojas: Lojas,
        Nome: nomeUser,
        TipoLista: tipoLista,
        TitleLista: titleLista,
        Views: Views,
        shares: shares,
        seguindo: seguindo,
        visivel: visivel,
        isLoja: isLoja
    }

    return colecao;
}

//Parametro "Lojas" terá uma lista com os nomes das lojas que tem a foto de origem;

/*
Parametro "FotosLista" = [] terá uma lista com os seguintes objetos que vem da loja origem

    "idLojaOrigem"
    "LogoLojaOrigem"
    "LojaOrigem"
    "uri"
    "idFoto"
    "descricaoFoto"

*/