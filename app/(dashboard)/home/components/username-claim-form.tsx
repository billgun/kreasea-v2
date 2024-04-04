'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string(),
});

export function UsernameClaimForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`signup?username=${values.username}`);
  }

  return (
    <div className='flex w-[70%] items-center sm:px-20 lg:px-0'>
      <div className='relative w-full justify-center lg:px-20 xl:px-32'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-full shadow-[0px_4px_20px_rgba(149,_185,_193,_0.6)]'
          >
            <div className='flex h-14 w-full items-center rounded-full bg-opacity-50 pl-4 pr-20 text-sm md:h-16 md:text-base xl:h-20 xl:pl-6 xl:text-xl'>
              <span className='p-2'>kreasea.com/</span>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  //   <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      className='w-20 border-0 bg-transparent text-lg placeholder-primary-foreground/60 placeholder:text-lg focus-visible:ring-transparent sm:w-36 xl:w-36'
                      placeholder='username'
                      autoComplete='false'
                      {...field}
                    />
                  </FormControl>
                  //</FormItem>
                )}
              />
              <div className='absolute right-2 top-2 sm:right-4 sm:top-3 lg:pr-20 xl:top-4 xl:pr-32'>
                <Button
                  type='submit'
                  className='h-10 w-24 rounded-full text-sm sm:w-24 md:h-10 md:text-lg xl:h-12 xl:w-28'
                >
                  Create!
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
