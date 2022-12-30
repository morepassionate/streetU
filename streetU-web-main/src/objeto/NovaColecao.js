
export const NovaColecao = (idUser, ideColecao, AvatarPerfil, DescricaoColecao, listaDeFotos, Lojas, nomeUser, tipoLista, titleLista, Views, shares, seguindo, visivel, isLoja) => {

    let colecao = {
        idUser: idUser,
        idColecao: ideColecao,
        AvatarPerfil: AvatarPerfil,
        DataCriacaoColecao: Date.now(),
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
