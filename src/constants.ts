export interface Passage {
  id: string;
  title: string;
  author: string;
  text: string;
}

export const PASSAGES: Passage[] = [
  {
    id: "hp-1",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    text: "Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense."
  },
  {
    id: "dune-1",
    title: "Dune",
    author: "Frank Herbert",
    text: "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain."
  },
  {
    id: "lotr-1",
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    text: "Three Rings for the Elven-kings under the sky, Seven for the Dwarf-lords in their halls of stone, Nine for Mortal Men doomed to die, One for the Dark Lord on his dark throne In the Land of Mordor where the Shadows lie."
  },
  {
    id: "hitchhiker-1",
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    text: "The story so far: In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move."
  },
  {
    id: "1984-1",
    title: "1984",
    author: "George Orwell",
    text: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him."
  }
];
