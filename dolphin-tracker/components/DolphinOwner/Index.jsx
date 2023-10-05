// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import cheerio from "cheerio";

// function GodolphinOwner() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/fetchData")
//       .then((response) => {
//         const html = response.data;
//         const $ = cheerio.load(html);

//         const raceData = [];

//         $("#block-system-main").each((dayIndex, dayElement) => {
//           console.log("Day Element HTML:", $(dayElement).html());
//           const $dayElement = $(dayElement);
//           if (!dayElement) {
//             return;
//           }

//           const raceDayElement = $dayElement.prev();

//           if (raceDayElement.length > 0) {
//             const raceDay = raceDayElement.text().trim();
//             console.log("Race Day:", raceDay);

//             $(dayElement)
//               .find("tr")
//               .each((raceIndex, raceElement) => {
//                 console.log("Race Element HTML:", $(raceElement).html());

//                 const racecourse = $(raceElement)
//                   .find(".racecourse")
//                   .text()
//                   .trim();
//                 const horseName = $(raceElement)
//                   .find(".horseName")
//                   .text()
//                   .trim();
//                 const owner = $(raceElement).find(".owner").text().trim();
//                 const trainer = $(raceElement).find(".trainer").text().trim();
//                 const jockey = $(raceElement).find(".jockey").text().trim();
//                 const time = $(raceElement).find(".time").text().trim();
//                 const raceDataText = $(raceElement)
//                   .find(".raceDataText")
//                   .text()
//                   .trim();

//                 const race = {
//                   raceDay,
//                   racecourse,
//                   horseName,
//                   owner,
//                   trainer,
//                   jockey,
//                   time,
//                   raceDataText,
//                 };

//                 raceData.push(race);
//               });
//           } else {
//             console.warn(
//               "Race day element not found for dayElement:",
//               $(dayElement).html()
//             );
//           }
//         });

//         setData(raceData);
//         setLoading(false);
//         console.log(raceData);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Dolphin Owner Data</h1>
//       {data.map((item, index) => (
//         <div key={index}>
//           <h2>{item.raceDay}</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Racecourse</th>
//                 <th>Horse/Owner</th>
//                 <th>Trainer</th>
//                 <th>Jockey</th>
//                 <th>Time</th>
//                 <th>Race Data</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>{item.racecourse}</td>
//                 <td>
//                   {item.horseName} / {item.owner}
//                 </td>
//                 <td>{item.trainer}</td>
//                 <td>{item.jockey}</td>
//                 <td>{item.time}</td>
//                 <td>{item.raceDataText}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default GodolphinOwner;





import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import './index.scss';

function DolphinOwner() {
  const [data, setData] = useState("");

  useEffect(() => {
    // Make a GET request to your Express server
    fetch("http://localhost:3001/api/fetchData")
      .then((response) => response.text())
      .then((html) => {
        // Update the state with the fetched HTML data
        setData(html);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="content-container">
      <h1 className="page-title">Dolphin Owner Data</h1>
      <div className="scrollable-content">
        {parse(data)} {/* Render the parsed HTML */}
      </div>
    </div>
  );
}
export default DolphinOwner;
