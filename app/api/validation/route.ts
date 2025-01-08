import prisma from "@/prisma/db";
import { Schedule } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log(body);

  const student = await prisma.student.findFirst({
    where: {
      AND: [{ email: body.email }, { studentId: body.studentId }],
    },
    include: {
      examSchedule: true,
    },
  });

  if (!student)
    return NextResponse.json({ message: "student not found" }, { status: 404 });

  let message = "success";
  let canExam = true;
  let schedule = student.examSchedule;

  if (!student.examSchedule) {
    message = "No selected schedule yet";
    canExam = false;
    schedule = {} as Schedule;
  }

  if (student.hasTakenExam) {
    message = "Already take an exam";
    canExam = false;
    schedule = {} as Schedule;
  }

  if (new Date(student.examSchedule?.date || "") > new Date()) {
    message = "Waiting for exam schedule";
    canExam = false;
    schedule = {} as Schedule;
  }

  return NextResponse.json({ message, canExam, schedule }, { status: 200 });
};
