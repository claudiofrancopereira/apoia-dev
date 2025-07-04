"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createPayment } from "../_actions/create-payment";
import { toast } from "sonner";
import { getStripeJs } from "@/lib/stripe-js";





const formSchema = z.object({
    name: z.string().min(1, "O nome eh obrigatorio"),
    message: z.string().min(1, "A mensagem eh obrigatoria"),
    price: z.enum(["15", "25", "35"], {
        required_error: "O valor eh obrigadorio"

    }),

});

type FormData = z.infer<typeof formSchema>;

interface FormDonateProps {
    creatorID: string;
    slug: string;

};

export function FormDonate({ creatorID, slug }: FormDonateProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            message: "",
            price: "15",

        },
    
    });

    async function onSubmit(data: FormData) {
        const priceCents = Number(data.price) * 100;

        const checkout = await createPayment({
            name: data.name,
            message: data.message,
            creatorID: creatorID,
            slug: slug,
            price: priceCents,

        });

        if (checkout.error) {
            toast.error(checkout.error);
            return;

        };

        if (checkout.data) {
            const data = JSON.parse(checkout.data);
            
            const stripe = await getStripeJs();

            await stripe?.redirectToCheckout({
                sessionId: data.id as string,

            });

        };

    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                    
                            <FormControl>
                                <Input 
                                    placeholder="Digite seu nome" 
                                    {...field} 
                                    className="bg-white"
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
                            <FormLabel>Messagem</FormLabel>
                    
                            <FormControl>
                                <Textarea 
                                    placeholder="Digite sua messagem" 
                                    {...field} 
                                    className="bg-white h-32 resize-none"
                                />
                            </FormControl>

                            <FormMessage />

                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor da doacao</FormLabel>
                    
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center gap-3"
                                >
                                    {["15", "25", "35"].map((value) => (
                                        <div key={value} className="flex items-center space-2">
                                            <RadioGroupItem value={value} id={value} />
                                            <Label className="text-lg" htmlFor={value}>R$ {value}</Label>
                                        </div>

                                    ))}

                                </RadioGroup>

                            </FormControl>

                            <FormMessage />

                        </FormItem>

                    )}

                />

                <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Carregando..." : "Fazer doacao"}
                </Button>

            </form>
        
        </Form>
    
    );

};