import { DataFormated } from "./Data";

export const novoUserBlock = (idUsuarioQueBloqueou, idUserBloqueado, userBloqueado) => {
    let userBlock = {
        idUsuarioQueBloqueou: idUsuarioQueBloqueou,
        idUserBloqueado: idUserBloqueado,
        userBloqueado: userBloqueado,
        data_create: DataFormated(new Date())
    }

    return userBlock;
}