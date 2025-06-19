"use server"

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const changeDescriptionSchema = z.object({
    description: z.string().min(4, "A descricao precisa ter no minimo 4 caracteres")

});






type changeDescriptionSchema = z.infer<typeof changeDescriptionSchema>;

export async function changeDescription(data: changeDescriptionSchema) {
    const session = await auth();
    const userID = session?.user.id;

    if (!userID) {
        return {
            data: null,
            error: "Usuario nao autenticado.",

        };

    };

    const schema = changeDescriptionSchema.safeParse(data);

    if (!schema.success) {
        return {
            data: null,
            error: schema.error.issues[0].message

        };

    };

    try {
        const user = await prisma.user.update({
            where: {
                id: userID

            },

            data: {
                bio: data.description

            },

        });

        return {
            data: user.name,
            error: null,

        }
    
    } catch(err) {
        console.log(err)

        return {
            data: null,
            error: "Falha ao salvar aleracoes.",

        };

    };

};