// Update import at the top to use backend services
import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Employee, Recommendation } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  date: z.date(),
})

const Recommendations = () => {
  const { auth } = useAuth();
  const userId = auth.user?.id;

  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', selectedEmployee?.id],
    queryFn: () => selectedEmployee ? api.recommendations.getByEmployeeId(selectedEmployee.id) : [],
    enabled: !!selectedEmployee
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      date: new Date(),
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Layout>
      <div className="container relative pb-20">
        <div className="flex h-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <div className="px-6">
              <div className="mb-4">
                <h4 className="font-semibold leading-none">Employees</h4>
                <p className="text-sm text-muted-foreground">
                  Select an employee to view recommendations
                </p>
              </div>
              <Input placeholder="Search employees..." className="mb-4" />
              <ScrollArea className="h-[400px] space-y-1">
                {employees.map((employee) => (
                  <Button
                    key={employee.id}
                    variant="ghost"
                    className="flex w-full items-center justify-start px-2"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage src={`https://avatar.vercel.sh/${employee.email}.png`} />
                      <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <span>{employee.firstName} {employee.lastName}</span>
                  </Button>
                ))}
              </ScrollArea>
            </div>
          </aside>
          <div className="flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recommendations</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Recommendation</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Recommendation</DialogTitle>
                      <DialogDescription>
                        Make a recommendation for{" "}
                        {selectedEmployee?.firstName} {selectedEmployee?.lastName}.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Recommendation Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Recommendation Content"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of Recommendation</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              {selectedEmployee ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </CardTitle>
                    <CardDescription>{selectedEmployee.position}</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-6">
                    <ul className="list-none space-y-4">
                      {recommendations?.map((recommendation) => (
                        <li key={recommendation.id} className="border rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{recommendation.title}</h3>
                            <Badge>{new Date(recommendation.date).toLocaleDateString()}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {recommendation.content}
                          </p>
                        </li>
                      ))}
                      {recommendations?.length === 0 && (
                        <li className="text-center text-muted-foreground">
                          No recommendations found for this employee.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-10 text-center">
                    Select an employee to view recommendations.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recommendations;
