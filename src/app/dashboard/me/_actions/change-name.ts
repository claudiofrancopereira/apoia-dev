"use server"

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const changeNameSchema = z.object({
    name: z.string().min(4, "O username precisa ter no minimo 4 caracteres")

});






type changeNameSchema = z.infer<typeof changeNameSchema>;

export async function changeName(data: changeNameSchema) {
    const session = await auth();
    const userID = session?.user.id;

    if (!userID) {
        return {
            data: null,
            error: "Usuario nao autenticado.",

        };

    };

    const schema = changeNameSchema.safeParse(data);

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
                name: data.name

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