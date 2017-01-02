module.exports = {
  concatComment: (str, author) => {
    if (!str.charAt(str.length-1).match(/[!.?"”']/g)) {
      puncArr = ['.', '?', '!'];
      punc = puncArr[Math.floor(Math.random() * puncArr.length)];
      str += punc;
    }
    let STR = str.charAt(0).toUpperCase() + str.slice(1);
    if (author) {
      salutations = [
        `umm hi ${author}, ${str}`,
        `haha ok ${author}, ${str}`,
        `Listen ${author}, ${str}`,
        `Whatever ${author}, ${str}`,
        `That's brilliant! ${author}, ${str}`,
        `${author} is right since ${str}`,
        `${author}, have you considered that ${str}`,
        `${author}, you clearly don't understand this issue. Consider that ${str}`,
        `Did you know that ${str}`,
        `${STR} Think about that ${author}.`,
        `Consider this ${author}. ${STR}`,
        `LOL ${author} wow, ${str}`,
        `That's very clever, ${author}. But ${str}`,
        `Quite frankly ${author} I don't believe you because ${str}`,
        `Wow ${author}, I never knew. Also, ${str}`,
        `You just don't get it, do you ${author}? Imagine that ${str}`,
        `Interesting, ${author}. ${STR}`,
        `Dear ${author}, ${str}`,
        `${author}, ${str}`,
        `${author}, ${str}`,
        `${author}, ${str}`,
        `So, ${str}`,
        `${STR}`,
        `${STR}`,
        `${STR}`,
        `${STR}`,
      ];
      return salutations[Math.floor(Math.random() * salutations.length)];
    } else {
      salutations = [
        `umm ${str}`,
        `So what! ${STR}`,
        `I heard once that ${str}`,
        `haha ok but ${str}`,
        `I just read somewhere that ${str}`,
        `Listen, ${str}`,
        `Whatever, ${str}`,
        `That's brilliant! ${STR}`,
        `But ${str}`,
        `THIS. ${STR}`,
        `Has anyone considered that ${str}`,
        `${STR} Think about that.`,
        `This article doesn't seem to get it. Consider ${str}`,
        `Did you know that ${str}`,
        `Consider this. ${STR}`,
        `LOL wow, ${str}`,
        `Quite frankly I don't believe you because ${str}`,
        `I never knew that ${str}`,
        `Articles like this make me wonder. ${STR}`,
        `I don't know how I feel about this article. ${STR}`,
        `This article doesn't make sense. ${STR}`,
        `This article is wrong because ${str}`,
        `I totally agree with this article because ${str}`,
        `There's something fascinating about news like this. ${STR}`,
        `On the other hand, ${str}`,
        `The author of this article seems to think that ${str}`,
        `News like this really makes me wonder if ${str}`,
        `Articles like this give me hope. ${STR}`,
        `This is great news. ${STR}`,
        `${STR}`,
        `${STR}`,
        `${STR}`,
        `${STR}`,
      ];
      return salutations[Math.floor(Math.random() * salutations.length)];
    };
  }
}
