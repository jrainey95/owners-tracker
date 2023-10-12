import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedHorses {
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
