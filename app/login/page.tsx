"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginForm, LoginForm } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schedule } from "@prisma/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertDestructive } from "./Alert";

const LoginPage = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      email: "",
      studentId: "",
    },
  });
  const [schedule, setSchedule] = useState<Schedule>();
  const [canExam, setCanExam] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (data: LoginForm) => {
    try {
      await signIn("credentials", {
        email: data.email,
        studentId: data.studentId,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const handleValidation = async () => {
    try {
      const { data } = await axios.post<{
        message: string;
        canExam: boolean;
        schedule: Schedule;
      }>(`/api/validation`, form.getValues());

      console.log(data);

      setMessage(data.message);
      setCanExam(data.canExam);
      setSchedule(data.schedule);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="container max-w-sm"
        >
          <div className="space-y-2">
            <span className="text-2xl">Login</span>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {schedule && schedule.id && (
              <div>
                <span>
                  {new Date(schedule.date).toLocaleDateString("en-PH", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            {!canExam && schedule && <AlertDestructive message={message} />}

            <div className="w-full flex flex-col space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleValidation}
              >
                Check schedule
              </Button>
              <Button disabled={!canExam} type="submit">
                Login
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
