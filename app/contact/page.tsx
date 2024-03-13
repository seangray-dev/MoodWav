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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useFormspark } from "@formspark/use-formspark";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactPage() {
  const contactFormId = process.env.NEXT_PUBLIC_FORMSPARK_CONTACT_FORM_ID || "";
  const { toast } = useToast();
  const [submit, submitting] = useFormspark({ formId: contactFormId });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
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
        description: "Your message has been sent.",
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
    <div className="container my-10 flex flex-1 flex-col place-content-center">
      <h1 className="mb-12 text-center text-2xl font-medium md:text-3xl">
        Contact
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
                  <FormLabel>Email</FormLabel>
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
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      className="border-white bg-transparent placeholder:text-white/75"
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-white bg-transparent placeholder:text-white/75"
                      placeholder="Message"
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
}
