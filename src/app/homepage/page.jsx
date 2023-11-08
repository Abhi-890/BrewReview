"use client";

import TextField from "@mui/material/TextField";
import { ButtonBase, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Homepage() {
  const router = useRouter();
  const types = [
    "micro",
    "nano",
    "regional",
    "brewpub",
    "large",
    "planning",
    "bar",
    "contract",
    "propietor",
    "closed",
  ];

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [breweryType, setBreweryType] = useState("");
  const [results, setResults] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApiCall = () => {
    const params = {};

    if (name) {
      params.by_name = name;
    }

    if (city) {
      params.by_city = city;
    }

    if (breweryType) {
      params.by_type = breweryType;
    }
    axios
      .get(`https://api.openbrewerydb.org/v1/breweries`, {
        params,
      })
      .then((response) => {
        setResults(response.data);
        console.group(results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-yellow-200  min-h-screen py-2">
        <Image
          src="/BrewReview-logos_black.png"
          alt="logo"
          width={400}
          height={200}
        />
        <div className="flex items-center justify-around py-2 w-3/4 ">
          <TextField
            variant="outlined"
            placeholder="Enter Name"
            value={name}
            className="w-1/3"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            placeholder="Enter City"
            value={city}
            className="w-1/3"
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            select
            label="Brewery Type"
            value={breweryType}
            onChange={(e) => setBreweryType(e.target.value)}
            className="my-2 w-1/4"
          >
            {types.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <Button
            variant="contained"
            size="large"
            onClick={handleApiCall}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </Button>
        </div>
        {results.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-2">
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, boxShadow: 4 }}
            >
              <Table>
                <TableHead sx={{ background: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Address
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        City
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        State
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Phone
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Website
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {row.address_1}
                          {row.address_2 && ` ${row.address_2}`}
                          {row.address_3 && ` ${row.address_3}`}
                        </TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>
                          <a
                            href={row.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row.website_url}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Link key={row.id} href={`/breweryinfo/${row.id}`}>
                            <Button type="submit" variant="outlined">
                              View info
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={results.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        ) : (
          "Modify search criteria to get breweries."
        )}
      </div>
    </>
  );
}
