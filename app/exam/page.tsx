import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import ExamForm from "./components/ExamForm";
import CountDown from "./components/CountDown";

const Page = async () => {
  const session = await getServerSession(authOptions)!;

  if (!session) redirect(`/login`);

  const student = await prisma.student.findFirst({
    where: {
      AND: [
        { email: session?.user?.email || "" },
        { studentId: session?.user?.studentId },
      ],
    },
    include: {
      examSchedule: {
        include: {
          exam: {
            include: {
              form: {
                include: {
                  questionnaires: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) return null;

  const { examSchedule: schedule } = student;

  if (!schedule) redirect(`/`);

  const {
    exam: { form },
  } = schedule;

  return (
    <div className="container max-w-screen-md mx-auto py-16">
      <div className="text-2xl font-bold mb-4">{form?.title}</div>
      <ExamForm studentId={student.id} form={form} />
      <CountDown minutes={schedule.duration} />
    </div>
  );
};

export default Page;
