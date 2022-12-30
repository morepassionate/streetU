import { DataFormated } from "./Data";

export const seguidores = (idUser, idUserSeguidor, userNameSeguidor) => {
    let userSeguidores = {
        data_criacao: DataFormated(new Date()),
        id_user: idUser,
        id_user_seguidor: idUserSeguidor,
        nome_user_seguidor: userNameSeguidor,
    };
    return userSeguidores;
}