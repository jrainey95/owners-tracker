const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Display selected data as a json //

// app.get("/api/fetchData", async (req, res) => {
//   try {
//     const axiosResponse = await axios.get(
//       "https://www.godolphin.com/runners-and-results/runners"
//     );
//     const html = await axiosResponse.data;

//     const $ = cheerio.load(html);
//     const data = []; // Create an array to store the parsed data

//     // Use Cheerio selectors to extract the data you need
//     $(".tabs-content").each((index, element) => {
//       // Remove line breaks from the HTML content
//       const itemHTML = $(element).html().replace(/\n/g, ""); // Remove line breaks
//       data.push(itemHTML); // Push the HTML content into the data array
//     });
//     console.log("HTML content:", data);
//     // res.send(html);
//     res.json(data); // Send the data array as JSON
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Unable to fetch data" });
//   }
// });


// display data as html as seen on website// 

app.get("/api/fetchData", async (req, res) => {
  try {
    const axiosResponse = await axios.get(
      "https://www.godolphin.com/runners-and-results/runners"
    );
    const html = await axiosResponse.data;

    const $ = cheerio.load(html);

    // Extract the content of the specific div with the given ID
    const mainContent = $("#block-system-main").html();

    if (mainContent) {
      // Send the content of the specific div as the response
      // res.send(mainContent);
      res.send(mainContent);
    } else {
      res.status(404).json({ error: "Main content not found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to fetch data" });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});