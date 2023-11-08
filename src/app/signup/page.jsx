"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Button, TextField, Typography, Modal } from "@mui/material";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const onSignup = async () => {
    if (user.email === "" || user.password === "" || user.username === "") {
      openModal();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/user/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error) {
      console.log("Signup failed", error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center bg-yellow-200 justify-around h-screen py-2">
      <Image
        src="/BrewReview-logos_black.png"
        alt="logo"
        width={400}
        height={200}
      />
      <div className="flex flex-col items-center justify-center bg-yellow-50 h-3/5 w-1/3 rounded-lg ">
        <Typography variant="h4"> Sign-up</Typography>
        <hr />
        <TextField
          margin="normal"
          required
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <TextField
          margin="normal"
          required
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <TextField
          margin="normal"
          required
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={onSignup}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </Button>
        <Link href="/login">Existing user? Sign In</Link>
        <Modal open={modalOpen} onClose={closeModal}>
          <div className="modal-content w-1/2 bg-white mx-auto p-4 rounded-lg">
            <div className="modal-header bg-blue-500 text-white py-2 rounded-t-lg">
              <h2 className="text-lg font-bold">Required Fields</h2>
            </div>
            <div className="modal-body py-4">
              <p>Please fill in all required fields to sign up.</p>
            </div>
            <div className="modal-footer text-right">
              <Button
                onClick={closeModal}
                variant="contained"
                className="bg-blue-500 text-white px-4 py-2"
              >
                OK
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
