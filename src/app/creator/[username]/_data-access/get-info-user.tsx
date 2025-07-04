"use server"

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createUsernameSchema = z.object({
    username: z.string({ message: "O username eh obrigatorio"

    })

});






type createUsernameSchema = z.infer<typeof createUsernameSchema>;

export async function getInfoUser(data: createUsernameSchema) {
    const schema = createUsernameSchema.safeParse(data);

    if (!schema.success) {
        return null;

    };

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: data.username

            },

        });
    
        return user;

    } catch(err) {
        return null;

    } 
};