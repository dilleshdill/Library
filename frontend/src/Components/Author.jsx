import React from "react";

const authorsList = [
  {
    id: "j_k_rowling",
    label: "J.K. Rowling",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "george_rr_martin",
    label: "George R.R. Martin",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "j_r_r_tolkien",
    label: "J.R.R. Tolkien",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "agatha_christie",
    label: "Agatha Christie",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "stephen_king",
    label: "Stephen King",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "jane_austen",
    label: "Jane Austen",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "ernest_hemingway",
    label: "Ernest Hemingway",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "mark_twain",
    label: "Mark Twain",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "leo_tolstoy",
    label: "Leo Tolstoy",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
  {
    id: "charles_dickens",
    label: "Charles Dickens",
    url: "https://images.gr-assets.com/authors/1362814142p8/3389.jpg",
  },
];

const Author = () => {
  return (
    <div className="flex gap-8 py-4"style={{overflowX:"auto",width:"100vw",scrollbarWidth:"none"}}>
      {authorsList.map((author) => (
        <div key={author.id} className="flex flex-col items-center">
          <img
            src={author.url}
            alt={author.label}
            className="w-[150px] h-[150px] rounded-full"
          />
          <p className="text-sm font-medium mt-2">{author.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Author;
