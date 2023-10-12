import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/mutations"; // Import the QUERY_ME query

const HorseProfile = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const user = data.me;

  return (
    <div>
      <h2>User Profile</h2>
      <p>ID: {user._id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <h3>Horses:</h3>
      <ul>
        {user.horses.map((horse) => (
          <li key={horse._id}>
            <p>Name: {horse.name}</p>
            <p>Age: {horse.age}</p>
            <p>Gender: {horse.gender}</p>
            <p>Dam: {horse.dam}</p>
            <p>Trainer: {horse.trainer}</p>
            <p>Country: {horse.country}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorseProfile;
