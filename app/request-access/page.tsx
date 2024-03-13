"use client";

import Header from "@/components/home/Header";
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
import { useToast } from "@/components/ui/use-toast";
import { useFormspark } from "@formspark/use-formspark";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

const RequestAccess = () => {
  const FormSparkID = process.env.NEXT_PUBLIC_FORMSPARK_ID || "";

  const { toast } = useToast();
  const [submit, submitting] = useFormspark({ formId: FormSparkID });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const {
    reset,
    formState: { isSubmitSuccessful, isSubmitted, errors },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      toast({
        title: "Success!",
        description:
          "Your request has been submitted. You will be notified when your account is ready.",
      });
    } else if (isSubmitted && Object.keys(errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please check your details and try again.",
      });
    }
  }, [isSubmitSuccessful, isSubmitted, errors, toast, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await submit(values);
  };

  return (
    <div className="container flex flex-1 flex-col place-content-center">
      <Header />
      <h1 className="mb-12 text-center text-2xl font-medium md:text-3xl">
        Request Access
      </h1>
      <div className="mx-auto w-full md:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-white bg-transparent placeholder:text-white/75"
                      placeholder="First & Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify Login Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-white bg-transparent placeholder:text-white/75"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="text-white" type="submit" disabled={submitting}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RequestAccess;
