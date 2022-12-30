export const novaLojaUser = (uid, avatar, nome, numero, email, senha, endereco, tipo, perfil_publico, privacidade_perfil, privacidade_lista, privacidade_geolocalizacao) => {
    let loja = {
        user_id: uid,
        user_foto_avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E',
        user_name: nome,
        user_numero: numero,
        user_email: email,
        user_senha: senha,
        data_cadastro: Date.now(),
        user_endereco: endereco,
        user_tipo: tipo,
        perfil_publico: perfil_publico,
        privacidade_perfil: privacidade_perfil,
        privacidade_lista: privacidade_lista,
        privacidade_geolocalizacao: privacidade_geolocalizacao,
        seguidores: 0,
        seguindo:[],
    }
    return loja;
}