const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get("/api/fetchData", async (req, res) => {
  try {
    const axiosResponse = await axios.get(
      "https://www.godolphin.com/runners-and-results/runners"
    );
    const html = await axiosResponse.data;

    const $ = cheerio.load(html);
    const data = []; // Create an array to store the parsed data

    // Use Cheerio selectors to extract the data you need
    $(".main-content").each((index, element) => {
      // Remove line breaks from the HTML content
      const itemHTML = $(element).html().replace(/\n/g, ""); // Remove line breaks
      data.push(itemHTML); // Push the HTML content into the data array
    });
    console.log("HTML content:", data);
    res.send(data);
    // res.json(data); // Send the data array as JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
