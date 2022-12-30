export const SalvouInColecao = (userId, idColecao, id_image, uri, idDaLoja, nomeDaNovaLoja) => {
    let NewMap = {
        userId: userId,
        Id_Colecao: idColecao,
        id_image: id_image,
        uri: uri,
        idDaLoja: idDaLoja,
        nomeDaNovaLoja: nomeDaNovaLoja,
    }
    return NewMap;
}
