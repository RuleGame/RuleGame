export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Book = {
  __typename?: 'Book';
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  reviews?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Query = {
  __typename?: 'Query';
  books?: Maybe<Array<Maybe<Book>>>;
  book?: Maybe<Book>;
};


export type QueryBookArgs = {
  id?: Maybe<Scalars['String']>;
};
