"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExamForm as Form, Questionnaire } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import FinishDialog from "./FinishDialog";
import { useStore } from "@/store/useStore";

interface Props {
  form: (Form & { questionnaires: Questionnaire[] }) | null;
  studentId: string;
}

const ExamForm = ({ form, studentId }: Props) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(false);
  const { setSuccess, success } = useStore();

  useEffect(() => {
    if (form?.questionnaires) {
      setQuestionnaires(form.questionnaires);
    }
  }, [form?.questionnaires]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post<{ success: boolean }>(
        "/api/exams/results",
        { questionnaires, studentId }
      );
      setSuccess(data.success);
    } catch (error) {
      console.error("Error submitting exam", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {form?.questionnaires.map((q, i) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="font-medium">{`${i + 1}. ${
              q.question
            }`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="px-6">
              <RadioGroup
                onValueChange={(value) =>
                  setQuestionnaires((prev) =>
                    prev.map((pr) =>
                      pr.id === q.id ? { ...pr, studentAnswer: value } : pr
                    )
                  )
                }
              >
                {q.choices.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="w-full flex justify-end">
        <FinishDialog shouldShow={success}>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </FinishDialog>
      </div>
    </div>
  );
};

export default ExamForm;
