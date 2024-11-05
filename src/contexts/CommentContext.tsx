import React, { createContext, useContext, RefObject } from "react";

interface CommentContextType {
  commentRef: RefObject<HTMLTextAreaElement> | null;
  setCommentRef: (ref: RefObject<HTMLTextAreaElement>) => void;
}

const CommentContext = createContext<CommentContextType>({
  commentRef: null,
  setCommentRef: () => {},
});

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [commentRef, setCommentRefState] =
    React.useState<RefObject<HTMLTextAreaElement> | null>(null);

  return (
    <CommentContext.Provider
      value={{
        commentRef,
        setCommentRef: ref => setCommentRefState(ref),
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export const useCommentContext = () => useContext(CommentContext);
