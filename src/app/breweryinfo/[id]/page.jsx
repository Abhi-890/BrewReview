"use client";
import Navbar from "../../../components/Navbar";
import { Box, Button, Rating, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const BreweryInfo = ({ params }) => {
  const id = params.id;
  const [breweryData, setBreweryData] = useState({});
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [description, setDescription] = useState("");
  const [reviews, setReviews] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  function getLabelText(value) {
    return `${value}`;
  }
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return null;
    }

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    return totalRating / reviews.length;
  };

  useEffect(() => {
    axios
      .get(`https://api.openbrewerydb.org/v1/breweries/${id}`)
      .then((response) => {
        setBreweryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);
  useEffect(() => {
    axios
      .get("/api/reviews/getreviews", {
        data: {
          brewery: id,
        },
      })
      .then((response) => {
        setReviews(response.data);
        const filteredReviews = response.data.data.filter(
          (review) => review.brewery === id
        );
        const avgRating = calculateAverageRating(filteredReviews);
        setAverageRating(avgRating);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);
  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post("/api/reviews/postreview", {
        brewery: id,
        rating: value,
        description: description,
      });

      setValue(0);
      setDescription("");
      window.location.reload();
    } catch (error) {
      console.error("Review submission failed", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-yellow-200  min-h-screen py-2">
        <div className="my-4 w-3/4">
          <h1 className="text-4xl text-center font-bold">{breweryData.name}</h1>
          <div className=" flex items-center justify-around bg-gray-100 rounded-lg p-4 mt-4 ">
            <div>
              <p className="mb-2 text-lg">
                <span className="font-bold">Brewery Type: </span>
                {breweryData.brewery_type}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Address: </span>{" "}
                {breweryData.address_1}
                {breweryData.address_2 !== null && ` ${breweryData.address_2}`}
                {breweryData.address_3 !== null && ` ${breweryData.address_3}`}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">City: </span> {breweryData.city}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">State: </span> {breweryData.state}
              </p>
            </div>
            <div>
              <p className="mb-2 text-lg">
                <span className="font-bold">State Province: </span>{" "}
                {breweryData.state_province}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Postal Code: </span>{" "}
                {breweryData.postal_code}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Longitude: </span>{" "}
                {breweryData.longitude}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Latitude: </span>{" "}
                {breweryData.latitude}
              </p>
            </div>
            <div>
              <p className="mb-2 text-lg">
                <span className="font-bold">Phone: </span> {breweryData.phone}
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Website: </span>
                <a
                  href={breweryData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {breweryData.website_url}
                </a>
              </p>
              <p className="mb-2 text-lg">
                <span className="font-bold">Street: </span> {breweryData.street}
              </p>
              <p>
                <span className="font-bold">Average Rating: </span>
                {averageRating !== null
                  ? averageRating.toFixed(1)
                  : "No reviews yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 w-3/4">
          <h1 className="text-2xl font-bold">Reviews</h1>
          <div className="bg-gray-100 rounded p-4 mt-4">
            <h2 className="text-xl font-semibold">Add review</h2>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              placeholder="Enter Review"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full my-2 p-2 rounded border"
            />
            <div className="flex items-center my-2">
              <Rating
                value={value}
                precision={1}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
              {value !== null && (
                <Box sx={{ marginLeft: "0.5rem" }}>
                  {hover !== -1 ? hover : value}
                </Box>
              )}
            </div>
            <Button
              variant="contained"
              onClick={handleReviewSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </Button>
          </div>
          <div className="bg-gray-100 rounded p-4 mt-4">
            <h2 className="text-xl font-semibold">Other Reviews</h2>
            {reviews?.data && (
              <ul>
                {reviews?.data.map((review) => {
                  if (review.brewery === id) {
                    return (
                      <li key={review._id} className="mb-4">
                        <div className="flex">
                          <p className="text-lg font-semibold mr-2">
                            {review.username}
                          </p>
                          <Rating disabled value={review.rating} />
                        </div>
                        <p className="text-lg">{review.description}</p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BreweryInfo;
