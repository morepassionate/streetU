import { DataFormated } from "./Data";

export const seguindo = (id_user_logado, id_user, nome_user_a_ser_seguido, requisicao_aceita, user_name, user_foto_avatar, show) => {
    let userSeguindo = {
        id_user_seguidor: id_user_logado,
        id_user_sendo_seguido: id_user,
        nome_user_a_ser_seguido: nome_user_a_ser_seguido,
        data_criacao: DataFormated(new Date()),
        requisicao_aceita: requisicao_aceita,
        nome_user_seguidor: user_name,
        uri: user_foto_avatar,
        show: show
    }
    return userSeguindo;
}