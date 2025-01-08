import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login`);

  return (
    <div className="flex h-screen justify-center items-center">
      <Link href={`/exam`}>
        <Button>Start Now</Button>
      </Link>
    </div>
  );
};

export default page;
