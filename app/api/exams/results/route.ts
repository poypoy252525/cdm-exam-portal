import prisma from "@/prisma/db";
import { resultSchema } from "@/schemas/resultSchema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  //   console.log(body);

  const validation = resultSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { message: validation.error.message },
      { status: 400 }
    );

  const { data } = validation;

  let score = 0;
  const totalItems = data.questionnaires.length;

  for (const q of data.questionnaires) {
    if (q.answer === q.studentAnswer) {
      score++;
    }
  }

  const remarks = Math.ceil((score / totalItems) * 100);

  try {
    const result = await prisma.result.create({
      data: {
        score,
        questionnaires: {
          connect: data.questionnaires.map((q) => ({
            id: q.id,
          })),
        },
        studentId: data.studentId,
        remarks: remarks >= 75 ? "PASSED" : "FAILED",
      },
    });

    await prisma.student.update({
      data: {
        hasTakenExam: true,
      },
      where: {
        id: data.studentId,
      },
    });

    return NextResponse.json(
      { message: "posted", result, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create new result: ", error);
    return NextResponse.json(
      { message: "Failed to create new result.", success: false },
      { status: 500 }
    );
  }
};
