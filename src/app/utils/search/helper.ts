export const searchSpecialCase = (searchWord, wordToFindFrom) => {

  const normalizedSearchWordTofind = searchWord
  .toLowerCase()
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "");

  const normalizedName = wordToFindFrom
  .toLowerCase()
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "");
  
  if(normalizedName == normalizedSearchWordTofind){
    return true
  }

  if(searchWord){
    return searchWord?.split(' ')?.length > 0  && searchWord.split(' ').filter(e=>e !== '').some(wordToFind => {
      const normalizedWordToFind = wordToFind
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  
      return normalizedName.includes(normalizedWordToFind)
    })
  }
  return false
}