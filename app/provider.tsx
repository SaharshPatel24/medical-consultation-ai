"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { userDetailsContext } from "@/context/userDetailsContext";

export type userDetails = {
  name: string;
  email: string;
  credits: number;
};

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = useUser();
  const [userDetail, setUserDetail] = useState<any>();

 useEffect(() => {
  if (user && !userDetail) {
    createNewUser();
  }
}, [user, userDetail]);
  const createNewUser = async () => {
    const result = await axios.post("/api/users");
    console.log(result.data);
    setUserDetail(result.data);
  };

  return (
    <div>
      <userDetailsContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </userDetailsContext.Provider>
    </div>
  );
};

export default Provider;
