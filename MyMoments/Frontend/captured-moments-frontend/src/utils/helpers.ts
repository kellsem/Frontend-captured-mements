//Autenticação de e-mail
export const validateEmail = (email: string) => {
  const regex = /^[\w.-]+@[a-z0-9-]+\.[a-z]{2,}(\.[a-z]{2,})?$/i;
  return regex.test(email)
}

//Pega as iniciais dos nomes para o perfil no home
export const getInitials = (name: string) => {
  if(!name) return "";

  const word = name.split(" ");
  let initial = "";

  for (let i=0; i < Math.min(word.length, 2); i++){
    initial += word[i][0];
  }
  return initial.toUpperCase()
}