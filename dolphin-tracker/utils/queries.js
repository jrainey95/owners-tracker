import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      horses {
        horses
        age
        gender
        dam
        trainer
        country
      }
    }
  }
`;
