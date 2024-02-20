'use client';

import Header from '@/components/home/Header';
import Nav from '@/components/layout/Nav';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useFormspark } from '@formspark/use-formspark';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

const RequestAccess = () => {
  const FormSparkID = process.env.NEXT_PUBLIC_FORMSPARK_ID || '';

  const { toast } = useToast();
  const [submit, submitting] = useFormspark({ formId: FormSparkID });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
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
        title: 'Success!',
        description:
          'Your request has been submitted. You will be notified when your account is ready.',
      });
    } else if (isSubmitted && Object.keys(errors).length > 0) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please check your details and try again.',
      });
    }
  }, [isSubmitSuccessful, isSubmitted, errors, toast, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await submit(values);
  };

  return (
    <div className='flex-1 flex flex-col place-content-center container'>
      <Header />
      <h1 className='text-center font-medium text-2xl mb-12 md:text-3xl'>
        Request Access
      </h1>
      <div className='md:w-1/2 mx-auto w-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-transparent border-white placeholder:text-white/75'
                      placeholder='First & Last Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify Login Email</FormLabel>
                  <FormControl>
                    <Input
                      className='bg-transparent border-white placeholder:text-white/75'
                      placeholder='example@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='text-white' type='submit' disabled={submitting}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RequestAccess;
